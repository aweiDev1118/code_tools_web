<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { searchTools } from '@/config/tools'
import { localeOptions, setLocale, type LocaleKey } from '@/i18n'

type ThemeMode = 'light' | 'dark' | 'system'

const props = defineProps<{
  isDark: boolean
  themeMode: ThemeMode
}>()

const emit = defineEmits<{
  changeTheme: [mode: ThemeMode]
  toggleSidebar: []
}>()

const { t } = useI18n()

// Theme dropdown
const showThemeMenu = ref(false)

const themeOptions: { value: ThemeMode; labelKey: string; icon: string }[] = [
  { value: 'light', labelKey: 'theme.light', icon: 'Sunny' },
  { value: 'dark', labelKey: 'theme.dark', icon: 'Moon' },
  { value: 'system', labelKey: 'theme.system', icon: 'Monitor' },
]

const currentThemeIcon = () => {
  if (props.themeMode === 'system') return 'Monitor'
  return props.isDark ? 'Moon' : 'Sunny'
}

const selectTheme = (mode: ThemeMode) => {
  emit('changeTheme', mode)
  showThemeMenu.value = false
}

// Locale dropdown
const showLocaleMenu = ref(false)

const currentLocaleOption = () => {
  const saved = (localStorage.getItem('locale') as LocaleKey) || 'zh-CN'
  return localeOptions.find((o) => o.value === saved) ?? localeOptions[0]
}

const selectLocale = (locale: LocaleKey) => {
  setLocale(locale)
  showLocaleMenu.value = false
}

// Click-outside to close dropdowns
const themeDropdownRef = ref<HTMLElement | null>(null)
const localeDropdownRef = ref<HTMLElement | null>(null)

const handleDocumentClick = (e: MouseEvent) => {
  const target = e.target as Node
  if (showThemeMenu.value && themeDropdownRef.value && !themeDropdownRef.value.contains(target)) {
    showThemeMenu.value = false
  }
  if (showLocaleMenu.value && localeDropdownRef.value && !localeDropdownRef.value.contains(target)) {
    showLocaleMenu.value = false
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    showThemeMenu.value = false
    showLocaleMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick, true)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick, true)
  document.removeEventListener('keydown', handleEscape)
})

// Search
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
          <el-icon size="18"><Fold /></el-icon>
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
            :placeholder="t('common.search')"
            class="search-input"
            @input="handleSearch"
            @blur="hideResults"
          />
          <kbd class="search-kbd">⌘K</kbd>
        </div>

        <!-- Search Results Dropdown -->
        <transition name="search-drop">
          <div v-if="showResults && searchResults.length > 0" class="search-results">
            <div class="search-results-inner">
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
                <el-icon class="result-arrow" size="14"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </transition>

        <transition name="search-drop">
          <div
            v-if="showResults && searchKeyword && searchResults.length === 0"
            class="search-results search-empty"
          >
            <el-icon size="28" class="empty-icon"><Search /></el-icon>
            <p>{{ t('common.searchEmpty') }}</p>
          </div>
        </transition>
      </div>

      <!-- Actions -->
      <div class="header-right">
        <!-- Locale Dropdown -->
        <div ref="localeDropdownRef" class="dropdown-wrapper">
          <button class="action-btn dropdown-trigger" @click="showLocaleMenu = !showLocaleMenu; showThemeMenu = false">
            <span class="flag-emoji">{{ currentLocaleOption().flag }}</span>
            <el-icon size="11" class="chevron" :class="{ open: showLocaleMenu }">
              <ArrowRight />
            </el-icon>
          </button>
          <transition name="dropdown">
            <div v-if="showLocaleMenu" class="dropdown-menu">
              <div class="dropdown-inner">
                <button
                  v-for="option in localeOptions"
                  :key="option.value"
                  class="dropdown-option"
                  :class="{ active: currentLocaleOption().value === option.value }"
                  @mousedown.prevent="selectLocale(option.value)"
                >
                  <span v-if="currentLocaleOption().value === option.value" class="active-bar" />
                  <span class="flag-emoji">{{ option.flag }}</span>
                  <span class="option-label">{{ option.label }}</span>
                  <el-icon v-if="currentLocaleOption().value === option.value" size="13" class="check-icon">
                    <CircleCheck />
                  </el-icon>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Theme Dropdown -->
        <div ref="themeDropdownRef" class="dropdown-wrapper">
          <button class="action-btn dropdown-trigger" @click="showThemeMenu = !showThemeMenu; showLocaleMenu = false">
            <el-icon size="17">
              <component :is="currentThemeIcon()" />
            </el-icon>
            <el-icon size="11" class="chevron" :class="{ open: showThemeMenu }">
              <ArrowRight />
            </el-icon>
          </button>
          <transition name="dropdown">
            <div v-if="showThemeMenu" class="dropdown-menu">
              <div class="dropdown-inner">
                <button
                  v-for="option in themeOptions"
                  :key="option.value"
                  class="dropdown-option"
                  :class="{ active: themeMode === option.value }"
                  @mousedown.prevent="selectTheme(option.value)"
                >
                  <span v-if="themeMode === option.value" class="active-bar" />
                  <el-icon size="15"><component :is="option.icon" /></el-icon>
                  <span class="option-label">{{ t(option.labelKey) }}</span>
                  <el-icon v-if="themeMode === option.value" size="13" class="check-icon">
                    <CircleCheck />
                  </el-icon>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- GitHub Link -->
        <a
          href="https://github.com/aweiDev1118/code_tools_web"
          target="_blank"
          class="action-btn github-btn"
          title="GitHub"
        >
          <el-icon size="18"><Link /></el-icon>
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ========================================
   Header Container — Subtle Glass
   ======================================== */
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 100;
  background: rgba(250, 250, 250, 0.8);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.06);
}

.dark .header-container {
  background: rgba(10, 11, 13, 0.85);
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

/* ========================================
   Left: Logo
   ======================================== */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.menu-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.menu-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.06);
  color: #111827;
}

.dark .menu-btn {
  border-color: rgba(255, 255, 255, 0.08);
  color: #8a8f98;
}

.dark .menu-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
  color: #f7f8f8;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.logo:hover {
  transform: scale(1.03);
}

.logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  box-sizing: border-box;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-size: 15.5px;
  font-weight: 700;
  letter-spacing: -0.02em;
  -webkit-font-smoothing: antialiased;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .logo-text {
  background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* ========================================
   Center: Search
   ======================================== */
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
  left: 12px;
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1;
}

.search-input {
  width: 100%;
  height: 38px;
  padding: 0 76px 0 38px;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  border-radius: 100px;
  background: rgba(0, 0, 0, 0.03);
  font-size: 13.5px;
  color: #111827;
  outline: none;
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  -webkit-font-smoothing: antialiased;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  border-color: rgba(99, 102, 241, 0.4);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
}

.dark .search-input {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  color: #f7f8f8;
}

.dark .search-input::placeholder {
  color: #4b5563;
}

.dark .search-input:focus {
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.search-kbd {
  position: absolute;
  right: 10px;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.8);
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  font-size: 10.5px;
  color: #94a3b8;
  font-family: inherit;
  line-height: 1.7;
  letter-spacing: 0.02em;
  pointer-events: none;
}

.dark .search-kbd {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  color: #4b5563;
}

/* Search Results */
.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border-radius: 12px;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    0 0 0 0.5px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  z-index: 50;
}

.dark .search-results {
  background: rgba(18, 18, 20, 0.95);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 0 0 0.5px rgba(255, 255, 255, 0.06);
}

.search-results-inner {
  padding: 6px;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.search-result-item:hover {
  background: rgba(99, 102, 241, 0.06);
}

.dark .search-result-item:hover {
  background: rgba(99, 102, 241, 0.1);
}

.result-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.08);
  border: 0.5px solid rgba(99, 102, 241, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  flex-shrink: 0;
}

.dark .result-icon {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.2);
  color: #818cf8;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 13.5px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 1px;
  -webkit-font-smoothing: antialiased;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .result-name {
  color: #f7f8f8;
}

.result-desc {
  font-size: 11.5px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .result-desc {
  color: #6b7280;
}

.result-arrow {
  color: #cbd5e1;
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.search-result-item:hover .result-arrow {
  opacity: 1;
  transform: translateX(0);
  color: #6366f1;
}

.dark .search-result-item:hover .result-arrow {
  color: #818cf8;
}

.search-empty {
  padding: 32px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.dark .empty-icon {
  color: #374151;
}

/* ========================================
   Right: Actions
   ======================================== */
.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.action-btn {
  height: 36px;
  border-radius: 8px;
  border: 0.5px solid transparent;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-decoration: none;
  padding: 0 10px;
  gap: 4px;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.06);
  color: #111827;
}

.dark .action-btn {
  color: #8a8f98;
}

.dark .action-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
  color: #f7f8f8;
}

.github-btn:hover {
  color: #6366f1;
}

.dark .github-btn:hover {
  color: #818cf8;
}

/* ========================================
   Dropdowns (shared: theme + locale)
   ======================================== */
.dropdown-wrapper {
  position: relative;
  outline: none;
}

.dropdown-trigger {
  min-width: 36px;
}

.flag-emoji {
  font-size: 15px;
  line-height: 1;
}

.chevron {
  transition: transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: rotate(90deg);
  color: #9ca3af;
}

.chevron.open {
  transform: rotate(-90deg);
  color: #6366f1;
}

.dark .chevron.open {
  color: #818cf8;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border-radius: 12px;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    0 0 0 0.5px rgba(0, 0, 0, 0.06);
  z-index: 200;
  overflow: hidden;
}

.dark .dropdown-menu {
  background: rgba(18, 18, 20, 0.95);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 0 0 0.5px rgba(255, 255, 255, 0.06);
}

.dropdown-inner {
  padding: 6px;
}

.dropdown-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

.dropdown-option:hover {
  background: rgba(99, 102, 241, 0.06);
  color: #111827;
}

.dropdown-option.active {
  color: #6366f1;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.06);
}

.dark .dropdown-option {
  color: #9ca3af;
}

.dark .dropdown-option:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #f7f8f8;
}

.dark .dropdown-option.active {
  color: #818cf8;
  background: rgba(99, 102, 241, 0.1);
}

/* Solid left accent border for active item */
.active-bar {
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 2px;
  border-radius: 1px;
  background: #6366f1;
}

.option-label {
  flex: 1;
  text-align: left;
}

.check-icon {
  margin-left: auto;
  color: #6366f1;
  flex-shrink: 0;
}

.dark .check-icon {
  color: #818cf8;
}

/* ========================================
   Transitions
   ======================================== */
.search-drop-enter-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.search-drop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.search-drop-enter-from,
.search-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.dropdown-enter-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
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
    width: 30px;
    height: 30px;
    border-radius: 7px;
  }

  .menu-btn {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

  .header-center {
    flex: 1;
    max-width: none;
  }

  .search-wrapper {
    width: 100%;
  }

  .search-input {
    height: 40px;
    padding: 0 12px 0 36px;
    font-size: 16px; /* 防止 iOS 自动缩放 */
    border-radius: 8px;
  }

  .search-icon {
    left: 10px;
  }

  .search-kbd {
    display: none;
  }

  .header-right {
    gap: 4px;
  }

  .action-btn {
    height: 40px;
    border-radius: 8px;
    padding: 0 8px;
  }

  .search-results {
    position: fixed;
    top: calc(56px + env(safe-area-inset-top) + 8px);
    left: 12px;
    right: 12px;
    max-height: 60vh;
    overflow-y: auto;
    border-radius: 12px;
  }

  .search-result-item {
    padding: 10px 10px;
  }

  .result-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .result-name {
    font-size: 13.5px;
  }

  .result-desc {
    font-size: 11.5px;
  }

  .search-empty {
    padding: 32px 20px;
  }
}

/* iPhone mini (375px) */
@media (max-width: 375px) {
  .header-content {
    gap: 6px;
  }

  .menu-btn,
  .action-btn {
    height: 38px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .search-input {
    height: 38px;
    font-size: 15px;
  }
}

/* iPhone Pro Max / Plus (428-430px) */
@media (min-width: 428px) and (max-width: 430px) {
  .header-content {
    gap: 12px;
  }

  .search-input {
    height: 42px;
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
  .action-btn {
    height: 34px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
  }

  .search-input {
    height: 36px;
  }

  .search-results {
    top: calc(48px + env(safe-area-inset-top) + 8px);
    max-height: 50vh;
  }
}
</style>
