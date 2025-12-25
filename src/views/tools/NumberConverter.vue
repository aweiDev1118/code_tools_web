<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

const decimal = ref('')
const binary = ref('')
const octal = ref('')
const hex = ref('')

const activeField = ref('')

const convert = (value: string, fromBase: number) => {
  if (!value.trim()) {
    decimal.value = ''
    binary.value = ''
    octal.value = ''
    hex.value = ''
    return
  }

  try {
    const num = parseInt(value, fromBase)
    if (isNaN(num)) {
      ElMessage.error('无效的数值')
      return
    }

    if (activeField.value !== 'decimal') decimal.value = num.toString(10)
    if (activeField.value !== 'binary') binary.value = num.toString(2)
    if (activeField.value !== 'octal') octal.value = num.toString(8)
    if (activeField.value !== 'hex') hex.value = num.toString(16).toUpperCase()
  } catch {
    ElMessage.error('转换失败')
  }
}

watch(decimal, (val) => {
  if (activeField.value === 'decimal') convert(val, 10)
})
watch(binary, (val) => {
  if (activeField.value === 'binary') convert(val, 2)
})
watch(octal, (val) => {
  if (activeField.value === 'octal') convert(val, 8)
})
watch(hex, (val) => {
  if (activeField.value === 'hex') convert(val, 16)
})

const copy = (text: string) => {
  if (!text) return
  copyToClipboard(text)
}

const clear = () => {
  decimal.value = ''
  binary.value = ''
  octal.value = ''
  hex.value = ''
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">进制转换</h1>
      <p class="text-gray-500">2进制、8进制、10进制、16进制互相转换</p>
    </div>

    <div class="mb-4">
      <el-button @click="clear">清空</el-button>
    </div>

    <el-card>
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-24 text-right font-medium">十进制</div>
          <el-input
            v-model="decimal"
            placeholder="输入十进制数"
            class="font-mono flex-1"
            @focus="activeField = 'decimal'"
          >
            <template #append>
              <el-button @click="copy(decimal)">复制</el-button>
            </template>
          </el-input>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-24 text-right font-medium">二进制</div>
          <el-input
            v-model="binary"
            placeholder="输入二进制数 (0/1)"
            class="font-mono flex-1"
            @focus="activeField = 'binary'"
          >
            <template #prepend>0b</template>
            <template #append>
              <el-button @click="copy(binary)">复制</el-button>
            </template>
          </el-input>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-24 text-right font-medium">八进制</div>
          <el-input
            v-model="octal"
            placeholder="输入八进制数 (0-7)"
            class="font-mono flex-1"
            @focus="activeField = 'octal'"
          >
            <template #prepend>0o</template>
            <template #append>
              <el-button @click="copy(octal)">复制</el-button>
            </template>
          </el-input>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-24 text-right font-medium">十六进制</div>
          <el-input
            v-model="hex"
            placeholder="输入十六进制数 (0-9, A-F)"
            class="font-mono flex-1"
            @focus="activeField = 'hex'"
          >
            <template #prepend>0x</template>
            <template #append>
              <el-button @click="copy(hex)">复制</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </el-card>

    <el-alert class="mt-4" type="info" :closable="false">
      在任意输入框中输入数值，其他进制会自动转换
    </el-alert>
  </div>
</template>
