<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

interface IpInfo {
  ip: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
}

const loading = ref(false)
const ip = ref('')
const ipInfo = ref<IpInfo | null>(null)
const errorMsg = ref('')
const queryIp = ref('')

// 获取本机 IP
const fetchMyIp = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const response = await fetch('https://api.ipify.org/?format=json')
    if (!response.ok) throw new Error('请求失败')
    const data = await response.json()
    if (data && data.ip) {
      ip.value = data.ip
      // 自动查询归属地
      await fetchIpInfo(data.ip)
    }
  } catch (e) {
    console.error('获取IP失败:', e)
    errorMsg.value = '无法获取 IP 地址，请稍后重试'
    loading.value = false
  }
}

// 查询 IP 归属地信息
const fetchIpInfo = async (targetIp: string) => {
  try {
    const response = await fetch(`https://ipapi.co/${targetIp}/json/`)
    if (!response.ok) throw new Error('查询失败')
    const data = await response.json()

    if (data.error) {
      errorMsg.value = data.reason || '查询归属地失败'
    } else {
      ipInfo.value = {
        ip: data.ip,
        country: data.country_name || '',
        countryCode: data.country_code || '',
        region: data.region_code || '',
        regionName: data.region || '',
        city: data.city || '',
        zip: data.postal || '',
        lat: data.latitude || 0,
        lon: data.longitude || 0,
        timezone: data.timezone || '',
        isp: data.org || '',
        org: data.org || '',
        as: data.asn ? `${data.asn} ${data.org}` : ''
      }
    }
  } catch (e) {
    console.error('查询归属地失败:', e)
    // 归属地查询失败不影响 IP 显示
  } finally {
    loading.value = false
  }
}

// 手动查询指定 IP
const queryCustomIp = () => {
  const targetIp = queryIp.value.trim()
  if (!targetIp) return

  ip.value = targetIp
  ipInfo.value = null
  loading.value = true
  errorMsg.value = ''
  fetchIpInfo(targetIp)
}

// 刷新本机 IP
const refresh = () => {
  queryIp.value = ''
  ip.value = ''
  ipInfo.value = null
  fetchMyIp()
}

const copyIp = () => {
  if (ip.value) {
    copyToClipboard(ip.value)
  }
}

const copyAllInfo = () => {
  if (!ipInfo.value) return
  const info = `IP: ${ipInfo.value.ip}
国家/地区: ${ipInfo.value.country} (${ipInfo.value.countryCode})
省份: ${ipInfo.value.regionName}
城市: ${ipInfo.value.city}
邮编: ${ipInfo.value.zip}
经纬度: ${ipInfo.value.lat}, ${ipInfo.value.lon}
时区: ${ipInfo.value.timezone}
运营商: ${ipInfo.value.isp}
AS: ${ipInfo.value.as}`
  copyToClipboard(info)
}

onMounted(() => {
  fetchMyIp()
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">IP 地址查询</h1>
      <p class="text-gray-500">获取您的公网 IP 地址及归属地信息</p>
    </div>

    <!-- 查询框 -->
    <el-card class="mb-4">
      <div class="flex flex-wrap gap-3 items-center">
        <el-input
          v-model="queryIp"
          placeholder="输入 IP 地址查询（留空获取本机 IP）"
          class="flex-1 min-w-[200px]"
          @keyup.enter="queryCustomIp"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="queryCustomIp" :loading="loading">
          查询
        </el-button>
        <el-button @click="refresh" :loading="loading">
          <el-icon class="mr-1"><Refresh /></el-icon>
          获取本机 IP
        </el-button>
      </div>
    </el-card>

    <!-- 错误提示 -->
    <el-alert
      v-if="errorMsg"
      :title="errorMsg"
      type="error"
      class="mb-4"
      show-icon
      closable
    />

    <!-- 加载状态 -->
    <el-card v-if="loading" class="mb-4">
      <div class="loading-display">
        <el-icon class="is-loading" :size="40"><Loading /></el-icon>
        <p class="loading-text">正在获取 IP 信息...</p>
      </div>
    </el-card>

    <!-- IP 展示 -->
    <template v-if="!loading && ip">
      <!-- 主要 IP 卡片 -->
      <el-card class="ip-card mb-4">
        <div class="ip-display">
          <div class="ip-label">IP 地址</div>
          <div class="ip-value">{{ ip }}</div>
          <div class="ip-actions">
            <el-button @click="copyIp">
              <el-icon class="mr-1"><CopyDocument /></el-icon>
              复制 IP
            </el-button>
            <el-button v-if="ipInfo" @click="copyAllInfo">
              <el-icon class="mr-1"><DocumentCopy /></el-icon>
              复制全部
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 归属地信息 -->
      <div v-if="ipInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 地理位置 -->
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Location /></el-icon>
              <span>地理位置</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">国家/地区</span>
              <span class="info-value">{{ ipInfo.country || '-' }} {{ ipInfo.countryCode ? `(${ipInfo.countryCode})` : '' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">省份</span>
              <span class="info-value">{{ ipInfo.regionName || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">城市</span>
              <span class="info-value">{{ ipInfo.city || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮政编码</span>
              <span class="info-value">{{ ipInfo.zip || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">经纬度</span>
              <span class="info-value">{{ ipInfo.lat }}, {{ ipInfo.lon }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">时区</span>
              <span class="info-value">{{ ipInfo.timezone || '-' }}</span>
            </div>
          </div>
        </el-card>

        <!-- 网络信息 -->
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Connection /></el-icon>
              <span>网络信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">运营商 (ISP)</span>
              <span class="info-value">{{ ipInfo.isp || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">组织</span>
              <span class="info-value">{{ ipInfo.org || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">AS 信息</span>
              <span class="info-value">{{ ipInfo.as || '-' }}</span>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 地图预览 -->
      <el-card v-if="ipInfo && ipInfo.lat && ipInfo.lon" class="mt-4">
        <template #header>
          <div class="card-header">
            <el-icon><MapLocation /></el-icon>
            <span>位置预览</span>
          </div>
        </template>
        <div class="map-container">
          <iframe
            :src="`https://maps.google.com/maps?q=${ipInfo.lat},${ipInfo.lon}&z=10&output=embed`"
            width="100%"
            height="300"
            style="border: 0; border-radius: 8px;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </el-card>
    </template>
  </div>
</template>

<style scoped>
.loading-display {
  text-align: center;
  padding: 40px;
  color: #666;
}

.dark .loading-display {
  color: #94a3b8;
}

.loading-text {
  margin-top: 16px;
}

.ip-card.el-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4) !important;
}

.ip-card.el-card :deep(.el-card__body) {
  padding: 40px 32px;
  background: transparent !important;
}

.ip-display {
  text-align: center;
  color: #ffffff;
}

.ip-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9) !important;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.ip-value {
  font-size: 40px;
  font-weight: 700;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  margin-bottom: 24px;
  word-break: break-all;
  color: #ffffff !important;
}

.ip-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ip-actions .el-button {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.ip-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
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
  text-align: right;
  word-break: break-all;
}

.dark .info-value {
  color: #f3f4f6;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
}

/* 移动端适配 */
@media (max-width: 430px) {
  .ip-card :deep(.el-card__body) {
    padding: 32px 20px;
  }

  .ip-value {
    font-size: 26px;
  }

  .ip-actions {
    flex-direction: column;
  }

  .ip-actions .el-button {
    width: 100%;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-value {
    text-align: left;
  }
}
</style>
