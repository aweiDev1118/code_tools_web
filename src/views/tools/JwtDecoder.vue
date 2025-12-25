<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

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

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制')
  } catch {
    ElMessage.error('复制失败')
  }
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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">JWT 解析</h1>
      <p class="text-gray-500">解析并查看 JWT Token 内容</p>
    </div>

    <div class="mb-4 flex gap-2">
      <el-button @click="clear">清空</el-button>
      <el-button @click="loadSample" text>加载示例</el-button>
    </div>

    <el-card class="mb-4">
      <template #header>输入 JWT</template>
      <el-input
        v-model="input"
        type="textarea"
        :rows="4"
        placeholder="请输入 JWT Token..."
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
          title="此 Token 已过期"
          :closable="false"
          class="mb-4"
        />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <el-card>
            <template #header>
              <div class="flex justify-between items-center">
                <span class="text-red-500">Header</span>
                <el-button size="small" @click="copy(JSON.stringify(decoded.header, null, 2))">复制</el-button>
              </div>
            </template>
            <pre class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm overflow-auto">{{ JSON.stringify(decoded.header, null, 2) }}</pre>
          </el-card>

          <el-card>
            <template #header>
              <div class="flex justify-between items-center">
                <span class="text-purple-500">Payload</span>
                <el-button size="small" @click="copy(JSON.stringify(decoded.payload, null, 2))">复制</el-button>
              </div>
            </template>
            <pre class="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm overflow-auto max-h-64">{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
          </el-card>
        </div>

        <el-card class="mt-4">
          <template #header>时间信息</template>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="decoded.formattedTimes?.iat" class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div class="text-sm text-gray-500">签发时间 (iat)</div>
              <div class="font-mono">{{ decoded.formattedTimes?.iat }}</div>
            </div>
            <div v-if="decoded.formattedTimes?.exp" class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div class="text-sm text-gray-500">过期时间 (exp)</div>
              <div class="font-mono" :class="decoded.isExpired ? 'text-red-500' : ''">
                {{ decoded.formattedTimes?.exp }}
              </div>
            </div>
            <div v-if="decoded.formattedTimes?.nbf" class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div class="text-sm text-gray-500">生效时间 (nbf)</div>
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
            注意：此工具仅解析 JWT，不验证签名。请勿将敏感 Token 粘贴到不信任的网站。
          </el-alert>
        </el-card>
      </template>
    </template>

    <el-empty v-else description="输入 JWT 后显示解析结果" />
  </div>
</template>
