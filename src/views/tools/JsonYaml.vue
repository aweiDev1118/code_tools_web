<script setup lang="ts">
import { ref, watch } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

// ── YAML serializer ──────────────────────────────────────────────────────────

function needsQuotes(s: string): boolean {
  // Quote if empty, contains special chars, looks like a number/bool/null, or starts with indicator chars
  if (s === '') return true
  if (/^(true|false|null|~)$/i.test(s)) return true
  if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) return true
  if (/[:#\[\]{},&*!|>'"%@`\n\r\t]/.test(s)) return true
  if (/^[\s-?:,[\]{}#&*!|>'"%@`]/.test(s)) return true
  return false
}

function quoteString(s: string): string {
  // Use double-quote, escape backslash and double-quote
  const escaped = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
  return `"${escaped}"`
}

function jsonToYamlValue(value: unknown, indent: number): string {
  const pad = '  '.repeat(indent)

  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)

  if (typeof value === 'string') {
    return needsQuotes(value) ? quoteString(value) : value
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return '\n' + value.map(item => {
      const rendered = jsonToYamlValue(item, indent + 1)
      if (rendered.startsWith('\n')) {
        // nested object/array — put on next line after dash
        return `${pad}- ${rendered.trimStart()}`
      }
      return `${pad}- ${rendered}`
    }).join('\n')
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    return '\n' + entries.map(([k, v]) => {
      const key = needsQuotes(k) ? quoteString(k) : k
      const rendered = jsonToYamlValue(v, indent + 1)
      if (rendered.startsWith('\n')) {
        return `${pad}${key}:${rendered}`
      }
      return `${pad}${key}: ${rendered}`
    }).join('\n')
  }

  return String(value)
}

function jsonToYaml(json: string): string {
  const parsed = JSON.parse(json)
  const result = jsonToYamlValue(parsed, 0)
  return result.startsWith('\n') ? result.slice(1) : result
}

// ── YAML parser ───────────────────────────────────────────────────────────────

interface Token {
  indent: number
  key: string | null
  value: string | null
  isList: boolean
}

function unquote(s: string): string {
  s = s.trim()
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    const inner = s.slice(1, -1)
    if (s.startsWith('"')) {
      return inner
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
    }
    return inner.replace(/''/g, "'")
  }
  return s
}

function parseScalar(s: string): unknown {
  const t = s.trim()
  if (t === 'null' || t === '~' || t === '') return null
  if (t === 'true') return true
  if (t === 'false') return false
  if (/^[-+]?\d+$/.test(t)) return parseInt(t, 10)
  if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(t)) return parseFloat(t)
  return unquote(t)
}

function tokenize(lines: string[]): Token[] {
  const tokens: Token[] = []
  for (const rawLine of lines) {
    // Strip comments (but not inside quoted strings — simplified heuristic)
    const line = rawLine.replace(/\s+#.*$/, '')
    if (line.trim() === '' || line.trim().startsWith('#')) continue

    const indent = line.match(/^( *)/)![1].length
    const content = line.slice(indent)

    if (content.startsWith('- ') || content === '-') {
      const rest = content.slice(2).trim()
      // Check if rest contains a key: value
      const kvMatch = rest.match(/^([^:]+):\s*(.*)$/)
      if (kvMatch && !rest.startsWith('"') && !rest.startsWith("'")) {
        // inline map item
        tokens.push({ indent, key: kvMatch[1].trim(), value: kvMatch[2].trim() || null, isList: true })
      } else {
        tokens.push({ indent, key: null, value: rest || null, isList: true })
      }
    } else {
      const colonIdx = findColonIndex(content)
      if (colonIdx !== -1) {
        const key = content.slice(0, colonIdx).trim()
        const val = content.slice(colonIdx + 1).trim()
        tokens.push({ indent, key, value: val || null, isList: false })
      } else {
        tokens.push({ indent, key: null, value: content, isList: false })
      }
    }
  }
  return tokens
}

function findColonIndex(s: string): number {
  let inSingle = false
  let inDouble = false
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === "'" && !inDouble) { inSingle = !inSingle }
    else if (c === '"' && !inSingle) { inDouble = !inDouble }
    else if (c === ':' && !inSingle && !inDouble) {
      // must be followed by space or end
      if (i + 1 >= s.length || s[i + 1] === ' ') return i
    }
  }
  return -1
}

interface ParseContext {
  tokens: Token[]
  pos: number
}

function parseBlock(ctx: ParseContext, baseIndent: number): unknown {
  if (ctx.pos >= ctx.tokens.length) return null

  const firstTok = ctx.tokens[ctx.pos]

  if (firstTok.isList) {
    return parseList(ctx, baseIndent)
  } else if (firstTok.key !== null) {
    return parseMap(ctx, baseIndent)
  }
  return null
}

function parseList(ctx: ParseContext, baseIndent: number): unknown[] {
  const arr: unknown[] = []
  while (ctx.pos < ctx.tokens.length) {
    const tok = ctx.tokens[ctx.pos]
    if (tok.indent < baseIndent) break
    if (!tok.isList) break

    if (tok.value !== null && tok.key === null) {
      // scalar list item — but check if next tokens at higher indent form a map
      const nextIndent = ctx.pos + 1 < ctx.tokens.length ? ctx.tokens[ctx.pos + 1].indent : -1
      if (nextIndent > tok.indent) {
        ctx.pos++
        arr.push(parseBlock(ctx, nextIndent))
      } else {
        ctx.pos++
        arr.push(parseScalar(tok.value))
      }
    } else if (tok.key !== null && tok.isList) {
      // list item that starts a map inline
      const map: Record<string, unknown> = {}
      const firstKey = unquote(tok.key)
      ctx.pos++
      if (tok.value !== null && tok.value !== '') {
        map[firstKey] = parseScalar(tok.value)
      } else {
        // next block
        const nextIndent = ctx.pos < ctx.tokens.length ? ctx.tokens[ctx.pos].indent : -1
        if (nextIndent > tok.indent) {
          map[firstKey] = parseBlock(ctx, nextIndent)
        } else {
          map[firstKey] = null
        }
      }
      // consume sibling keys at same indent (non-list)
      while (ctx.pos < ctx.tokens.length && ctx.tokens[ctx.pos].indent > baseIndent && !ctx.tokens[ctx.pos].isList) {
        const sibling = ctx.tokens[ctx.pos]
        const sibKey = unquote(sibling.key!)
        ctx.pos++
        if (sibling.value !== null && sibling.value !== '') {
          const nextIndent2 = ctx.pos < ctx.tokens.length ? ctx.tokens[ctx.pos].indent : -1
          if (nextIndent2 > sibling.indent) {
            map[sibKey] = parseBlock(ctx, nextIndent2)
          } else {
            map[sibKey] = parseScalar(sibling.value)
          }
        } else {
          const nextIndent2 = ctx.pos < ctx.tokens.length ? ctx.tokens[ctx.pos].indent : -1
          if (nextIndent2 > sibling.indent) {
            map[sibKey] = parseBlock(ctx, nextIndent2)
          } else {
            map[sibKey] = null
          }
        }
      }
      arr.push(map)
    } else {
      // empty list item
      ctx.pos++
      arr.push(null)
    }
  }
  return arr
}

function parseMap(ctx: ParseContext, baseIndent: number): Record<string, unknown> {
  const map: Record<string, unknown> = {}
  while (ctx.pos < ctx.tokens.length) {
    const tok = ctx.tokens[ctx.pos]
    if (tok.indent < baseIndent) break
    if (tok.isList) break
    if (tok.key === null) break

    const key = unquote(tok.key)
    ctx.pos++

    if (tok.value !== null && tok.value !== '') {
      // Check inline flow collections
      if (tok.value.startsWith('[') && tok.value.endsWith(']')) {
        map[key] = parseInlineArray(tok.value)
      } else if (tok.value.startsWith('{') && tok.value.endsWith('}')) {
        map[key] = parseInlineMap(tok.value)
      } else {
        const nextIndent = ctx.pos < ctx.tokens.length ? ctx.tokens[ctx.pos].indent : -1
        if (nextIndent > tok.indent) {
          map[key] = parseBlock(ctx, nextIndent)
        } else {
          map[key] = parseScalar(tok.value)
        }
      }
    } else {
      const nextIndent = ctx.pos < ctx.tokens.length ? ctx.tokens[ctx.pos].indent : -1
      if (nextIndent > tok.indent) {
        map[key] = parseBlock(ctx, nextIndent)
      } else {
        map[key] = null
      }
    }
  }
  return map
}

function parseInlineArray(s: string): unknown[] {
  const inner = s.slice(1, -1).trim()
  if (!inner) return []
  return inner.split(',').map(item => parseScalar(item.trim()))
}

function parseInlineMap(s: string): Record<string, unknown> {
  const inner = s.slice(1, -1).trim()
  const map: Record<string, unknown> = {}
  if (!inner) return map
  inner.split(',').forEach(pair => {
    const idx = pair.indexOf(':')
    if (idx !== -1) {
      const k = unquote(pair.slice(0, idx).trim())
      const v = parseScalar(pair.slice(idx + 1).trim())
      map[k] = v
    }
  })
  return map
}

function yamlToJson(yaml: string): string {
  const lines = yaml.split('\n')
  const tokens = tokenize(lines)
  if (tokens.length === 0) return 'null'

  const ctx: ParseContext = { tokens, pos: 0 }
  const baseIndent = tokens[0].indent
  const result = parseBlock(ctx, baseIndent)
  return JSON.stringify(result, null, 2)
}

// ── Component state ───────────────────────────────────────────────────────────

const jsonText = ref('')
const yamlText = ref('')
const jsonError = ref('')
const yamlError = ref('')
let updating = false

const EXAMPLE = {
  name: 'John Doe',
  age: 30,
  active: true,
  address: {
    street: '123 Main St',
    city: 'Springfield',
  },
  tags: ['admin', 'user'],
  metadata: null,
}

function loadExample() {
  jsonText.value = JSON.stringify(EXAMPLE, null, 2)
}

watch(jsonText, (val) => {
  if (updating) return
  updating = true
  jsonError.value = ''
  if (!val.trim()) {
    yamlText.value = ''
    yamlError.value = ''
    updating = false
    return
  }
  try {
    yamlText.value = jsonToYaml(val)
    yamlError.value = ''
  } catch {
    jsonError.value = '无效的 JSON 格式'
  }
  updating = false
})

watch(yamlText, (val) => {
  if (updating) return
  updating = true
  yamlError.value = ''
  if (!val.trim()) {
    jsonText.value = ''
    jsonError.value = ''
    updating = false
    return
  }
  try {
    jsonText.value = yamlToJson(val)
    jsonError.value = ''
  } catch (e) {
    yamlError.value = '无效的 YAML 格式'
  }
  updating = false
})

async function copyJson() {
  if (jsonText.value) await copyToClipboard(jsonText.value)
}

async function copyYaml() {
  if (yamlText.value) await copyToClipboard(yamlText.value)
}

function clearAll() {
  jsonText.value = ''
  yamlText.value = ''
  jsonError.value = ''
  yamlError.value = ''
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">JSON ↔ YAML</h1>
      <p class="text-gray-500 dark:text-gray-400">JSON 与 YAML 格式互转，双向实时转换</p>
    </div>

    <!-- Toolbar -->
    <div class="flex gap-2 mb-4 flex-wrap">
      <el-button @click="loadExample">加载示例</el-button>
      <el-button @click="clearAll">清空</el-button>
    </div>

    <!-- Dual panel -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- JSON panel -->
      <el-card shadow="never" class="border border-gray-200 dark:border-gray-700">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-700 dark:text-gray-300">JSON</span>
            <el-button size="small" @click="copyJson" :disabled="!jsonText">复制</el-button>
          </div>
        </template>
        <el-input
          v-model="jsonText"
          type="textarea"
          :rows="20"
          placeholder='{ "key": "value" }'
          resize="none"
          :class="{ 'border-red-400': jsonError }"
          style="font-family: monospace; font-size: 13px;"
        />
        <el-alert
          v-if="jsonError"
          :title="jsonError"
          type="error"
          :closable="false"
          class="mt-2"
          show-icon
        />
      </el-card>

      <!-- YAML panel -->
      <el-card shadow="never" class="border border-gray-200 dark:border-gray-700">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-700 dark:text-gray-300">YAML</span>
            <el-button size="small" @click="copyYaml" :disabled="!yamlText">复制</el-button>
          </div>
        </template>
        <el-input
          v-model="yamlText"
          type="textarea"
          :rows="20"
          placeholder="key: value"
          resize="none"
          :class="{ 'border-red-400': yamlError }"
          style="font-family: monospace; font-size: 13px;"
        />
        <el-alert
          v-if="yamlError"
          :title="yamlError"
          type="error"
          :closable="false"
          class="mt-2"
          show-icon
        />
      </el-card>
    </div>
  </div>
</template>
