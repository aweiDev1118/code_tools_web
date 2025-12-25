<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

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
    ElMessage.success('编码成功')
  } catch {
    ElMessage.error('编码失败')
  }
}

const decode = () => {
  if (!input.value) return
  try {
    output.value = input.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    ElMessage.success('解码成功')
  } catch {
    ElMessage.error('解码失败')
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unicode 转换</h1>
      <p class="text-gray-500">Unicode 编码与中文互相转换</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-radio-group v-model="mode">
        <el-radio-button value="encode">中文 → Unicode</el-radio-button>
        <el-radio-button value="decode">Unicode → 中文</el-radio-button>
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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>
          {{ mode === 'encode' ? '中文文本' : 'Unicode 编码' }}
        </template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="12"
          :placeholder="mode === 'encode' ? '请输入中文文本...' : '请输入 Unicode 编码，如 \\u4f60\\u597d'"
          class="font-mono"
        />
      </el-card>

      <el-card>
        <template #header>
          {{ mode === 'encode' ? 'Unicode 编码' : '中文文本' }}
        </template>
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
