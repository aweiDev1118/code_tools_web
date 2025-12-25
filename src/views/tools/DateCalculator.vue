<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

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
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
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

const units = [
  { value: 'day', label: '天' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">日期计算</h1>
      <p class="text-gray-500">计算日期差值或推算日期</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 日期差值计算 -->
      <el-card>
        <template #header>日期差值计算</template>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="w-16">开始:</span>
            <el-date-picker v-model="date1" type="date" value-format="YYYY-MM-DD" class="flex-1" />
            <el-button size="small" @click="setToday('date1')">今天</el-button>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-16">结束:</span>
            <el-date-picker v-model="date2" type="date" value-format="YYYY-MM-DD" class="flex-1" />
            <el-button size="small" @click="setToday('date2')">今天</el-button>
          </div>
          <el-button @click="swapDates" class="w-full">
            <el-icon><Switch /></el-icon>
            交换日期
          </el-button>

          <el-divider />

          <div v-if="diff" class="space-y-3">
            <div class="text-center p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <div class="text-3xl font-bold text-primary-600">{{ diff.days }}</div>
              <div class="text-gray-500">天</div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div class="text-lg font-semibold">{{ diff.weeks }} 周 {{ diff.remainingDays }} 天</div>
                <div class="text-sm text-gray-500">周数</div>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div class="text-lg font-semibold">{{ diff.months }}</div>
                <div class="text-sm text-gray-500">月</div>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div class="text-lg font-semibold">{{ diff.hours.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">小时</div>
              </div>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div class="text-lg font-semibold">{{ diff.minutes.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">分钟</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 日期推算 -->
      <el-card>
        <template #header>日期推算</template>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="w-16">基准:</span>
            <el-date-picker v-model="baseDate" type="date" value-format="YYYY-MM-DD" class="flex-1" />
            <el-button size="small" @click="setToday('baseDate')">今天</el-button>
          </div>

          <div class="flex items-center gap-2">
            <span class="w-16">增减:</span>
            <el-input-number v-model="addValue" :min="-9999" :max="9999" class="flex-1" />
            <el-select v-model="addUnit" style="width: 80px">
              <el-option v-for="unit in units" :key="unit.value" :value="unit.value" :label="unit.label" />
            </el-select>
          </div>

          <el-divider />

          <div class="text-center p-6 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div class="text-sm text-gray-500 mb-2">计算结果</div>
            <div class="text-2xl font-bold text-green-600">{{ calculatedDate }}</div>
            <div class="text-gray-500 mt-1">{{ calculatedWeekday }}</div>
          </div>

          <el-alert type="info" :closable="false" class="mt-4">
            <p>输入正数表示之后的日期</p>
            <p>输入负数表示之前的日期</p>
          </el-alert>
        </div>
      </el-card>
    </div>
  </div>
</template>
