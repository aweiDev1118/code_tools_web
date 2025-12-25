<script setup lang="ts">
import type { Tool } from '@/config/tools'

defineProps<{
  tool: Tool
}>()
</script>

<template>
  <router-link :to="`/tool/${tool.id}`" class="tool-card-link">
    <div class="tool-card">
      <div class="card-glow"></div>
      <div class="card-content">
        <div class="card-icon">
          <el-icon size="24"><component :is="tool.icon" /></el-icon>
        </div>
        <div class="card-info">
          <h3 class="card-title">{{ tool.name }}</h3>
          <p class="card-desc">{{ tool.description }}</p>
        </div>
        <div class="card-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.tool-card-link {
  text-decoration: none;
  display: block;
}

.tool-card {
  position: relative;
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1),
    0 0 30px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.tool-card:hover::before {
  opacity: 1;
}

.dark .tool-card {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .tool-card:hover {
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 8px 10px -6px rgba(0, 0, 0, 0.2),
    0 0 30px rgba(99, 102, 241, 0.2);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.tool-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.35);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.tool-card:hover .card-icon {
  transform: scale(1.1) rotate(-5deg);
  box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.5);
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px 0;
  transition: color 0.2s ease;
}

.tool-card:hover .card-title {
  color: #6366f1;
}

.dark .card-title {
  color: #f1f5f9;
}

.dark .tool-card:hover .card-title {
  color: #a5b4fc;
}

.card-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .card-desc {
  color: #94a3b8;
}

.card-arrow {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.tool-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.dark .card-arrow {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}
</style>
