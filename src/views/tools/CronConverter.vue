<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CronField, CronFieldType } from '@/utils/cron'
import {
  getDefaultCronState,
  buildCronExpression,
  CRON_PRESETS,
  FIELD_RANGES,
  WEEK_LABELS,
  MONTH_LABELS,
} from '@/utils/cron'
import { parseCronExpression, describeCronExpression, getNextRunTimes } from '@/utils/cronParser'
import { copyToClipboard } from '@/utils/clipboard'

// ─── State ───────────────────────────────────────────────────────────────────

const cronState = ref(getDefaultCronState())
const activeTab = ref('second')
const reverseInput = ref('')
const reverseError = ref('')

// ─── Tab field definitions ────────────────────────────────────────────────────

const tabFields = [
  { key: 'second', label: '秒', name: 'second' },
  { key: 'minute', label: '分', name: 'minute' },
  { key: 'hour', label: '时', name: 'hour' },
  { key: 'day', label: '日', name: 'day' },
  { key: 'month', label: '月', name: 'month' },
  { key: 'week', label: '周', name: 'week' },
  { key: 'year', label: '年', name: 'year' },
] as const

type TabKey = (typeof tabFields)[number]['key']

// ─── Computed ─────────────────────────────────────────────────────────────────

const cronExpression = computed(() => buildCronExpression(cronState.value))

const expressionDescription = computed(() => {
  try {
    return describeCronExpression(cronExpression.value)
  } catch {
    return ''
  }
})

const nextRunTimes = computed(() => {
  try {
    return getNextRunTimes(cronExpression.value, 10)
  } catch {
    return []
  }
})

// ─── Field helpers ────────────────────────────────────────────────────────────

function getField(key: TabKey): CronField {
  return cronState.value[key]
}

function setFieldType(key: TabKey, type: CronFieldType) {
  const field = cronState.value[key]
  cronState.value = {
    ...cronState.value,
    [key]: { ...field, type },
  }
}

function updateField(key: TabKey, updates: Partial<CronField>) {
  const field = cronState.value[key]
  cronState.value = {
    ...cronState.value,
    [key]: { ...field, ...updates },
  }
}

function getFieldValues(key: TabKey): number[] {
  const range = FIELD_RANGES[key]
  const values: number[] = []
  for (let i = range.min; i <= range.max; i++) values.push(i)
  return values
}

function getCheckboxLabel(key: TabKey, v: number): string {
  if (key === 'week') return `星期${WEEK_LABELS[v]}`
  if (key === 'month') return MONTH_LABELS[v - 1]
  return String(v)
}

function toggleSpecificValue(key: TabKey, v: number) {
  const field = cronState.value[key]
  const values = field.values.includes(v)
    ? field.values.filter((x) => x !== v)
    : [...field.values, v]
  cronState.value = {
    ...cronState.value,
    [key]: { ...field, values },
  }
}

// ─── Methods ──────────────────────────────────────────────────────────────────

function applyPreset(expression: string) {
  cronState.value = parseCronExpression(expression)
}

function resetCron() {
  cronState.value = getDefaultCronState()
  reverseInput.value = ''
  reverseError.value = ''
}

function reverseParse() {
  if (!reverseInput.value.trim()) {
    reverseError.value = '请输入 Cron 表达式'
    return
  }
  try {
    cronState.value = parseCronExpression(reverseInput.value)
    reverseError.value = ''
  } catch {
    reverseError.value = '无效的 Cron 表达式'
  }
}

function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// Type options shared for common fields
type RadioOption = { label: string; value: CronFieldType }

function getCommonOptions(key: TabKey): RadioOption[] {
  const range = FIELD_RANGES[key]
  return [
    { label: `每${range.label}`, value: 'every' },
    { label: '范围', value: 'range' },
    { label: '指定', value: 'specific' },
    { label: '间隔', value: 'interval' },
  ]
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cron 表达式</h1>
      <p class="text-gray-500 dark:text-gray-400">通过选项生成 Cron 表达式，支持反向解析</p>
    </div>

    <!-- Expression Result Card -->
    <el-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">生成结果</span>
          <div class="flex gap-2">
            <el-button size="small" @click="copyToClipboard(cronExpression)">复制</el-button>
            <el-button size="small" @click="resetCron">重置</el-button>
          </div>
        </div>
      </template>
      <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3">
        <div class="text-xl font-mono font-bold text-center tracking-wider text-blue-600 dark:text-blue-400">
          {{ cronExpression }}
        </div>
      </div>
      <div class="text-center text-gray-500 dark:text-gray-400 text-sm">{{ expressionDescription }}</div>
    </el-card>

    <!-- Common Presets Card -->
    <el-card class="mb-6">
      <template #header>
        <span class="font-semibold">常用表达式</span>
      </template>
      <div class="flex flex-wrap gap-2">
        <el-button
          v-for="preset in CRON_PRESETS"
          :key="preset.expression"
          size="small"
          :title="preset.description"
          @click="applyPreset(preset.expression)"
        >
          {{ preset.label }}
        </el-button>
      </div>
    </el-card>

    <!-- Tab-based Field Editor Card -->
    <el-card class="mb-6">
      <template #header>
        <span class="font-semibold">字段配置</span>
      </template>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane
          v-for="tab in tabFields"
          :key="tab.key"
          :label="tab.label"
          :name="tab.name"
        >
          <div class="p-2">
            <!-- Type selector -->
            <div class="mb-4">
              <el-radio-group
                :model-value="getField(tab.key).type"
                @update:model-value="(val: CronFieldType) => setFieldType(tab.key, val)"
              >
                <!-- Common options -->
                <el-radio-button
                  v-for="opt in getCommonOptions(tab.key)"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </el-radio-button>

                <!-- Day-specific extra options -->
                <template v-if="tab.key === 'day'">
                  <el-radio-button value="noSpecific">不指定</el-radio-button>
                  <el-radio-button value="last">最后一天</el-radio-button>
                  <el-radio-button value="weekday">最近工作日</el-radio-button>
                </template>

                <!-- Week-specific extra options -->
                <template v-if="tab.key === 'week'">
                  <el-radio-button value="noSpecific">不指定</el-radio-button>
                  <el-radio-button value="lastWeekday">最后一个</el-radio-button>
                  <el-radio-button value="nthWeekday">第N个</el-radio-button>
                </template>
              </el-radio-group>
            </div>

            <!-- Conditional inputs based on type -->

            <!-- Range -->
            <div v-if="getField(tab.key).type === 'range'" class="flex items-center gap-3 flex-wrap">
              <span class="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">从</span>
              <el-input-number
                :model-value="getField(tab.key).start"
                :min="FIELD_RANGES[tab.key].min"
                :max="FIELD_RANGES[tab.key].max"
                size="small"
                @update:model-value="(val: number) => updateField(tab.key, { start: val })"
              />
              <span class="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">到</span>
              <el-input-number
                :model-value="getField(tab.key).end"
                :min="FIELD_RANGES[tab.key].min"
                :max="FIELD_RANGES[tab.key].max"
                size="small"
                @update:model-value="(val: number) => updateField(tab.key, { end: val })"
              />
              <span class="text-gray-600 dark:text-gray-400 text-sm">{{ FIELD_RANGES[tab.key].label }}</span>
            </div>

            <!-- Specific values -->
            <div v-else-if="getField(tab.key).type === 'specific'">
              <div :class="['cron-checkbox-grid', tab.key === 'week' || tab.key === 'month' ? 'cron-checkbox-grid--wide' : '']">
                <el-checkbox
                  v-for="v in getFieldValues(tab.key)"
                  :key="v"
                  :model-value="getField(tab.key).values.includes(v)"
                  @update:model-value="() => toggleSpecificValue(tab.key, v)"
                >
                  {{ getCheckboxLabel(tab.key, v) }}
                </el-checkbox>
              </div>
            </div>

            <!-- Interval -->
            <div v-else-if="getField(tab.key).type === 'interval'" class="flex items-center gap-3 flex-wrap">
              <span class="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">从</span>
              <el-input-number
                :model-value="getField(tab.key).start"
                :min="FIELD_RANGES[tab.key].min"
                :max="FIELD_RANGES[tab.key].max"
                size="small"
                @update:model-value="(val: number) => updateField(tab.key, { start: val })"
              />
              <span class="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">开始，每</span>
              <el-input-number
                :model-value="getField(tab.key).interval"
                :min="1"
                :max="FIELD_RANGES[tab.key].max"
                size="small"
                @update:model-value="(val: number) => updateField(tab.key, { interval: val })"
              />
              <span class="text-gray-600 dark:text-gray-400 text-sm">{{ FIELD_RANGES[tab.key].label }}</span>
            </div>

            <!-- Day: Nearest weekday -->
            <div v-else-if="getField(tab.key).type === 'weekday'" class="flex items-center gap-3 flex-wrap">
              <el-input-number
                :model-value="getField(tab.key).start"
                :min="1"
                :max="31"
                size="small"
                @update:model-value="(val: number) => updateField(tab.key, { start: val })"
              />
              <span class="text-gray-600 dark:text-gray-400 text-sm">号最近的工作日</span>
            </div>

            <!-- Week: Last weekday -->
            <div v-else-if="getField(tab.key).type === 'lastWeekday'" class="flex items-center gap-3 flex-wrap">
              <span class="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">最后一个</span>
              <el-select
                :model-value="getField(tab.key).start"
                size="small"
                style="width: 120px"
                @update:model-value="(val: number) => updateField(tab.key, { start: val })"
              >
                <el-option
                  v-for="(wLabel, idx) in WEEK_LABELS"
                  :key="idx"
                  :value="idx"
                  :label="`星期${wLabel}`"
                />
              </el-select>
            </div>

            <!-- Week: Nth weekday -->
            <div v-else-if="getField(tab.key).type === 'nthWeekday'" class="flex items-center gap-3 flex-wrap">
              <span class="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">第</span>
              <el-input-number
                :model-value="getField(tab.key).nth"
                :min="1"
                :max="5"
                size="small"
                @update:model-value="(val: number) => updateField(tab.key, { nth: val })"
              />
              <span class="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">个</span>
              <el-select
                :model-value="getField(tab.key).week"
                size="small"
                style="width: 120px"
                @update:model-value="(val: number) => updateField(tab.key, { week: val })"
              >
                <el-option
                  v-for="(wLabel, idx) in WEEK_LABELS"
                  :key="idx"
                  :value="idx"
                  :label="`星期${wLabel}`"
                />
              </el-select>
            </div>

            <!-- every / noSpecific / last — no extra inputs needed -->
            <div
              v-else-if="['every', 'noSpecific', 'last'].includes(getField(tab.key).type)"
              class="text-gray-400 dark:text-gray-500 text-sm py-2"
            >
              <template v-if="getField(tab.key).type === 'every'">每{{ FIELD_RANGES[tab.key].label }}执行</template>
              <template v-else-if="getField(tab.key).type === 'noSpecific'">不指定（使用 ?）</template>
              <template v-else-if="getField(tab.key).type === 'last'">每月最后一天（使用 L）</template>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- Reverse Parsing Card -->
    <el-card class="mb-6">
      <template #header>
        <span class="font-semibold">反向解析</span>
      </template>
      <div class="flex gap-2 mb-3">
        <el-input
          v-model="reverseInput"
          placeholder="输入 Cron 表达式，如: 0 0/5 * * * ? *"
          class="font-mono"
          clearable
          @keyup.enter="reverseParse"
        />
        <el-button type="primary" @click="reverseParse">解析</el-button>
      </div>
      <el-tag v-if="reverseError" type="danger">{{ reverseError }}</el-tag>
    </el-card>

    <!-- Next Execution Times Card -->
    <el-card class="mb-6">
      <template #header>
        <span class="font-semibold">最近10次执行时间</span>
      </template>
      <div v-if="nextRunTimes.length" class="space-y-2">
        <div
          v-for="(time, index) in nextRunTimes"
          :key="index"
          class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded"
        >
          <el-tag size="small" type="info">{{ index + 1 }}</el-tag>
          <span class="font-mono text-sm text-gray-700 dark:text-gray-300">{{ formatDate(time) }}</span>
        </div>
      </div>
      <div v-else class="text-gray-400 dark:text-gray-500 text-center py-4">无法计算执行时间</div>
    </el-card>
  </div>
</template>

<style scoped>
.cron-checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 4px;
}

.cron-checkbox-grid--wide {
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
}

.cron-checkbox-grid :deep(.el-checkbox) {
  margin-right: 0;
  height: auto;
  padding: 4px 2px;
}
</style>
