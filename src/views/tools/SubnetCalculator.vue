<script setup lang="ts">
import { ref, computed } from 'vue'
import { copyToClipboard } from '@/utils/clipboard'

const ipAddress = ref('192.168.1.100')
const cidr = ref(24)

interface SubnetInfo {
  networkAddress: string
  broadcastAddress: string
  subnetMask: string
  wildcardMask: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  ipClass: string
  ipType: string
  binaryIp: string
  binaryMask: string
}

const isValidIp = (ip: string): boolean => {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  return parts.every(part => {
    const num = parseInt(part)
    return !isNaN(num) && num >= 0 && num <= 255
  })
}

const ipToNumber = (ip: string): number => {
  const parts = ip.split('.').map(Number)
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
}

const numberToIp = (num: number): string => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join('.')
}

const ipToBinary = (ip: string): string => {
  return ip.split('.').map(octet =>
    parseInt(octet).toString(2).padStart(8, '0')
  ).join('.')
}

const getIpClass = (ip: string): string => {
  const firstOctet = parseInt(ip.split('.')[0])
  if (firstOctet >= 1 && firstOctet <= 126) return 'A'
  if (firstOctet >= 128 && firstOctet <= 191) return 'B'
  if (firstOctet >= 192 && firstOctet <= 223) return 'C'
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (多播)'
  if (firstOctet >= 240 && firstOctet <= 255) return 'E (保留)'
  return '特殊'
}

const getIpType = (ip: string): string => {
  const parts = ip.split('.').map(Number)
  // 私有地址范围
  if (parts[0] === 10) return '私有地址 (A类)'
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return '私有地址 (B类)'
  if (parts[0] === 192 && parts[1] === 168) return '私有地址 (C类)'
  // 回环地址
  if (parts[0] === 127) return '回环地址'
  // 链路本地
  if (parts[0] === 169 && parts[1] === 254) return '链路本地地址'
  return '公网地址'
}

const subnetInfo = computed<SubnetInfo | null>(() => {
  if (!ipAddress.value || !isValidIp(ipAddress.value)) return null

  const ip = ipToNumber(ipAddress.value)
  const maskBits = cidr.value
  const mask = maskBits === 0 ? 0 : (0xFFFFFFFF << (32 - maskBits)) >>> 0
  const wildcard = (~mask) >>> 0

  const network = (ip & mask) >>> 0
  const broadcast = (network | wildcard) >>> 0
  const firstHost = maskBits >= 31 ? network : network + 1
  const lastHost = maskBits >= 31 ? broadcast : broadcast - 1
  const totalHosts = Math.pow(2, 32 - maskBits)
  const usableHosts = maskBits >= 31 ? totalHosts : totalHosts - 2

  return {
    networkAddress: numberToIp(network),
    broadcastAddress: numberToIp(broadcast),
    subnetMask: numberToIp(mask),
    wildcardMask: numberToIp(wildcard),
    firstHost: numberToIp(firstHost),
    lastHost: numberToIp(lastHost),
    totalHosts,
    usableHosts: Math.max(0, usableHosts),
    ipClass: getIpClass(ipAddress.value),
    ipType: getIpType(ipAddress.value),
    binaryIp: ipToBinary(ipAddress.value),
    binaryMask: ipToBinary(numberToIp(mask))
  }
})

const isValid = computed(() => isValidIp(ipAddress.value))

const copyAllInfo = () => {
  if (!subnetInfo.value) return
  const info = `IP 地址: ${ipAddress.value}/${cidr.value}
子网掩码: ${subnetInfo.value.subnetMask}
网络地址: ${subnetInfo.value.networkAddress}
广播地址: ${subnetInfo.value.broadcastAddress}
可用主机范围: ${subnetInfo.value.firstHost} - ${subnetInfo.value.lastHost}
可用主机数: ${subnetInfo.value.usableHosts}
IP 类型: ${subnetInfo.value.ipType}`
  copyToClipboard(info)
}

const commonCidrs = [8, 16, 24, 25, 26, 27, 28, 29, 30, 31, 32]
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">子网掩码计算器</h1>
      <p class="text-gray-500">计算 IP 地址的子网信息、可用主机范围等</p>
    </div>

    <!-- 输入区 -->
    <el-card class="mb-4">
      <template #header>输入 IP 地址</template>
      <div class="input-row">
        <el-input
          v-model="ipAddress"
          placeholder="192.168.1.100"
          class="ip-input"
          :class="{ 'is-error': ipAddress && !isValid }"
        >
          <template #prefix>
            <el-icon><Position /></el-icon>
          </template>
        </el-input>
        <span class="cidr-slash">/</span>
        <el-input-number
          v-model="cidr"
          :min="0"
          :max="32"
          :step="1"
          class="cidr-input"
        />
      </div>
      <div v-if="ipAddress && !isValid" class="mt-2 text-red-500 text-sm">
        IP 地址格式不正确
      </div>
      <div class="mt-3 flex flex-wrap gap-2">
        <span class="text-sm text-gray-500 mr-2">常用 CIDR:</span>
        <el-tag
          v-for="c in commonCidrs"
          :key="c"
          :type="c === cidr ? 'primary' : 'info'"
          class="cidr-tag"
          @click="cidr = c"
        >
          /{{ c }}
        </el-tag>
      </div>
      <div class="mt-3">
        <el-button type="primary" @click="copyAllInfo" :disabled="!subnetInfo">
          <el-icon class="mr-1"><CopyDocument /></el-icon>
          复制全部信息
        </el-button>
      </div>
    </el-card>

    <!-- 计算结果 -->
    <template v-if="subnetInfo">
      <!-- 主要信息 -->
      <el-card class="main-card mb-4">
        <div class="main-info">
          <div class="main-ip">{{ ipAddress }}/{{ cidr }}</div>
          <div class="main-desc">
            <el-tag>{{ subnetInfo.ipClass }} 类</el-tag>
            <el-tag type="info">{{ subnetInfo.ipType }}</el-tag>
          </div>
        </div>
      </el-card>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 地址信息 -->
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Connection /></el-icon>
              <span>地址信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">网络地址</span>
              <span class="info-value">{{ subnetInfo.networkAddress }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">广播地址</span>
              <span class="info-value">{{ subnetInfo.broadcastAddress }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">子网掩码</span>
              <span class="info-value">{{ subnetInfo.subnetMask }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">通配符掩码</span>
              <span class="info-value">{{ subnetInfo.wildcardMask }}</span>
            </div>
          </div>
        </el-card>

        <!-- 主机信息 -->
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><Monitor /></el-icon>
              <span>主机信息</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">第一个可用主机</span>
              <span class="info-value">{{ subnetInfo.firstHost }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">最后一个可用主机</span>
              <span class="info-value">{{ subnetInfo.lastHost }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">总地址数</span>
              <span class="info-value">{{ subnetInfo.totalHosts.toLocaleString() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">可用主机数</span>
              <span class="info-value highlight">{{ subnetInfo.usableHosts.toLocaleString() }}</span>
            </div>
          </div>
        </el-card>

        <!-- 二进制表示 -->
        <el-card class="md:col-span-2">
          <template #header>
            <div class="card-header">
              <el-icon><Tickets /></el-icon>
              <span>二进制表示</span>
            </div>
          </template>
          <div class="binary-grid">
            <div class="binary-item">
              <span class="binary-label">IP 地址</span>
              <code class="binary-value">{{ subnetInfo.binaryIp }}</code>
            </div>
            <div class="binary-item">
              <span class="binary-label">子网掩码</span>
              <code class="binary-value">{{ subnetInfo.binaryMask }}</code>
            </div>
          </div>
        </el-card>
      </div>
    </template>
  </div>
</template>

<style scoped>
.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ip-input {
  flex: 1;
  max-width: 300px;
}

.ip-input.is-error :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.cidr-slash {
  font-size: 24px;
  font-weight: bold;
  color: #666;
}

.cidr-input {
  width: 100px;
}

.cidr-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.cidr-tag:hover {
  transform: scale(1.05);
}

.main-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
}

.main-card :deep(.el-card__body) {
  background: transparent !important;
  padding: 32px;
}

.main-info {
  text-align: center;
  color: white;
}

.main-ip {
  font-size: 36px;
  font-weight: 700;
  font-family: 'Monaco', 'Menlo', monospace;
  margin-bottom: 12px;
}

.main-desc {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.main-desc .el-tag {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
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
  font-family: 'Monaco', 'Menlo', monospace;
}

.dark .info-value {
  color: #f3f4f6;
}

.info-value.highlight {
  color: #667eea;
  font-size: 18px;
  font-weight: 700;
}

.binary-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.binary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.binary-label {
  color: #6b7280;
  font-size: 13px;
}

.dark .binary-label {
  color: #9ca3af;
}

.binary-value {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: 1px;
  color: #1f2937;
  word-break: break-all;
}

.dark .binary-value {
  background: #1e293b;
  color: #e2e8f0;
}

/* 移动端适配 */
@media (max-width: 430px) {
  .input-row {
    flex-wrap: wrap;
  }

  .ip-input {
    max-width: 100%;
    width: 100%;
  }

  .main-ip {
    font-size: 24px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
