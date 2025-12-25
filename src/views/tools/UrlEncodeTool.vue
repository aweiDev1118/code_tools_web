<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

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
    ElMessage.success('编码成功')
  } catch {
    ElMessage.error('编码失败')
  }
}

const decode = () => {
  if (!input.value) return
  try {
    output.value = encodeType.value === 'component'
      ? decodeURIComponent(input.value)
      : decodeURI(input.value)
    ElMessage.success('解码成功')
  } catch {
    ElMessage.error('解码失败，请检查输入')
  }
}

const convert = () => {
  if (mode.value === 'encode') {
    encode()
  } else {
    decode()
  }
}

const copy = async () => {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    ElMessage.success('已复制')
  } catch {
    ElMessage.error('复制失败')
  }
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">URL 编解码</h1>
      <p class="text-gray-500">URL 编码与解码转换</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <el-radio-group v-model="mode">
        <el-radio-button value="encode">编码</el-radio-button>
        <el-radio-button value="decode">解码</el-radio-button>
      </el-radio-group>
      <el-select v-model="encodeType" style="width: 180px">
        <el-option value="component" label="encodeURIComponent" />
        <el-option value="uri" label="encodeURI" />
      </el-select>
      <el-button type="primary" @click="convert">
        {{ mode === 'encode' ? '编码' : '解码' }}
      </el-button>
      <el-button @click="swap">
        <el-icon><Switch /></el-icon>
        交换
      </el-button>
      <el-button @click="copy">复制结果</el-button>
      <el-button @click="clear">清空</el-button>
      <el-button @click="loadSample" text>示例</el-button>
    </div>

    <el-alert class="mb-4" type="info" :closable="false">
      <strong>encodeURIComponent:</strong> 编码所有特殊字符，适用于 URL 参数<br>
      <strong>encodeURI:</strong> 保留 URL 结构字符 (://?#)，适用于完整 URL
    </el-alert>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>输入</template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="12"
          placeholder="请输入要转换的内容..."
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
        />
      </el-card>
    </div>
  </div>
</template>
