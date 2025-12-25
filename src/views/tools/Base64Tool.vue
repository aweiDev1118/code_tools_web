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
    output.value = btoa(unescape(encodeURIComponent(input.value)))
    ElMessage.success('编码成功')
  } catch {
    ElMessage.error('编码失败')
  }
}

const decode = () => {
  if (!input.value) return
  try {
    output.value = decodeURIComponent(escape(atob(input.value)))
    ElMessage.success('解码成功')
  } catch {
    ElMessage.error('解码失败，请检查输入是否为有效的 Base64')
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Base64 编解码</h1>
      <p class="text-gray-500">文本与 Base64 格式互相转换</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-radio-group v-model="mode">
        <el-radio-button value="encode">编码</el-radio-button>
        <el-radio-button value="decode">解码</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="convert">
        {{ mode === 'encode' ? '编码' : '解码' }}
      </el-button>
      <el-button @click="swap">
        <el-icon><Switch /></el-icon>
        交换
      </el-button>
      <el-button @click="copy">复制结果</el-button>
      <el-button @click="clear">清空</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>
          {{ mode === 'encode' ? '原文' : 'Base64' }}
        </template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="15"
          :placeholder="mode === 'encode' ? '请输入要编码的文本...' : '请输入要解码的 Base64...'"
        />
      </el-card>

      <el-card>
        <template #header>
          {{ mode === 'encode' ? 'Base64' : '原文' }}
        </template>
        <el-input
          v-model="output"
          type="textarea"
          :rows="15"
          readonly
          placeholder="转换结果..."
        />
      </el-card>
    </div>
  </div>
</template>
