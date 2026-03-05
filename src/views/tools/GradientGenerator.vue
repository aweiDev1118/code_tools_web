<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

const gradientType = ref<'linear' | 'radial'>('linear')
const angle = ref(90)
const color1 = ref('#667eea')
const color2 = ref('#764ba2')
const color3 = ref('')
const radialShape = ref<'circle' | 'ellipse'>('circle')

const gradientStyle = computed(() => {
  const colors = [color1.value, color2.value, color3.value].filter(Boolean).join(', ')

  if (gradientType.value === 'linear') {
    return `linear-gradient(${angle.value}deg, ${colors})`
  } else {
    return `radial-gradient(${radialShape.value}, ${colors})`
  }
})

const cssCode = computed(() => {
  return `background: ${gradientStyle.value};`
})

const presets = computed(() => [
  { name: t('tool.gradient-generator.presetPurpleBlue'), colors: ['#667eea', '#764ba2'] },
  { name: t('tool.gradient-generator.presetOrangeRed'), colors: ['#f093fb', '#f5576c'] },
  { name: t('tool.gradient-generator.presetCyanGreen'), colors: ['#4facfe', '#00f2fe'] },
  { name: t('tool.gradient-generator.presetSunset'), colors: ['#fa709a', '#fee140'] },
  { name: t('tool.gradient-generator.presetForest'), colors: ['#0ba360', '#3cba92'] },
  { name: t('tool.gradient-generator.presetOcean'), colors: ['#2193b0', '#6dd5ed'] },
  { name: t('tool.gradient-generator.presetFlame'), colors: ['#ff512f', '#f09819'] },
  { name: t('tool.gradient-generator.presetAurora'), colors: ['#00c6ff', '#0072ff'] },
])

const applyPreset = (preset: { colors: string[] }) => {
  color1.value = preset.colors[0]
  color2.value = preset.colors[1]
  color3.value = preset.colors[2] || ''
}

const copy = () => {
  copyToClipboard(cssCode.value, t('tool.gradient-generator.cssCopied'))
}

const randomGradient = () => {
  const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  color1.value = randomColor()
  color2.value = randomColor()
  color3.value = Math.random() > 0.5 ? randomColor() : ''
  angle.value = Math.floor(Math.random() * 360)
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.gradient-generator.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.gradient-generator.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <el-card>
          <template #header>{{ t('tool.gradient-generator.settings') }}</template>

          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <span class="w-20">{{ t('tool.gradient-generator.type') }}:</span>
              <el-radio-group v-model="gradientType">
                <el-radio-button value="linear">{{ t('tool.gradient-generator.linear') }}</el-radio-button>
                <el-radio-button value="radial">{{ t('tool.gradient-generator.radial') }}</el-radio-button>
              </el-radio-group>
            </div>

            <div v-if="gradientType === 'linear'" class="flex items-center gap-4">
              <span class="w-20">{{ t('tool.gradient-generator.angle') }}:</span>
              <el-slider v-model="angle" :min="0" :max="360" show-input class="flex-1" />
            </div>

            <div v-if="gradientType === 'radial'" class="flex items-center gap-4">
              <span class="w-20">{{ t('tool.gradient-generator.shape') }}:</span>
              <el-radio-group v-model="radialShape">
                <el-radio-button value="circle">{{ t('tool.gradient-generator.circle') }}</el-radio-button>
                <el-radio-button value="ellipse">{{ t('tool.gradient-generator.ellipse') }}</el-radio-button>
              </el-radio-group>
            </div>

            <div class="flex items-center gap-4">
              <span class="w-20">{{ t('tool.gradient-generator.color1') }}:</span>
              <el-color-picker v-model="color1" />
              <el-input v-model="color1" style="width: 100px" />
            </div>

            <div class="flex items-center gap-4">
              <span class="w-20">{{ t('tool.gradient-generator.color2') }}:</span>
              <el-color-picker v-model="color2" />
              <el-input v-model="color2" style="width: 100px" />
            </div>

            <div class="flex items-center gap-4">
              <span class="w-20">{{ t('tool.gradient-generator.color3') }}:</span>
              <el-color-picker v-model="color3" />
              <el-input v-model="color3" style="width: 100px" :placeholder="t('tool.gradient-generator.optional')" />
              <el-button v-if="color3" size="small" @click="color3 = ''">{{ t('tool.gradient-generator.remove') }}</el-button>
            </div>

            <div class="flex gap-2">
              <el-button type="primary" @click="copy">{{ t('tool.gradient-generator.copyCss') }}</el-button>
              <el-button @click="randomGradient">{{ t('tool.gradient-generator.random') }}</el-button>
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>{{ t('tool.gradient-generator.presets') }}</template>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="preset in presets"
              :key="preset.name"
              class="aspect-square rounded cursor-pointer hover:ring-2 ring-primary-500 transition-all"
              :style="{ background: `linear-gradient(135deg, ${preset.colors.join(', ')})` }"
              :title="preset.name"
              @click="applyPreset(preset)"
            />
          </div>
        </el-card>
      </div>

      <div class="space-y-4">
        <el-card>
          <template #header>{{ t('tool.gradient-generator.preview') }}</template>
          <div
            class="h-64 rounded-lg"
            :style="{ background: gradientStyle }"
          />
        </el-card>

        <el-card>
          <template #header>{{ t('tool.gradient-generator.cssCode') }}</template>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm">
            {{ cssCode }}
          </div>
          <el-button class="w-full mt-4" @click="copy">{{ t('tool.gradient-generator.copyCss') }}</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>
