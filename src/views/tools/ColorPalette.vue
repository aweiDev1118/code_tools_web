<template>
  <div class="max-w-5xl mx-auto">
    <el-card class="mb-6">
      <template #header>
        <span class="font-semibold text-base">颜色调色板生成器</span>
      </template>

      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">选择颜色：</span>
          <el-color-picker v-model="hexColor" @change="onColorPickerChange" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">HEX：</span>
          <el-input
            v-model="hexInput"
            placeholder="#000000"
            style="width: 120px"
            @change="onHexInputChange"
          />
        </div>
        <div
          class="w-10 h-10 rounded-lg border border-gray-200"
          :style="{ backgroundColor: hexColor }"
        />
      </div>
    </el-card>

    <!-- 单色渐变 -->
    <el-card class="mb-4">
      <template #header>
        <span class="font-semibold">单色渐变（10 个色阶）</span>
      </template>
      <div class="flex flex-wrap gap-3">
        <color-swatch
          v-for="color in monochromaticShades"
          :key="color.hex"
          :color="color"
          @copy="handleCopy"
        />
      </div>
    </el-card>

    <!-- 互补色 -->
    <el-card class="mb-4">
      <template #header>
        <span class="font-semibold">互补色（色相 +180°）</span>
      </template>
      <div class="flex flex-wrap gap-3">
        <color-swatch
          v-for="color in complementaryColors"
          :key="color.hex"
          :color="color"
          @copy="handleCopy"
        />
      </div>
    </el-card>

    <!-- 类似色 -->
    <el-card class="mb-4">
      <template #header>
        <span class="font-semibold">类似色（色相 ±30°）</span>
      </template>
      <div class="flex flex-wrap gap-3">
        <color-swatch
          v-for="color in analogousColors"
          :key="color.hex"
          :color="color"
          @copy="handleCopy"
        />
      </div>
    </el-card>

    <!-- 三色组 -->
    <el-card class="mb-4">
      <template #header>
        <span class="font-semibold">三色组（色相 +120°, +240°）</span>
      </template>
      <div class="flex flex-wrap gap-3">
        <color-swatch
          v-for="color in triadicColors"
          :key="color.hex"
          :color="color"
          @copy="handleCopy"
        />
      </div>
    </el-card>

    <!-- 分裂互补色 -->
    <el-card class="mb-4">
      <template #header>
        <span class="font-semibold">分裂互补色（色相 +150°, +210°）</span>
      </template>
      <div class="flex flex-wrap gap-3">
        <color-swatch
          v-for="color in splitComplementaryColors"
          :key="color.hex"
          :color="color"
          @copy="handleCopy"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

interface ColorInfo {
  hex: string
  rgb: string
  label?: string
}

// ---- Color math ----

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / delta + 2) / 6
    else h = ((r - g) / delta + 4) / 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = ((h % 360) + 360) % 360
  const sNorm = s / 100
  const lNorm = l / 100

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0, g = 0, b = 0
  if (hNorm < 60) { r = c; g = x }
  else if (hNorm < 120) { r = x; g = c }
  else if (hNorm < 180) { g = c; b = x }
  else if (hNorm < 240) { g = x; b = c }
  else if (hNorm < 300) { r = x; b = c }
  else { r = c; b = x }

  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
}

function makeColor(hex: string, label?: string): ColorInfo {
  return { hex: hex.toUpperCase(), rgb: hexToRgb(hex), label }
}

function generateShades(h: number, s: number): string[] {
  return Array.from({ length: 10 }, (_, i) => hslToHex(h, s, 95 - i * 9))
}

// ---- State ----

const hexColor = ref('#3B82F6')
const hexInput = ref('#3B82F6')

function isValidHex(val: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(val)
}

function onColorPickerChange(val: string | null) {
  if (val && isValidHex(val)) {
    hexColor.value = val
    hexInput.value = val.toUpperCase()
  }
}

function onHexInputChange(val: string) {
  const normalized = val.startsWith('#') ? val : `#${val}`
  if (isValidHex(normalized)) {
    hexColor.value = normalized
    hexInput.value = normalized.toUpperCase()
  }
}

// ---- Computed palettes ----

const monochromaticShades = computed<ColorInfo[]>(() => {
  if (!isValidHex(hexColor.value)) return []
  const [h, s] = hexToHsl(hexColor.value)
  return generateShades(h, s).map((hex, i) => makeColor(hex, `${(i + 1) * 100}`))
})

const complementaryColors = computed<ColorInfo[]>(() => {
  if (!isValidHex(hexColor.value)) return []
  const [h, s, l] = hexToHsl(hexColor.value)
  const base = makeColor(hexColor.value, '基础色')
  const comp = makeColor(hslToHex(h + 180, s, l), '互补色')
  const baseShades = generateShades(h, s).map((hex, i) => makeColor(hex, `基础 ${(i + 1) * 100}`))
  const compShades = generateShades(h + 180, s).map((hex, i) => makeColor(hex, `互补 ${(i + 1) * 100}`))
  return [base, comp, ...baseShades.slice(3, 7), ...compShades.slice(3, 7)]
})

const analogousColors = computed<ColorInfo[]>(() => {
  if (!isValidHex(hexColor.value)) return []
  const [h, s, l] = hexToHsl(hexColor.value)
  return [
    makeColor(hslToHex(h - 30, s, l), '-30°'),
    makeColor(hslToHex(h - 15, s, l), '-15°'),
    makeColor(hexColor.value, '基础色'),
    makeColor(hslToHex(h + 15, s, l), '+15°'),
    makeColor(hslToHex(h + 30, s, l), '+30°'),
  ]
})

const triadicColors = computed<ColorInfo[]>(() => {
  if (!isValidHex(hexColor.value)) return []
  const [h, s, l] = hexToHsl(hexColor.value)
  return [
    makeColor(hexColor.value, '基础色'),
    makeColor(hslToHex(h + 120, s, l), '+120°'),
    makeColor(hslToHex(h + 240, s, l), '+240°'),
  ]
})

const splitComplementaryColors = computed<ColorInfo[]>(() => {
  if (!isValidHex(hexColor.value)) return []
  const [h, s, l] = hexToHsl(hexColor.value)
  return [
    makeColor(hexColor.value, '基础色'),
    makeColor(hslToHex(h + 150, s, l), '+150°'),
    makeColor(hslToHex(h + 210, s, l), '+210°'),
  ]
})

// ---- Copy handler ----

async function handleCopy(value: string) {
  try {
    await copyToClipboard(value)
    ElMessage.success(`已复制 ${value}`)
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

// ---- ColorSwatch inline component ----

const ColorSwatch = defineComponent({
  name: 'ColorSwatch',
  props: {
    color: {
      type: Object as () => ColorInfo,
      required: true,
    },
  },
  emits: ['copy'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'flex flex-col items-center gap-1 cursor-pointer group' }, [
        h('div', {
          class:
            'w-10 h-10 rounded-lg border border-gray-200 shadow-sm transition-transform group-hover:scale-110',
          style: { backgroundColor: props.color.hex },
          title: `点击复制 ${props.color.hex}`,
          onClick: () => emit('copy', props.color.hex),
        }),
        h(
          'span',
          {
            class:
              'text-xs text-gray-700 dark:text-gray-300 font-mono hover:text-blue-500 cursor-pointer select-all',
            title: '点击复制 HEX',
            onClick: () => emit('copy', props.color.hex),
          },
          props.color.hex,
        ),
        h(
          'span',
          {
            class: 'text-xs text-gray-400 dark:text-gray-500 cursor-pointer hover:text-blue-400',
            title: '点击复制 RGB',
            onClick: () => emit('copy', props.color.rgb),
          },
          props.color.rgb,
        ),
        props.color.label
          ? h('span', { class: 'text-xs text-gray-400 dark:text-gray-500' }, props.color.label)
          : null,
      ])
  },
})
</script>
