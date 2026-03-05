<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const { t } = useI18n()

const date1 = ref(dayjs().format('YYYY-MM-DD'))
const date2 = ref(dayjs().add(30, 'day').format('YYYY-MM-DD'))
const baseDate = ref(dayjs().format('YYYY-MM-DD'))
const addValue = ref(7)
const addUnit = ref<'day' | 'week' | 'month' | 'year'>('day')

const diff = computed(() => {
  if (!date1.value || !date2.value) return null

  const d1 = dayjs(date1.value)
  const d2 = dayjs(date2.value)

  const days = Math.abs(d2.diff(d1, 'day'))
  const weeks = Math.floor(days / 7)
  const months = Math.abs(d2.diff(d1, 'month'))
  const years = Math.abs(d2.diff(d1, 'year'))

  const hours = days * 24
  const minutes = hours * 60
  const seconds = minutes * 60

  return {
    days,
    weeks,
    remainingDays: days % 7,
    months,
    years,
    hours,
    minutes,
    seconds
  }
})

const calculatedDate = computed(() => {
  if (!baseDate.value) return ''
  return dayjs(baseDate.value).add(addValue.value, addUnit.value).format('YYYY-MM-DD')
})

const calculatedWeekday = computed(() => {
  if (!calculatedDate.value) return ''
  const weekdays = [
    t('tool.date-calculator.sunday'),
    t('tool.date-calculator.monday'),
    t('tool.date-calculator.tuesday'),
    t('tool.date-calculator.wednesday'),
    t('tool.date-calculator.thursday'),
    t('tool.date-calculator.friday'),
    t('tool.date-calculator.saturday'),
  ]
  return weekdays[dayjs(calculatedDate.value).day()]
})

const swapDates = () => {
  const temp = date1.value
  date1.value = date2.value
  date2.value = temp
}

const setToday = (field: 'date1' | 'date2' | 'baseDate') => {
  const today = dayjs().format('YYYY-MM-DD')
  if (field === 'date1') date1.value = today
  else if (field === 'date2') date2.value = today
  else baseDate.value = today
}

const units = computed(() => [
  { value: 'day', label: t('tool.date-calculator.day') },
  { value: 'week', label: t('tool.date-calculator.week') },
  { value: 'month', label: t('tool.date-calculator.month') },
  { value: 'year', label: t('tool.date-calculator.year') },
])
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.date-calculator.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.date-calculator.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 日期差值计算 -->
      <el-card>
        <template #header>{{ t('tool.date-calculator.diffHeader') }}</template>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="w-16">{{ t('tool.date-calculator.start') }}:</span>
            <el-date-picker v-model="date1" type="date" value-format="YYYY-MM-DD" class="flex-1" />
            <el-button size="small" @click="setToday('date1')">{{ t('tool.date-calculator.today') }}</el-button>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-16">{{ t('tool.date-calculator.end') }}:</span>
            <el-date-picker v-model="date2" type="date" value-format="YYYY-MM-DD" class="flex-1" />
            <el-button size="small" @click="setToday('date2')">{{ t('tool.date-calculator.today') }}</el-button>
          </div>
          <el-button @click="swapDates" class="w-full">
            <el-icon><Switch /></el-icon>
            {{ t('tool.date-calculator.swapDates') }}
          </el-button>

          <el-divider />

          <div v-if="diff" class="space-y-3">
            <div class="text-center p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <div class="text-3xl font-bold text-primary-600">{{ diff.days }}</div>
              <div class="text-gray-500">{{ t('tool.date-calculator.days') }}</div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div class="text-lg font-semibold">{{ diff.weeks }} {{ t('tool.date-calculator.week') }} {{ diff.remainingDays }} {{ t('tool.date-calculator.days') }}</div>
                <div class="text-sm text-gray-500">{{ t('tool.date-calculator.weeks') }}</div>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div class="text-lg font-semibold">{{ diff.months }}</div>
                <div class="text-sm text-gray-500">{{ t('tool.date-calculator.months') }}</div>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div class="text-lg font-semibold">{{ diff.hours.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">{{ t('tool.date-calculator.hours') }}</div>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div class="text-lg font-semibold">{{ diff.minutes.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">{{ t('tool.date-calculator.minutes') }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 日期推算 -->
      <el-card>
        <template #header>{{ t('tool.date-calculator.calcHeader') }}</template>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="w-16">{{ t('tool.date-calculator.base') }}:</span>
            <el-date-picker v-model="baseDate" type="date" value-format="YYYY-MM-DD" class="flex-1" />
            <el-button size="small" @click="setToday('baseDate')">{{ t('tool.date-calculator.today') }}</el-button>
          </div>

          <div class="flex items-center gap-2">
            <span class="w-16">{{ t('tool.date-calculator.offset') }}:</span>
            <el-input-number v-model="addValue" :min="-9999" :max="9999" class="flex-1" />
            <el-select v-model="addUnit" style="width: 80px">
              <el-option v-for="unit in units" :key="unit.value" :value="unit.value" :label="unit.label" />
            </el-select>
          </div>

          <el-divider />

          <div class="text-center p-6 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div class="text-sm text-gray-500 mb-2">{{ t('tool.date-calculator.calcResult') }}</div>
            <div class="text-2xl font-bold text-green-600">{{ calculatedDate }}</div>
            <div class="text-gray-500 mt-1">{{ calculatedWeekday }}</div>
          </div>

          <el-alert type="info" :closable="false" class="mt-4">
            <p>{{ t('tool.date-calculator.positiveHint') }}</p>
            <p>{{ t('tool.date-calculator.negativeHint') }}</p>
          </el-alert>
        </div>
      </el-card>
    </div>
  </div>
</template>
