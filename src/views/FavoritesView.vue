<script setup lang="ts">
import ToolCard from '@/components/common/ToolCard.vue'
import { useFavorites } from '@/composables/useFavorites'

const { favoriteTools, favoriteCount } = useFavorites()
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">我的收藏</h1>
      <p class="text-gray-500">已收藏 {{ favoriteCount }} 个工具</p>
    </div>

    <!-- Favorites grid -->
    <div v-if="favoriteTools.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ToolCard v-for="tool in favoriteTools" :key="tool.id" :tool="tool" />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-20">
      <div class="text-5xl mb-4 opacity-30">⭐</div>
      <p class="text-gray-400 dark:text-gray-500 text-lg">还没有收藏任何工具</p>
      <p class="text-gray-400 dark:text-gray-500 mt-2 text-sm">点击工具卡片上的星标即可收藏</p>
      <router-link to="/" class="mt-6 inline-block">
        <el-button type="primary">浏览工具</el-button>
      </router-link>
    </div>
  </div>
</template>
