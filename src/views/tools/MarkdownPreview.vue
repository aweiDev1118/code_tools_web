<script setup lang="ts">
import { ref, computed } from 'vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js/lib/core'
// 按需引入常用语言
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import sql from 'highlight.js/lib/languages/sql'
import 'highlight.js/styles/github.css'

// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
import { copyToClipboard } from '@/utils/clipboard'

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    }
  })
)

const input = ref(`# Markdown 预览工具

这是一个 **Markdown** 实时预览工具。

## 功能特性

- 实时预览
- 代码高亮
- 支持表格

## 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!')
}
\`\`\`

## 表格示例

| 名称 | 描述 |
|------|------|
| Vue  | 渐进式框架 |
| React | UI 库 |

> 引用文字

[链接示例](https://example.com)
`)

const output = computed(() => {
  try {
    return marked.parse(input.value, { async: false }) as string
  } catch {
    return ''
  }
})

const copy = () => {
  copyToClipboard(input.value, '已复制 Markdown 源码')
}

const copyHtml = () => {
  copyToClipboard(output.value, '已复制 HTML')
}

const clear = () => {
  input.value = ''
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Markdown 预览</h1>
      <p class="text-gray-500">实时预览 Markdown 渲染效果</p>
    </div>

    <div class="mb-4 flex gap-2">
      <el-button @click="copy">复制 Markdown</el-button>
      <el-button @click="copyHtml">复制 HTML</el-button>
      <el-button @click="clear">清空</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card class="h-[600px]">
        <template #header>编辑</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="22"
          placeholder="输入 Markdown..."
          class="font-mono h-full"
        />
      </el-card>

      <el-card class="h-[600px] overflow-auto">
        <template #header>预览</template>
        <div
          class="prose prose-sm dark:prose-invert max-w-none"
          v-html="output"
        />
      </el-card>
    </div>
  </div>
</template>

<style>
.prose pre {
  @apply bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-auto;
}
.prose code {
  @apply bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm;
}
.prose pre code {
  @apply bg-transparent p-0;
}
.prose table {
  @apply w-full border-collapse;
}
.prose th,
.prose td {
  @apply border border-gray-300 dark:border-gray-600 px-3 py-2;
}
.prose th {
  @apply bg-gray-100 dark:bg-gray-700;
}
.prose blockquote {
  @apply border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400;
}
</style>
