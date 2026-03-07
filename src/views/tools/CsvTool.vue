<template>
  <div class="csv-tool">
    <el-card class="input-card">
      <template #header>
        <div class="card-header">
          <span>CSV / TSV 工具</span>
          <div class="header-actions">
            <el-radio-group v-model="delimiter" size="small" @change="handleDelimiterChange">
              <el-radio-button value=",">CSV（逗号）</el-radio-button>
              <el-radio-button value="\t">TSV（Tab）</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <div class="input-area">
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="8"
          placeholder="粘贴 CSV 或 TSV 内容，或上传文件..."
          @input="handleInput"
        />
        <div class="upload-row">
          <el-upload
            :show-file-list="false"
            accept=".csv,.tsv,.txt"
            :before-upload="handleFileUpload"
          >
            <el-button size="small" :icon="Upload">上传文件</el-button>
          </el-upload>
          <span v-if="autoDetectedDelimiter" class="auto-detect-hint">
            已自动检测到分隔符：{{ autoDetectedDelimiter === ',' ? '逗号（CSV）' : 'Tab（TSV）' }}
          </span>
        </div>
      </div>

      <div v-if="errorMsg" class="error-msg">
        <el-alert :title="errorMsg" type="error" show-icon :closable="false" />
      </div>

      <div class="action-buttons">
        <el-button type="primary" @click="parseInput" :disabled="!inputText.trim()">
          解析
        </el-button>
        <el-button @click="convertToJson" :disabled="!parsedRows.length">
          CSV → JSON
        </el-button>
        <el-button @click="convertFromJson" :disabled="!inputText.trim()">
          JSON → CSV
        </el-button>
        <el-button @click="convertToCsvFromTsv" :disabled="!parsedRows.length || delimiter !== '\t'">
          TSV → CSV
        </el-button>
        <el-button @click="convertToTsvFromCsv" :disabled="!parsedRows.length || delimiter !== ','">
          CSV → TSV
        </el-button>
        <el-button @click="clearAll">清空</el-button>
      </div>
    </el-card>

    <el-card v-if="parsedRows.length" class="table-card">
      <template #header>
        <div class="card-header">
          <span>解析结果（{{ parsedRows.length - 1 }} 行数据，{{ headers.length }} 列）</span>
          <div class="header-actions">
            <el-button size="small" @click="copyTable">复制表格</el-button>
            <el-button size="small" @click="downloadCsv">下载 CSV</el-button>
            <el-button size="small" @click="downloadTsv">下载 TSV</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="tableData"
        border
        stripe
        max-height="400"
        size="small"
      >
        <el-table-column
          v-for="(header, index) in headers"
          :key="index"
          :prop="String(index)"
          :label="header"
          sortable
          min-width="120"
          show-overflow-tooltip
        />
      </el-table>
    </el-card>

    <el-card v-if="outputText" class="output-card">
      <template #header>
        <div class="card-header">
          <span>{{ outputLabel }}</span>
          <div class="header-actions">
            <el-button size="small" @click="copyOutput">复制</el-button>
            <el-button size="small" @click="downloadOutput">下载</el-button>
          </div>
        </div>
      </template>
      <el-input
        v-model="outputText"
        type="textarea"
        :rows="10"
        readonly
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const inputText = ref('')
const outputText = ref('')
const outputLabel = ref('')
const delimiter = ref(',')
const errorMsg = ref('')
const autoDetectedDelimiter = ref('')
const parsedRows = ref<string[][]>([])

const headers = computed(() => parsedRows.value[0] ?? [])

const tableData = computed(() => {
  if (parsedRows.value.length < 2) return []
  return parsedRows.value.slice(1).map((row) => {
    const obj: Record<string, string> = {}
    headers.value.forEach((_, i) => {
      obj[String(i)] = row[i] ?? ''
    })
    return obj
  })
})

function parseCsv(text: string, sep = ','): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        cell += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === sep) {
        row.push(cell)
        cell = ''
      } else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
        if (ch === '\r') i++
        row.push(cell)
        cell = ''
        rows.push(row)
        row = []
      } else {
        cell += ch
      }
    }
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

function detectDelimiter(text: string): string {
  const lines = text.split('\n').slice(0, 3)
  let tabCount = 0
  let commaCount = 0
  for (const line of lines) {
    tabCount += (line.match(/\t/g) ?? []).length
    commaCount += (line.match(/,/g) ?? []).length
  }
  return tabCount > commaCount ? '\t' : ','
}

function escapeCell(value: string, sep: string): string {
  if (value.includes(sep) || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return '"' + value.replace(/"/g, '""') + '"'
  }
  return value
}

function rowsToCsv(rows: string[][], sep: string): string {
  return rows.map((row) => row.map((cell) => escapeCell(cell, sep)).join(sep)).join('\n')
}

function handleInput() {
  errorMsg.value = ''
  outputText.value = ''
  parsedRows.value = []
  autoDetectedDelimiter.value = ''
}

function handleDelimiterChange() {
  if (parsedRows.value.length) {
    parseInput()
  }
}

function handleFileUpload(file: File): boolean {
  const reader = new FileReader()
  reader.onload = (e) => {
    inputText.value = (e.target?.result as string) ?? ''
    parseInput()
  }
  reader.readAsText(file)
  return false
}

function parseInput() {
  errorMsg.value = ''
  outputText.value = ''
  const text = inputText.value.trim()
  if (!text) return

  try {
    const detected = detectDelimiter(text)
    autoDetectedDelimiter.value = detected
    delimiter.value = detected

    const rows = parseCsv(text, detected)
    if (rows.length === 0) {
      errorMsg.value = '未能解析出任何数据，请检查输入格式'
      return
    }
    parsedRows.value = rows
  } catch (e) {
    errorMsg.value = `解析失败：${e instanceof Error ? e.message : String(e)}`
    parsedRows.value = []
  }
}

function convertToJson() {
  if (!parsedRows.value.length) return
  try {
    const [headerRow, ...dataRows] = parsedRows.value
    const jsonArray = dataRows.map((row) => {
      const obj: Record<string, string> = {}
      headerRow.forEach((key, i) => {
        obj[key] = row[i] ?? ''
      })
      return obj
    })
    outputText.value = JSON.stringify(jsonArray, null, 2)
    outputLabel.value = 'JSON 输出'
  } catch (e) {
    errorMsg.value = `转换失败：${e instanceof Error ? e.message : String(e)}`
  }
}

function convertFromJson() {
  try {
    const parsed = JSON.parse(inputText.value.trim())
    if (!Array.isArray(parsed)) {
      errorMsg.value = '输入必须是 JSON 数组'
      return
    }
    if (parsed.length === 0) {
      errorMsg.value = 'JSON 数组为空'
      return
    }
    const keys = Object.keys(parsed[0])
    const rows: string[][] = [
      keys,
      ...parsed.map((item: Record<string, unknown>) =>
        keys.map((k) => String(item[k] ?? ''))
      )
    ]
    outputText.value = rowsToCsv(rows, ',')
    outputLabel.value = 'CSV 输出'
    parsedRows.value = rows
    delimiter.value = ','
  } catch (e) {
    errorMsg.value = `JSON 解析失败：${e instanceof Error ? e.message : String(e)}`
  }
}

function convertToCsvFromTsv() {
  if (!parsedRows.value.length) return
  outputText.value = rowsToCsv(parsedRows.value, ',')
  outputLabel.value = 'CSV 输出（从 TSV 转换）'
}

function convertToTsvFromCsv() {
  if (!parsedRows.value.length) return
  outputText.value = rowsToCsv(parsedRows.value, '\t')
  outputLabel.value = 'TSV 输出（从 CSV 转换）'
}

function clearAll() {
  inputText.value = ''
  outputText.value = ''
  outputLabel.value = ''
  errorMsg.value = ''
  parsedRows.value = []
  autoDetectedDelimiter.value = ''
  delimiter.value = ','
}

function copyTable() {
  const text = rowsToCsv(parsedRows.value, delimiter.value)
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('表格已复制')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function copyOutput() {
  navigator.clipboard.writeText(outputText.value).then(() => {
    ElMessage.success('已复制')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadCsv() {
  downloadFile(rowsToCsv(parsedRows.value, ','), 'data.csv', 'text/csv;charset=utf-8;')
}

function downloadTsv() {
  downloadFile(rowsToCsv(parsedRows.value, '\t'), 'data.tsv', 'text/tab-separated-values;charset=utf-8;')
}

function downloadOutput() {
  const isJson = outputLabel.value.includes('JSON')
  const ext = isJson ? 'json' : outputLabel.value.includes('TSV') ? 'tsv' : 'csv'
  const mime = isJson ? 'application/json' : ext === 'tsv' ? 'text/tab-separated-values' : 'text/csv'
  downloadFile(outputText.value, `output.${ext}`, `${mime};charset=utf-8;`)
}
</script>

<style scoped>
.csv-tool {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.input-card,
.table-card,
.output-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auto-detect-hint {
  font-size: 13px;
  color: var(--el-color-success);
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.error-msg {
  margin-top: 8px;
}
</style>
