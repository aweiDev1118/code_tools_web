<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

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
      ElMessage.error(t('tool.number-converter.invalidValue'))
      return
    }

    if (activeField.value !== 'decimal') decimal.value = num.toString(10)
    if (activeField.value !== 'binary') binary.value = num.toString(2)
    if (activeField.value !== 'octal') octal.value = num.toString(8)
    if (activeField.value !== 'hex') hex.value = num.toString(16).toUpperCase()
  } catch {
    ElMessage.error(t('tool.number-converter.convertFailed'))
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.number-converter.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.number-converter.subtitle') }}</p>
    </div>

    <div class="mb-4">
      <el-button @click="clear">{{ t('common.clear') }}</el-button>
    </div>

    <el-card>
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-24 text-right font-medium">{{ t('tool.number-converter.decimal') }}</div>
          <el-input
            v-model="decimal"
            :placeholder="t('tool.number-converter.decimalPlaceholder')"
            class="font-mono flex-1"
            @focus="activeField = 'decimal'"
          >
            <template #append>
              <el-button @click="copy(decimal)">{{ t('common.copy') }}</el-button>
            </template>
          </el-input>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-24 text-right font-medium">{{ t('tool.number-converter.binary') }}</div>
          <el-input
            v-model="binary"
            :placeholder="t('tool.number-converter.binaryPlaceholder')"
            class="font-mono flex-1"
            @focus="activeField = 'binary'"
          >
            <template #prepend>0b</template>
            <template #append>
              <el-button @click="copy(binary)">{{ t('common.copy') }}</el-button>
            </template>
          </el-input>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-24 text-right font-medium">{{ t('tool.number-converter.octal') }}</div>
          <el-input
            v-model="octal"
            :placeholder="t('tool.number-converter.octalPlaceholder')"
            class="font-mono flex-1"
            @focus="activeField = 'octal'"
          >
            <template #prepend>0o</template>
            <template #append>
              <el-button @click="copy(octal)">{{ t('common.copy') }}</el-button>
            </template>
          </el-input>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-24 text-right font-medium">{{ t('tool.number-converter.hexadecimal') }}</div>
          <el-input
            v-model="hex"
            :placeholder="t('tool.number-converter.hexPlaceholder')"
            class="font-mono flex-1"
            @focus="activeField = 'hex'"
          >
            <template #prepend>0x</template>
            <template #append>
              <el-button @click="copy(hex)">{{ t('common.copy') }}</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </el-card>

    <el-alert class="mt-4" type="info" :closable="false">
      {{ t('tool.number-converter.autoConvertHint') }}
    </el-alert>
  </div>
</template>
