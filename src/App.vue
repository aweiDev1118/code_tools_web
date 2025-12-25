<script setup lang="ts">
import { ref, provide, computed, onMounted, onUnmounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'

const isDark = ref(false)
const sidebarCollapsed = ref(false)
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => windowWidth.value < 768)

// 移动端默认隐藏侧边栏
const sidebarVisible = computed(() => {
  if (isMobile.value) {
    return !sidebarCollapsed.value
  }
  return true
})

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
  // 切换到桌面端时重置侧边栏状态
  if (!isMobile.value) {
    sidebarCollapsed.value = false
  } else {
    sidebarCollapsed.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始化时如果是移动端，隐藏侧边栏
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

provide('isDark', isDark)
provide('toggleDark', toggleDark)
provide('isMobile', isMobile)
provide('closeSidebar', closeSidebar)
</script>

<template>
  <div class="app-container" :class="{ dark: isDark, mobile: isMobile }">
    <AppHeader
      :is-dark="isDark"
      @toggle-dark="toggleDark"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- 移动端遮罩层 -->
    <Transition name="fade">
      <div
        v-if="isMobile && sidebarVisible"
        class="sidebar-overlay"
        @click="closeSidebar"
      />
    </Transition>

    <AppSidebar
      :collapsed="sidebarCollapsed"
      :is-mobile="isMobile"
      @close="closeSidebar"
    />
    <main
      class="main-content"
      :class="{ collapsed: sidebarCollapsed && !isMobile }"
    >
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  transition: background 0.3s ease;
}

.app-container.dark {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.main-content {
  margin-left: 240px;
  margin-top: 64px;
  padding: 32px;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content.collapsed {
  margin-left: 72px;
}

/* Page Transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 95;
  backdrop-filter: blur(4px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========================================
   iPhone 适配 (iPhone 12-17 全系列)
   ======================================== */

@media (max-width: 430px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
    padding-top: 12px;
    padding-bottom: max(16px, env(safe-area-inset-bottom));
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
    margin-top: calc(56px + env(safe-area-inset-top));
    min-height: calc(100vh - 56px - env(safe-area-inset-top));
  }

  .main-content.collapsed {
    margin-left: 0;
  }
}

/* iPhone mini (375px) */
@media (max-width: 375px) {
  .main-content {
    padding: 10px;
    padding-bottom: max(10px, env(safe-area-inset-bottom));
  }
}

/* iPhone Pro Max / Plus (428-430px) */
@media (min-width: 428px) and (max-width: 430px) {
  .main-content {
    padding: 20px;
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
}

/* 横屏模式 */
@media (max-width: 844px) and (orientation: landscape) {
  .main-content {
    margin-top: calc(48px + env(safe-area-inset-top));
    min-height: calc(100vh - 48px - env(safe-area-inset-top));
    padding: 12px;
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
  }
}
</style>
