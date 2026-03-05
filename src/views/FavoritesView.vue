<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ToolCard from '@/components/common/ToolCard.vue'
import { useFavorites } from '@/composables/useFavorites'

const { t } = useI18n()
const { favoriteTools, favoriteCount } = useFavorites()
</script>

<template>
  <div class="fav-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-inner">
        <div class="header-left">
          <div class="header-icon">
            <el-icon size="22"><Star /></el-icon>
          </div>
          <div class="header-info">
            <h1 class="header-title">{{ t('favorites.title') }}</h1>
            <p class="header-subtitle">
              <span class="count-accent">{{ favoriteCount }}</span>
              {{ t('favorites.subtitle', { count: '' }).trim() }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tool grid -->
    <div v-if="favoriteTools.length" class="tools-grid">
      <ToolCard v-for="tool in favoriteTools" :key="tool.id" :tool="tool" />
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <div class="empty-icon-wrap">
        <el-icon size="32"><Star /></el-icon>
      </div>
      <h3 class="empty-title">{{ t('favorites.empty') }}</h3>
      <p class="empty-hint">{{ t('favorites.emptyHint') }}</p>
      <router-link to="/" class="empty-cta">
        {{ t('favorites.goExplore') }}
        <el-icon><ArrowRight /></el-icon>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.fav-container {
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
  background: rgba(245, 158, 11, 0.08);
  border: 0.5px solid rgba(245, 158, 11, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  flex-shrink: 0;
}

.dark .header-icon {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
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

.header-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dark .header-subtitle {
  color: #9ca3af;
}

.count-accent {
  font-size: 14px;
  font-weight: 600;
  color: #f59e0b;
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
  text-align: center;
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: rgba(245, 158, 11, 0.06);
  border: 0.5px solid rgba(245, 158, 11, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  margin-bottom: 4px;
}

.dark .empty-icon-wrap {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.2);
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  letter-spacing: -0.02em;
}

.dark .empty-title {
  color: #f7f8f8;
}

.empty-hint {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  max-width: 300px;
  line-height: 1.6;
}

.dark .empty-hint {
  color: #9ca3af;
}

.empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #6366f1;
  text-decoration: none;
  background: rgba(99, 102, 241, 0.06);
  border: 0.5px solid rgba(99, 102, 241, 0.2);
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-top: 4px;
}

.empty-cta:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.3);
}

.dark .empty-cta {
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.2);
}

.dark .empty-cta:hover {
  background: rgba(99, 102, 241, 0.14);
}

/* ---- Mobile ---- */
@media (max-width: 768px) {
  .header-inner {
    padding: 20px;
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
