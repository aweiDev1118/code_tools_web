<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

interface BrowserInfo {
  userAgent: string
  platform: string
  language: string
  languages: string[]
  cookieEnabled: boolean
  doNotTrack: string | null
  onLine: boolean
  hardwareConcurrency: number
  deviceMemory: number | undefined
  maxTouchPoints: number
  vendor: string
  screenWidth: number
  screenHeight: number
  screenColorDepth: number
  windowWidth: number
  windowHeight: number
  pixelRatio: number
  timezone: string
  timezoneOffset: number
}

const browserInfo = ref<BrowserInfo | null>(null)

const getBrowserName = (ua: string): string => {
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg')) return 'Microsoft Edge'
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
  return '未知浏览器'
}

const getOSName = (ua: string): string => {
  if (ua.includes('Windows NT 10')) return 'Windows 10/11'
  if (ua.includes('Windows NT 6.3')) return 'Windows 8.1'
  if (ua.includes('Windows NT 6.2')) return 'Windows 8'
  if (ua.includes('Windows NT 6.1')) return 'Windows 7'
  if (ua.includes('Mac OS X')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  return '未知系统'
}

const getDeviceType = (): string => {
  const ua = navigator.userAgent
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    if (/iPad|Tablet/i.test(ua)) return '平板电脑'
    return '手机'
  }
  return '电脑'
}

const fetchBrowserInfo = () => {
  browserInfo.value = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: [...navigator.languages],
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
    maxTouchPoints: navigator.maxTouchPoints,
    vendor: navigator.vendor,
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset()
  }
}

const copyAllInfo = () => {
  if (!browserInfo.value) return
  const info = `浏览器: ${getBrowserName(browserInfo.value.userAgent)}
操作系统: ${getOSName(browserInfo.value.userAgent)}
设备类型: ${getDeviceType()}
UserAgent: ${browserInfo.value.userAgent}
平台: ${browserInfo.value.platform}
语言: ${browserInfo.value.language}
屏幕分辨率: ${browserInfo.value.screenWidth} x ${browserInfo.value.screenHeight}
窗口大小: ${browserInfo.value.windowWidth} x ${browserInfo.value.windowHeight}
像素比: ${browserInfo.value.pixelRatio}
时区: ${browserInfo.value.timezone}
CPU 核心数: ${browserInfo.value.hardwareConcurrency}
触控点数: ${browserInfo.value.maxTouchPoints}
Cookie 启用: ${browserInfo.value.cookieEnabled ? '是' : '否'}
在线状态: ${browserInfo.value.onLine ? '在线' : '离线'}`
  copyToClipboard(info)
}

onMounted(() => {
  fetchBrowserInfo()
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">浏览器信息</h1>
      <p class="text-gray-500">获取您的浏览器和设备详细信息</p>
    </div>

    <div class="mb-4">
      <el-button type="primary" @click="copyAllInfo">
        <el-icon class="mr-1"><CopyDocument /></el-icon>
        复制全部信息
      </el-button>
      <el-button @click="fetchBrowserInfo">
        <el-icon class="mr-1"><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <template v-if="browserInfo">
      <!-- 主要信息卡片 -->
      <el-card class="main-card mb-4">
        <div class="main-info">
          <div class="browser-icon">
            <el-icon :size="48"><Monitor /></el-icon>
          </div>
          <div class="browser-details">
            <div class="browser-name">{{ getBrowserName(browserInfo.userAgent) }}</div>
            <div class="os-name">{{ getOSName(browserInfo.userAgent) }} · {{ getDeviceType() }}</div>
          </div>
        </div>
      </el-card>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 浏览器信息 -->
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
              <span class="info-value">{{ getBrowserName(browserInfo.userAgent) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">浏览器引擎</span>
              <span class="info-value">{{ browserInfo.vendor || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">平台</span>
              <span class="info-value">{{ browserInfo.platform }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">语言</span>
              <span class="info-value">{{ browserInfo.language }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cookie</span>
              <span class="info-value">
                <el-tag :type="browserInfo.cookieEnabled ? 'success' : 'danger'" size="small">
                  {{ browserInfo.cookieEnabled ? '启用' : '禁用' }}
                </el-tag>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">在线状态</span>
              <span class="info-value">
                <el-tag :type="browserInfo.onLine ? 'success' : 'danger'" size="small">
                  {{ browserInfo.onLine ? '在线' : '离线' }}
                </el-tag>
              </span>
            </div>
          </div>
        </el-card>

        <!-- 屏幕信息 -->
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Monitor /></el-icon>
              <span>屏幕信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">屏幕分辨率</span>
              <span class="info-value">{{ browserInfo.screenWidth }} x {{ browserInfo.screenHeight }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">窗口大小</span>
              <span class="info-value">{{ browserInfo.windowWidth }} x {{ browserInfo.windowHeight }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">像素比</span>
              <span class="info-value">{{ browserInfo.pixelRatio }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">色深</span>
              <span class="info-value">{{ browserInfo.screenColorDepth }} bit</span>
            </div>
            <div class="info-item">
              <span class="info-label">触控点数</span>
              <span class="info-value">{{ browserInfo.maxTouchPoints }}</span>
            </div>
          </div>
        </el-card>

        <!-- 系统信息 -->
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Cpu /></el-icon>
              <span>系统信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">操作系统</span>
              <span class="info-value">{{ getOSName(browserInfo.userAgent) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">设备类型</span>
              <span class="info-value">{{ getDeviceType() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CPU 核心数</span>
              <span class="info-value">{{ browserInfo.hardwareConcurrency }}</span>
            </div>
            <div class="info-item" v-if="browserInfo.deviceMemory">
              <span class="info-label">设备内存</span>
              <span class="info-value">{{ browserInfo.deviceMemory }} GB</span>
            </div>
            <div class="info-item">
              <span class="info-label">时区</span>
              <span class="info-value">{{ browserInfo.timezone }}</span>
            </div>
          </div>
        </el-card>

        <!-- UserAgent -->
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Document /></el-icon>
              <span>UserAgent</span>
            </div>
          </template>
          <div class="ua-content">
            <code class="ua-text">{{ browserInfo.userAgent }}</code>
            <el-button size="small" class="mt-3" @click="copyToClipboard(browserInfo.userAgent)">
              <el-icon class="mr-1"><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
        </el-card>
      </div>
    </template>
  </div>
</template>

<style scoped>
.main-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
}

.main-card :deep(.el-card__body) {
  padding: 32px;
  background: transparent !important;
}

.main-info {
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
}

.browser-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.browser-name {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.os-name {
  font-size: 16px;
  opacity: 0.9;
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

.ua-content {
  display: flex;
  flex-direction: column;
}

.ua-text {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  word-break: break-all;
  line-height: 1.6;
  color: #333;
}

.dark .ua-text {
  background: #1e293b;
  color: #e2e8f0;
}

/* 移动端适配 */
@media (max-width: 430px) {
  .main-info {
    flex-direction: column;
    text-align: center;
  }

  .browser-name {
    font-size: 22px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
