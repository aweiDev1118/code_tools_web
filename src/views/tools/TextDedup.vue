<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

const input = ref('')
const ignoreEmpty = ref(true)
const ignoreCase = ref(false)
const trimLines = ref(true)

const stats = computed(() => {
  const lines = input.value.split('\n')
  const originalCount = lines.length

  let processed = lines.map(line => (trimLines.value ? line.trim() : line))

  if (ignoreEmpty.value) {
    processed = processed.filter(line => line.length > 0)
  }

  const seen = new Set<string>()
  const deduped = processed.filter(line => {
    const key = ignoreCase.value ? line.toLowerCase() : line
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return {
    originalCount,
    dedupedCount: deduped.length,
    removedCount: processed.length - deduped.length,
    result: deduped.join('\n'),
  }
})

const clear = () => {
  input.value = ''
}

const loadSample = () => {
  input.value = `苹果
香蕉
苹果
橙子
香蕉
葡萄
  苹果
APPLE
apple
橙子`
}

const copyResult = () => {
  copyToClipboard(stats.value.result)
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">文本去重</h1>
      <p class="text-gray-500">按行去重，支持多种去重规则</p>
    </div>

    <el-card class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span>去重选项</span>
          <div class="flex gap-2">
            <el-button size="small" @click="loadSample" text>加载示例</el-button>
            <el-button size="small" @click="clear">清空</el-button>
          </div>
        </div>
      </template>
      <div class="flex flex-wrap gap-6">
        <el-checkbox v-model="ignoreEmpty">忽略空行</el-checkbox>
        <el-checkbox v-model="ignoreCase">忽略大小写</el-checkbox>
        <el-checkbox v-model="trimLines">去除首尾空格</el-checkbox>
      </div>
    </el-card>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <el-card>
        <template #header>输入文本</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="14"
          placeholder="请输入多行文本，每行一条..."
        />
      </el-card>

      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>去重结果</span>
            <el-button size="small" :disabled="!stats.result" @click="copyResult">复制结果</el-button>
          </div>
        </template>
        <div
          class="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm min-h-[300px] whitespace-pre-wrap break-all overflow-auto"
          style="height: 300px;"
        >
          {{ stats.result || '去重结果将显示在此处' }}
        </div>
      </el-card>
    </div>

    <el-card v-if="input">
      <div class="flex flex-wrap gap-8 text-center">
        <div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.originalCount }}</div>
          <div class="text-sm text-gray-500 mt-1">原始行数</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ stats.dedupedCount }}</div>
          <div class="text-sm text-gray-500 mt-1">去重后行数</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-red-500">{{ stats.removedCount }}</div>
          <div class="text-sm text-gray-500 mt-1">已移除重复</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">
            {{ stats.originalCount > 0 ? Math.round((stats.removedCount / Math.max(stats.originalCount, 1)) * 100) : 0 }}%
          </div>
          <div class="text-sm text-gray-500 mt-1">去重率</div>
        </div>
      </div>
    </el-card>
  </div>
</template>
