<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

const hexColor = ref('#3b82f6')

interface RGB {
  r: number
  g: number
  b: number
}

interface HSL {
  h: number
  s: number
  l: number
}

const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

const rgbToHsl = (r: number, g: number, b: number): HSL => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

const rgb = computed(() => hexToRgb(hexColor.value))
const hsl = computed(() => {
  if (!rgb.value) return null
  return rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b)
})

const rgbString = computed(() => {
  if (!rgb.value) return ''
  return `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`
})

const rgbaString = computed(() => {
  if (!rgb.value) return ''
  return `rgba(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}, 1)`
})

const hslString = computed(() => {
  if (!hsl.value) return ''
  return `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`
})

const copy = (text: string) => {
  copyToClipboard(text)
}

const colorFormats = computed(() => [
  { label: 'HEX', value: hexColor.value.toUpperCase() },
  { label: 'HEX (小写)', value: hexColor.value.toLowerCase() },
  { label: 'RGB', value: rgbString.value },
  { label: 'RGBA', value: rgbaString.value },
  { label: 'HSL', value: hslString.value },
])
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">颜色转换</h1>
      <p class="text-gray-500">HEX、RGB、HSL 颜色格式互转</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <el-card>
        <template #header>选择颜色</template>
        <div class="flex flex-col items-center gap-6">
          <el-color-picker
            v-model="hexColor"
            size="large"
            show-alpha
            :predefine="[
              '#ff4500',
              '#ff8c00',
              '#ffd700',
              '#90ee90',
              '#00ced1',
              '#3b82f6',
              '#8b5cf6',
              '#ff69b4',
            ]"
          />
          <div
            class="w-full h-32 rounded-lg shadow-inner"
            :style="{ backgroundColor: hexColor }"
          />
          <el-input v-model="hexColor" placeholder="#FFFFFF">
            <template #prepend>HEX</template>
          </el-input>
        </div>
      </el-card>

      <el-card>
        <template #header>颜色值</template>
        <div class="space-y-3">
          <div
            v-for="format in colorFormats"
            :key="format.label"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
          >
            <div>
              <div class="text-sm text-gray-500">{{ format.label }}</div>
              <div class="font-mono">{{ format.value }}</div>
            </div>
            <el-button size="small" @click="copy(format.value)">复制</el-button>
          </div>
        </div>

        <el-divider />

        <div v-if="rgb && hsl" class="grid grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-red-50 dark:bg-red-900/30 rounded">
            <div class="text-2xl font-bold text-red-600">{{ rgb.r }}</div>
            <div class="text-sm text-gray-500">R</div>
          </div>
          <div class="p-3 bg-green-50 dark:bg-green-900/30 rounded">
            <div class="text-2xl font-bold text-green-600">{{ rgb.g }}</div>
            <div class="text-sm text-gray-500">G</div>
          </div>
          <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
            <div class="text-2xl font-bold text-blue-600">{{ rgb.b }}</div>
            <div class="text-sm text-gray-500">B</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
