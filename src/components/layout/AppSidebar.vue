<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { categories, getToolsByCategory } from '@/config/tools'

const props = defineProps<{
  collapsed: boolean
  isMobile?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const expandedCategories = ref<Record<string, boolean>>(
  Object.fromEntries(categories.map(c => [c.id, false]))
)

const toggleCategory = (categoryId: string) => {
  expandedCategories.value = {
    ...expandedCategories.value,
    [categoryId]: !expandedCategories.value[categoryId],
  }
}

const isCategoryExpanded = (categoryId: string) => expandedCategories.value[categoryId]

const goToTool = (toolId: string) => {
  router.push(`/tool/${toolId}`)
  if (props.isMobile) emit('close')
}

const goHome = () => {
  router.push('/')
  if (props.isMobile) emit('close')
}

const goTo = (path: string) => {
  router.push(path)
  if (props.isMobile) emit('close')
}

const isToolActive = (toolId: string) => route.path === `/tool/${toolId}`

const isCategoryActive = (categoryId: string) =>
  route.path.startsWith('/tool/') &&
  getToolsByCategory(categoryId).some(t => route.path === `/tool/${t.id}`)
</script>

<template>
  <aside class="sidebar" :class="{ collapsed, mobile: isMobile, 'mobile-visible': isMobile && !collapsed }">
    <div class="sidebar-content">
      <!-- Top nav items -->
      <nav class="nav-section">
        <div
          class="nav-item"
          :class="{ active: route.path === '/' }"
          @click="goHome"
        >
          <span class="nav-icon-wrap">
            <el-icon size="15"><HomeFilled /></el-icon>
          </span>
          <span v-if="!collapsed || isMobile" class="nav-label">{{ t('nav.home') }}</span>
          <span v-if="(!collapsed || isMobile) && route.path === '/'" class="active-pip"></span>
        </div>

        <div
          class="nav-item"
          :class="{ active: route.path === '/favorites' }"
          @click="goTo('/favorites')"
        >
          <span class="nav-icon-wrap">
            <el-icon size="15"><StarFilled /></el-icon>
          </span>
          <span v-if="!collapsed || isMobile" class="nav-label">{{ t('nav.favorites') }}</span>
          <span v-if="(!collapsed || isMobile) && route.path === '/favorites'" class="active-pip"></span>
        </div>

        <div
          class="nav-item"
          :class="{ active: route.path === '/history' }"
          @click="goTo('/history')"
        >
          <span class="nav-icon-wrap">
            <el-icon size="15"><Clock /></el-icon>
          </span>
          <span v-if="!collapsed || isMobile" class="nav-label">{{ t('nav.history') }}</span>
          <span v-if="(!collapsed || isMobile) && route.path === '/history'" class="active-pip"></span>
        </div>
      </nav>

      <!-- Divider with categories label -->
      <div v-if="!collapsed || isMobile" class="section-label">
        {{ t('nav.categories') }}
      </div>
      <div v-else class="section-divider"></div>

      <!-- Category groups -->
      <nav class="nav-section categories-nav">
        <div
          v-for="category in categories"
          :key="category.id"
          class="nav-group"
        >
          <div
            class="nav-item nav-group-header"
            :class="{ active: isCategoryActive(category.id), expanded: isCategoryExpanded(category.id) }"
            @click="toggleCategory(category.id)"
          >
            <span class="nav-icon-wrap">
              <el-icon size="15"><component :is="category.icon" /></el-icon>
            </span>
            <span v-if="!collapsed || isMobile" class="nav-label">{{ t(`category.${category.id}`) }}</span>
            <el-icon v-if="!collapsed || isMobile" class="chevron-icon" size="11">
              <ArrowDown />
            </el-icon>
          </div>

          <Transition name="collapse">
            <div
              v-if="(!collapsed || isMobile) && isCategoryExpanded(category.id)"
              class="nav-sub-list"
              @click.stop
            >
              <div
                v-for="tool in getToolsByCategory(category.id)"
                :key="tool.id"
                class="nav-sub-item"
                :class="{ active: isToolActive(tool.id) }"
                @click="goToTool(tool.id)"
              >
                <span class="sub-dot"></span>
                <span class="nav-label">{{ t(`tool.${tool.id}.name`) }}</span>
              </div>
            </div>
          </Transition>
        </div>
      </nav>
    </div>

    <!-- Footer -->
    <div v-if="!collapsed || isMobile" class="sidebar-footer">
      <span class="version-badge">
        <el-icon size="11"><InfoFilled /></el-icon>
        {{ t('common.version') }} 0.1.0
      </span>
    </div>
  </aside>
</template>

<style scoped>
/* ── Base ── */
.sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 240px;
  background: #ffffff;
  border-right: 0.5px solid rgba(0, 0, 0, 0.06);
  box-shadow: none;
  z-index: 90;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar.collapsed {
  width: 72px;
}

.dark .sidebar {
  background: #0a0b0d;
  border-right-color: rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

/* ── Content scroll area ── */
.sidebar-content {
  flex: 1;
  padding: 10px 8px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.2s ease;
}

.sidebar-content:hover {
  scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
}

.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 99px;
  transition: background 0.2s ease;
}

.sidebar-content:hover::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

/* ── Section label ── */
.section-label {
  padding: 12px 10px 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9ca3af;
}

.dark .section-label {
  color: rgba(255, 255, 255, 0.3);
}

.section-divider {
  height: 0.5px;
  background: rgba(0, 0, 0, 0.06);
  margin: 10px 6px;
}

.dark .section-divider {
  background: rgba(255, 255, 255, 0.06);
}

/* ── Nav section ── */
.nav-section {
  margin-bottom: 2px;
}

.categories-nav {
  margin-top: 2px;
}

/* ── Nav item (shared base) ── */
.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 1px;
  position: relative;
  user-select: none;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 2px;
  border-radius: 1px;
  background: #6366f1;
  opacity: 0;
  transform: scaleY(1);
  transition: opacity 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nav-item:hover {
  background: rgba(99, 102, 241, 0.06);
  color: #374151;
}

.nav-item.active {
  background: rgba(99, 102, 241, 0.04);
  color: #4f46e5;
  font-weight: 500;
}

.nav-item.active::before {
  opacity: 1;
}

.dark .nav-item {
  color: rgba(148, 163, 184, 0.75);
}

.dark .nav-item:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #e2e8f0;
}

.dark .nav-item.active {
  background: rgba(99, 102, 241, 0.08);
  color: #a5b4fc;
}

/* ── Active pip indicator (top-right) ── */
.active-pip {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #6366f1;
  margin-left: auto;
  flex-shrink: 0;
}

/* ── Icon wrap ── */
.nav-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 6px;
  background: transparent;
  transition:
    background 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: inherit;
}

.nav-item:hover .nav-icon-wrap {
  background: rgba(99, 102, 241, 0.06);
  color: #6366f1;
}

.nav-item.active .nav-icon-wrap {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  box-shadow: none;
}

.dark .nav-icon-wrap {
  background: transparent;
}

.dark .nav-item:hover .nav-icon-wrap {
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
}

.dark .nav-item.active .nav-icon-wrap {
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  box-shadow: none;
}

/* ── Label ── */
.nav-label {
  font-size: 13.5px;
  font-weight: 450;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  letter-spacing: -0.01em;
  transition: color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.nav-item.active .nav-label {
  font-weight: 550;
}

/* ── Category header ── */
.nav-group-header {
  user-select: none;
}

.chevron-icon {
  margin-left: auto;
  flex-shrink: 0;
  color: rgba(156, 163, 175, 0.7);
  transition: transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.16s ease;
}

.nav-group-header.expanded .chevron-icon {
  transform: rotate(180deg);
}

.nav-group-header:hover .chevron-icon {
  color: #6366f1;
}

.dark .nav-group-header:hover .chevron-icon {
  color: #818cf8;
}

/* ── Sub items ── */
.nav-sub-list {
  padding-left: 14px;
  margin: 2px 0 4px;
  border-left: 0.5px solid rgba(0, 0, 0, 0.08);
  margin-left: 22px;
}

.dark .nav-sub-list {
  border-left-color: rgba(255, 255, 255, 0.08);
}

.nav-sub-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: rgba(107, 114, 128, 0.85);
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 1px;
  position: relative;
}

.nav-sub-item::before {
  content: '';
  position: absolute;
  left: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 1px;
  background: rgba(209, 213, 219, 0.6);
  transition: background 0.16s ease;
}

.nav-sub-item:hover {
  background: rgba(99, 102, 241, 0.06);
  color: #4b5563;
}

.nav-sub-item:hover::before {
  background: rgba(99, 102, 241, 0.4);
}

.nav-sub-item.active {
  background: rgba(99, 102, 241, 0.06);
  color: #4f46e5;
  font-weight: 550;
}

.nav-sub-item.active::before {
  background: #6366f1;
}

.dark .nav-sub-item {
  color: rgba(148, 163, 184, 0.6);
}

.dark .nav-sub-item:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #cbd5e1;
}

.dark .nav-sub-item:hover::before {
  background: rgba(99, 102, 241, 0.5);
}

.dark .nav-sub-item.active {
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
}

.dark .nav-sub-item.active::before {
  background: #818cf8;
}

.sub-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  opacity: 0.4;
  transition: opacity 0.16s ease;
}

.nav-sub-item:hover .sub-dot {
  opacity: 0.6;
}

.nav-sub-item.active .sub-dot {
  opacity: 1;
  background: #6366f1;
}

.dark .nav-sub-item.active .sub-dot {
  background: #818cf8;
}

/* ── Footer ── */
.sidebar-footer {
  padding: 10px 12px 12px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.06);
  background: transparent;
}

.dark .sidebar-footer {
  border-top-color: rgba(255, 255, 255, 0.06);
  background: transparent;
}

.version-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  padding: 5px 10px;
  border-radius: 100px;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  background: transparent;
}

.dark .version-badge {
  color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.06);
  background: transparent;
}

/* ── Collapsed state ── */
.collapsed .nav-item {
  justify-content: center;
  padding: 8px;
}

.collapsed .nav-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 9px;
}

.collapsed .nav-group-items {
  display: none;
}

/* ── Collapse transition ── */
.collapse-enter-active,
.collapse-leave-active {
  transition: opacity 0.2s ease, max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 600px;
}

/* ── Mobile ── */
.sidebar.mobile {
  top: 0;
  width: 85vw;
  max-width: 300px;
  transform: translateX(-100%);
  z-index: 100;
  background: #ffffff;
  padding-top: calc(56px + env(safe-area-inset-top));
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  box-shadow: none;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.mobile.mobile-visible {
  transform: translateX(0);
  box-shadow: 4px 0 32px rgba(0, 0, 0, 0.08), 1px 0 0 rgba(0, 0, 0, 0.04);
}

.dark .sidebar.mobile {
  background: #0a0b0d;
}

@media (max-width: 430px) {
  .sidebar:not(.mobile) {
    display: none;
  }

  .sidebar.mobile .sidebar-content {
    padding: 12px 8px;
  }

  .sidebar.mobile .nav-item {
    padding: 10px 10px;
    min-height: 44px;
  }

  .sidebar.mobile .nav-label {
    font-size: 14px;
  }

  .sidebar.mobile .nav-sub-item {
    padding: 9px 8px;
    min-height: 40px;
    font-size: 13px;
  }

  .sidebar.mobile .sidebar-footer {
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
}

@media (max-width: 375px) {
  .sidebar.mobile {
    width: 280px;
  }

  .sidebar.mobile .nav-item {
    padding: 9px 10px;
    min-height: 42px;
  }
}

@media (min-width: 428px) and (max-width: 430px) {
  .sidebar.mobile {
    max-width: 320px;
  }
}

@media (max-width: 844px) and (orientation: landscape) {
  .sidebar.mobile {
    padding-top: calc(48px + env(safe-area-inset-top));
    width: 260px;
  }

  .sidebar.mobile .nav-item {
    padding: 7px 10px;
    min-height: 36px;
  }

  .sidebar.mobile .nav-label {
    font-size: 13px;
  }

  .sidebar.mobile .nav-sub-item {
    padding: 6px 8px;
    min-height: 32px;
    font-size: 12px;
  }
}
</style>
