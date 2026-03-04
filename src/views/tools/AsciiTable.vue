<script setup lang="ts">
import { ref, computed } from 'vue'

interface AsciiRow {
  dec: number
  hex: string
  oct: string
  bin: string
  char: string
  description: string
}

const controlNames: Record<number, string> = {
  0: 'NUL',
  1: 'SOH',
  2: 'STX',
  3: 'ETX',
  4: 'EOT',
  5: 'ENQ',
  6: 'ACK',
  7: 'BEL',
  8: 'BS',
  9: 'HT/TAB',
  10: 'LF',
  11: 'VT',
  12: 'FF',
  13: 'CR',
  14: 'SO',
  15: 'SI',
  16: 'DLE',
  17: 'DC1',
  18: 'DC2',
  19: 'DC3',
  20: 'DC4',
  21: 'NAK',
  22: 'SYN',
  23: 'ETB',
  24: 'CAN',
  25: 'EM',
  26: 'SUB',
  27: 'ESC',
  28: 'FS',
  29: 'GS',
  30: 'RS',
  31: 'US',
  32: 'SP',
  127: 'DEL',
}

const controlDescriptions: Record<number, string> = {
  0: '空字符 (Null)',
  1: '标题开始 (Start of Heading)',
  2: '正文开始 (Start of Text)',
  3: '正文结束 (End of Text)',
  4: '传输结束 (End of Transmission)',
  5: '请求 (Enquiry)',
  6: '确认 (Acknowledge)',
  7: '响铃 (Bell)',
  8: '退格 (Backspace)',
  9: '水平制表符 (Horizontal Tab)',
  10: '换行 (Line Feed)',
  11: '垂直制表符 (Vertical Tab)',
  12: '换页 (Form Feed)',
  13: '回车 (Carriage Return)',
  14: '移出 (Shift Out)',
  15: '移入 (Shift In)',
  16: '数据链路转义 (Data Link Escape)',
  17: '设备控制1 (Device Control 1)',
  18: '设备控制2 (Device Control 2)',
  19: '设备控制3 (Device Control 3)',
  20: '设备控制4 (Device Control 4)',
  21: '否定确认 (Negative Acknowledge)',
  22: '同步空闲 (Synchronous Idle)',
  23: '传输块结束 (End of Transmission Block)',
  24: '取消 (Cancel)',
  25: '介质结束 (End of Medium)',
  26: '替换 (Substitute)',
  27: '转义 (Escape)',
  28: '文件分隔符 (File Separator)',
  29: '组分隔符 (Group Separator)',
  30: '记录分隔符 (Record Separator)',
  31: '单元分隔符 (Unit Separator)',
  32: '空格 (Space)',
  127: '删除 (Delete)',
}

const allRows: AsciiRow[] = Array.from({ length: 128 }, (_, i) => {
  const isControl = i <= 31 || i === 127
  const char = isControl ? (controlNames[i] ?? '') : String.fromCharCode(i)
  const description = isControl
    ? (controlDescriptions[i] ?? '')
    : `可打印字符 "${String.fromCharCode(i)}"`

  return {
    dec: i,
    hex: i.toString(16).toUpperCase().padStart(2, '0'),
    oct: i.toString(8).padStart(3, '0'),
    bin: i.toString(2).padStart(7, '0'),
    char,
    description,
  }
})

const searchQuery = ref('')

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allRows

  return allRows.filter(
    (row) =>
      String(row.dec).includes(q) ||
      row.hex.toLowerCase().includes(q) ||
      row.char.toLowerCase().includes(q) ||
      row.description.toLowerCase().includes(q),
  )
})

function rowClassName({ row }: { row: AsciiRow }): string {
  if (row.dec <= 31 || row.dec === 127) return 'ascii-control'
  return ''
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">ASCII 码表</h1>
      <p class="text-gray-500 dark:text-gray-400">标准 ASCII 字符集（0–127）对照表</p>
    </div>

    <el-card class="mb-6">
      <el-input
        v-model="searchQuery"
        placeholder="搜索十进制、字符或描述..."
        clearable
        prefix-icon="Search"
      />
    </el-card>

    <el-card>
      <div class="flex gap-4 mb-4 text-sm">
        <span class="flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded bg-blue-100 dark:bg-blue-900"></span>
          控制字符 (0–31, 127)
        </span>
        <span class="flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"></span>
          可打印字符 (32–126)
        </span>
      </div>

      <el-table
        :data="filteredRows"
        stripe
        :row-class-name="rowClassName"
        class="w-full font-mono text-sm"
        max-height="600"
      >
        <el-table-column label="DEC" prop="dec" width="70" />
        <el-table-column label="HEX" prop="hex" width="70" />
        <el-table-column label="OCT" prop="oct" width="70" />
        <el-table-column label="BIN" prop="bin" width="100" />
        <el-table-column label="Char" width="80">
          <template #default="{ row }">
            <span class="font-bold">{{ row.char }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" />
      </el-table>

      <div v-if="filteredRows.length === 0" class="text-center text-gray-400 py-12">
        未找到匹配的 ASCII 字符
      </div>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.ascii-control) {
  background-color: rgb(239 246 255) !important;
}

:deep(.dark .ascii-control),
.dark :deep(.ascii-control) {
  background-color: rgb(30 58 138 / 0.2) !important;
}
</style>
