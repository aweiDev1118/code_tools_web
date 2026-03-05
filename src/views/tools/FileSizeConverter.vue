<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

type SizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB'

const units: SizeUnit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

const inputValue = ref<number>(1)
const fromUnit = ref<SizeUnit>('MB')
const binaryMode = ref(true)

const base = computed(() => (binaryMode.value ? 1024 : 1000))

interface ResultRow {
  unit: SizeUnit
  value: string
  bytes: number
}

const toBytes = (value: number, unit: SizeUnit, b: number): number => {
  const idx = units.indexOf(unit)
  return value * Math.pow(b, idx)
}

const formatValue = (bytes: number, unit: SizeUnit, b: number): string => {
  const idx = units.indexOf(unit)
  const v = bytes / Math.pow(b, idx)
  if (!isFinite(v)) return '—'
  if (v === 0) return '0'
  if (v >= 1e15) return v.toExponential(4)
  if (v >= 1000) return parseFloat(v.toFixed(4)).toString()
  if (v >= 1) return parseFloat(v.toFixed(6)).toString()
  return parseFloat(v.toPrecision(6)).toString()
}

const results = computed((): ResultRow[] => {
  const val = Number(inputValue.value)
  if (!val && val !== 0) return units.map((u) => ({ unit: u, value: '0', bytes: 0 }))
  const bytes = toBytes(val, fromUnit.value, base.value)
  return units.map((u) => ({
    unit: u,
    value: formatValue(bytes, u, base.value),
    bytes,
  }))
})

const handleCopy = (row: ResultRow) => {
  copyToClipboard(row.value, t('tool.file-size-converter.copied', { value: row.value, unit: row.unit }))
}

const isCurrentUnit = (unit: SizeUnit): boolean => unit === fromUnit.value
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.file-size-converter.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.file-size-converter.subtitle') }}</p>
    </div>

    <el-card>
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <el-input-number
          v-model="inputValue"
          :min="0"
          :controls="true"
          :precision="6"
          :placeholder="t('tool.file-size-converter.inputPlaceholder')"
          style="width: 200px"
        />
        <el-select v-model="fromUnit" style="width: 100px">
          <el-option
            v-for="unit in units"
            :key="unit"
            :label="unit"
            :value="unit"
          />
        </el-select>

        <div class="flex items-center gap-2 ml-auto">
          <span class="text-sm text-gray-500">{{ t('tool.file-size-converter.decimal1000') }}</span>
          <el-switch v-model="binaryMode" />
          <span class="text-sm text-gray-500">{{ t('tool.file-size-converter.binary1024') }}</span>
        </div>
      </div>

      <el-alert
        class="mb-4"
        :title="binaryMode ? t('tool.file-size-converter.binaryModeNote') : t('tool.file-size-converter.decimalModeNote')"
        type="info"
        :closable="false"
        show-icon
      />

      <el-table :data="results" stripe border>
        <el-table-column :label="t('tool.file-size-converter.unitCol')" width="100">
          <template #default="{ row }">
            <span
              class="font-semibold"
              :class="isCurrentUnit(row.unit) ? 'text-blue-500' : ''"
            >
              {{ row.unit }}
            </span>
            <el-tag v-if="isCurrentUnit(row.unit)" size="small" class="ml-2">{{ t('common.input') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('tool.file-size-converter.resultCol')">
          <template #default="{ row }">
            <span class="font-mono text-base">{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('tool.file-size-converter.baseNote')" width="200">
          <template #default="{ row }">
            <span class="text-gray-400 text-sm">
              {{ binaryMode ? '1 ' + row.unit + ' = ' + Math.pow(1024, units.indexOf(row.unit)) + ' B' : '1 ' + row.unit + ' = ' + Math.pow(1000, units.indexOf(row.unit)) + ' B' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="t('tool.file-size-converter.actionCol')" width="80" align="center">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleCopy(row)"
            >
              {{ t('common.copy') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
