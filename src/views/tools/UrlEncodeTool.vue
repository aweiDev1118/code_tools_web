<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const input = ref('')
const output = ref('')
const mode = ref<'encode' | 'decode'>('encode')
const encodeType = ref<'component' | 'uri'>('component')

const encode = () => {
  if (!input.value) return
  try {
    output.value = encodeType.value === 'component'
      ? encodeURIComponent(input.value)
      : encodeURI(input.value)
    ElMessage.success(t('tool.url-encode.encodeSuccess'))
  } catch {
    ElMessage.error(t('tool.url-encode.encodeFail'))
  }
}

const decode = () => {
  if (!input.value) return
  try {
    output.value = encodeType.value === 'component'
      ? decodeURIComponent(input.value)
      : decodeURI(input.value)
    ElMessage.success(t('tool.url-encode.decodeSuccess'))
  } catch {
    ElMessage.error(t('tool.url-encode.decodeFail'))
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
  input.value = 'https://example.com/search?q=你好世界&page=1'
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.url-encode.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.url-encode.subtitle') }}</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-radio-group v-model="mode">
        <el-radio-button value="encode">{{ t('common.encode') }}</el-radio-button>
        <el-radio-button value="decode">{{ t('common.decode') }}</el-radio-button>
      </el-radio-group>
      <el-select v-model="encodeType" style="width: 180px">
        <el-option value="component" label="encodeURIComponent" />
        <el-option value="uri" label="encodeURI" />
      </el-select>
      <el-button type="primary" @click="convert">
        {{ mode === 'encode' ? t('common.encode') : t('common.decode') }}
      </el-button>
      <el-button @click="swap">
        <el-icon><Switch /></el-icon>
        {{ t('tool.url-encode.swap') }}
      </el-button>
      <el-button @click="copy">{{ t('tool.url-encode.copyResult') }}</el-button>
      <el-button @click="clear">{{ t('common.clear') }}</el-button>
      <el-button @click="loadSample" text>{{ t('tool.url-encode.sample') }}</el-button>
    </div>

    <el-alert class="mb-4" type="info" :closable="false">
      <strong>encodeURIComponent:</strong> {{ t('tool.url-encode.componentHint') }}<br>
      <strong>encodeURI:</strong> {{ t('tool.url-encode.uriHint') }}
    </el-alert>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>{{ t('common.input') }}</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="12"
          :placeholder="t('tool.url-encode.inputPlaceholder')"
        />
      </el-card>

      <el-card>
        <template #header>{{ t('common.output') }}</template>
        <el-input
          v-model="output"
          type="textarea"
          :rows="12"
          readonly
          :placeholder="t('tool.url-encode.resultPlaceholder')"
        />
      </el-card>
    </div>
  </div>
</template>
