<script setup lang="ts">
import { ref, computed } from 'vue'

const text1 = ref('')
const text2 = ref('')

interface DiffResult {
  type: 'equal' | 'add' | 'remove'
  value: string
}

const diffLines = computed((): DiffResult[] => {
  if (!text1.value && !text2.value) return []

  const lines1 = text1.value.split('\n')
  const lines2 = text2.value.split('\n')
  const result: DiffResult[] = []

  const maxLen = Math.max(lines1.length, lines2.length)

  for (let i = 0; i < maxLen; i++) {
    const line1 = lines1[i] ?? ''
    const line2 = lines2[i] ?? ''

    if (line1 === line2) {
      if (line1) result.push({ type: 'equal', value: line1 })
    } else {
      if (line1) result.push({ type: 'remove', value: line1 })
      if (line2) result.push({ type: 'add', value: line2 })
    }
  }

  return result
})

const stats = computed(() => {
  const added = diffLines.value.filter(d => d.type === 'add').length
  const removed = diffLines.value.filter(d => d.type === 'remove').length
  const unchanged = diffLines.value.filter(d => d.type === 'equal').length
  return { added, removed, unchanged }
})

const clear = () => {
  text1.value = ''
  text2.value = ''
}

const swap = () => {
  const temp = text1.value
  text1.value = text2.value
  text2.value = temp
}

const loadSample = () => {
  text1.value = `function hello() {
  console.log("Hello");
  return true;
}`
  text2.value = `function hello() {
  console.log("Hello, World!");
  return false;
}`
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">文本对比</h1>
      <p class="text-gray-500">对比两段文本的差异</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <el-button @click="swap">
        <el-icon><Switch /></el-icon>
        交换
      </el-button>
      <el-button @click="clear">清空</el-button>
      <el-button @click="loadSample" text>加载示例</el-button>
      <div class="ml-auto flex gap-2">
        <el-tag type="danger">- {{ stats.removed }} 删除</el-tag>
        <el-tag type="success">+ {{ stats.added }} 新增</el-tag>
        <el-tag type="info">{{ stats.unchanged }} 相同</el-tag>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <el-card>
        <template #header>原文本</template>
        <el-input
          v-model="text1"
          type="textarea"
          :rows="12"
          placeholder="请输入原文本..."
          class="font-mono"
        />
      </el-card>

      <el-card>
        <template #header>新文本</template>
        <el-input
          v-model="text2"
          type="textarea"
          :rows="12"
          placeholder="请输入新文本..."
          class="font-mono"
        />
      </el-card>
    </div>

    <el-card>
      <template #header>对比结果</template>
      <div v-if="diffLines.length" class="font-mono text-sm space-y-1 max-h-96 overflow-auto">
        <div
          v-for="(diff, index) in diffLines"
          :key="index"
          class="px-2 py-1 rounded"
          :class="{
            'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200': diff.type === 'remove',
            'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200': diff.type === 'add',
            'bg-gray-50 dark:bg-gray-800': diff.type === 'equal'
          }"
        >
          <span class="inline-block w-6 text-gray-400">
            {{ diff.type === 'remove' ? '-' : diff.type === 'add' ? '+' : ' ' }}
          </span>
          {{ diff.value }}
        </div>
      </div>
      <el-empty v-else description="输入文本后显示对比结果" />
    </el-card>
  </div>
</template>
