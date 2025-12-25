<script setup lang="ts">
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import { ElMessage } from 'element-plus'

const input = ref('https://example.com')
const qrcodeUrl = ref('')
const size = ref(200)
const errorLevel = ref<'L' | 'M' | 'Q' | 'H'>('M')
const darkColor = ref('#000000')
const lightColor = ref('#ffffff')

const generateQRCode = async () => {
  if (!input.value.trim()) {
    qrcodeUrl.value = ''
    return
  }
  try {
    qrcodeUrl.value = await QRCode.toDataURL(input.value, {
      width: size.value,
      margin: 2,
      errorCorrectionLevel: errorLevel.value,
      color: {
        dark: darkColor.value,
        light: lightColor.value
      }
    })
  } catch {
    ElMessage.error('生成失败')
  }
}

const download = () => {
  if (!qrcodeUrl.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrcodeUrl.value
  link.click()
}

const copyImage = async () => {
  if (!qrcodeUrl.value) return
  try {
    const response = await fetch(qrcodeUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    ElMessage.success('已复制图片')
  } catch {
    ElMessage.error('复制失败')
  }
}

watch([input, size, errorLevel, darkColor, lightColor], generateQRCode, { immediate: true })
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">二维码生成</h1>
      <p class="text-gray-500">将文本或链接转换为二维码图片</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <el-card>
        <template #header>输入内容</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="4"
          placeholder="请输入文本或网址..."
        />

        <el-divider />

        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-sm w-20">尺寸:</span>
            <el-slider v-model="size" :min="100" :max="500" :step="50" show-input />
          </div>

          <div class="flex items-center gap-4">
            <span class="text-sm w-20">容错级别:</span>
            <el-radio-group v-model="errorLevel">
              <el-radio-button value="L">L (7%)</el-radio-button>
              <el-radio-button value="M">M (15%)</el-radio-button>
              <el-radio-button value="Q">Q (25%)</el-radio-button>
              <el-radio-button value="H">H (30%)</el-radio-button>
            </el-radio-group>
          </div>

          <div class="flex items-center gap-4">
            <span class="text-sm w-20">前景色:</span>
            <el-color-picker v-model="darkColor" />
            <span class="text-sm w-20 ml-4">背景色:</span>
            <el-color-picker v-model="lightColor" />
          </div>
        </div>
      </el-card>

      <el-card>
        <template #header>
          <div class="flex justify-between items-center">
            <span>二维码</span>
            <div class="flex gap-2">
              <el-button size="small" @click="copyImage" :disabled="!qrcodeUrl">复制</el-button>
              <el-button size="small" type="primary" @click="download" :disabled="!qrcodeUrl">下载</el-button>
            </div>
          </div>
        </template>
        <div class="flex items-center justify-center min-h-[300px]">
          <img
            v-if="qrcodeUrl"
            :src="qrcodeUrl"
            alt="QR Code"
            class="max-w-full"
          />
          <el-empty v-else description="输入内容后生成二维码" />
        </div>
      </el-card>
    </div>
  </div>
</template>
