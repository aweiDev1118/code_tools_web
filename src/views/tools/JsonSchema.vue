<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-4 flex items-center gap-2">
      <el-button @click="loadExample">示例</el-button>
      <el-button @click="clearAll">清空</el-button>
    </div>

    <el-alert
      v-if="parseError"
      :title="parseError"
      type="error"
      show-icon
      class="mb-4"
      :closable="false"
    />

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col">
        <div class="mb-2 font-medium text-sm text-gray-600 dark:text-gray-400">输入 JSON 数据</div>
        <el-input
          v-model="inputJson"
          type="textarea"
          :rows="16"
          placeholder="请输入 JSON 数据..."
          class="font-mono"
          @input="onInputChange"
        />
      </div>

      <div class="flex flex-col">
        <div class="mb-2 flex items-center justify-between">
          <span class="font-medium text-sm text-gray-600 dark:text-gray-400">生成的 JSON Schema</span>
          <el-button
            size="small"
            :disabled="!outputSchema"
            @click="copySchema"
          >
            复制
          </el-button>
        </div>
        <el-input
          v-model="outputSchema"
          type="textarea"
          :rows="16"
          readonly
          placeholder="JSON Schema 将在此处显示..."
          class="font-mono"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const inputJson = ref('')
const outputSchema = ref('')
const parseError = ref('')

function generateSchema(value: unknown): Record<string, unknown> {
  if (value === null) return { type: 'null' }
  if (typeof value === 'boolean') return { type: 'boolean' }
  if (typeof value === 'number') return { type: Number.isInteger(value) ? 'integer' : 'number' }
  if (typeof value === 'string') return { type: 'string' }
  if (Array.isArray(value)) {
    const schema: Record<string, unknown> = { type: 'array' }
    if (value.length > 0) {
      schema.items = generateSchema(value[0])
    } else {
      schema.items = {}
    }
    return schema
  }
  if (typeof value === 'object') {
    const properties: Record<string, unknown> = {}
    const keys = Object.keys(value as Record<string, unknown>)
    for (const key of keys) {
      properties[key] = generateSchema((value as Record<string, unknown>)[key])
    }
    return { type: 'object', properties, required: keys }
  }
  return {}
}

function onInputChange() {
  const input = inputJson.value.trim()
  if (!input) {
    outputSchema.value = ''
    parseError.value = ''
    return
  }

  try {
    const parsed = JSON.parse(input)
    parseError.value = ''
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      ...generateSchema(parsed)
    }
    outputSchema.value = JSON.stringify(schema, null, 2)
  } catch (e) {
    parseError.value = `JSON 解析错误: ${(e as Error).message}`
    outputSchema.value = ''
  }
}

function loadExample() {
  inputJson.value = JSON.stringify(
    {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      age: 30,
      score: 9.5,
      active: true,
      address: {
        city: 'Beijing',
        zip: '100000'
      },
      tags: ['developer', 'vue'],
      meta: null
    },
    null,
    2
  )
  onInputChange()
}

function clearAll() {
  inputJson.value = ''
  outputSchema.value = ''
  parseError.value = ''
}

async function copySchema() {
  if (!outputSchema.value) return
  try {
    await navigator.clipboard.writeText(outputSchema.value)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}
</script>
