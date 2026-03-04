<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

const input = ref('')
const rootName = ref('RootType')
const useInterface = ref(true)

function inferType(value: unknown, name: string, interfaces: Map<string, string>, depth: number): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number'
  if (typeof value === 'boolean') return 'boolean'

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const types = new Set(value.map((item) => inferType(item, `${name}Item`, interfaces, depth)))
    if (types.size === 1) return `${[...types][0]}[]`
    return `(${[...types].join(' | ')})[]`
  }

  if (typeof value === 'object') {
    const interfaceName = name.charAt(0).toUpperCase() + name.slice(1)
    const entries = Object.entries(value as Record<string, unknown>)
    const indent = '  '
    const fields = entries.map(([key, val]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`
      const fieldType = inferType(val, key, interfaces, depth + 1)
      return `${indent}${safeKey}: ${fieldType}`
    })
    const keyword = useInterface.value ? 'interface' : 'type'
    const eq = useInterface.value ? '' : ' ='
    const body = fields.length > 0 ? fields.join('\n') : `${indent}[key: string]: unknown`
    interfaces.set(interfaceName, `export ${keyword} ${interfaceName}${eq} {\n${body}\n}`)
    return interfaceName
  }

  return 'unknown'
}

const result = computed(() => {
  const trimmed = input.value.trim()
  if (!trimmed) return ''

  try {
    const parsed = JSON.parse(trimmed)
    const interfaces = new Map<string, string>()
    const name = rootName.value || 'RootType'
    inferType(parsed, name, interfaces, 0)

    const parts: string[] = []
    const mainInterface = interfaces.get(name.charAt(0).toUpperCase() + name.slice(1))
    interfaces.delete(name.charAt(0).toUpperCase() + name.slice(1))

    for (const def of interfaces.values()) {
      parts.push(def)
    }
    if (mainInterface) {
      parts.push(mainInterface)
    }

    return parts.join('\n\n')
  } catch {
    return '// JSON 解析错误，请检查输入格式'
  }
})

const error = computed(() => {
  const trimmed = input.value.trim()
  if (!trimmed) return ''
  try {
    JSON.parse(trimmed)
    return ''
  } catch (e) {
    return (e as Error).message
  }
})

const loadSample = () => {
  input.value = JSON.stringify({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    active: true,
    age: 30,
    address: {
      street: "123 Main St",
      city: "Springfield",
      zipCode: "62704"
    },
    roles: ["admin", "user"],
    scores: [95, 87, 92],
    metadata: null
  }, null, 2)
}

const clear = () => {
  input.value = ''
}

const copyResult = () => {
  copyToClipboard(result.value)
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">JSON 转 TypeScript</h1>
      <p class="text-gray-500">将 JSON 数据转换为 TypeScript 接口/类型定义</p>
    </div>

    <el-card class="mb-4">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-300">类型名称：</span>
          <el-input v-model="rootName" placeholder="RootType" style="width: 160px" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-300">风格：</span>
          <el-radio-group v-model="useInterface">
            <el-radio-button :value="true">interface</el-radio-button>
            <el-radio-button :value="false">type</el-radio-button>
          </el-radio-group>
        </div>
        <el-button @click="loadSample" text>加载示例</el-button>
        <el-button @click="clear">清空</el-button>
      </div>
    </el-card>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>JSON 输入</span>
            <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
          </div>
        </template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="20"
          placeholder='请输入 JSON 数据，例如：&#10;{&#10;  "name": "test",&#10;  "value": 123&#10;}'
          class="font-mono"
        />
      </el-card>

      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>TypeScript 输出</span>
            <el-button size="small" :disabled="!result || !!error" @click="copyResult">复制</el-button>
          </div>
        </template>
        <pre
          class="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm overflow-auto whitespace-pre-wrap"
          style="min-height: 432px; max-height: 432px;"
        >{{ result || '// TypeScript 类型将显示在此处' }}</pre>
      </el-card>
    </div>
  </div>
</template>
