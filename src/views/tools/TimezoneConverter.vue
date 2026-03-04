<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

interface Timezone {
  label: string
  value: string
  offset: number
}

const timezones: Timezone[] = [
  { label: 'UTC (协调世界时)', value: 'UTC', offset: 0 },
  { label: 'GMT+8 北京/上海', value: 'Asia/Shanghai', offset: 8 },
  { label: 'GMT+9 东京', value: 'Asia/Tokyo', offset: 9 },
  { label: 'GMT-5 纽约', value: 'America/New_York', offset: -5 },
  { label: 'GMT-8 洛杉矶', value: 'America/Los_Angeles', offset: -8 },
  { label: 'GMT+0 伦敦', value: 'Europe/London', offset: 0 },
  { label: 'GMT+1 巴黎/柏林', value: 'Europe/Paris', offset: 1 },
  { label: 'GMT+5:30 新德里', value: 'Asia/Kolkata', offset: 5.5 },
  { label: 'GMT+10 悉尼', value: 'Australia/Sydney', offset: 10 },
  { label: 'GMT+3 莫斯科', value: 'Europe/Moscow', offset: 3 },
  { label: 'GMT+7 曼谷', value: 'Asia/Bangkok', offset: 7 },
  { label: 'GMT-3 圣保罗', value: 'America/Sao_Paulo', offset: -3 },
]

const selectedDate = ref<Date>(new Date())
const sourceTimezone = ref('Asia/Shanghai')

function useCurrentTime() {
  selectedDate.value = new Date()
}

interface ConvertedResult {
  label: string
  value: string
  time: string
  date: string
  timezone: string
}

const results = computed<ConvertedResult[]>(() => {
  if (!selectedDate.value) return []

  return timezones.map((tz) => {
    try {
      const formatter = new Intl.DateTimeFormat('zh-CN', {
        timeZone: tz.value,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      const parts = formatter.formatToParts(selectedDate.value)
      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''

      const date = `${get('year')}-${get('month')}-${get('day')}`
      const time = `${get('hour')}:${get('minute')}:${get('second')}`

      return {
        label: tz.label,
        value: tz.value,
        time,
        date,
        timezone: tz.value,
      }
    } catch {
      return {
        label: tz.label,
        value: tz.value,
        time: '--:--:--',
        date: '----/--/--',
        timezone: tz.value,
      }
    }
  })
})

function copyTime(result: ConvertedResult) {
  copyToClipboard(`${result.date} ${result.time} (${result.timezone})`)
}

const sourceLabel = computed(
  () => timezones.find((tz) => tz.value === sourceTimezone.value)?.label ?? sourceTimezone.value
)
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">时区转换</h1>
      <p class="text-gray-500 dark:text-gray-400">将指定时间转换为全球各时区对应时间</p>
    </div>

    <!-- 输入区域 -->
    <el-card class="mb-6">
      <template #header>
        <span class="font-semibold">选择时间与源时区</span>
      </template>
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <el-date-picker
          v-model="selectedDate"
          type="datetime"
          placeholder="选择日期时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="x"
          class="flex-1"
        />
        <el-button @click="useCurrentTime">当前时间</el-button>
        <el-select v-model="sourceTimezone" placeholder="源时区" class="flex-1">
          <el-option
            v-for="tz in timezones"
            :key="tz.value"
            :label="tz.label"
            :value="tz.value"
          />
        </el-select>
      </div>
      <div v-if="selectedDate" class="mt-3 text-sm text-gray-500 dark:text-gray-400">
        源时区：{{ sourceLabel }}
      </div>
    </el-card>

    <!-- 结果网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <el-card
        v-for="result in results"
        :key="result.value"
        class="cursor-pointer hover:shadow-md transition-shadow"
        :class="result.value === sourceTimezone ? 'ring-2 ring-blue-500' : ''"
      >
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
              {{ result.label }}
            </span>
            <el-tag v-if="result.value === sourceTimezone" size="small" type="primary" class="ml-2 shrink-0">
              源
            </el-tag>
          </div>
          <div class="text-2xl font-mono font-bold text-gray-900 dark:text-white">
            {{ result.time }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ result.date }}
          </div>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs font-mono text-gray-400">{{ result.timezone }}</span>
            <el-button size="small" plain @click="copyTime(result)">复制</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
