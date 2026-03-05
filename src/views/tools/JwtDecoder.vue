<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

const input = ref('')

const decoded = computed(() => {
  if (!input.value.trim()) return null

  try {
    const parts = input.value.split('.')
    if (parts.length !== 3) {
      return { error: 'Invalid JWT format. JWT should have 3 parts separated by dots.' }
    }

    const decodeBase64 = (str: string) => {
      // 处理 URL-safe base64
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
      return JSON.parse(atob(padded))
    }

    const header = decodeBase64(parts[0])
    const payload = decodeBase64(parts[1])

    // 解析时间戳字段
    const formatTime = (timestamp?: number) => {
      if (!timestamp) return null
      return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
    }

    const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : false

    return {
      header,
      payload,
      signature: parts[2],
      formattedTimes: {
        iat: formatTime(payload.iat),
        exp: formatTime(payload.exp),
        nbf: formatTime(payload.nbf),
      },
      isExpired
    }
  } catch (e) {
    return { error: 'Failed to decode JWT: ' + (e as Error).message }
  }
})

const copy = (text: string) => {
  copyToClipboard(text)
}

const clear = () => {
  input.value = ''
}

const loadSample = () => {
  // 示例 JWT (已过期)
  input.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.jwt-decoder.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.jwt-decoder.subtitle') }}</p>
    </div>

    <div class="mb-4 flex gap-2">
      <el-button @click="clear">{{ t('common.clear') }}</el-button>
      <el-button @click="loadSample" text>{{ t('common.loadSample') }}</el-button>
    </div>

    <el-card class="mb-4">
      <template #header>{{ t('tool.jwt-decoder.inputHeader') }}</template>
      <el-input
        v-model="input"
        type="textarea"
        :rows="4"
        :placeholder="t('tool.jwt-decoder.inputPlaceholder')"
        class="font-mono"
      />
    </el-card>

    <template v-if="decoded">
      <el-alert
        v-if="decoded.error"
        type="error"
        :title="decoded.error"
        :closable="false"
        class="mb-4"
      />

      <template v-else>
        <el-alert
          v-if="decoded.isExpired"
          type="warning"
          :title="t('tool.jwt-decoder.tokenExpired')"
          :closable="false"
          class="mb-4"
        />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <el-card>
            <template #header>
              <div class="flex justify-between items-center">
                <span class="text-red-500">Header</span>
                <el-button size="small" @click="copy(JSON.stringify(decoded.header, null, 2))">{{ t('common.copy') }}</el-button>
              </div>
            </template>
            <pre class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm overflow-auto">{{ JSON.stringify(decoded.header, null, 2) }}</pre>
          </el-card>

          <el-card>
            <template #header>
              <div class="flex justify-between items-center">
                <span class="text-purple-500">Payload</span>
                <el-button size="small" @click="copy(JSON.stringify(decoded.payload, null, 2))">{{ t('common.copy') }}</el-button>
              </div>
            </template>
            <pre class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm overflow-auto max-h-64">{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
          </el-card>
        </div>

        <el-card class="mt-4">
          <template #header>{{ t('tool.jwt-decoder.timeInfo') }}</template>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="decoded.formattedTimes?.iat" class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div class="text-sm text-gray-500">{{ t('tool.jwt-decoder.issuedAt') }} (iat)</div>
              <div class="font-mono">{{ decoded.formattedTimes?.iat }}</div>
            </div>
            <div v-if="decoded.formattedTimes?.exp" class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div class="text-sm text-gray-500">{{ t('tool.jwt-decoder.expiresAt') }} (exp)</div>
              <div class="font-mono" :class="decoded.isExpired ? 'text-red-500' : ''">
                {{ decoded.formattedTimes?.exp }}
              </div>
            </div>
            <div v-if="decoded.formattedTimes?.nbf" class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div class="text-sm text-gray-500">{{ t('tool.jwt-decoder.notBefore') }} (nbf)</div>
              <div class="font-mono">{{ decoded.formattedTimes?.nbf }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="mt-4">
          <template #header>
            <span class="text-blue-500">Signature</span>
          </template>
          <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm break-all">
            {{ decoded.signature }}
          </div>
          <el-alert type="info" :closable="false" class="mt-4">
            {{ t('tool.jwt-decoder.securityNotice') }}
          </el-alert>
        </el-card>
      </template>
    </template>

    <el-empty v-else :description="t('tool.jwt-decoder.emptyHint')" />
  </div>
</template>
