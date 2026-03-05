<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

type CategoryKey = 'length' | 'weight' | 'temperature' | 'area' | 'volume'

interface UnitDef {
  labelKey: string
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

const categoriesConfig: Record<CategoryKey, { labelKey: string; base: string; units: UnitDef[] }> = {
  length: {
    labelKey: 'tool.unit-converter.length',
    base: 'm',
    units: [
      { labelKey: 'tool.unit-converter.mm', symbol: 'mm', toBase: 0.001 },
      { labelKey: 'tool.unit-converter.cm', symbol: 'cm', toBase: 0.01 },
      { labelKey: 'tool.unit-converter.m', symbol: 'm', toBase: 1 },
      { labelKey: 'tool.unit-converter.km', symbol: 'km', toBase: 1000 },
      { labelKey: 'tool.unit-converter.inch', symbol: 'in', toBase: 0.0254 },
      { labelKey: 'tool.unit-converter.foot', symbol: 'ft', toBase: 0.3048 },
      { labelKey: 'tool.unit-converter.yard', symbol: 'yd', toBase: 0.9144 },
      { labelKey: 'tool.unit-converter.mile', symbol: 'mi', toBase: 1609.344 },
    ],
  },
  weight: {
    labelKey: 'tool.unit-converter.weight',
    base: 'kg',
    units: [
      { labelKey: 'tool.unit-converter.mg', symbol: 'mg', toBase: 0.000001 },
      { labelKey: 'tool.unit-converter.g', symbol: 'g', toBase: 0.001 },
      { labelKey: 'tool.unit-converter.kg', symbol: 'kg', toBase: 1 },
      { labelKey: 'tool.unit-converter.ton', symbol: 't', toBase: 1000 },
      { labelKey: 'tool.unit-converter.pound', symbol: 'lb', toBase: 0.45359237 },
      { labelKey: 'tool.unit-converter.ounce', symbol: 'oz', toBase: 0.028349523 },
    ],
  },
  temperature: {
    labelKey: 'tool.unit-converter.temperature',
    base: 'C',
    units: [
      { labelKey: 'tool.unit-converter.celsius', symbol: '°C', toBase: 1 },
      { labelKey: 'tool.unit-converter.fahrenheit', symbol: '°F', toBase: 1 },
      { labelKey: 'tool.unit-converter.kelvin', symbol: 'K', toBase: 1 },
    ],
  },
  area: {
    labelKey: 'tool.unit-converter.area',
    base: 'm2',
    units: [
      { labelKey: 'tool.unit-converter.mm2', symbol: 'mm²', toBase: 0.000001 },
      { labelKey: 'tool.unit-converter.cm2', symbol: 'cm²', toBase: 0.0001 },
      { labelKey: 'tool.unit-converter.m2', symbol: 'm²', toBase: 1 },
      { labelKey: 'tool.unit-converter.km2', symbol: 'km²', toBase: 1000000 },
      { labelKey: 'tool.unit-converter.acre', symbol: 'ac', toBase: 4046.8564 },
      { labelKey: 'tool.unit-converter.hectare', symbol: 'ha', toBase: 10000 },
    ],
  },
  volume: {
    labelKey: 'tool.unit-converter.volume',
    base: 'L',
    units: [
      { labelKey: 'tool.unit-converter.ml', symbol: 'mL', toBase: 0.001 },
      { labelKey: 'tool.unit-converter.liter', symbol: 'L', toBase: 1 },
      { labelKey: 'tool.unit-converter.m3', symbol: 'm³', toBase: 1000 },
      { labelKey: 'tool.unit-converter.usGallon', symbol: 'gal(US)', toBase: 3.785411784 },
      { labelKey: 'tool.unit-converter.ukGallon', symbol: 'gal(UK)', toBase: 4.54609 },
    ],
  },
}

const currentCategory = computed(() => {
  const cfg = categoriesConfig[activeCategory.value]
  return {
    label: t(cfg.labelKey),
    base: cfg.base,
    units: cfg.units.map(u => ({ ...u, label: t(u.labelKey) })),
  }
})

const currentUnits = computed(() => currentCategory.value.units)

const onCategoryChange = (key: CategoryKey) => {
  activeCategory.value = key
  inputValue.value = undefined
  fromUnit.value = currentUnits.value[0]?.symbol ?? ''
}

fromUnit.value = currentUnits.value[0]?.symbol ?? ''

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
    { unit: t('tool.unit-converter.celsius'), symbol: '°C', value: formatNumber(celsius) },
    { unit: t('tool.unit-converter.fahrenheit'), symbol: '°F', value: formatNumber(fromCelsius(celsius, '°F')) },
    { unit: t('tool.unit-converter.kelvin'), symbol: 'K', value: formatNumber(fromCelsius(celsius, 'K')) },
  ]
})

const displayResults = computed(() => {
  if (activeCategory.value === 'temperature') return tempResults.value
  return results.value
})

const handleCopy = (row: ResultRow | TempResult) => {
  copyToClipboard(row.value, t('tool.unit-converter.copied', { value: row.value, symbol: row.symbol }))
}

const categoryTabs = computed(() =>
  (Object.keys(categoriesConfig) as CategoryKey[]).map((k) => ({
    key: k,
    label: t(categoriesConfig[k].labelKey),
  }))
)
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.unit-converter.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.unit-converter.subtitle') }}</p>
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
          :placeholder="t('tool.unit-converter.inputPlaceholder', { category: currentCategory.label })"
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
          <el-table-column :label="t('tool.unit-converter.unitCol')" prop="label" min-width="120" />
          <el-table-column :label="t('tool.unit-converter.symbolCol')" prop="symbol" width="100" />
          <el-table-column :label="t('tool.unit-converter.resultCol')" prop="value" min-width="200">
            <template #default="{ row }">
              <span class="font-mono">{{ row.value }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.unit-converter.actionCol')" width="80" align="center">
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
      </div>

      <el-empty v-else :description="t('tool.unit-converter.emptyHint')" />
    </el-card>
  </div>
</template>
