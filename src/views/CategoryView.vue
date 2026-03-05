<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { categories, getToolsByCategory } from '@/config/tools'
import ToolCard from '@/components/common/ToolCard.vue'

const route = useRoute()
const { t } = useI18n()

const categoryId = computed(() => route.params.id as string)
const category = computed(() => categories.find(c => c.id === categoryId.value))
const tools = computed(() => getToolsByCategory(categoryId.value))
</script>

<template>
  <div class="category-container">
    <!-- Page Header -->
    <div v-if="category" class="page-header">
      <div class="header-inner">
        <div class="header-left">
          <div class="header-icon">
            <el-icon size="22"><component :is="category.icon" /></el-icon>
          </div>
          <div class="header-info">
            <h1 class="header-title">{{ t('category.' + categoryId) }}</h1>
            <div class="header-meta">
              <span class="tool-count-badge">
                {{ t('home.toolCount', { count: tools.length }) }}
              </span>
            </div>
          </div>
        </div>

        <router-link to="/" class="back-link">
          <el-icon><ArrowLeft /></el-icon>
          {{ t('nav.home') }}
        </router-link>
      </div>
    </div>

    <!-- Tools Grid -->
    <div v-if="tools.length > 0" class="tools-grid">
      <ToolCard
        v-for="tool in tools"
        :key="tool.id"
        :tool="tool"
      />
    </div>

    <!-- Empty State -->
    <div v-if="tools.length === 0" class="empty-state">
      <div class="empty-icon-wrap">
        <el-icon size="32"><FolderOpened /></el-icon>
      </div>
      <p class="empty-title">{{ t('common.noData') }}</p>
    </div>
  </div>
</template>

<style scoped>
.category-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ---- Header ---- */
.page-header {
  border-radius: 12px;
  background: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.dark .page-header {
  background: #111113;
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.06);
  border: 0.5px solid rgba(99, 102, 241, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  flex-shrink: 0;
}

.dark .header-icon {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.04em;
  line-height: 1.2;
  color: #111827;
}

.dark .header-title {
  color: #f7f8f8;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-count-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.06);
  border: 0.5px solid rgba(99, 102, 241, 0.15);
  color: #6366f1;
}

.dark .tool-count-badge {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

/* Back link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  flex-shrink: 0;
  background: transparent;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.back-link:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.1);
  color: #111827;
}

.dark .back-link {
  color: #9ca3af;
  border-color: rgba(255, 255, 255, 0.08);
}

.dark .back-link:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f7f8f8;
}

/* ---- Tools Grid ---- */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* ---- Empty State ---- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  gap: 16px;
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: rgba(99, 102, 241, 0.06);
  border: 0.5px solid rgba(99, 102, 241, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
}

.dark .empty-icon-wrap {
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.empty-title {
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
}

.dark .empty-title {
  color: #9ca3af;
}

/* ---- Mobile ---- */
@media (max-width: 768px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }

  .back-link {
    align-self: flex-start;
  }

  .tools-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .page-header {
    margin-bottom: 20px;
  }
}

@media (max-width: 430px) {
  .header-inner {
    padding: 16px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .header-title {
    font-size: 22px;
  }

  .tools-grid {
    gap: 10px;
  }
}
</style>
