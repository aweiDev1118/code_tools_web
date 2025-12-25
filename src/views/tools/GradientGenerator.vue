<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

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

const presets = [
  { name: '紫蓝', colors: ['#667eea', '#764ba2'] },
  { name: '橙红', colors: ['#f093fb', '#f5576c'] },
  { name: '青绿', colors: ['#4facfe', '#00f2fe'] },
  { name: '日落', colors: ['#fa709a', '#fee140'] },
  { name: '森林', colors: ['#0ba360', '#3cba92'] },
  { name: '海洋', colors: ['#2193b0', '#6dd5ed'] },
  { name: '火焰', colors: ['#ff512f', '#f09819'] },
  { name: '极光', colors: ['#00c6ff', '#0072ff'] },
]

const applyPreset = (preset: { colors: string[] }) => {
  color1.value = preset.colors[0]
  color2.value = preset.colors[1]
  color3.value = preset.colors[2] || ''
}

const copy = () => {
  copyToClipboard(cssCode.value, 'CSS 已复制')
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">渐变生成器</h1>
      <p class="text-gray-500">生成 CSS 渐变背景</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <el-card>
          <template #header>渐变设置</template>

          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <span class="w-20">类型:</span>
              <el-radio-group v-model="gradientType">
                <el-radio-button value="linear">线性</el-radio-button>
                <el-radio-button value="radial">径向</el-radio-button>
              </el-radio-group>
            </div>

            <div v-if="gradientType === 'linear'" class="flex items-center gap-4">
              <span class="w-20">角度:</span>
              <el-slider v-model="angle" :min="0" :max="360" show-input class="flex-1" />
            </div>

            <div v-if="gradientType === 'radial'" class="flex items-center gap-4">
              <span class="w-20">形状:</span>
              <el-radio-group v-model="radialShape">
                <el-radio-button value="circle">圆形</el-radio-button>
                <el-radio-button value="ellipse">椭圆</el-radio-button>
              </el-radio-group>
            </div>

            <div class="flex items-center gap-4">
              <span class="w-20">颜色 1:</span>
              <el-color-picker v-model="color1" />
              <el-input v-model="color1" style="width: 100px" />
            </div>

            <div class="flex items-center gap-4">
              <span class="w-20">颜色 2:</span>
              <el-color-picker v-model="color2" />
              <el-input v-model="color2" style="width: 100px" />
            </div>

            <div class="flex items-center gap-4">
              <span class="w-20">颜色 3:</span>
              <el-color-picker v-model="color3" />
              <el-input v-model="color3" style="width: 100px" placeholder="可选" />
              <el-button v-if="color3" size="small" @click="color3 = ''">移除</el-button>
            </div>

            <div class="flex gap-2">
              <el-button type="primary" @click="copy">复制 CSS</el-button>
              <el-button @click="randomGradient">随机生成</el-button>
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>预设方案</template>
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
          <template #header>预览</template>
          <div
            class="h-64 rounded-lg"
            :style="{ background: gradientStyle }"
          />
        </el-card>

        <el-card>
          <template #header>CSS 代码</template>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm">
            {{ cssCode }}
          </div>
          <el-button class="w-full mt-4" @click="copy">复制 CSS</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>
