<script setup lang="ts">
import { categories, getToolsByCategory, tools } from '@/config/tools'
import ToolCard from '@/components/common/ToolCard.vue'
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <el-icon><MagicStick /></el-icon>
          <span>纯前端实现 · 数据安全</span>
        </div>
        <h1 class="hero-title">
          开发者<span class="gradient-text">工具箱</span>
        </h1>
        <p class="hero-desc">
          集成 {{ tools.length }}+ 款常用开发工具，JSON格式化、编码转换、时间戳、二维码生成等一应俱全
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">{{ tools.length }}+</div>
            <div class="stat-label">工具数量</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ categories.length }}</div>
            <div class="stat-label">工具分类</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">100%</div>
            <div class="stat-label">免费使用</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tools by Category -->
    <div class="tools-section">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-block"
      >
        <div class="category-header">
          <div class="category-icon">
            <el-icon size="20"><component :is="category.icon" /></el-icon>
          </div>
          <h2 class="category-title">{{ category.name }}</h2>
          <div class="category-count">{{ getToolsByCategory(category.id).length }} 个工具</div>
          <router-link
            :to="`/category/${category.id}`"
            class="category-more"
          >
            查看全部
            <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        <div class="tools-grid">
          <ToolCard
            v-for="tool in getToolsByCategory(category.id).slice(0, 4)"
            :key="tool.id"
            :tool="tool"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 48px 32px;
  margin-bottom: 48px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

.dark .hero-section {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.hero-bg {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 60%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 100px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #6366f1;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 24px;
}

.dark .hero-badge {
  color: #a5b4fc;
  border-color: rgba(99, 102, 241, 0.3);
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.dark .hero-title {
  color: #f1f5f9;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.dark .hero-desc {
  color: #94a3b8;
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 32px;
  padding: 20px 32px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.dark .hero-stats {
  background: rgba(15, 23, 42, 0.6);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.dark .stat-label {
  color: #94a3b8;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.3), transparent);
}

/* Tools Section */
.tools-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.category-block {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.dark .category-block {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(255, 255, 255, 0.06);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.3);
}

.category-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.dark .category-title {
  color: #f1f5f9;
}

.category-count {
  font-size: 13px;
  color: #94a3b8;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.1);
}

.category-more {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 14px;
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.category-more:hover {
  gap: 8px;
}

.dark .category-more {
  color: #a5b4fc;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-stats {
    flex-direction: column;
    gap: 16px;
  }

  .stat-divider {
    width: 40px;
    height: 1px;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
