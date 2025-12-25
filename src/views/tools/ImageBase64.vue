<script setup lang="ts">
import { ref } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

const mode = ref<'toBase64' | 'toImage'>('toBase64')
const base64Output = ref('')
const base64Input = ref('')
const imagePreview = ref('')
const fileName = ref('')
const fileSize = ref(0)
const fileType = ref('')

const handleFileChange = (file: File) => {
  if (!file) return

  fileName.value = file.name
  fileSize.value = file.size
  fileType.value = file.type

  const reader = new FileReader()
  reader.onload = (e) => {
    base64Output.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  return false
}

const handleBase64Input = () => {
  if (!base64Input.value) {
    imagePreview.value = ''
    return
  }

  let base64 = base64Input.value.trim()
  // 如果没有 data: 前缀，尝试添加
  if (!base64.startsWith('data:')) {
    base64 = `data:image/png;base64,${base64}`
  }

  imagePreview.value = base64
}

const copy = () => {
  const text = mode.value === 'toBase64' ? base64Output.value : base64Input.value
  if (!text) return
  copyToClipboard(text)
}

const download = () => {
  if (!imagePreview.value) return
  const link = document.createElement('a')
  link.download = 'image.png'
  link.href = imagePreview.value
  link.click()
}

const clear = () => {
  base64Output.value = ''
  base64Input.value = ''
  imagePreview.value = ''
  fileName.value = ''
  fileSize.value = 0
  fileType.value = ''
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">图片 Base64 转换</h1>
      <p class="text-gray-500">图片与 Base64 编码互相转换</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-radio-group v-model="mode">
        <el-radio-button value="toBase64">图片 → Base64</el-radio-button>
        <el-radio-button value="toImage">Base64 → 图片</el-radio-button>
      </el-radio-group>
      <el-button @click="copy">复制</el-button>
      <el-button @click="clear">清空</el-button>
    </div>

    <!-- 图片转 Base64 -->
    <div v-if="mode === 'toBase64'" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>选择图片</template>
        <el-upload
          drag
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          :on-change="(file: any) => handleFileChange(file.raw)"
        >
          <el-icon size="48" class="text-gray-400"><Upload /></el-icon>
          <div class="text-gray-500 mt-2">拖拽图片到此处或点击选择</div>
        </el-upload>
        <div v-if="fileName" class="mt-4 text-sm text-gray-500">
          <p>文件名: {{ fileName }}</p>
          <p>大小: {{ formatSize(fileSize) }}</p>
          <p>类型: {{ fileType }}</p>
        </div>
      </el-card>

      <el-card>
        <template #header>Base64 编码</template>
        <el-input
          v-model="base64Output"
          type="textarea"
          :rows="12"
          readonly
          placeholder="Base64 编码将显示在这里..."
          class="font-mono text-xs"
        />
        <div v-if="base64Output" class="mt-2 text-sm text-gray-500">
          长度: {{ base64Output.length }} 字符
        </div>
      </el-card>
    </div>

    <!-- Base64 转图片 -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>Base64 编码</template>
        <el-input
          v-model="base64Input"
          type="textarea"
          :rows="12"
          placeholder="请输入 Base64 编码..."
          class="font-mono text-xs"
          @input="handleBase64Input"
        />
      </el-card>

      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span>图片预览</span>
            <el-button v-if="imagePreview" size="small" @click="download">下载</el-button>
          </div>
        </template>
        <div class="min-h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
          <img
            v-if="imagePreview"
            :src="imagePreview"
            alt="Preview"
            class="max-w-full max-h-[300px]"
          />
          <span v-else class="text-gray-400">图片预览</span>
        </div>
      </el-card>
    </div>
  </div>
</template>
