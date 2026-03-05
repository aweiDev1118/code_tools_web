<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

const currentTimestamp = ref(Date.now())
const timestampInput = ref('')
const dateInput = ref('')
const unit = ref<'s' | 'ms'>('ms')

let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    currentTimestamp.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const currentTimeFormatted = computed(() => {
  return dayjs(currentTimestamp.value).format('YYYY-MM-DD HH:mm:ss')
})

const currentTimestampSeconds = computed(() => {
  return Math.floor(currentTimestamp.value / 1000)
})

// 时间戳转日期
const timestampToDate = computed(() => {
  if (!timestampInput.value) return ''
  const ts = parseInt(timestampInput.value)
  if (isNaN(ts)) return t('tool.timestamp.invalidTimestamp')
  const timestamp = unit.value === 's' ? ts * 1000 : ts
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
})

// 日期转时间戳
const dateToTimestamp = computed(() => {
  if (!dateInput.value) return ''
  const d = dayjs(dateInput.value)
  if (!d.isValid()) return t('tool.timestamp.invalidDate')
  return unit.value === 's' ? d.unix().toString() : d.valueOf().toString()
})

const copyText = (text: string) => {
  copyToClipboard(text)
}

const setNow = () => {
  timestampInput.value = unit.value === 's'
    ? Math.floor(Date.now() / 1000).toString()
    : Date.now().toString()
}

const setNowDate = () => {
  dateInput.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.timestamp.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.timestamp.subtitle') }}</p>
    </div>

    <!-- 当前时间 -->
    <el-card class="mb-6">
      <template #header>{{ t('tool.timestamp.currentTime') }}</template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">{{ t('tool.timestamp.dateTime') }}</div>
          <div class="text-lg font-mono font-medium">{{ currentTimeFormatted }}</div>
        </div>
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">{{ t('tool.timestamp.secondTimestamp') }}</div>
          <div class="text-lg font-mono font-medium cursor-pointer hover:text-primary-600" @click="copyText(currentTimestampSeconds.toString())">
            {{ currentTimestampSeconds }}
          </div>
        </div>
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">{{ t('tool.timestamp.millisecondTimestamp') }}</div>
          <div class="text-lg font-mono font-medium cursor-pointer hover:text-primary-600" @click="copyText(currentTimestamp.toString())">
            {{ currentTimestamp }}
          </div>
        </div>
      </div>
    </el-card>

    <!-- 单位选择 -->
    <div class="mb-4">
      <el-radio-group v-model="unit">
        <el-radio-button value="s">{{ t('tool.timestamp.second') }} (s)</el-radio-button>
        <el-radio-button value="ms">{{ t('tool.timestamp.millisecond') }} (ms)</el-radio-button>
      </el-radio-group>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 时间戳转日期 -->
      <el-card>
        <template #header>{{ t('tool.timestamp.tsToDate') }}</template>
        <div class="space-y-4">
          <div class="flex gap-2">
            <el-input
              v-model="timestampInput"
              :placeholder="t('tool.timestamp.tsPlaceholder')"
              class="font-mono"
            />
            <el-button @click="setNow">{{ t('tool.timestamp.now') }}</el-button>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[60px] flex items-center justify-center">
            <span class="font-mono text-lg">{{ timestampToDate || t('tool.timestamp.convertResult') }}</span>
          </div>
          <el-button v-if="timestampToDate && !timestampToDate.includes(t('tool.timestamp.invalid'))" @click="copyText(timestampToDate)" block>
            {{ t('tool.timestamp.copyResult') }}
          </el-button>
        </div>
      </el-card>

      <!-- 日期转时间戳 -->
      <el-card>
        <template #header>{{ t('tool.timestamp.dateToTs') }}</template>
        <div class="space-y-4">
          <div class="flex gap-2">
            <el-input
              v-model="dateInput"
              :placeholder="t('tool.timestamp.datePlaceholder')"
              class="font-mono"
            />
            <el-button @click="setNowDate">{{ t('tool.timestamp.now') }}</el-button>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[60px] flex items-center justify-center">
            <span class="font-mono text-lg">{{ dateToTimestamp || t('tool.timestamp.convertResult') }}</span>
          </div>
          <el-button v-if="dateToTimestamp && !dateToTimestamp.includes(t('tool.timestamp.invalid'))" @click="copyText(dateToTimestamp)" block>
            {{ t('tool.timestamp.copyResult') }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
