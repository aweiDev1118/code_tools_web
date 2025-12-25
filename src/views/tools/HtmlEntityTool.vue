<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

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
  ElMessage.success('编码成功')
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
  ElMessage.success('解码成功')
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">HTML 实体转换</h1>
      <p class="text-gray-500">HTML 实体编码与解码</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-radio-group v-model="mode">
        <el-radio-button value="encode">编码</el-radio-button>
        <el-radio-button value="decode">解码</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="convert">转换</el-button>
      <el-button @click="swap">
        <el-icon><Switch /></el-icon>
        交换
      </el-button>
      <el-button @click="copy">复制结果</el-button>
      <el-button @click="clear">清空</el-button>
      <el-button @click="loadSample" text>示例</el-button>
    </div>

    <el-alert class="mb-4" type="info" :closable="false">
      <div class="text-sm">
        常用实体:
        <code class="mx-1">&amp;lt;</code> = &lt;
        <code class="mx-1">&amp;gt;</code> = &gt;
        <code class="mx-1">&amp;amp;</code> = &amp;
        <code class="mx-1">&amp;quot;</code> = "
        <code class="mx-1">&amp;nbsp;</code> = 空格
      </div>
    </el-alert>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>输入</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="12"
          :placeholder="mode === 'encode' ? '请输入要编码的 HTML...' : '请输入要解码的实体...'"
          class="font-mono"
        />
      </el-card>

      <el-card>
        <template #header>输出</template>
        <el-input
          v-model="output"
          type="textarea"
          :rows="12"
          readonly
          placeholder="转换结果..."
          class="font-mono"
        />
      </el-card>
    </div>
  </div>
</template>
