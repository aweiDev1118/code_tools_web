<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { searchTools } from '@/config/tools'

type ThemeMode = 'light' | 'dark' | 'system'

const props = defineProps<{
  isDark: boolean
  themeMode: ThemeMode
}>()

const emit = defineEmits<{
  changeTheme: [mode: ThemeMode]
  toggleSidebar: []
}>()

const showThemeMenu = ref(false)

const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: '浅色', icon: 'Sunny' },
  { value: 'dark', label: '深色', icon: 'Moon' },
  { value: 'system', label: '跟随系统', icon: 'Monitor' },
]

const currentThemeIcon = () => {
  if (props.themeMode === 'system') return 'Monitor'
  return props.isDark ? 'Moon' : 'Sunny'
}

const selectTheme = (mode: ThemeMode) => {
  emit('changeTheme', mode)
  showThemeMenu.value = false
}

const hideThemeMenu = () => {
  setTimeout(() => {
    showThemeMenu.value = false
  }, 150)
}

const router = useRouter()
const searchKeyword = ref('')
const searchResults = ref<ReturnType<typeof searchTools>>([])
const showResults = ref(false)

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    searchResults.value = searchTools(searchKeyword.value)
    showResults.value = true
  } else {
    searchResults.value = []
    showResults.value = false
  }
}

const goToTool = (toolId: string) => {
  router.push(`/tool/${toolId}`)
  searchKeyword.value = ''
  showResults.value = false
}

const hideResults = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}
</script>

<template>
  <header class="header-container">
    <div class="header-content">
      <!-- Logo -->
      <div class="header-left">
        <button class="menu-btn" @click="emit('toggleSidebar')">
          <el-icon size="20"><Fold /></el-icon>
        </button>
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <img src="@/assets/logo.svg" alt="Logo" class="logo-img" />
          </div>
          <span class="logo-text">DevToolbox</span>
        </router-link>
      </div>

      <!-- Search -->
      <div class="header-center">
        <div class="search-wrapper">
          <el-icon class="search-icon"><Search /></el-icon>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索工具..."
            class="search-input"
            @input="handleSearch"
            @blur="hideResults"
          />
          <kbd class="search-kbd">⌘K</kbd>
        </div>

        <!-- Search Results Dropdown -->
        <transition name="fade">
          <div v-if="showResults && searchResults.length > 0" class="search-results">
            <div
              v-for="tool in searchResults.slice(0, 6)"
              :key="tool.id"
              class="search-result-item"
              @mousedown="goToTool(tool.id)"
            >
              <div class="result-icon">
                <el-icon><component :is="tool.icon" /></el-icon>
              </div>
              <div class="result-info">
                <div class="result-name">{{ tool.name }}</div>
                <div class="result-desc">{{ tool.description }}</div>
              </div>
            </div>
          </div>
        </transition>

        <div
          v-if="showResults && searchKeyword && searchResults.length === 0"
          class="search-results search-empty"
        >
          <el-icon size="32" class="text-gray-300"><Search /></el-icon>
          <p>未找到相关工具</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="header-right">
        <div class="theme-dropdown" tabindex="0" @blur="hideThemeMenu">
          <button class="action-btn theme-trigger" @click="showThemeMenu = !showThemeMenu">
            <el-icon size="18">
              <component :is="currentThemeIcon()" />
            </el-icon>
            <el-icon size="12" class="chevron" :class="{ open: showThemeMenu }">
              <ArrowRight />
            </el-icon>
          </button>
          <transition name="dropdown">
            <div v-if="showThemeMenu" class="theme-menu">
              <button
                v-for="option in themeOptions"
                :key="option.value"
                class="theme-option"
                :class="{ active: themeMode === option.value }"
                @mousedown.prevent="selectTheme(option.value)"
              >
                <el-icon size="16"><component :is="option.icon" /></el-icon>
                <span>{{ option.label }}</span>
                <el-icon v-if="themeMode === option.value" size="14" class="check-icon">
                  <CircleCheck />
                </el-icon>
              </button>
            </div>
          </transition>
        </div>
        <a href="https://github.com/aweiDev1118/code_tools_web" target="_blank" class="action-btn">
          <el-icon size="20"><Link /></el-icon>
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .header-container {
  background: rgba(15, 23, 42, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.header-content {
  max-width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: #6366f1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.menu-btn:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  transform: scale(1.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.4);
  padding: 6px;
  box-sizing: border-box;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-center {
  flex: 1;
  max-width: 480px;
  position: relative;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 100px 0 44px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: white;
}

.dark .search-input {
  background: rgba(30, 41, 59, 0.8);
  border-color: #334155;
  color: #f1f5f9;
}

.dark .search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  background: #1e293b;
}

.search-kbd {
  position: absolute;
  right: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  color: #64748b;
  font-family: inherit;
}

.dark .search-kbd {
  background: #334155;
  border-color: #475569;
  color: #94a3b8;
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  z-index: 50;
}

.dark .search-results {
  background: #1e293b;
  border-color: #334155;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-result-item:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.result-info {
  flex: 1;
}

.result-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.dark .result-name {
  color: #f1f5f9;
}

.result-desc {
  font-size: 13px;
  color: #64748b;
}

.dark .result-desc {
  color: #94a3b8;
}

.search-empty {
  padding: 32px;
  text-align: center;
  color: #94a3b8;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;
}

.action-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
  transform: scale(1.05);
}

.dark .action-btn {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}

.dark .action-btn:hover {
  border-color: #6366f1;
  color: #a5b4fc;
}

/* Theme Dropdown */
.theme-dropdown {
  position: relative;
  outline: none;
}

.theme-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  width: auto;
  padding: 0 10px;
}

.chevron {
  transition: transform 0.2s ease;
  transform: rotate(90deg);
}

.chevron.open {
  transform: rotate(-90deg);
}

.theme-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 140px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  padding: 6px;
  z-index: 200;
}

.dark .theme-menu {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.4);
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.theme-option:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
}

.theme-option.active {
  color: #6366f1;
  font-weight: 500;
}

.dark .theme-option {
  color: #94a3b8;
}

.dark .theme-option:hover {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
}

.dark .theme-option.active {
  color: #a5b4fc;
}

.check-icon {
  margin-left: auto;
  color: #6366f1;
}

.dark .check-icon {
  color: #a5b4fc;
}

/* Dropdown Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ========================================
   iPhone 适配 (iPhone 12-17 全系列)
   ======================================== */

/* 通用移动端 */
@media (max-width: 430px) {
  .header-container {
    height: calc(56px + env(safe-area-inset-top));
    padding-top: env(safe-area-inset-top);
  }

  .header-content {
    padding: 0 max(12px, env(safe-area-inset-left)) 0 max(12px, env(safe-area-inset-right));
    gap: 8px;
    height: 56px;
  }

  .header-left {
    gap: 8px;
  }

  .logo-text {
    display: none;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }

  .menu-btn {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }

  .header-center {
    flex: 1;
    max-width: none;
  }

  .search-wrapper {
    width: 100%;
  }

  .search-input {
    height: 44px;
    padding: 0 12px 0 40px;
    font-size: 16px; /* 防止 iOS 自动缩放 */
    border-radius: 10px;
  }

  .search-icon {
    left: 12px;
  }

  .search-kbd {
    display: none;
  }

  .header-right {
    gap: 4px;
  }

  .action-btn {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }

  .search-results {
    position: fixed;
    top: calc(56px + env(safe-area-inset-top) + 8px);
    left: 12px;
    right: 12px;
    max-height: 60vh;
    overflow-y: auto;
    border-radius: 14px;
  }

  .search-result-item {
    padding: 14px 16px;
  }

  .result-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }

  .result-name {
    font-size: 15px;
  }

  .result-desc {
    font-size: 13px;
  }

  .search-empty {
    padding: 40px 20px;
  }
}

/* iPhone mini (375px) */
@media (max-width: 375px) {
  .header-content {
    gap: 6px;
  }

  .menu-btn,
  .action-btn {
    width: 40px;
    height: 40px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .search-input {
    height: 40px;
    font-size: 15px;
  }
}

/* iPhone Pro Max / Plus (428-430px) */
@media (min-width: 428px) and (max-width: 430px) {
  .header-content {
    gap: 12px;
  }

  .search-input {
    height: 46px;
  }
}

/* 横屏模式 */
@media (max-width: 844px) and (orientation: landscape) {
  .header-container {
    height: calc(48px + env(safe-area-inset-top));
  }

  .header-content {
    height: 48px;
  }

  .menu-btn,
  .action-btn,
  .logo-icon {
    width: 36px;
    height: 36px;
  }

  .search-input {
    height: 38px;
  }

  .search-results {
    top: calc(48px + env(safe-area-inset-top) + 8px);
    max-height: 50vh;
  }
}
</style>
