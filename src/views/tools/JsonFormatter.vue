<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const input = ref('')
const indentSize = ref(2)
const errorMsg = ref('')

const output = computed(() => {
  if (!input.value.trim()) {
    errorMsg.value = ''
    return ''
  }
  try {
    const obj = JSON.parse(input.value)
    errorMsg.value = ''
    return JSON.stringify(obj, null, indentSize.value)
  } catch (e) {
    errorMsg.value = (e as Error).message
    return ''
  }
})

const format = () => {
  if (!input.value.trim()) return
  try {
    const obj = JSON.parse(input.value)
    input.value = JSON.stringify(obj, null, indentSize.value)
    errorMsg.value = ''
    ElMessage.success('格式化成功')
  } catch (e) {
    errorMsg.value = (e as Error).message
    ElMessage.error('JSON 格式错误')
  }
}

const compress = () => {
  if (!input.value.trim()) return
  try {
    const obj = JSON.parse(input.value)
    input.value = JSON.stringify(obj)
    errorMsg.value = ''
    ElMessage.success('压缩成功')
  } catch (e) {
    errorMsg.value = (e as Error).message
    ElMessage.error('JSON 格式错误')
  }
}

const copy = async () => {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

const clear = () => {
  input.value = ''
  errorMsg.value = ''
}

const loadSample = () => {
  input.value = JSON.stringify({
    name: "开发工具箱",
    version: "1.0.0",
    features: ["JSON格式化", "Base64编码", "时间戳转换"],
    config: {
      theme: "light",
      language: "zh-CN"
    }
  }, null, 2)
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">JSON 格式化</h1>
      <p class="text-gray-500">格式化、压缩、校验 JSON 数据</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <el-button type="primary" @click="format">格式化</el-button>
      <el-button @click="compress">压缩</el-button>
      <el-button @click="copy">复制结果</el-button>
      <el-button @click="clear">清空</el-button>
      <el-button @click="loadSample" text>加载示例</el-button>
      <div class="ml-auto flex items-center gap-2">
        <span class="text-sm text-gray-500">缩进:</span>
        <el-select v-model="indentSize" style="width: 80px">
          <el-option :value="2" label="2 空格" />
          <el-option :value="4" label="4 空格" />
          <el-option :value="1" label="Tab" />
        </el-select>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>输入</span>
            <el-tag v-if="errorMsg" type="danger" size="small">格式错误</el-tag>
            <el-tag v-else-if="input.trim()" type="success" size="small">有效 JSON</el-tag>
          </div>
        </template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="20"
          placeholder="请输入 JSON 数据..."
          class="font-mono"
        />
        <div v-if="errorMsg" class="mt-2 text-sm text-red-500">
          {{ errorMsg }}
        </div>
      </el-card>

      <el-card>
        <template #header>输出</template>
        <el-input
          :model-value="output"
          type="textarea"
          :rows="20"
          readonly
          placeholder="格式化结果将显示在这里..."
          class="font-mono"
        />
      </el-card>
    </div>
  </div>
</template>
