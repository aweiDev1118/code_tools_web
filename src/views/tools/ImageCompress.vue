<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const originalImage = ref('')
const compressedImage = ref('')
const quality = ref(80)
const originalSize = ref(0)
const compressedSize = ref(0)
const originalDimensions = ref({ width: 0, height: 0 })
const compressedDimensions = ref({ width: 0, height: 0 })
const maxWidth = ref(1920)
const maxHeight = ref(1080)
const maintainRatio = ref(true)

const handleFileChange = (file: File) => {
  if (!file) return

  originalSize.value = file.size

  const reader = new FileReader()
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string

    const img = new Image()
    img.onload = () => {
      originalDimensions.value = { width: img.width, height: img.height }
      compress()
    }
    img.src = originalImage.value
  }
  reader.readAsDataURL(file)

  return false
}

const compress = () => {
  if (!originalImage.value) return

  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    let { width, height } = img

    // 计算缩放后的尺寸
    if (width > maxWidth.value || height > maxHeight.value) {
      if (maintainRatio.value) {
        const ratio = Math.min(maxWidth.value / width, maxHeight.value / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      } else {
        width = Math.min(width, maxWidth.value)
        height = Math.min(height, maxHeight.value)
      }
    }

    canvas.width = width
    canvas.height = height
    compressedDimensions.value = { width, height }

    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, width, height)

    compressedImage.value = canvas.toDataURL('image/jpeg', quality.value / 100)

    // 计算压缩后大小
    const base64 = compressedImage.value.split(',')[1]
    compressedSize.value = Math.round(base64.length * 0.75)
  }
  img.src = originalImage.value
}

const download = () => {
  if (!compressedImage.value) return
  const link = document.createElement('a')
  link.download = 'compressed.jpg'
  link.href = compressedImage.value
  link.click()
  ElMessage.success('下载成功')
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const compressionRatio = () => {
  if (!originalSize.value || !compressedSize.value) return 0
  return Math.round((1 - compressedSize.value / originalSize.value) * 100)
}

const clear = () => {
  originalImage.value = ''
  compressedImage.value = ''
  originalSize.value = 0
  compressedSize.value = 0
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">图片压缩</h1>
      <p class="text-gray-500">在线压缩图片，减小文件体积</p>
    </div>

    <el-card class="mb-4">
      <div class="flex flex-wrap gap-6 items-center">
        <div class="flex items-center gap-2">
          <span class="text-sm">质量:</span>
          <el-slider v-model="quality" :min="10" :max="100" style="width: 150px" @change="compress" />
          <span class="text-sm w-10">{{ quality }}%</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm">最大宽度:</span>
          <el-input-number v-model="maxWidth" :min="100" :max="4096" size="small" @change="compress" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm">最大高度:</span>
          <el-input-number v-model="maxHeight" :min="100" :max="4096" size="small" @change="compress" />
        </div>
        <el-checkbox v-model="maintainRatio" @change="compress">保持比例</el-checkbox>
        <el-button @click="clear">清空</el-button>
      </div>
    </el-card>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>
          <div class="flex justify-between">
            <span>原图</span>
            <span v-if="originalSize" class="text-sm text-gray-500">
              {{ formatSize(originalSize) }} | {{ originalDimensions.width }} x {{ originalDimensions.height }}
            </span>
          </div>
        </template>
        <el-upload
          v-if="!originalImage"
          drag
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          :on-change="(file: any) => handleFileChange(file.raw)"
        >
          <el-icon size="48" class="text-gray-400"><Upload /></el-icon>
          <div class="text-gray-500 mt-2">拖拽图片或点击选择</div>
        </el-upload>
        <div v-else class="flex items-center justify-center min-h-[200px] bg-gray-50 dark:bg-gray-700 rounded">
          <img :src="originalImage" alt="Original" class="max-w-full max-h-[300px]" />
        </div>
      </el-card>

      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span>压缩后</span>
            <div v-if="compressedSize" class="flex items-center gap-2">
              <span class="text-sm text-gray-500">
                {{ formatSize(compressedSize) }} | {{ compressedDimensions.width }} x {{ compressedDimensions.height }}
              </span>
              <el-tag type="success" size="small">-{{ compressionRatio() }}%</el-tag>
            </div>
          </div>
        </template>
        <div class="flex items-center justify-center min-h-[200px] bg-gray-50 dark:bg-gray-700 rounded">
          <img v-if="compressedImage" :src="compressedImage" alt="Compressed" class="max-w-full max-h-[300px]" />
          <span v-else class="text-gray-400">压缩结果</span>
        </div>
        <el-button v-if="compressedImage" type="primary" class="w-full mt-4" @click="download">
          下载压缩图片
        </el-button>
      </el-card>
    </div>
  </div>
</template>
