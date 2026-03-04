<script setup lang="ts">
import { ref, computed } from 'vue'

interface MimeEntry {
  mime: string
  extensions: string
  description: string
}

type Category = 'text' | 'image' | 'audio' | 'video' | 'application'

const activeTab = ref<Category>('text')
const searchQuery = ref('')

const data: Record<Category, MimeEntry[]> = {
  text: [
    { mime: 'text/plain', extensions: '.txt', description: '纯文本文件' },
    { mime: 'text/html', extensions: '.html, .htm', description: 'HTML 超文本标记语言' },
    { mime: 'text/css', extensions: '.css', description: '层叠样式表' },
    { mime: 'text/javascript', extensions: '.js, .mjs', description: 'JavaScript 脚本' },
    { mime: 'text/xml', extensions: '.xml', description: 'XML 可扩展标记语言' },
    { mime: 'text/csv', extensions: '.csv', description: '逗号分隔值文件' },
    { mime: 'text/markdown', extensions: '.md, .markdown', description: 'Markdown 文档' },
    { mime: 'text/calendar', extensions: '.ics', description: 'iCalendar 日历格式' },
    { mime: 'text/tab-separated-values', extensions: '.tsv', description: '制表符分隔值文件' },
    { mime: 'text/yaml', extensions: '.yaml, .yml', description: 'YAML 数据序列化格式' },
  ],
  image: [
    { mime: 'image/png', extensions: '.png', description: '可移植网络图形' },
    { mime: 'image/jpeg', extensions: '.jpg, .jpeg', description: 'JPEG 图像' },
    { mime: 'image/gif', extensions: '.gif', description: 'GIF 动态图像' },
    { mime: 'image/webp', extensions: '.webp', description: 'WebP 现代图像格式' },
    { mime: 'image/svg+xml', extensions: '.svg', description: '可缩放矢量图形' },
    { mime: 'image/bmp', extensions: '.bmp', description: 'Windows 位图图像' },
    { mime: 'image/x-icon', extensions: '.ico', description: '图标文件' },
    { mime: 'image/tiff', extensions: '.tif, .tiff', description: 'TIFF 图像格式' },
    { mime: 'image/avif', extensions: '.avif', description: 'AVIF 高效图像格式' },
    { mime: 'image/heic', extensions: '.heic', description: 'HEIC 高效图像容器' },
  ],
  audio: [
    { mime: 'audio/mpeg', extensions: '.mp3', description: 'MP3 音频' },
    { mime: 'audio/wav', extensions: '.wav', description: 'WAV 波形音频' },
    { mime: 'audio/ogg', extensions: '.ogg, .oga', description: 'OGG 音频格式' },
    { mime: 'audio/aac', extensions: '.aac', description: 'AAC 高级音频编码' },
    { mime: 'audio/flac', extensions: '.flac', description: 'FLAC 无损音频' },
    { mime: 'audio/webm', extensions: '.weba', description: 'WebM 音频' },
    { mime: 'audio/x-m4a', extensions: '.m4a', description: 'M4A 苹果音频格式' },
    { mime: 'audio/midi', extensions: '.mid, .midi', description: 'MIDI 乐器数字接口' },
    { mime: 'audio/opus', extensions: '.opus', description: 'Opus 音频编解码器' },
  ],
  video: [
    { mime: 'video/mp4', extensions: '.mp4', description: 'MP4 视频格式' },
    { mime: 'video/webm', extensions: '.webm', description: 'WebM 视频格式' },
    { mime: 'video/ogg', extensions: '.ogv', description: 'OGG 视频格式' },
    { mime: 'video/avi', extensions: '.avi', description: 'AVI 音视频交错格式' },
    { mime: 'video/quicktime', extensions: '.mov', description: 'QuickTime 视频格式' },
    { mime: 'video/x-matroska', extensions: '.mkv', description: 'Matroska 视频容器' },
    { mime: 'video/x-flv', extensions: '.flv', description: 'Flash 视频格式' },
    { mime: 'video/3gpp', extensions: '.3gp', description: '3GP 移动视频格式' },
    { mime: 'video/mpeg', extensions: '.mpeg, .mpg', description: 'MPEG 视频格式' },
  ],
  application: [
    { mime: 'application/json', extensions: '.json', description: 'JSON 数据格式' },
    { mime: 'application/xml', extensions: '.xml', description: 'XML 数据格式' },
    { mime: 'application/pdf', extensions: '.pdf', description: 'PDF 便携式文档格式' },
    { mime: 'application/zip', extensions: '.zip', description: 'ZIP 压缩文件' },
    { mime: 'application/gzip', extensions: '.gz', description: 'Gzip 压缩文件' },
    { mime: 'application/octet-stream', extensions: '.bin', description: '任意二进制数据' },
    { mime: 'application/javascript', extensions: '.js', description: 'JavaScript 脚本（旧标准）' },
    { mime: 'application/x-www-form-urlencoded', extensions: '—', description: 'HTML 表单提交格式' },
    { mime: 'application/wasm', extensions: '.wasm', description: 'WebAssembly 二进制格式' },
    { mime: 'application/x-tar', extensions: '.tar', description: 'TAR 归档文件' },
    { mime: 'application/x-7z-compressed', extensions: '.7z', description: '7-Zip 压缩文件' },
    { mime: 'application/vnd.ms-excel', extensions: '.xls', description: 'Microsoft Excel 电子表格（旧）' },
    { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extensions: '.xlsx', description: 'Microsoft Excel 电子表格' },
    { mime: 'application/vnd.ms-powerpoint', extensions: '.ppt', description: 'Microsoft PowerPoint（旧）' },
    { mime: 'application/msword', extensions: '.doc', description: 'Microsoft Word 文档（旧）' },
    { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extensions: '.docx', description: 'Microsoft Word 文档' },
  ],
}

const tabs: { key: Category; label: string }[] = [
  { key: 'text', label: 'Text 文本' },
  { key: 'image', label: 'Image 图像' },
  { key: 'audio', label: 'Audio 音频' },
  { key: 'video', label: 'Video 视频' },
  { key: 'application', label: 'Application 应用' },
]

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const source = searchQuery.value.trim()
    ? Object.values(data).flat()
    : data[activeTab.value]

  if (!q) return source

  return source.filter(
    (row) =>
      row.mime.toLowerCase().includes(q) ||
      row.extensions.toLowerCase().includes(q) ||
      row.description.toLowerCase().includes(q),
  )
})

const isSearching = computed(() => searchQuery.value.trim().length > 0)
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">MIME 类型速查</h1>
      <p class="text-gray-500 dark:text-gray-400">常见 MIME 类型、文件扩展名及说明</p>
    </div>

    <el-card class="mb-6">
      <el-input
        v-model="searchQuery"
        placeholder="搜索 MIME 类型、扩展名或描述..."
        clearable
        prefix-icon="Search"
      />
    </el-card>

    <el-card>
      <el-tabs v-if="!isSearching" v-model="activeTab">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.key"
          :label="tab.label"
          :name="tab.key"
        />
      </el-tabs>

      <div v-if="isSearching" class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        在全部分类中搜索，共找到 {{ filteredRows.length }} 条结果
      </div>

      <el-table :data="filteredRows" stripe class="w-full">
        <el-table-column label="MIME 类型" min-width="280">
          <template #default="{ row }">
            <span class="font-mono text-sm text-blue-600 dark:text-blue-400">{{ row.mime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="常见扩展名" width="180">
          <template #default="{ row }">
            <span class="font-mono text-sm text-gray-600 dark:text-gray-300">{{ row.extensions }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" min-width="220" />
      </el-table>

      <div v-if="filteredRows.length === 0" class="text-center text-gray-400 py-12">
        未找到匹配的 MIME 类型
      </div>
    </el-card>
  </div>
</template>
