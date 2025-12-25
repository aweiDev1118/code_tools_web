<script setup lang="ts">
import { ref, provide } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'

const isDark = ref(false)
const sidebarCollapsed = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

provide('isDark', isDark)
provide('toggleDark', toggleDark)
</script>

<template>
  <div class="app-container" :class="{ dark: isDark }">
    <AppHeader
      :is-dark="isDark"
      @toggle-dark="toggleDark"
      @toggle-sidebar="toggleSidebar"
    />
    <AppSidebar :collapsed="sidebarCollapsed" />
    <main
      class="main-content"
      :class="{ collapsed: sidebarCollapsed }"
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

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }

  .main-content.collapsed {
    margin-left: 0;
  }
}
</style>
