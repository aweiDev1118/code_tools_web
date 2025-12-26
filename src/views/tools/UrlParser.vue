<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

const urlInput = ref('https://example.com:8080/path/to/page?name=test&id=123#section')

interface UrlParts {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  origin: string
  host: string
  params: { key: string; value: string }[]
}

const parsedUrl = computed<UrlParts | null>(() => {
  if (!urlInput.value.trim()) return null

  try {
    const url = new URL(urlInput.value)
    const params: { key: string; value: string }[] = []
    url.searchParams.forEach((value, key) => {
      params.push({ key, value })
    })

    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      host: url.host,
      params
    }
  } catch {
    return null
  }
})

const isValidUrl = computed(() => {
  if (!urlInput.value.trim()) return true
  try {
    new URL(urlInput.value)
    return true
  } catch {
    return false
  }
})

const copyPart = (value: string) => {
  if (value) {
    copyToClipboard(value)
  }
}

const loadSample = () => {
  urlInput.value = 'https://www.example.com:8080/path/to/page?name=张三&age=25&city=北京#section-1'
}

const clear = () => {
  urlInput.value = ''
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">URL 解析</h1>
      <p class="text-gray-500">解析 URL 地址的各个组成部分</p>
    </div>

    <!-- 输入区 -->
    <el-card class="mb-4">
      <template #header>输入 URL</template>
      <el-input
        v-model="urlInput"
        placeholder="请输入要解析的 URL..."
        size="large"
        clearable
      >
        <template #prefix>
          <el-icon><Link /></el-icon>
        </template>
      </el-input>
      <div class="mt-3 flex gap-2">
        <el-button @click="loadSample">加载示例</el-button>
        <el-button @click="clear">清空</el-button>
      </div>
      <div v-if="!isValidUrl" class="mt-2 text-red-500 text-sm">
        URL 格式不正确
      </div>
    </el-card>

    <!-- 解析结果 -->
    <template v-if="parsedUrl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 基本信息 -->
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Link /></el-icon>
              <span>基本信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">协议 (Protocol)</span>
              <div class="info-value-wrap">
                <code class="info-code">{{ parsedUrl.protocol }}</code>
                <el-button size="small" text @click="copyPart(parsedUrl.protocol)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="info-item">
              <span class="info-label">主机名 (Hostname)</span>
              <div class="info-value-wrap">
                <code class="info-code">{{ parsedUrl.hostname }}</code>
                <el-button size="small" text @click="copyPart(parsedUrl.hostname)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="info-item">
              <span class="info-label">端口 (Port)</span>
              <div class="info-value-wrap">
                <code class="info-code">{{ parsedUrl.port || '默认' }}</code>
                <el-button v-if="parsedUrl.port" size="small" text @click="copyPart(parsedUrl.port)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="info-item">
              <span class="info-label">Origin</span>
              <div class="info-value-wrap">
                <code class="info-code">{{ parsedUrl.origin }}</code>
                <el-button size="small" text @click="copyPart(parsedUrl.origin)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 路径信息 -->
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><FolderOpened /></el-icon>
              <span>路径信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">路径 (Pathname)</span>
              <div class="info-value-wrap">
                <code class="info-code">{{ parsedUrl.pathname || '/' }}</code>
                <el-button size="small" text @click="copyPart(parsedUrl.pathname)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="info-item">
              <span class="info-label">查询字符串 (Search)</span>
              <div class="info-value-wrap">
                <code class="info-code">{{ parsedUrl.search || '无' }}</code>
                <el-button v-if="parsedUrl.search" size="small" text @click="copyPart(parsedUrl.search)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="info-item">
              <span class="info-label">锚点 (Hash)</span>
              <div class="info-value-wrap">
                <code class="info-code">{{ parsedUrl.hash || '无' }}</code>
                <el-button v-if="parsedUrl.hash" size="small" text @click="copyPart(parsedUrl.hash)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 查询参数 -->
      <el-card v-if="parsedUrl.params.length > 0" class="mt-4">
        <template #header>
          <div class="card-header">
            <el-icon><List /></el-icon>
            <span>查询参数 ({{ parsedUrl.params.length }} 个)</span>
          </div>
        </template>
        <el-table :data="parsedUrl.params" stripe>
          <el-table-column prop="key" label="参数名" min-width="120">
            <template #default="{ row }">
              <code class="param-code">{{ row.key }}</code>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="参数值" min-width="200">
            <template #default="{ row }">
              <code class="param-code">{{ decodeURIComponent(row.value) }}</code>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ row }">
              <el-button size="small" text @click="copyPart(row.value)">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!-- 无结果提示 -->
    <el-card v-else-if="urlInput && !isValidUrl" class="text-center py-10">
      <el-icon :size="48" class="text-gray-300 mb-4"><Warning /></el-icon>
      <p class="text-gray-500">请输入有效的 URL 地址</p>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1f2937;
}

.dark .card-header {
  color: #f3f4f6;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  color: #6b7280;
  font-size: 13px;
}

.dark .info-label {
  color: #9ca3af;
}

.info-value-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-code {
  background: #f5f5f5;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #1f2937;
  flex: 1;
  word-break: break-all;
}

.dark .info-code {
  background: #1e293b;
  color: #e2e8f0;
}

.param-code {
  background: #f0f9ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #0369a1;
}

.dark .param-code {
  background: #1e3a5f;
  color: #7dd3fc;
}

/* 移动端适配 */
@media (max-width: 430px) {
  .info-value-wrap {
    flex-wrap: wrap;
  }
}
</style>
