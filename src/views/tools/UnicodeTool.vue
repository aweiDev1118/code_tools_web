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
    output.value = input.value.split('').map(char => {
      const code = char.charCodeAt(0)
      if (code > 127) {
        return '\\u' + code.toString(16).padStart(4, '0')
      }
      return char
    }).join('')
    ElMessage.success(t('tool.unicode.encodeSuccess'))
  } catch {
    ElMessage.error(t('tool.unicode.encodeFail'))
  }
}

const decode = () => {
  if (!input.value) return
  try {
    output.value = input.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    ElMessage.success(t('tool.unicode.decodeSuccess'))
  } catch {
    ElMessage.error(t('tool.unicode.decodeFail'))
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

const loadSample = () => {
  if (mode.value === 'encode') {
    input.value = '你好世界 Hello'
  } else {
    input.value = '\\u4f60\\u597d\\u4e16\\u754c Hello'
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.unicode.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.unicode.subtitle') }}</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-radio-group v-model="mode">
        <el-radio-button value="encode">{{ t('tool.unicode.toUnicode') }}</el-radio-button>
        <el-radio-button value="decode">{{ t('tool.unicode.toText') }}</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="convert">{{ t('common.convert') }}</el-button>
      <el-button @click="swap">
        <el-icon><Switch /></el-icon>
        {{ t('tool.unicode.swap') }}
      </el-button>
      <el-button @click="copy">{{ t('tool.unicode.copyResult') }}</el-button>
      <el-button @click="clear">{{ t('common.clear') }}</el-button>
      <el-button @click="loadSample" text>{{ t('tool.unicode.sample') }}</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>
          {{ mode === 'encode' ? t('tool.unicode.chineseText') : t('tool.unicode.unicodeCode') }}
        </template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="12"
          :placeholder="mode === 'encode' ? t('tool.unicode.encodePlaceholder') : t('tool.unicode.decodePlaceholder')"
          class="font-mono"
        />
      </el-card>

      <el-card>
        <template #header>
          {{ mode === 'encode' ? t('tool.unicode.unicodeCode') : t('tool.unicode.chineseText') }}
        </template>
        <el-input
          v-model="output"
          type="textarea"
          :rows="12"
          readonly
          :placeholder="t('tool.unicode.resultPlaceholder')"
          class="font-mono"
        />
      </el-card>
    </div>
  </div>
</template>
