<script setup lang="ts">
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'
import { copyToClipboard } from '@/utils/clipboard'

type AesMode = 'CBC' | 'ECB' | 'CTR'
type OutputFormat = 'Base64' | 'Hex'

const inputText = ref('')
const keyText = ref('')
const ivText = ref('')
const outputText = ref('')
const mode = ref<AesMode>('CBC')
const outputFormat = ref<OutputFormat>('Base64')
const errorMsg = ref('')
const copySuccess = ref(false)

const modeOptions = [
  { label: 'CBC', value: 'CBC' },
  { label: 'ECB', value: 'ECB' },
  { label: 'CTR', value: 'CTR' },
]

const needsIv = computed(() => mode.value === 'CBC' || mode.value === 'CTR')

function getKeyBytes(key: string): number {
  return new TextEncoder().encode(key).length
}

function validateKey(key: string): string | null {
  const len = getKeyBytes(key)
  if (len === 16 || len === 24 || len === 32) return null
  return `密钥长度不正确：当前 ${len} 字节，需要 16/24/32 字节（对应 AES-128/192/256）`
}

function getModeObj(m: AesMode) {
  switch (m) {
    case 'CBC': return CryptoJS.mode.CBC
    case 'ECB': return CryptoJS.mode.ECB
    case 'CTR': return CryptoJS.mode.CTR
  }
}

function encrypt() {
  errorMsg.value = ''
  outputText.value = ''

  const keyErr = validateKey(keyText.value)
  if (keyErr) {
    errorMsg.value = keyErr
    return
  }

  if (needsIv.value && !ivText.value) {
    errorMsg.value = `${mode.value} 模式需要填写 IV`
    return
  }

  try {
    const keyParsed = CryptoJS.enc.Utf8.parse(keyText.value)
    const options: Record<string, unknown> = {
      mode: getModeObj(mode.value),
      padding: CryptoJS.pad.Pkcs7,
    }

    if (needsIv.value) {
      options.iv = CryptoJS.enc.Utf8.parse(ivText.value)
    }

    const encrypted = CryptoJS.AES.encrypt(inputText.value, keyParsed, options as any)

    if (outputFormat.value === 'Base64') {
      outputText.value = encrypted.toString()
    } else {
      outputText.value = encrypted.ciphertext.toString(CryptoJS.enc.Hex)
    }
  } catch (e) {
    errorMsg.value = `加密失败：${e instanceof Error ? e.message : String(e)}`
  }
}

function decrypt() {
  errorMsg.value = ''
  outputText.value = ''

  const keyErr = validateKey(keyText.value)
  if (keyErr) {
    errorMsg.value = keyErr
    return
  }

  if (needsIv.value && !ivText.value) {
    errorMsg.value = `${mode.value} 模式需要填写 IV`
    return
  }

  if (!inputText.value.trim()) {
    errorMsg.value = '请输入需要解密的内容'
    return
  }

  try {
    const keyParsed = CryptoJS.enc.Utf8.parse(keyText.value)
    const options: Record<string, unknown> = {
      mode: getModeObj(mode.value),
      padding: CryptoJS.pad.Pkcs7,
    }

    if (needsIv.value) {
      options.iv = CryptoJS.enc.Utf8.parse(ivText.value)
    }

    let ciphertext: CryptoJS.lib.CipherParams
    if (outputFormat.value === 'Hex') {
      const hexWords = CryptoJS.enc.Hex.parse(inputText.value)
      ciphertext = CryptoJS.lib.CipherParams.create({ ciphertext: hexWords })
    } else {
      ciphertext = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(inputText.value),
      })
    }

    const decrypted = CryptoJS.AES.decrypt(ciphertext, keyParsed, options)
    const result = decrypted.toString(CryptoJS.enc.Utf8)

    if (!result) {
      errorMsg.value = '解密失败：结果为空，请检查密钥、IV 及输入格式是否正确'
      return
    }

    outputText.value = result
  } catch (e) {
    errorMsg.value = `解密失败：${e instanceof Error ? e.message : String(e)}`
  }
}

async function handleCopy() {
  if (!outputText.value) return
  await copyToClipboard(outputText.value)
  copySuccess.value = true
  setTimeout(() => {
    copySuccess.value = false
  }, 2000)
}

function clearAll() {
  inputText.value = ''
  outputText.value = ''
  errorMsg.value = ''
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">AES 加密解密</h1>
      <p class="text-gray-500 dark:text-gray-400">AES 对称加密和解密工具，支持 AES-128/192/256、CBC/ECB/CTR 模式</p>
    </div>

    <!-- 配置项 -->
    <el-card class="mb-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- 加密模式 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">加密模式</label>
          <el-select v-model="mode" class="w-full">
            <el-option
              v-for="opt in modeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>

        <!-- 输出格式 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">输出格式</label>
          <el-radio-group v-model="outputFormat">
            <el-radio-button label="Base64" value="Base64" />
            <el-radio-button label="Hex" value="Hex" />
          </el-radio-group>
        </div>

        <!-- 密钥 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            密钥
            <span class="text-gray-400 font-normal ml-1">（16/24/32 字节 → AES-128/192/256）</span>
          </label>
          <el-input
            v-model="keyText"
            placeholder="请输入密钥"
            clearable
            show-word-limit
            :maxlength="32"
          />
        </div>

        <!-- IV -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            IV（初始向量）
            <span class="text-gray-400 font-normal ml-1">{{ needsIv ? '（必填）' : '（当前模式不需要）' }}</span>
          </label>
          <el-input
            v-model="ivText"
            placeholder="请输入 IV（16 字节）"
            clearable
            :disabled="!needsIv"
            show-word-limit
            :maxlength="16"
          />
        </div>
      </div>
    </el-card>

    <!-- 输入区域 -->
    <el-card class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium text-gray-700 dark:text-gray-300">输入内容</span>
          <el-button size="small" @click="clearAll">清空</el-button>
        </div>
      </template>
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="5"
        placeholder="请输入需要加密或解密的内容"
      />
    </el-card>

    <!-- 操作按钮 -->
    <div class="flex gap-3 mb-4">
      <el-button type="primary" size="large" :disabled="!inputText || !keyText" @click="encrypt">
        加密
      </el-button>
      <el-button type="warning" size="large" :disabled="!inputText || !keyText" @click="decrypt">
        解密
      </el-button>
    </div>

    <!-- 错误提示 -->
    <el-alert
      v-if="errorMsg"
      :title="errorMsg"
      type="error"
      show-icon
      closable
      class="mb-4"
      @close="errorMsg = ''"
    />

    <!-- 输出区域 -->
    <el-card v-if="outputText">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium text-gray-700 dark:text-gray-300">输出结果</span>
          <el-button
            size="small"
            :type="copySuccess ? 'success' : 'default'"
            @click="handleCopy"
          >
            {{ copySuccess ? '已复制' : '复制' }}
          </el-button>
        </div>
      </template>
      <el-input
        v-model="outputText"
        type="textarea"
        :rows="5"
        readonly
      />
    </el-card>
  </div>
</template>
