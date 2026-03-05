<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface AsciiRow {
  dec: number
  hex: string
  oct: string
  bin: string
  char: string
  descKey: string
  printable: boolean
}

const controlNames: Record<number, string> = {
  0: 'NUL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK',
  7: 'BEL', 8: 'BS', 9: 'HT/TAB', 10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR',
  14: 'SO', 15: 'SI', 16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3', 20: 'DC4',
  21: 'NAK', 22: 'SYN', 23: 'ETB', 24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC',
  28: 'FS', 29: 'GS', 30: 'RS', 31: 'US', 32: 'SP', 127: 'DEL',
}

const controlDescKeys: Record<number, string> = {
  0: 'tool.ascii-table.ctrl0', 1: 'tool.ascii-table.ctrl1', 2: 'tool.ascii-table.ctrl2',
  3: 'tool.ascii-table.ctrl3', 4: 'tool.ascii-table.ctrl4', 5: 'tool.ascii-table.ctrl5',
  6: 'tool.ascii-table.ctrl6', 7: 'tool.ascii-table.ctrl7', 8: 'tool.ascii-table.ctrl8',
  9: 'tool.ascii-table.ctrl9', 10: 'tool.ascii-table.ctrl10', 11: 'tool.ascii-table.ctrl11',
  12: 'tool.ascii-table.ctrl12', 13: 'tool.ascii-table.ctrl13', 14: 'tool.ascii-table.ctrl14',
  15: 'tool.ascii-table.ctrl15', 16: 'tool.ascii-table.ctrl16', 17: 'tool.ascii-table.ctrl17',
  18: 'tool.ascii-table.ctrl18', 19: 'tool.ascii-table.ctrl19', 20: 'tool.ascii-table.ctrl20',
  21: 'tool.ascii-table.ctrl21', 22: 'tool.ascii-table.ctrl22', 23: 'tool.ascii-table.ctrl23',
  24: 'tool.ascii-table.ctrl24', 25: 'tool.ascii-table.ctrl25', 26: 'tool.ascii-table.ctrl26',
  27: 'tool.ascii-table.ctrl27', 28: 'tool.ascii-table.ctrl28', 29: 'tool.ascii-table.ctrl29',
  30: 'tool.ascii-table.ctrl30', 31: 'tool.ascii-table.ctrl31', 32: 'tool.ascii-table.ctrl32',
  127: 'tool.ascii-table.ctrl127',
}

const allRows: AsciiRow[] = Array.from({ length: 128 }, (_, i) => {
  const isControl = i <= 31 || i === 127
  const char = isControl ? (controlNames[i] ?? '') : String.fromCharCode(i)
  const descKey = isControl
    ? (controlDescKeys[i] ?? '')
    : 'tool.ascii-table.printableChar'

  return {
    dec: i,
    hex: i.toString(16).toUpperCase().padStart(2, '0'),
    oct: i.toString(8).padStart(3, '0'),
    bin: i.toString(2).padStart(7, '0'),
    char,
    descKey,
    printable: !isControl,
  }
})

const searchQuery = ref('')

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allRows.map(row => ({
    ...row,
    description: row.printable
      ? t('tool.ascii-table.printableChar') + ` "${row.char}"`
      : t(row.descKey),
  }))

  return allRows
    .map(row => ({
      ...row,
      description: row.printable
        ? t('tool.ascii-table.printableChar') + ` "${row.char}"`
        : t(row.descKey),
    }))
    .filter(
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.ascii-table.name') }}</h1>
      <p class="text-gray-500 dark:text-gray-400">{{ t('tool.ascii-table.subtitle') }}</p>
    </div>

    <el-card class="mb-6">
      <el-input
        v-model="searchQuery"
        :placeholder="t('tool.ascii-table.searchPlaceholder')"
        clearable
        prefix-icon="Search"
      />
    </el-card>

    <el-card>
      <div class="flex gap-4 mb-4 text-sm">
        <span class="flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded bg-blue-100 dark:bg-blue-900"></span>
          {{ t('tool.ascii-table.controlChars') }}
        </span>
        <span class="flex items-center gap-1">
          <span class="inline-block w-3 h-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"></span>
          {{ t('tool.ascii-table.printableChars') }}
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
        <el-table-column :label="t('tool.ascii-table.colDescription')" prop="description" />
      </el-table>

      <div v-if="filteredRows.length === 0" class="text-center text-gray-400 py-12">
        {{ t('tool.ascii-table.noResults') }}
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
