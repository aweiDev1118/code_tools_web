<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

const uaInput = ref('')

interface ParsedUA {
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  device: string
  engine: string
  isMobile: boolean
  isBot: boolean
}

const parseUserAgent = (ua: string): ParsedUA => {
  const result: ParsedUA = {
    browser: '未知',
    browserVersion: '',
    os: '未知',
    osVersion: '',
    device: '电脑',
    engine: '未知',
    isMobile: false,
    isBot: false
  }

  // 检测是否是爬虫
  if (/bot|spider|crawl|slurp|googlebot|bingbot|yandex/i.test(ua)) {
    result.isBot = true
    result.device = '爬虫'
  }

  // 检测浏览器
  if (ua.includes('Firefox/')) {
    result.browser = 'Firefox'
    result.browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || ''
    result.engine = 'Gecko'
  } else if (ua.includes('Edg/')) {
    result.browser = 'Microsoft Edge'
    result.browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || ''
    result.engine = 'Blink'
  } else if (ua.includes('Chrome/')) {
    result.browser = 'Chrome'
    result.browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || ''
    result.engine = 'Blink'
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    result.browser = 'Safari'
    result.browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || ''
    result.engine = 'WebKit'
  } else if (ua.includes('Opera') || ua.includes('OPR/')) {
    result.browser = 'Opera'
    result.browserVersion = ua.match(/(?:Opera|OPR)\/([\d.]+)/)?.[1] || ''
    result.engine = 'Blink'
  } else if (ua.includes('MSIE') || ua.includes('Trident/')) {
    result.browser = 'Internet Explorer'
    result.browserVersion = ua.match(/(?:MSIE |rv:)([\d.]+)/)?.[1] || ''
    result.engine = 'Trident'
  }

  // 检测操作系统
  if (ua.includes('Windows NT 10')) {
    result.os = 'Windows'
    result.osVersion = '10/11'
  } else if (ua.includes('Windows NT 6.3')) {
    result.os = 'Windows'
    result.osVersion = '8.1'
  } else if (ua.includes('Windows NT 6.2')) {
    result.os = 'Windows'
    result.osVersion = '8'
  } else if (ua.includes('Windows NT 6.1')) {
    result.os = 'Windows'
    result.osVersion = '7'
  } else if (ua.includes('Mac OS X')) {
    result.os = 'macOS'
    result.osVersion = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || ''
  } else if (ua.includes('Android')) {
    result.os = 'Android'
    result.osVersion = ua.match(/Android ([\d.]+)/)?.[1] || ''
    result.isMobile = true
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    result.os = 'iOS'
    result.osVersion = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || ''
    result.isMobile = true
  } else if (ua.includes('Linux')) {
    result.os = 'Linux'
  }

  // 检测设备类型
  if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
    result.device = '手机'
    result.isMobile = true
  } else if (/iPad|Tablet/i.test(ua)) {
    result.device = '平板'
    result.isMobile = true
  }

  return result
}

const parsedResult = computed(() => {
  if (!uaInput.value.trim()) return null
  return parseUserAgent(uaInput.value)
})

const useCurrentUA = () => {
  uaInput.value = navigator.userAgent
}

const sampleUAs = [
  { name: 'Chrome (Windows)', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { name: 'Safari (macOS)', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' },
  { name: 'Firefox (Windows)', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0' },
  { name: 'iPhone Safari', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
  { name: 'Android Chrome', ua: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36' },
  { name: 'Googlebot', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
]

const loadSample = (ua: string) => {
  uaInput.value = ua
}

const clear = () => {
  uaInput.value = ''
}

onMounted(() => {
  useCurrentUA()
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">UserAgent 分析</h1>
      <p class="text-gray-500">解析 UserAgent 字符串，识别浏览器、操作系统等信息</p>
    </div>

    <!-- 输入区 -->
    <el-card class="mb-4">
      <template #header>输入 UserAgent</template>
      <el-input
        v-model="uaInput"
        type="textarea"
        :rows="3"
        placeholder="请输入 UserAgent 字符串..."
        class="font-mono text-sm"
      />
      <div class="mt-3 flex flex-wrap gap-2">
        <el-button type="primary" @click="useCurrentUA">使用当前浏览器</el-button>
        <el-button @click="clear">清空</el-button>
        <el-button @click="copyToClipboard(uaInput)" :disabled="!uaInput">复制</el-button>
      </div>
    </el-card>

    <!-- 示例 UA -->
    <el-card class="mb-4">
      <template #header>常用 UserAgent 示例</template>
      <div class="sample-list">
        <el-tag
          v-for="sample in sampleUAs"
          :key="sample.name"
          class="sample-tag"
          @click="loadSample(sample.ua)"
        >
          {{ sample.name }}
        </el-tag>
      </div>
    </el-card>

    <!-- 解析结果 -->
    <template v-if="parsedResult">
      <!-- 主要信息卡片 -->
      <el-card class="result-card mb-4">
        <div class="result-main">
          <div class="result-icon">
            <el-icon :size="40">
              <Iphone v-if="parsedResult.isMobile" />
              <Monitor v-else />
            </el-icon>
          </div>
          <div class="result-info">
            <div class="result-title">
              {{ parsedResult.browser }} {{ parsedResult.browserVersion }}
            </div>
            <div class="result-subtitle">
              {{ parsedResult.os }} {{ parsedResult.osVersion }} · {{ parsedResult.device }}
            </div>
          </div>
          <div class="result-tags">
            <el-tag v-if="parsedResult.isMobile" type="info" size="small">移动设备</el-tag>
            <el-tag v-if="parsedResult.isBot" type="warning" size="small">爬虫</el-tag>
          </div>
        </div>
      </el-card>

      <!-- 详细信息 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><ChromeFilled /></el-icon>
              <span>浏览器信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">浏览器</span>
              <span class="info-value">{{ parsedResult.browser }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">版本</span>
              <span class="info-value">{{ parsedResult.browserVersion || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">渲染引擎</span>
              <span class="info-value">{{ parsedResult.engine }}</span>
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Platform /></el-icon>
              <span>系统信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">操作系统</span>
              <span class="info-value">{{ parsedResult.os }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">系统版本</span>
              <span class="info-value">{{ parsedResult.osVersion || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">设备类型</span>
              <span class="info-value">{{ parsedResult.device }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sample-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sample-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.sample-tag:hover {
  transform: scale(1.05);
}

.result-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
}

.result-card :deep(.el-card__body) {
  background: transparent !important;
}

.result-main {
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
}

.result-icon {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
}

.result-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.result-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.result-tags {
  display: flex;
  gap: 8px;
}

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
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.dark .info-item {
  border-bottom-color: #374151;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #6b7280;
  font-size: 14px;
}

.dark .info-label {
  color: #9ca3af;
}

.info-value {
  color: #1f2937;
  font-weight: 500;
}

.dark .info-value {
  color: #f3f4f6;
}

/* 移动端适配 */
@media (max-width: 430px) {
  .result-main {
    flex-direction: column;
    text-align: center;
  }

  .result-title {
    font-size: 18px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
