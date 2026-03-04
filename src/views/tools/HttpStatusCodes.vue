<script setup lang="ts">
import { ref, computed } from 'vue'

interface StatusCode {
  code: number
  name: string
  description: string
}

interface StatusGroup {
  label: string
  type: 'info' | 'success' | 'warning' | 'danger' | 'primary'
  items: StatusCode[]
}

const searchQuery = ref('')

const groups: StatusGroup[] = [
  {
    label: '1xx 信息响应',
    type: 'info',
    items: [
      { code: 100, name: 'Continue', description: '继续，客户端应继续发送请求' },
      { code: 101, name: 'Switching Protocols', description: '切换协议，服务器同意切换协议' },
    ],
  },
  {
    label: '2xx 成功',
    type: 'success',
    items: [
      { code: 200, name: 'OK', description: '请求成功' },
      { code: 201, name: 'Created', description: '已创建，请求成功并创建了新的资源' },
      { code: 202, name: 'Accepted', description: '已接受，请求已接受但尚未处理' },
      { code: 204, name: 'No Content', description: '无内容，服务器成功处理但不返回内容' },
    ],
  },
  {
    label: '3xx 重定向',
    type: 'warning',
    items: [
      { code: 301, name: 'Moved Permanently', description: '永久重定向，资源已永久移动到新位置' },
      { code: 302, name: 'Found', description: '临时重定向，资源临时移动到新位置' },
      { code: 304, name: 'Not Modified', description: '未修改，资源未改变可使用缓存版本' },
      { code: 307, name: 'Temporary Redirect', description: '临时重定向，与302类似但方法不变' },
      { code: 308, name: 'Permanent Redirect', description: '永久重定向，与301类似但方法不变' },
    ],
  },
  {
    label: '4xx 客户端错误',
    type: 'danger',
    items: [
      { code: 400, name: 'Bad Request', description: '错误请求，服务器无法理解请求语法' },
      { code: 401, name: 'Unauthorized', description: '未授权，请求需要身份验证' },
      { code: 403, name: 'Forbidden', description: '禁止访问，服务器拒绝执行请求' },
      { code: 404, name: 'Not Found', description: '未找到，服务器找不到请求的资源' },
      { code: 405, name: 'Method Not Allowed', description: '方法不允许，请求方法不支持该资源' },
      { code: 408, name: 'Request Timeout', description: '请求超时，服务器等待请求超时' },
      { code: 409, name: 'Conflict', description: '冲突，请求与服务器当前状态冲突' },
      { code: 413, name: 'Payload Too Large', description: '请求实体过大，超出服务器限制' },
      { code: 415, name: 'Unsupported Media Type', description: '不支持的媒体类型' },
      { code: 422, name: 'Unprocessable Entity', description: '无法处理的实体，请求格式正确但语义错误' },
      { code: 429, name: 'Too Many Requests', description: '请求过多，触发速率限制' },
    ],
  },
  {
    label: '5xx 服务端错误',
    type: 'danger',
    items: [
      { code: 500, name: 'Internal Server Error', description: '服务器内部错误' },
      { code: 502, name: 'Bad Gateway', description: '错误网关，上游服务器返回无效响应' },
      { code: 503, name: 'Service Unavailable', description: '服务不可用，服务器暂时过载或维护' },
      { code: 504, name: 'Gateway Timeout', description: '网关超时，上游服务器未及时响应' },
    ],
  },
]

const tagTypeMap: Record<string, string> = {
  '1': 'info',
  '2': 'success',
  '3': 'warning',
  '4': 'danger',
  '5': 'danger',
}

function getTagType(code: number): string {
  return tagTypeMap[String(code)[0]] ?? 'info'
}

const filteredGroups = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return groups

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          String(item.code).includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q),
      ),
    }))
    .filter((group) => group.items.length > 0)
})
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">HTTP 状态码速查</h1>
      <p class="text-gray-500 dark:text-gray-400">常用 HTTP 状态码及其含义</p>
    </div>

    <el-card class="mb-6">
      <el-input
        v-model="searchQuery"
        placeholder="搜索状态码或描述..."
        clearable
        prefix-icon="Search"
      />
    </el-card>

    <div v-if="filteredGroups.length === 0" class="text-center text-gray-400 py-12">
      未找到匹配的状态码
    </div>

    <div v-for="group in filteredGroups" :key="group.label" class="mb-6">
      <el-card>
        <template #header>
          <span class="font-semibold text-base text-gray-800 dark:text-gray-100">{{ group.label }}</span>
        </template>
        <el-table :data="group.items" stripe class="w-full">
          <el-table-column label="状态码" width="110">
            <template #default="{ row }">
              <el-tag :type="getTagType(row.code)" class="font-mono font-bold text-sm">
                {{ row.code }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="英文名" prop="name" width="240" class-name="font-mono" />
          <el-table-column label="中文描述" prop="description" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>
