<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

type CategoryKey = 'length' | 'weight' | 'temperature' | 'area' | 'volume'

interface UnitDef {
  label: string
  symbol: string
  toBase: number
}

interface TempResult {
  unit: string
  symbol: string
  value: string
}

const activeCategory = ref<CategoryKey>('length')
const inputValue = ref<number | undefined>(undefined)
const fromUnit = ref<string>('')

// Conversion factors relative to base unit
const categories: Record<CategoryKey, { label: string; base: string; units: UnitDef[] }> = {
  length: {
    label: '长度',
    base: 'm',
    units: [
      { label: '毫米', symbol: 'mm', toBase: 0.001 },
      { label: '厘米', symbol: 'cm', toBase: 0.01 },
      { label: '米', symbol: 'm', toBase: 1 },
      { label: '千米', symbol: 'km', toBase: 1000 },
      { label: '英寸', symbol: 'in', toBase: 0.0254 },
      { label: '英尺', symbol: 'ft', toBase: 0.3048 },
      { label: '码', symbol: 'yd', toBase: 0.9144 },
      { label: '英里', symbol: 'mi', toBase: 1609.344 },
    ],
  },
  weight: {
    label: '重量',
    base: 'kg',
    units: [
      { label: '毫克', symbol: 'mg', toBase: 0.000001 },
      { label: '克', symbol: 'g', toBase: 0.001 },
      { label: '千克', symbol: 'kg', toBase: 1 },
      { label: '吨', symbol: 't', toBase: 1000 },
      { label: '磅', symbol: 'lb', toBase: 0.45359237 },
      { label: '盎司', symbol: 'oz', toBase: 0.028349523 },
    ],
  },
  temperature: {
    label: '温度',
    base: 'C',
    units: [
      { label: '摄氏度', symbol: '°C', toBase: 1 },
      { label: '华氏度', symbol: '°F', toBase: 1 },
      { label: '开尔文', symbol: 'K', toBase: 1 },
    ],
  },
  area: {
    label: '面积',
    base: 'm2',
    units: [
      { label: '平方毫米', symbol: 'mm²', toBase: 0.000001 },
      { label: '平方厘米', symbol: 'cm²', toBase: 0.0001 },
      { label: '平方米', symbol: 'm²', toBase: 1 },
      { label: '平方千米', symbol: 'km²', toBase: 1000000 },
      { label: '英亩', symbol: '英亩', toBase: 4046.8564 },
      { label: '公顷', symbol: '公顷', toBase: 10000 },
    ],
  },
  volume: {
    label: '体积',
    base: 'L',
    units: [
      { label: '毫升', symbol: 'mL', toBase: 0.001 },
      { label: '升', symbol: 'L', toBase: 1 },
      { label: '立方米', symbol: 'm³', toBase: 1000 },
      { label: '美制加仑', symbol: 'gal(美)', toBase: 3.785411784 },
      { label: '英制加仑', symbol: 'gal(英)', toBase: 4.54609 },
    ],
  },
}

const currentCategory = computed(() => categories[activeCategory.value])

const currentUnits = computed(() => currentCategory.value.units)

// Initialize fromUnit when category changes
const onCategoryChange = (key: CategoryKey) => {
  activeCategory.value = key
  inputValue.value = undefined
  fromUnit.value = currentUnits.value[0]?.symbol ?? ''
}

// Set initial fromUnit
fromUnit.value = currentUnits.value[0]?.symbol ?? ''

// Convert temperature to Celsius as base
const toCelsius = (value: number, symbol: string): number => {
  if (symbol === '°C') return value
  if (symbol === '°F') return (value - 32) * (5 / 9)
  if (symbol === 'K') return value - 273.15
  return value
}

const fromCelsius = (celsius: number, symbol: string): number => {
  if (symbol === '°C') return celsius
  if (symbol === '°F') return celsius * (9 / 5) + 32
  if (symbol === 'K') return celsius + 273.15
  return celsius
}

const formatNumber = (n: number): string => {
  if (!isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs === 0) return '0'
  if (abs >= 1e15 || (abs < 1e-9 && abs > 0)) {
    return n.toExponential(6)
  }
  // Trim trailing zeros up to 10 decimal places
  return parseFloat(n.toPrecision(10)).toString()
}

interface ResultRow {
  label: string
  symbol: string
  value: string
}

const results = computed((): ResultRow[] => {
  if (inputValue.value === undefined || inputValue.value === null) return []
  const val = Number(inputValue.value)
  if (isNaN(val)) return []

  const units = currentUnits.value
  const from = fromUnit.value
  const isTemp = activeCategory.value === 'temperature'

  if (isTemp) {
    const celsius = toCelsius(val, from)
    return units
      .filter((u) => u.symbol !== from)
      .map((u): ResultRow => ({
        label: u.label,
        symbol: u.symbol,
        value: formatNumber(fromCelsius(celsius, u.symbol)),
      }))
  }

  const fromDef = units.find((u) => u.symbol === from)
  if (!fromDef) return []
  const baseValue = val * fromDef.toBase

  return units
    .filter((u) => u.symbol !== from)
    .map((u): ResultRow => ({
      label: u.label,
      symbol: u.symbol,
      value: formatNumber(baseValue / u.toBase),
    }))
})

const tempResults = computed((): TempResult[] => {
  if (activeCategory.value !== 'temperature') return []
  if (inputValue.value === undefined || inputValue.value === null) return []
  const val = Number(inputValue.value)
  if (isNaN(val)) return []
  const from = fromUnit.value
  const celsius = toCelsius(val, from)
  return [
    { unit: '摄氏度', symbol: '°C', value: formatNumber(celsius) },
    { unit: '华氏度', symbol: '°F', value: formatNumber(fromCelsius(celsius, '°F')) },
    { unit: '开尔文', symbol: 'K', value: formatNumber(fromCelsius(celsius, 'K')) },
  ]
})

const displayResults = computed(() => {
  if (activeCategory.value === 'temperature') return tempResults.value
  return results.value
})

const handleCopy = (row: ResultRow | TempResult) => {
  copyToClipboard(row.value, `已复制 ${row.value} ${row.symbol}`)
}

const categoryTabs = (Object.keys(categories) as CategoryKey[]).map((k) => ({
  key: k,
  label: categories[k].label,
}))
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">单位换算</h1>
      <p class="text-gray-500">支持长度、重量、温度、面积、体积等常用单位互转</p>
    </div>

    <el-card>
      <el-tabs
        :model-value="activeCategory"
        @tab-click="(tab: any) => onCategoryChange(tab.paneName as CategoryKey)"
      >
        <el-tab-pane
          v-for="tab in categoryTabs"
          :key="tab.key"
          :label="tab.label"
          :name="tab.key"
        />
      </el-tabs>

      <div class="flex items-center gap-4 mt-4 mb-6">
        <el-input-number
          v-model="inputValue"
          :placeholder="'输入' + currentCategory.label + '数值'"
          :controls="false"
          class="flex-1"
          style="width: 100%"
        />
        <el-select v-model="fromUnit" style="width: 160px">
          <el-option
            v-for="unit in currentUnits"
            :key="unit.symbol"
            :label="unit.label + ' (' + unit.symbol + ')'"
            :value="unit.symbol"
          />
        </el-select>
      </div>

      <div v-if="displayResults.length > 0">
        <el-table :data="displayResults" stripe border>
          <el-table-column label="单位" prop="label" min-width="120" />
          <el-table-column label="符号" prop="symbol" width="100" />
          <el-table-column label="换算结果" prop="value" min-width="200">
            <template #default="{ row }">
              <span class="font-mono">{{ row.value }}</span>
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
      </div>

      <el-empty v-else description="请输入数值并选择源单位" />
    </el-card>
  </div>
</template>
