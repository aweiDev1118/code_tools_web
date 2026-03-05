<script setup lang="ts">
import { ref, provide, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import { useHistory } from '@/composables/useHistory'
import { useSeo } from '@/composables/useSeo'

useSeo()

const { addHistory } = useHistory()
const route = useRoute()

watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/tool/')) {
      const toolId = path.replace('/tool/', '')
      addHistory(toolId)
    }
  }
)

type ThemeMode = 'light' | 'dark' | 'system'

const themeMode = ref<ThemeMode>((localStorage.getItem('themeMode') as ThemeMode) || 'system')
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

const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)')

const applyTheme = (mode: ThemeMode) => {
  const shouldBeDark = mode === 'dark' || (mode === 'system' && systemDarkQuery.matches)
  isDark.value = shouldBeDark
  document.documentElement.classList.toggle('dark', shouldBeDark)
}

const changeTheme = (mode: ThemeMode) => {
  themeMode.value = mode
  localStorage.setItem('themeMode', mode)
  applyTheme(mode)
}

const handleSystemThemeChange = () => {
  if (themeMode.value === 'system') {
    applyTheme('system')
  }
}

systemDarkQuery.addEventListener('change', handleSystemThemeChange)

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
  applyTheme(themeMode.value)
  // 初始化时如果是移动端，隐藏侧边栏
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  systemDarkQuery.removeEventListener('change', handleSystemThemeChange)
})

provide('isDark', isDark)
provide('themeMode', themeMode)
provide('changeTheme', changeTheme)
provide('isMobile', isMobile)
provide('closeSidebar', closeSidebar)
</script>

<template>
  <div class="app-container" :class="{ dark: isDark, mobile: isMobile }">
    <AppHeader
      :is-dark="isDark"
      :theme-mode="themeMode"
      @change-theme="changeTheme"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- 移动端遮罩层 -->
    <Transition name="overlay-fade">
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
/* ---- Background mesh gradient ---- */
.app-container {
  min-height: 100vh;
  position: relative;
  background-color: #fafafa;
  background-image:
    radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99, 102, 241, 0.03) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 110%, rgba(168, 85, 247, 0.02) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 50% 50%, rgba(59, 130, 246, 0.01) 0%, transparent 70%);
  transition: background-color 0.3s ease, background-image 0.3s ease;
}

.app-container.dark {
  background-color: #0a0b0d;
  background-image:
    radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99, 102, 241, 0.05) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 85% 100%, rgba(139, 92, 246, 0.04) 0%, transparent 55%),
    radial-gradient(ellipse 70% 40% at 50% 50%, rgba(37, 99, 235, 0.02) 0%, transparent 70%);
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

/* ---- Page Transition: slide-up + fade ---- */
.page-enter-active {
  transition: opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-leave-active {
  transition: opacity 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---- Mobile Overlay: richer blur ---- */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(2, 6, 23, 0.55);
  z-index: 95;
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
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
