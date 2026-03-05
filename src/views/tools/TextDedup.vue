<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.text-dedup.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.text-dedup.subtitle') }}</p>
    </div>

    <el-card class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span>{{ t('tool.text-dedup.dedupOptions') }}</span>
          <div class="flex gap-2">
            <el-button size="small" @click="loadSample" text>{{ t('common.loadSample') }}</el-button>
            <el-button size="small" @click="clear">{{ t('common.clear') }}</el-button>
          </div>
        </div>
      </template>
      <div class="flex flex-wrap gap-6">
        <el-checkbox v-model="ignoreEmpty">{{ t('tool.text-dedup.ignoreEmpty') }}</el-checkbox>
        <el-checkbox v-model="ignoreCase">{{ t('tool.text-dedup.ignoreCase') }}</el-checkbox>
        <el-checkbox v-model="trimLines">{{ t('tool.text-dedup.trimLines') }}</el-checkbox>
      </div>
    </el-card>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <el-card>
        <template #header>{{ t('tool.text-dedup.inputText') }}</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="14"
          :placeholder="t('tool.text-dedup.inputPlaceholder')"
        />
      </el-card>

      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>{{ t('tool.text-dedup.dedupResult') }}</span>
            <el-button size="small" :disabled="!stats.result" @click="copyResult">{{ t('tool.text-dedup.copyResult') }}</el-button>
          </div>
        </template>
        <div
          class="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm min-h-[300px] whitespace-pre-wrap break-all overflow-auto"
          style="height: 300px;"
        >
          {{ stats.result || t('tool.text-dedup.resultPlaceholder') }}
        </div>
      </el-card>
    </div>

    <el-card v-if="input">
      <div class="flex flex-wrap gap-8 text-center">
        <div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.originalCount }}</div>
          <div class="text-sm text-gray-500 mt-1">{{ t('tool.text-dedup.originalLines') }}</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ stats.dedupedCount }}</div>
          <div class="text-sm text-gray-500 mt-1">{{ t('tool.text-dedup.dedupedLines') }}</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-red-500">{{ stats.removedCount }}</div>
          <div class="text-sm text-gray-500 mt-1">{{ t('tool.text-dedup.removedDuplicates') }}</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">
            {{ stats.originalCount > 0 ? Math.round((stats.removedCount / Math.max(stats.originalCount, 1)) * 100) : 0 }}%
          </div>
          <div class="text-sm text-gray-500 mt-1">{{ t('tool.text-dedup.dedupRate') }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>
