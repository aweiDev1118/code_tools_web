<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const input = ref('')

const conversions = computed(() => [
  { id: 'upper', name: t('tool.case-converter.upper'), transform: (s: string) => s.toUpperCase() },
  { id: 'lower', name: t('tool.case-converter.lower'), transform: (s: string) => s.toLowerCase() },
  { id: 'capitalize', name: t('tool.case-converter.capitalize'), transform: (s: string) => s.replace(/\b\w/g, c => c.toUpperCase()) },
  { id: 'sentence', name: t('tool.case-converter.sentence'), transform: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()) },
  { id: 'camel', name: 'camelCase', transform: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { id: 'pascal', name: 'PascalCase', transform: (s: string) => s.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase()) },
  { id: 'snake', name: 'snake_case', transform: (s: string) => s.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase() },
  { id: 'kebab', name: 'kebab-case', transform: (s: string) => s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase() },
  { id: 'constant', name: 'CONSTANT_CASE', transform: (s: string) => s.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toUpperCase() },
  { id: 'toggle', name: t('tool.case-converter.toggle'), transform: (s: string) => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('') },
])

const copy = (text: string) => {
  copyToClipboard(text)
}

const applyConversion = (transform: (s: string) => string) => {
  if (input.value) {
    input.value = transform(input.value)
    ElMessage.success(t('tool.case-converter.convertSuccess'))
  }
}

const clear = () => {
  input.value = ''
}

const loadSample = () => {
  input.value = 'hello world example text'
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.case-converter.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.case-converter.subtitle') }}</p>
    </div>

    <div class="mb-4 flex gap-2">
      <el-button @click="clear">{{ t('common.clear') }}</el-button>
      <el-button @click="loadSample" text>{{ t('common.loadSample') }}</el-button>
    </div>

    <el-card class="mb-4">
      <template #header>{{ t('tool.case-converter.inputText') }}</template>
      <el-input
        v-model="input"
        type="textarea"
        :rows="4"
        :placeholder="t('tool.case-converter.inputPlaceholder')"
      />
    </el-card>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <el-card v-for="conv in conversions" :key="conv.id">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium">{{ conv.name }}</span>
          <div class="flex gap-2">
            <el-button size="small" @click="applyConversion(conv.transform)">{{ t('tool.case-converter.apply') }}</el-button>
            <el-button size="small" @click="copy(conv.transform(input))">{{ t('common.copy') }}</el-button>
          </div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm min-h-[48px] break-all">
          {{ input ? conv.transform(input) : t('common.result') }}
        </div>
      </el-card>
    </div>
  </div>
</template>
