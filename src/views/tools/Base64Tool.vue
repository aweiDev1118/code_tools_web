<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const input = ref('')
const output = ref('')
const mode = ref<'encode' | 'decode'>('encode')

const encode = () => {
  if (!input.value) return
  try {
    output.value = btoa(unescape(encodeURIComponent(input.value)))
    ElMessage.success(t('tool.base64.encodeSuccess'))
  } catch {
    ElMessage.error(t('tool.base64.encodeFail'))
  }
}

const decode = () => {
  if (!input.value) return
  try {
    output.value = decodeURIComponent(escape(atob(input.value)))
    ElMessage.success(t('tool.base64.decodeSuccess'))
  } catch {
    ElMessage.error(t('tool.base64.decodeFail'))
  }
}

const convert = () => {
  if (mode.value === 'encode') {
    encode()
  } else {
    decode()
  }
}

const copy = () => {
  if (!output.value) return
  copyToClipboard(output.value)
}

const swap = () => {
  const temp = input.value
  input.value = output.value
  output.value = temp
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}

const clear = () => {
  input.value = ''
  output.value = ''
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.base64.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.base64.subtitle') }}</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-radio-group v-model="mode">
        <el-radio-button value="encode">{{ t('common.encode') }}</el-radio-button>
        <el-radio-button value="decode">{{ t('common.decode') }}</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="convert">
        {{ mode === 'encode' ? t('common.encode') : t('common.decode') }}
      </el-button>
      <el-button @click="swap">
        <el-icon><Switch /></el-icon>
        {{ t('tool.base64.swap') }}
      </el-button>
      <el-button @click="copy">{{ t('tool.base64.copyResult') }}</el-button>
      <el-button @click="clear">{{ t('common.clear') }}</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>
          {{ mode === 'encode' ? t('tool.base64.originalText') : 'Base64' }}
        </template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="15"
          :placeholder="mode === 'encode' ? t('tool.base64.encodePlaceholder') : t('tool.base64.decodePlaceholder')"
        />
      </el-card>

      <el-card>
        <template #header>
          {{ mode === 'encode' ? 'Base64' : t('tool.base64.originalText') }}
        </template>
        <el-input
          v-model="output"
          type="textarea"
          :rows="15"
          readonly
          :placeholder="t('tool.base64.resultPlaceholder')"
        />
      </el-card>
    </div>
  </div>
</template>
