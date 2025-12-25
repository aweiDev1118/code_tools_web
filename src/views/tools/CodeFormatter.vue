<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

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
  // 简单的 JS 格式化
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
    ElMessage.warning('请输入代码')
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
    ElMessage.success('格式化成功')
  } catch (e) {
    ElMessage.error('格式化失败: ' + (e as Error).message)
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
    ElMessage.success('压缩成功')
  } catch (e) {
    ElMessage.error('压缩失败')
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">代码格式化</h1>
      <p class="text-gray-500">格式化 JSON、HTML、CSS、JavaScript、SQL 代码</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-select v-model="language" style="width: 140px">
        <el-option v-for="lang in languages" :key="lang.value" :value="lang.value" :label="lang.label" />
      </el-select>
      <div class="flex items-center gap-2">
        <span class="text-sm">缩进:</span>
        <el-select v-model="indentSize" style="width: 100px">
          <el-option :value="2" label="2 空格" />
          <el-option :value="4" label="4 空格" />
        </el-select>
      </div>
      <el-button type="primary" @click="format">格式化</el-button>
      <el-button @click="compress">压缩</el-button>
      <el-button @click="copy">复制结果</el-button>
      <el-button @click="clear">清空</el-button>
      <el-button @click="loadSample" text>示例</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>输入代码</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="18"
          placeholder="请输入要格式化的代码..."
          class="font-mono"
        />
      </el-card>

      <el-card>
        <template #header>格式化结果</template>
        <el-input
          v-model="output"
          type="textarea"
          :rows="18"
          readonly
          placeholder="格式化结果..."
          class="font-mono"
        />
      </el-card>
    </div>
  </div>
</template>
