<script setup lang="ts">
import { ref, computed } from 'vue'

const input = ref('')

const stats = computed(() => {
  const text = input.value

  // 总字符数
  const totalChars = text.length

  // 不含空格字符数
  const charsNoSpace = text.replace(/\s/g, '').length

  // 中文字符数
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length

  // 英文字母数
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length

  // 数字数
  const numbers = (text.match(/\d/g) || []).length

  // 标点符号数
  const punctuation = (text.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~，。！？；：""''【】、]/g) || []).length

  // 空格数
  const spaces = (text.match(/ /g) || []).length

  // 行数
  const lines = text ? text.split('\n').length : 0

  // 段落数（以空行分隔）
  const paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0

  // 英文单词数
  const words = (text.match(/\b[a-zA-Z]+\b/g) || []).length

  // 中文词数（简单估算：中文字符数）
  const chineseWords = chineseChars

  return {
    totalChars,
    charsNoSpace,
    chineseChars,
    englishChars,
    numbers,
    punctuation,
    spaces,
    lines,
    paragraphs,
    words,
    chineseWords
  }
})

const clear = () => {
  input.value = ''
}

const loadSample = () => {
  input.value = `这是一段示例文本，包含中文和English，还有数字123。

这是第二段。用于测试段落统计功能。

Hello World! 这是第三段，混合了中英文内容。`
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">字数统计</h1>
      <p class="text-gray-500">统计文本的字符、单词、行数等信息</p>
    </div>

    <div class="mb-4 flex gap-2">
      <el-button @click="clear">清空</el-button>
      <el-button @click="loadSample" text>加载示例</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <el-card class="h-full">
          <template #header>输入文本</template>
          <el-input
            v-model="input"
            type="textarea"
            :rows="16"
            placeholder="请输入要统计的文本..."
          />
        </el-card>
      </div>

      <div class="space-y-4">
        <el-card>
          <template #header>基本统计</template>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span>总字符数</span>
              <span class="text-xl font-bold text-primary-600">{{ stats.totalChars }}</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span>不含空格</span>
              <span class="text-xl font-bold">{{ stats.charsNoSpace }}</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span>行数</span>
              <span class="text-xl font-bold">{{ stats.lines }}</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span>段落数</span>
              <span class="text-xl font-bold">{{ stats.paragraphs }}</span>
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>详细统计</template>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">中文字符</span>
              <span class="font-medium">{{ stats.chineseChars }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">英文字母</span>
              <span class="font-medium">{{ stats.englishChars }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">英文单词</span>
              <span class="font-medium">{{ stats.words }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">数字</span>
              <span class="font-medium">{{ stats.numbers }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">标点符号</span>
              <span class="font-medium">{{ stats.punctuation }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">空格</span>
              <span class="font-medium">{{ stats.spaces }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
