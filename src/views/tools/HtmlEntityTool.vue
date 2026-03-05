<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const input = ref('')
const output = ref('')
const mode = ref<'encode' | 'decode'>('encode')

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  ' ': '&nbsp;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '°': '&deg;',
  '±': '&plusmn;',
  '×': '&times;',
  '÷': '&divide;',
}

const reverseEntities: Record<string, string> = Object.fromEntries(
  Object.entries(htmlEntities).map(([k, v]) => [v, k])
)

const encode = () => {
  if (!input.value) return
  let result = input.value
  for (const [char, entity] of Object.entries(htmlEntities)) {
    if (char !== ' ') { // 不自动转换空格
      result = result.split(char).join(entity)
    }
  }
  output.value = result
  ElMessage.success(t('tool.html-entity.encodeSuccess'))
}

const decode = () => {
  if (!input.value) return
  let result = input.value
  // 处理命名实体
  for (const [entity, char] of Object.entries(reverseEntities)) {
    result = result.split(entity).join(char)
  }
  // 处理数字实体
  result = result.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec)))
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  output.value = result
  ElMessage.success(t('tool.html-entity.decodeSuccess'))
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
    input.value = '<div class="test">Hello & World</div>'
  } else {
    input.value = '&lt;div class=&quot;test&quot;&gt;Hello &amp; World&lt;/div&gt;'
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.html-entity.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.html-entity.subtitle') }}</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-radio-group v-model="mode">
        <el-radio-button value="encode">{{ t('common.encode') }}</el-radio-button>
        <el-radio-button value="decode">{{ t('common.decode') }}</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="convert">{{ t('common.convert') }}</el-button>
      <el-button @click="swap">
        <el-icon><Switch /></el-icon>
        {{ t('tool.html-entity.swap') }}
      </el-button>
      <el-button @click="copy">{{ t('tool.html-entity.copyResult') }}</el-button>
      <el-button @click="clear">{{ t('common.clear') }}</el-button>
      <el-button @click="loadSample" text>{{ t('tool.html-entity.sample') }}</el-button>
    </div>

    <el-alert class="mb-4" type="info" :closable="false">
      <div class="text-sm">
        {{ t('tool.html-entity.commonEntities') }}:
        <code class="mx-1">&amp;lt;</code> = &lt;
        <code class="mx-1">&amp;gt;</code> = &gt;
        <code class="mx-1">&amp;amp;</code> = &amp;
        <code class="mx-1">&amp;quot;</code> = "
        <code class="mx-1">&amp;nbsp;</code> = {{ t('tool.html-entity.space') }}
      </div>
    </el-alert>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>{{ t('common.input') }}</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="12"
          :placeholder="mode === 'encode' ? t('tool.html-entity.encodePlaceholder') : t('tool.html-entity.decodePlaceholder')"
          class="font-mono"
        />
      </el-card>

      <el-card>
        <template #header>{{ t('common.output') }}</template>
        <el-input
          v-model="output"
          type="textarea"
          :rows="12"
          readonly
          :placeholder="t('tool.html-entity.resultPlaceholder')"
          class="font-mono"
        />
      </el-card>
    </div>
  </div>
</template>
