<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">使用历史</h1>
        <p class="text-gray-500">共 {{ totalUsage }} 次使用记录</p>
      </div>
      <el-button v-if="totalUsage > 0" @click="clearHistory" type="danger" plain size="small">
        清除记录
      </el-button>
    </div>

    <template v-if="totalUsage > 0">
      <!-- Recent tools section -->
      <el-card class="mb-6">
        <template #header>最近使用</template>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="tool in recentTools.slice(0, 9)" :key="tool.id" class="relative">
            <ToolCard :tool="tool" />
            <div class="absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm">
              {{ formatTime(tool.lastUsed) }}
            </div>
          </div>
        </div>
      </el-card>

      <!-- Usage stats section -->
      <el-card>
        <template #header>使用统计</template>
        <div class="space-y-3">
          <div v-for="(item, index) in usageStats" :key="item.tool.id"
            class="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span class="text-sm font-mono text-gray-400 w-6 text-center">{{ index + 1 }}</span>
            <el-icon size="20" class="text-indigo-500 flex-shrink-0">
              <component :is="item.tool.icon" />
            </el-icon>
            <span class="font-medium text-gray-700 dark:text-gray-200 min-w-0 truncate">{{ item.tool.name }}</span>
            <div class="flex-1 mx-2">
              <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  :style="{ width: `${(item.count / usageStats[0].count) * 100}%` }"></div>
              </div>
            </div>
            <span class="text-sm font-mono text-gray-500 flex-shrink-0">{{ item.count }} 次</span>
          </div>
        </div>
      </el-card>
    </template>

    <!-- Empty state -->
    <div v-else class="text-center py-20">
      <div class="text-5xl mb-4 opacity-30">📊</div>
      <p class="text-gray-400 dark:text-gray-500 text-lg">还没有使用记录</p>
      <p class="text-gray-400 dark:text-gray-500 mt-2 text-sm">使用工具后会自动记录</p>
      <router-link to="/" class="mt-6 inline-block">
        <el-button type="primary">浏览工具</el-button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHistory } from '@/composables/useHistory'
import ToolCard from '@/components/common/ToolCard.vue'

const { recentTools, usageStats, totalUsage, clearHistory } = useHistory()

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  const days = Math.floor(diff / 86400000)
  return days === 1 ? '昨天' : `${days} 天前`
}
</script>
