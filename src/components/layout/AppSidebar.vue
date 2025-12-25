<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categories, getToolsByCategory } from '@/config/tools'

defineProps<{
  collapsed: boolean
}>()

const route = useRoute()
const router = useRouter()

// 记录每个分类的展开状态，默认全部折叠
const expandedCategories = ref<Record<string, boolean>>(
  Object.fromEntries(categories.map(c => [c.id, false]))
)

const toggleCategory = (categoryId: string) => {
  expandedCategories.value[categoryId] = !expandedCategories.value[categoryId]
}

const isCategoryExpanded = (categoryId: string) => {
  return expandedCategories.value[categoryId]
}

const goToTool = (toolId: string) => {
  router.push(`/tool/${toolId}`)
}

const isToolActive = (toolId: string) => {
  return route.path === `/tool/${toolId}`
}

const isCategoryActive = (categoryId: string) => {
  return route.path.startsWith(`/tool/`) &&
    getToolsByCategory(categoryId).some(t => route.path === `/tool/${t.id}`)
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-content">
      <!-- Home -->
      <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
        <div class="nav-icon">
          <el-icon size="20"><HomeFilled /></el-icon>
        </div>
        <span v-if="!collapsed" class="nav-text">首页</span>
      </router-link>

      <div class="nav-divider"></div>

      <!-- Categories -->
      <div v-for="category in categories" :key="category.id" class="nav-group">
        <div
          class="nav-group-header"
          :class="{ active: isCategoryActive(category.id), expanded: isCategoryExpanded(category.id) }"
          @click="toggleCategory(category.id)"
        >
          <div class="nav-icon">
            <el-icon size="18"><component :is="category.icon" /></el-icon>
          </div>
          <span v-if="!collapsed" class="nav-text">{{ category.name }}</span>
          <el-icon v-if="!collapsed" class="expand-icon" size="14">
            <ArrowDown />
          </el-icon>
        </div>

        <Transition name="collapse">
          <div v-if="!collapsed && isCategoryExpanded(category.id)" class="nav-group-items">
            <div
              v-for="tool in getToolsByCategory(category.id)"
              :key="tool.id"
              class="nav-sub-item"
              :class="{ active: isToolActive(tool.id) }"
              @click.stop="goToTool(tool.id)"
            >
              <span class="nav-dot"></span>
              <span class="nav-text">{{ tool.name }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="!collapsed" class="sidebar-footer">
      <div class="footer-badge">
        <el-icon size="14"><InfoFilled /></el-icon>
        <span>v0.1.0</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 240px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 90;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar.collapsed {
  width: 72px;
}

.dark .sidebar {
  background: rgba(15, 23, 42, 0.7);
  border-right-color: rgba(255, 255, 255, 0.06);
}

.sidebar-content {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item,
.nav-group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: #64748b;
  margin-bottom: 4px;
}

.nav-group-header {
  position: relative;
}

.expand-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
  opacity: 0.6;
}

.nav-group-header.expanded .expand-icon {
  transform: rotate(180deg);
}

.nav-group-header:hover .expand-icon {
  opacity: 1;
}

.nav-item:hover,
.nav-group-header:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: #6366f1;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.4);
}

.nav-group-header.active {
  color: #6366f1;
  font-weight: 600;
}

.dark .nav-item,
.dark .nav-group-header {
  color: #94a3b8;
}

.dark .nav-item:hover,
.dark .nav-group-header:hover {
  color: #a5b4fc;
}

.dark .nav-item.active {
  color: white;
}

.dark .nav-group-header.active {
  color: #a5b4fc;
}

.nav-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  color: inherit;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.nav-item.active .nav-icon,
.nav-group-header.active .nav-icon {
  background: rgba(255, 255, 255, 0.2);
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
  margin: 12px 0;
}

.nav-group {
  margin-bottom: 8px;
}

.nav-group-items {
  padding-left: 20px;
  margin-top: 4px;
}

.nav-sub-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  font-size: 13px;
}

.nav-sub-item:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
}

.nav-sub-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  color: #6366f1;
  font-weight: 600;
}

.dark .nav-sub-item {
  color: #94a3b8;
}

.dark .nav-sub-item:hover,
.dark .nav-sub-item.active {
  color: #a5b4fc;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
  transition: all 0.2s ease;
}

.nav-sub-item.active .nav-dot {
  opacity: 1;
  box-shadow: 0 0 8px currentColor;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .sidebar-footer {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.footer-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: #6366f1;
  font-size: 12px;
  font-weight: 500;
}

.dark .footer-badge {
  color: #a5b4fc;
}

/* Collapsed state */
.collapsed .nav-icon {
  width: 44px;
  height: 44px;
}

.collapsed .nav-item,
.collapsed .nav-group-header {
  justify-content: center;
  padding: 8px;
}

.collapsed .nav-group-items {
  display: none;
}

/* Collapse transition */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}
</style>
