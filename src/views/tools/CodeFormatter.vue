<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

const input = ref('')
const output = ref('')
const language = ref('json')
const indentSize = ref(2)

const languages = [
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'sql', label: 'SQL' },
]

const formatJson = (code: string) => {
  const obj = JSON.parse(code)
  return JSON.stringify(obj, null, indentSize.value)
}

const formatHtml = (code: string) => {
  let formatted = ''
  let indent = 0
  const lines = code.replace(/>\s*</g, '>\n<').split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 1)
    }

    formatted += ' '.repeat(indent * indentSize.value) + trimmed + '\n'

    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<!') &&
        !trimmed.endsWith('/>') && !trimmed.includes('</')) {
      indent++
    }
  }

  return formatted.trim()
}

const formatCss = (code: string) => {
  return code
    .replace(/\s*{\s*/g, ' {\n')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/;\s*/g, ';\n')
    .replace(/,\s*/g, ',\n')
    .split('\n')
    .map(line => {
      const trimmed = line.trim()
      if (trimmed.endsWith('{') || trimmed === '}') {
        return trimmed
      }
      if (trimmed && !trimmed.endsWith('}')) {
        return ' '.repeat(indentSize.value) + trimmed
      }
      return trimmed
    })
    .filter(line => line.trim())
    .join('\n')
}

const formatJs = (code: string) => {
  let formatted = code
    .replace(/\s*{\s*/g, ' {\n')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/;\s*/g, ';\n')

  let indent = 0
  const lines = formatted.split('\n')
  const result: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('}')) {
      indent = Math.max(0, indent - 1)
    }

    result.push(' '.repeat(indent * indentSize.value) + trimmed)

    if (trimmed.endsWith('{')) {
      indent++
    }
  }

  return result.join('\n')
}

const formatSql = (code: string) => {
  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY',
    'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'INSERT INTO',
    'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE']

  let result = code.toUpperCase()

  keywords.forEach(keyword => {
    result = result.replace(new RegExp(`\\b${keyword}\\b`, 'gi'), `\n${keyword}`)
  })

  return result.trim().replace(/^\n/, '')
}

const format = () => {
  if (!input.value.trim()) {
    ElMessage.warning(t('tool.code-formatter.inputRequired'))
    return
  }

  try {
    switch (language.value) {
      case 'json':
        output.value = formatJson(input.value)
        break
      case 'html':
        output.value = formatHtml(input.value)
        break
      case 'css':
        output.value = formatCss(input.value)
        break
      case 'javascript':
        output.value = formatJs(input.value)
        break
      case 'sql':
        output.value = formatSql(input.value)
        break
      default:
        output.value = input.value
    }
    ElMessage.success(t('tool.code-formatter.formatSuccess'))
  } catch (e) {
    ElMessage.error(t('tool.code-formatter.formatFailed') + ': ' + (e as Error).message)
  }
}

const compress = () => {
  if (!input.value.trim()) return

  try {
    if (language.value === 'json') {
      output.value = JSON.stringify(JSON.parse(input.value))
    } else {
      output.value = input.value.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim()
    }
    ElMessage.success(t('tool.code-formatter.compressSuccess'))
  } catch (e) {
    ElMessage.error(t('tool.code-formatter.compressFailed'))
  }
}

const copy = () => {
  if (!output.value) return
  copyToClipboard(output.value)
}

const clear = () => {
  input.value = ''
  output.value = ''
}

const loadSample = () => {
  switch (language.value) {
    case 'json':
      input.value = '{"name":"test","version":"1.0.0","dependencies":{"vue":"^3.0.0"}}'
      break
    case 'html':
      input.value = '<div class="container"><h1>Title</h1><p>Content</p></div>'
      break
    case 'css':
      input.value = '.container{display:flex;align-items:center;}.title{font-size:24px;color:#333;}'
      break
    case 'javascript':
      input.value = 'function hello(){const msg="Hello";console.log(msg);return msg;}'
      break
    case 'sql':
      input.value = 'SELECT id, name, email FROM users WHERE status = 1 AND age > 18 ORDER BY created_at DESC'
      break
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.code-formatter.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.code-formatter.subtitle') }}</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-select v-model="language" style="width: 140px">
        <el-option v-for="lang in languages" :key="lang.value" :value="lang.value" :label="lang.label" />
      </el-select>
      <div class="flex items-center gap-2">
        <span class="text-sm">{{ t('tool.code-formatter.indent') }}:</span>
        <el-select v-model="indentSize" style="width: 100px">
          <el-option :value="2" :label="t('tool.code-formatter.twoSpaces')" />
          <el-option :value="4" :label="t('tool.code-formatter.fourSpaces')" />
        </el-select>
      </div>
      <el-button type="primary" @click="format">{{ t('common.format') }}</el-button>
      <el-button @click="compress">{{ t('common.compress') }}</el-button>
      <el-button @click="copy">{{ t('tool.code-formatter.copyResult') }}</el-button>
      <el-button @click="clear">{{ t('common.clear') }}</el-button>
      <el-button @click="loadSample" text>{{ t('tool.code-formatter.sample') }}</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>{{ t('tool.code-formatter.inputCode') }}</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="18"
          :placeholder="t('tool.code-formatter.inputPlaceholder')"
          class="font-mono"
        />
      </el-card>

      <el-card>
        <template #header>{{ t('tool.code-formatter.formattedResult') }}</template>
        <el-input
          v-model="output"
          type="textarea"
          :rows="18"
          readonly
          :placeholder="t('tool.code-formatter.outputPlaceholder')"
          class="font-mono"
        />
      </el-card>
    </div>
  </div>
</template>
