<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CryptoJS from 'crypto-js'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

const input = ref('')
const uppercase = ref(false)

const hashes = computed(() => {
  if (!input.value) return null
  const text = input.value
  const result = {
    md5: CryptoJS.MD5(text).toString(),
    sha1: CryptoJS.SHA1(text).toString(),
    sha256: CryptoJS.SHA256(text).toString(),
    sha512: CryptoJS.SHA512(text).toString(),
    sha3: CryptoJS.SHA3(text).toString(),
  }
  if (uppercase.value) {
    return {
      md5: result.md5.toUpperCase(),
      sha1: result.sha1.toUpperCase(),
      sha256: result.sha256.toUpperCase(),
      sha512: result.sha512.toUpperCase(),
      sha3: result.sha3.toUpperCase(),
    }
  }
  return result
})

const copy = (text: string) => {
  copyToClipboard(text)
}

const clear = () => {
  input.value = ''
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.hash-generator.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.hash-generator.subtitle') }}</p>
    </div>

    <el-card class="mb-4">
      <div class="flex gap-2 mb-4">
        <el-checkbox v-model="uppercase">{{ t('tool.hash-generator.uppercaseOutput') }}</el-checkbox>
        <el-button @click="clear" class="ml-auto">{{ t('common.clear') }}</el-button>
      </div>
      <el-input
        v-model="input"
        type="textarea"
        :rows="4"
        :placeholder="t('tool.hash-generator.inputPlaceholder')"
      />
    </el-card>

    <div v-if="hashes" class="space-y-4">
      <el-card v-for="(value, key) in hashes" :key="key">
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold uppercase">{{ key }}</span>
          <el-button size="small" @click="copy(value)">{{ t('common.copy') }}</el-button>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm break-all">
          {{ value }}
        </div>
      </el-card>
    </div>

    <el-empty v-else :description="t('tool.hash-generator.emptyHint')" />
  </div>
</template>
