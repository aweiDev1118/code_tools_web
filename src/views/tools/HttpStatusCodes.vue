<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface StatusCode {
  code: number
  nameKey: string
  descKey: string
  name: string
}

interface StatusGroup {
  labelKey: string
  type: 'info' | 'success' | 'warning' | 'danger' | 'primary'
  items: StatusCode[]
}

const searchQuery = ref('')

const groupsConfig: StatusGroup[] = [
  {
    labelKey: 'tool.http-status-codes.group1xx',
    type: 'info',
    items: [
      { code: 100, nameKey: '', descKey: 'tool.http-status-codes.desc100', name: 'Continue' },
      { code: 101, nameKey: '', descKey: 'tool.http-status-codes.desc101', name: 'Switching Protocols' },
    ],
  },
  {
    labelKey: 'tool.http-status-codes.group2xx',
    type: 'success',
    items: [
      { code: 200, nameKey: '', descKey: 'tool.http-status-codes.desc200', name: 'OK' },
      { code: 201, nameKey: '', descKey: 'tool.http-status-codes.desc201', name: 'Created' },
      { code: 202, nameKey: '', descKey: 'tool.http-status-codes.desc202', name: 'Accepted' },
      { code: 204, nameKey: '', descKey: 'tool.http-status-codes.desc204', name: 'No Content' },
    ],
  },
  {
    labelKey: 'tool.http-status-codes.group3xx',
    type: 'warning',
    items: [
      { code: 301, nameKey: '', descKey: 'tool.http-status-codes.desc301', name: 'Moved Permanently' },
      { code: 302, nameKey: '', descKey: 'tool.http-status-codes.desc302', name: 'Found' },
      { code: 304, nameKey: '', descKey: 'tool.http-status-codes.desc304', name: 'Not Modified' },
      { code: 307, nameKey: '', descKey: 'tool.http-status-codes.desc307', name: 'Temporary Redirect' },
      { code: 308, nameKey: '', descKey: 'tool.http-status-codes.desc308', name: 'Permanent Redirect' },
    ],
  },
  {
    labelKey: 'tool.http-status-codes.group4xx',
    type: 'danger',
    items: [
      { code: 400, nameKey: '', descKey: 'tool.http-status-codes.desc400', name: 'Bad Request' },
      { code: 401, nameKey: '', descKey: 'tool.http-status-codes.desc401', name: 'Unauthorized' },
      { code: 403, nameKey: '', descKey: 'tool.http-status-codes.desc403', name: 'Forbidden' },
      { code: 404, nameKey: '', descKey: 'tool.http-status-codes.desc404', name: 'Not Found' },
      { code: 405, nameKey: '', descKey: 'tool.http-status-codes.desc405', name: 'Method Not Allowed' },
      { code: 408, nameKey: '', descKey: 'tool.http-status-codes.desc408', name: 'Request Timeout' },
      { code: 409, nameKey: '', descKey: 'tool.http-status-codes.desc409', name: 'Conflict' },
      { code: 413, nameKey: '', descKey: 'tool.http-status-codes.desc413', name: 'Payload Too Large' },
      { code: 415, nameKey: '', descKey: 'tool.http-status-codes.desc415', name: 'Unsupported Media Type' },
      { code: 422, nameKey: '', descKey: 'tool.http-status-codes.desc422', name: 'Unprocessable Entity' },
      { code: 429, nameKey: '', descKey: 'tool.http-status-codes.desc429', name: 'Too Many Requests' },
    ],
  },
  {
    labelKey: 'tool.http-status-codes.group5xx',
    type: 'danger',
    items: [
      { code: 500, nameKey: '', descKey: 'tool.http-status-codes.desc500', name: 'Internal Server Error' },
      { code: 502, nameKey: '', descKey: 'tool.http-status-codes.desc502', name: 'Bad Gateway' },
      { code: 503, nameKey: '', descKey: 'tool.http-status-codes.desc503', name: 'Service Unavailable' },
      { code: 504, nameKey: '', descKey: 'tool.http-status-codes.desc504', name: 'Gateway Timeout' },
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

  const groups = groupsConfig.map(group => ({
    ...group,
    label: t(group.labelKey),
    items: group.items.map(item => ({
      ...item,
      description: t(item.descKey),
    })),
  }))

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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.http-status-codes.name') }}</h1>
      <p class="text-gray-500 dark:text-gray-400">{{ t('tool.http-status-codes.subtitle') }}</p>
    </div>

    <el-card class="mb-6">
      <el-input
        v-model="searchQuery"
        :placeholder="t('tool.http-status-codes.searchPlaceholder')"
        clearable
        prefix-icon="Search"
      />
    </el-card>

    <div v-if="filteredGroups.length === 0" class="text-center text-gray-400 py-12">
      {{ t('tool.http-status-codes.noResults') }}
    </div>

    <div v-for="group in filteredGroups" :key="group.labelKey" class="mb-6">
      <el-card>
        <template #header>
          <span class="font-semibold text-base text-gray-800 dark:text-gray-100">{{ group.label }}</span>
        </template>
        <el-table :data="group.items" stripe class="w-full">
          <el-table-column :label="t('tool.http-status-codes.colCode')" width="110">
            <template #default="{ row }">
              <el-tag :type="getTagType(row.code)" class="font-mono font-bold text-sm">
                {{ row.code }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="t('tool.http-status-codes.colName')" prop="name" width="240" class-name="font-mono" />
          <el-table-column :label="t('tool.http-status-codes.colDescription')" prop="description" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>
