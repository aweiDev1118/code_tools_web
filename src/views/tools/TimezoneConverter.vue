<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

interface Timezone {
  label: string
  value: string
  offset: number
}

const timezones = computed<Timezone[]>(() => [
  { label: t('tool.timezone-converter.tz_utc'), value: 'UTC', offset: 0 },
  { label: t('tool.timezone-converter.tz_shanghai'), value: 'Asia/Shanghai', offset: 8 },
  { label: t('tool.timezone-converter.tz_tokyo'), value: 'Asia/Tokyo', offset: 9 },
  { label: t('tool.timezone-converter.tz_newyork'), value: 'America/New_York', offset: -5 },
  { label: t('tool.timezone-converter.tz_losangeles'), value: 'America/Los_Angeles', offset: -8 },
  { label: t('tool.timezone-converter.tz_london'), value: 'Europe/London', offset: 0 },
  { label: t('tool.timezone-converter.tz_paris'), value: 'Europe/Paris', offset: 1 },
  { label: t('tool.timezone-converter.tz_kolkata'), value: 'Asia/Kolkata', offset: 5.5 },
  { label: t('tool.timezone-converter.tz_sydney'), value: 'Australia/Sydney', offset: 10 },
  { label: t('tool.timezone-converter.tz_moscow'), value: 'Europe/Moscow', offset: 3 },
  { label: t('tool.timezone-converter.tz_bangkok'), value: 'Asia/Bangkok', offset: 7 },
  { label: t('tool.timezone-converter.tz_saopaulo'), value: 'America/Sao_Paulo', offset: -3 },
])

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

  return timezones.value.map((tz) => {
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
  () => timezones.value.find((tz) => tz.value === sourceTimezone.value)?.label ?? sourceTimezone.value
)
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.timezone-converter.name') }}</h1>
      <p class="text-gray-500 dark:text-gray-400">{{ t('tool.timezone-converter.subtitle') }}</p>
    </div>

    <!-- 输入区域 -->
    <el-card class="mb-6">
      <template #header>
        <span class="font-semibold">{{ t('tool.timezone-converter.selectTimeHeader') }}</span>
      </template>
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <el-date-picker
          v-model="selectedDate"
          type="datetime"
          :placeholder="t('tool.timezone-converter.selectDatetime')"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="x"
          class="flex-1"
        />
        <el-button @click="useCurrentTime">{{ t('tool.timezone-converter.currentTime') }}</el-button>
        <el-select v-model="sourceTimezone" :placeholder="t('tool.timezone-converter.sourceTimezone')" class="flex-1">
          <el-option
            v-for="tz in timezones"
            :key="tz.value"
            :label="tz.label"
            :value="tz.value"
          />
        </el-select>
      </div>
      <div v-if="selectedDate" class="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {{ t('tool.timezone-converter.sourceLabel') }}：{{ sourceLabel }}
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
              {{ t('tool.timezone-converter.sourceTag') }}
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
            <el-button size="small" plain @click="copyTime(result)">{{ t('common.copy') }}</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
