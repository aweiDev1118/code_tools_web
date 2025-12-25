<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { copyToClipboard } from '@/utils/clipboard'

const count = ref(5)
const uppercase = ref(false)
const noDash = ref(false)
const uuids = ref<string[]>([])

const generate = () => {
  const result: string[] = []
  for (let i = 0; i < count.value; i++) {
    let uuid = uuidv4()
    if (noDash.value) {
      uuid = uuid.replace(/-/g, '')
    }
    if (uppercase.value) {
      uuid = uuid.toUpperCase()
    }
    result.push(uuid)
  }
  uuids.value = result
}

const copy = (text: string) => {
  copyToClipboard(text)
}

const copyAll = () => {
  if (!uuids.value.length) return
  copyToClipboard(uuids.value.join('\n'), '已复制全部')
}

// 初始化生成
generate()
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">UUID 生成</h1>
      <p class="text-gray-500">生成随机 UUID v4</p>
    </div>

    <el-card class="mb-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <span class="text-sm">数量:</span>
          <el-input-number v-model="count" :min="1" :max="100" size="small" />
        </div>
        <el-checkbox v-model="uppercase">大写</el-checkbox>
        <el-checkbox v-model="noDash">无横线</el-checkbox>
        <div class="ml-auto flex gap-2">
          <el-button type="primary" @click="generate">生成</el-button>
          <el-button @click="copyAll">复制全部</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <div class="space-y-2">
        <div
          v-for="(uuid, index) in uuids"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded group"
        >
          <code class="font-mono text-sm">{{ uuid }}</code>
          <el-button
            size="small"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
            @click="copy(uuid)"
          >
            复制
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
