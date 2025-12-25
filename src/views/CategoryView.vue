<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { categories, getToolsByCategory } from '@/config/tools'
import ToolCard from '@/components/common/ToolCard.vue'

const route = useRoute()

const categoryId = computed(() => route.params.id as string)
const category = computed(() => categories.find(c => c.id === categoryId.value))
const tools = computed(() => getToolsByCategory(categoryId.value))
</script>

<template>
  <div class="category-container">
    <!-- Header -->
    <div v-if="category" class="category-header">
      <div class="header-icon">
        <el-icon size="28"><component :is="category.icon" /></el-icon>
      </div>
      <div class="header-info">
        <h1 class="header-title">{{ category.name }}</h1>
        <p class="header-desc">共 {{ tools.length }} 个工具</p>
      </div>
      <router-link to="/" class="back-link">
        <el-icon><ArrowLeft /></el-icon>
        返回首页
      </router-link>
    </div>

    <!-- Tools Grid -->
    <div class="tools-grid">
      <ToolCard
        v-for="tool in tools"
        :key="tool.id"
        :tool="tool"
      />
    </div>

    <div v-if="tools.length === 0" class="empty-state">
      <el-icon size="64" class="empty-icon"><FolderOpened /></el-icon>
      <p>暂无工具</p>
    </div>
  </div>
</template>

<style scoped>
.category-container {
  max-width: 1200px;
  margin: 0 auto;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px;
  margin-bottom: 32px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.dark .category-header {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.header-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px 0 rgba(99, 102, 241, 0.35);
}

.header-info {
  flex: 1;
}

.header-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.dark .header-title {
  color: #f1f5f9;
}

.header-desc {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.dark .header-desc {
  color: #94a3b8;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-link:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  transform: translateX(-4px);
}

.dark .back-link {
  color: #a5b4fc;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #94a3b8;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .category-header {
    flex-direction: column;
    text-align: center;
  }

  .back-link {
    margin-top: 16px;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
