<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

const length = ref(16)
const count = ref(5)
const options = ref({
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
})

const passwords = ref<string[]>([])

const charsets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

const generatePassword = (): string => {
  let chars = ''
  if (options.value.lowercase) chars += charsets.lowercase
  if (options.value.uppercase) chars += charsets.uppercase
  if (options.value.numbers) chars += charsets.numbers
  if (options.value.symbols) chars += charsets.symbols

  if (!chars) {
    ElMessage.warning('请至少选择一种字符类型')
    return ''
  }

  let password = ''
  const array = new Uint32Array(length.value)
  crypto.getRandomValues(array)
  for (let i = 0; i < length.value; i++) {
    password += chars[array[i] % chars.length]
  }
  return password
}

const generate = () => {
  const result: string[] = []
  for (let i = 0; i < count.value; i++) {
    const pwd = generatePassword()
    if (pwd) result.push(pwd)
  }
  passwords.value = result
}

const copy = (text: string) => {
  copyToClipboard(text)
}

const copyAll = () => {
  if (!passwords.value.length) return
  copyToClipboard(passwords.value.join('\n'), '已复制全部')
}

const strength = computed(() => {
  let score = 0
  if (options.value.lowercase) score++
  if (options.value.uppercase) score++
  if (options.value.numbers) score++
  if (options.value.symbols) score++

  if (length.value >= 16) score++
  if (length.value >= 24) score++

  if (score <= 2) return { level: '弱', color: 'danger' }
  if (score <= 4) return { level: '中', color: 'warning' }
  return { level: '强', color: 'success' }
})

// 初始化生成
generate()
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">随机密码生成</h1>
      <p class="text-gray-500">生成安全的随机密码</p>
    </div>

    <el-card class="mb-4">
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <span class="w-20">长度:</span>
          <el-slider v-model="length" :min="6" :max="64" :step="1" show-input class="flex-1" />
        </div>

        <div class="flex items-center gap-4">
          <span class="w-20">数量:</span>
          <el-input-number v-model="count" :min="1" :max="20" />
        </div>

        <div class="flex flex-wrap gap-4">
          <el-checkbox v-model="options.lowercase">小写字母 (a-z)</el-checkbox>
          <el-checkbox v-model="options.uppercase">大写字母 (A-Z)</el-checkbox>
          <el-checkbox v-model="options.numbers">数字 (0-9)</el-checkbox>
          <el-checkbox v-model="options.symbols">特殊符号</el-checkbox>
        </div>

        <div class="flex items-center gap-4">
          <span>密码强度:</span>
          <el-tag :type="strength.color as any">{{ strength.level }}</el-tag>
        </div>

        <div class="flex gap-2">
          <el-button type="primary" @click="generate">生成密码</el-button>
          <el-button @click="copyAll">复制全部</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <template #header>生成结果</template>
      <div class="space-y-2">
        <div
          v-for="(pwd, index) in passwords"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded group"
        >
          <code class="font-mono text-sm break-all">{{ pwd }}</code>
          <el-button
            size="small"
            class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
            @click="copy(pwd)"
          >
            复制
          </el-button>
        </div>
      </div>
      <el-empty v-if="!passwords.length" description="点击生成密码" />
    </el-card>
  </div>
</template>
