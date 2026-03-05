<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const fgColor = ref('#000000')
const bgColor = ref('#ffffff')

function linearize(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1)
  const l2 = luminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const isValidHex = (hex: string) => /^#[0-9a-fA-F]{6}$/.test(hex)

const ratio = computed(() => {
  if (!isValidHex(fgColor.value) || !isValidHex(bgColor.value)) return 1
  return contrastRatio(fgColor.value, bgColor.value)
})

const ratioDisplay = computed(() => `${ratio.value.toFixed(2)}:1`)

interface CheckResult {
  label: string
  threshold: number
  pass: boolean
}

const checks = computed<CheckResult[]>(() => [
  { label: t('tool.contrast-checker.aaNormal'), threshold: 4.5, pass: ratio.value >= 4.5 },
  { label: t('tool.contrast-checker.aaLarge'), threshold: 3, pass: ratio.value >= 3 },
  { label: t('tool.contrast-checker.aaaNormal'), threshold: 7, pass: ratio.value >= 7 },
  { label: t('tool.contrast-checker.aaaLarge'), threshold: 4.5, pass: ratio.value >= 4.5 },
])

function swapColors() {
  const tmp = fgColor.value
  fgColor.value = bgColor.value
  bgColor.value = tmp
}

function syncFgInput(val: string) {
  if (isValidHex(val)) fgColor.value = val
}

function syncBgInput(val: string) {
  if (isValidHex(val)) bgColor.value = val
}

const ratioLevel = computed(() => {
  const r = ratio.value
  if (r >= 7) return 'success'
  if (r >= 4.5) return 'primary'
  if (r >= 3) return 'warning'
  return 'danger'
})
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.contrast-checker.name') }}</h1>
      <p class="text-gray-500 dark:text-gray-400">{{ t('tool.contrast-checker.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 前景色 -->
      <el-card>
        <template #header>
          <span class="font-semibold">{{ t('tool.contrast-checker.fgColor') }}</span>
        </template>
        <div class="flex flex-col items-center gap-4">
          <el-color-picker v-model="fgColor" size="large" color-format="hex" />
          <el-input
            :model-value="fgColor"
            placeholder="#000000"
            @update:model-value="syncFgInput"
          >
            <template #prepend>HEX</template>
          </el-input>
          <div class="w-full h-16 rounded-lg border border-gray-200 dark:border-gray-600" :style="{ backgroundColor: fgColor }" />
        </div>
      </el-card>

      <!-- 背景色 -->
      <el-card>
        <template #header>
          <span class="font-semibold">{{ t('tool.contrast-checker.bgColor') }}</span>
        </template>
        <div class="flex flex-col items-center gap-4">
          <el-color-picker v-model="bgColor" size="large" color-format="hex" />
          <el-input
            :model-value="bgColor"
            placeholder="#ffffff"
            @update:model-value="syncBgInput"
          >
            <template #prepend>HEX</template>
          </el-input>
          <div class="w-full h-16 rounded-lg border border-gray-200 dark:border-gray-600" :style="{ backgroundColor: bgColor }" />
        </div>
      </el-card>
    </div>

    <!-- 互换按钮 -->
    <div class="flex justify-center mb-6">
      <el-button type="primary" plain @click="swapColors">
        ⇄ {{ t('tool.contrast-checker.swapColors') }}
      </el-button>
    </div>

    <!-- 对比度结果 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 比值 + WCAG 结果 -->
      <el-card>
        <template #header>
          <span class="font-semibold">{{ t('tool.contrast-checker.checkResult') }}</span>
        </template>
        <div class="text-center mb-6">
          <div class="text-5xl font-bold mb-2" :class="{
            'text-green-500': ratioLevel === 'success',
            'text-blue-500': ratioLevel === 'primary',
            'text-yellow-500': ratioLevel === 'warning',
            'text-red-500': ratioLevel === 'danger',
          }">
            {{ ratioDisplay }}
          </div>
          <div class="text-gray-500 dark:text-gray-400 text-sm">{{ t('tool.contrast-checker.contrastRatio') }}</div>
        </div>
        <div class="space-y-3">
          <div
            v-for="check in checks"
            :key="check.label"
            class="flex items-center justify-between p-3 rounded-lg"
            :class="check.pass
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-red-50 dark:bg-red-900/20'"
          >
            <div>
              <span class="font-medium text-gray-800 dark:text-gray-200">WCAG {{ check.label }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">(≥{{ check.threshold }}:1)</span>
            </div>
            <span class="text-xl font-bold" :class="check.pass ? 'text-green-500' : 'text-red-500'">
              {{ check.pass ? '✓' : '✗' }}
            </span>
          </div>
        </div>
      </el-card>

      <!-- 预览区域 -->
      <el-card>
        <template #header>
          <span class="font-semibold">{{ t('tool.contrast-checker.livePreview') }}</span>
        </template>
        <div
          class="rounded-lg p-6 space-y-4"
          :style="{ backgroundColor: bgColor, color: fgColor }"
        >
          <div>
            <div class="text-xs mb-1 opacity-60" :style="{ color: fgColor }">{{ t('tool.contrast-checker.normalText') }} (16px)</div>
            <p class="text-base leading-relaxed">
              {{ t('tool.contrast-checker.sampleNormalText') }}
            </p>
          </div>
          <div>
            <div class="text-xs mb-1 opacity-60" :style="{ color: fgColor }">{{ t('tool.contrast-checker.largeText') }} (24px / {{ t('tool.contrast-checker.bold') }})</div>
            <p class="text-2xl font-bold">
              {{ t('tool.contrast-checker.sampleLargeText') }}
            </p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
