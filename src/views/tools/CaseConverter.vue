<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

const input = ref('')

const conversions = [
  { id: 'upper', name: '大写', transform: (s: string) => s.toUpperCase() },
  { id: 'lower', name: '小写', transform: (s: string) => s.toLowerCase() },
  { id: 'capitalize', name: '首字母大写', transform: (s: string) => s.replace(/\b\w/g, c => c.toUpperCase()) },
  { id: 'sentence', name: '句首大写', transform: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()) },
  { id: 'camel', name: 'camelCase', transform: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { id: 'pascal', name: 'PascalCase', transform: (s: string) => s.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase()) },
  { id: 'snake', name: 'snake_case', transform: (s: string) => s.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase() },
  { id: 'kebab', name: 'kebab-case', transform: (s: string) => s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase() },
  { id: 'constant', name: 'CONSTANT_CASE', transform: (s: string) => s.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toUpperCase() },
  { id: 'toggle', name: '大小写反转', transform: (s: string) => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('') },
]

const copy = (text: string) => {
  copyToClipboard(text)
}

const applyConversion = (transform: (s: string) => string) => {
  if (input.value) {
    input.value = transform(input.value)
    ElMessage.success('已转换')
  }
}

const clear = () => {
  input.value = ''
}

const loadSample = () => {
  input.value = 'hello world example text'
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">大小写转换</h1>
      <p class="text-gray-500">各种大小写和命名格式转换</p>
    </div>

    <div class="mb-4 flex gap-2">
      <el-button @click="clear">清空</el-button>
      <el-button @click="loadSample" text>加载示例</el-button>
    </div>

    <el-card class="mb-4">
      <template #header>输入文本</template>
      <el-input
        v-model="input"
        type="textarea"
        :rows="4"
        placeholder="请输入要转换的文本..."
      />
    </el-card>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <el-card v-for="conv in conversions" :key="conv.id">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium">{{ conv.name }}</span>
          <div class="flex gap-2">
            <el-button size="small" @click="applyConversion(conv.transform)">应用</el-button>
            <el-button size="small" @click="copy(conv.transform(input))">复制</el-button>
          </div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm min-h-[48px] break-all">
          {{ input ? conv.transform(input) : '转换结果' }}
        </div>
      </el-card>
    </div>
  </div>
</template>
