<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

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
  // Show reasonable decimal places
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
  copyToClipboard(row.value, `已复制 ${row.value} ${row.unit}`)
}

const isCurrentUnit = (unit: SizeUnit): boolean => unit === fromUnit.value
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">文件大小换算</h1>
      <p class="text-gray-500">B、KB、MB、GB、TB、PB 互相换算，支持二进制(1024)和十进制(1000)两种模式</p>
    </div>

    <el-card>
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <el-input-number
          v-model="inputValue"
          :min="0"
          :controls="true"
          :precision="6"
          placeholder="输入文件大小"
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
          <span class="text-sm text-gray-500">十进制(1000)</span>
          <el-switch v-model="binaryMode" />
          <span class="text-sm text-gray-500">二进制(1024)</span>
        </div>
      </div>

      <el-alert
        class="mb-4"
        :title="binaryMode ? '二进制模式：1 KB = 1024 B，1 MB = 1024 KB（符合操作系统实际显示）' : '十进制模式：1 KB = 1000 B，1 MB = 1000 KB（符合硬盘厂商标注）'"
        type="info"
        :closable="false"
        show-icon
      />

      <el-table :data="results" stripe border>
        <el-table-column label="单位" width="100">
          <template #default="{ row }">
            <span
              class="font-semibold"
              :class="isCurrentUnit(row.unit) ? 'text-blue-500' : ''"
            >
              {{ row.unit }}
            </span>
            <el-tag v-if="isCurrentUnit(row.unit)" size="small" class="ml-2">输入</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="换算结果">
          <template #default="{ row }">
            <span class="font-mono text-base">{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进制说明" width="200">
          <template #default="{ row }">
            <span class="text-gray-400 text-sm">
              {{ binaryMode ? '1 ' + row.unit + ' = ' + Math.pow(1024, units.indexOf(row.unit)) + ' B' : '1 ' + row.unit + ' = ' + Math.pow(1000, units.indexOf(row.unit)) + ' B' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleCopy(row)"
            >
              复制
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
