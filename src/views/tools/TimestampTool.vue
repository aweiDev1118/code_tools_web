<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

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
  if (isNaN(ts)) return '无效的时间戳'
  const timestamp = unit.value === 's' ? ts * 1000 : ts
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
})

// 日期转时间戳
const dateToTimestamp = computed(() => {
  if (!dateInput.value) return ''
  const d = dayjs(dateInput.value)
  if (!d.isValid()) return '无效的日期'
  return unit.value === 's' ? d.unix().toString() : d.valueOf().toString()
})

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制')
  } catch {
    ElMessage.error('复制失败')
  }
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">时间戳转换</h1>
      <p class="text-gray-500">时间戳与日期格式互相转换</p>
    </div>

    <!-- 当前时间 -->
    <el-card class="mb-6">
      <template #header>当前时间</template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">日期时间</div>
          <div class="text-lg font-mono font-medium">{{ currentTimeFormatted }}</div>
        </div>
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">秒级时间戳</div>
          <div class="text-lg font-mono font-medium cursor-pointer hover:text-primary-600" @click="copyText(currentTimestampSeconds.toString())">
            {{ currentTimestampSeconds }}
          </div>
        </div>
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">毫秒级时间戳</div>
          <div class="text-lg font-mono font-medium cursor-pointer hover:text-primary-600" @click="copyText(currentTimestamp.toString())">
            {{ currentTimestamp }}
          </div>
        </div>
      </div>
    </el-card>

    <!-- 单位选择 -->
    <div class="mb-4">
      <el-radio-group v-model="unit">
        <el-radio-button value="s">秒 (s)</el-radio-button>
        <el-radio-button value="ms">毫秒 (ms)</el-radio-button>
      </el-radio-group>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 时间戳转日期 -->
      <el-card>
        <template #header>时间戳 → 日期</template>
        <div class="space-y-4">
          <div class="flex gap-2">
            <el-input
              v-model="timestampInput"
              placeholder="请输入时间戳"
              class="font-mono"
            />
            <el-button @click="setNow">现在</el-button>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[60px] flex items-center justify-center">
            <span class="font-mono text-lg">{{ timestampToDate || '转换结果' }}</span>
          </div>
          <el-button v-if="timestampToDate && !timestampToDate.includes('无效')" @click="copyText(timestampToDate)" block>
            复制结果
          </el-button>
        </div>
      </el-card>

      <!-- 日期转时间戳 -->
      <el-card>
        <template #header>日期 → 时间戳</template>
        <div class="space-y-4">
          <div class="flex gap-2">
            <el-input
              v-model="dateInput"
              placeholder="如: 2024-01-01 12:00:00"
              class="font-mono"
            />
            <el-button @click="setNowDate">现在</el-button>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[60px] flex items-center justify-center">
            <span class="font-mono text-lg">{{ dateToTimestamp || '转换结果' }}</span>
          </div>
          <el-button v-if="dateToTimestamp && !dateToTimestamp.includes('无效')" @click="copyText(dateToTimestamp)" block>
            复制结果
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
