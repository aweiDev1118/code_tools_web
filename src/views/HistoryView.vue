<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import { useHistory } from '@/composables/useHistory'
import ToolCard from '@/components/common/ToolCard.vue'

const { t } = useI18n()
const { recentTools, usageStats, totalUsage, clearHistory } = useHistory()

async function handleClearHistory() {
  try {
    await ElMessageBox.confirm(t('history.clearConfirm'), t('history.clearHistory'), {
      type: 'warning',
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
    })
    clearHistory()
  } catch {
    // user cancelled
  }
}
</script>

<template>
  <div class="history-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-inner">
        <div class="header-left">
          <div class="header-icon">
            <el-icon size="22"><Clock /></el-icon>
          </div>
          <div class="header-info">
            <h1 class="header-title">{{ t('history.title') }}</h1>
            <p class="header-subtitle">
              {{ t('history.subtitle', { count: totalUsage }) }}
            </p>
          </div>
        </div>

        <button
          v-if="totalUsage > 0"
          class="clear-btn"
          @click="handleClearHistory"
        >
          <el-icon><Delete /></el-icon>
          {{ t('history.clearHistory') }}
        </button>
      </div>
    </div>

    <template v-if="totalUsage > 0">
      <!-- Recently used section -->
      <div class="section">
        <div class="section-header">
          <div class="section-accent" />
          <h2 class="section-title">{{ t('history.recentlyUsed') }}</h2>
        </div>
        <div class="tools-grid">
          <ToolCard
            v-for="tool in recentTools.slice(0, 9)"
            :key="tool.id"
            :tool="tool"
          />
        </div>
      </div>

      <!-- Usage stats section -->
      <div class="section">
        <div class="section-header">
          <div class="section-accent" />
          <h2 class="section-title">{{ t('history.usageStats') }}</h2>
        </div>

        <div class="stats-card">
          <div
            v-for="(item, index) in usageStats"
            :key="item.tool.id"
            class="stats-row"
          >
            <span class="stats-rank">{{ index + 1 }}</span>

            <div class="stats-icon">
              <el-icon size="16"><component :is="item.tool.icon" /></el-icon>
            </div>

            <span class="stats-name">{{ item.tool.name }}</span>

            <div class="stats-bar-wrap">
              <div
                class="stats-bar-fill"
                :style="{ width: `${(item.count / usageStats[0].count) * 100}%` }"
              />
            </div>

            <span class="stats-count">
              {{ t('history.usageCount', { count: item.count }) }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <div class="empty-icon-wrap">
        <el-icon size="32"><Clock /></el-icon>
      </div>
      <h3 class="empty-title">{{ t('history.empty') }}</h3>
      <p class="empty-hint">{{ t('history.emptyHint') }}</p>
      <router-link to="/" class="empty-cta">
        {{ t('history.goExplore') }}
        <el-icon><ArrowRight /></el-icon>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.history-container {
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
}

.dark .header-subtitle {
  color: #9ca3af;
}

/* Clear button */
.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #ef4444;
  cursor: pointer;
  background: rgba(239, 68, 68, 0.06);
  border: 0.5px solid rgba(239, 68, 68, 0.2);
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  flex-shrink: 0;
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.dark .clear-btn {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
}

.dark .clear-btn:hover {
  background: rgba(239, 68, 68, 0.14);
  border-color: rgba(239, 68, 68, 0.35);
}

/* ---- Section ---- */
.section {
  margin-bottom: 36px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-accent {
  width: 3px;
  height: 16px;
  border-radius: 2px;
  background: #6366f1;
  flex-shrink: 0;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9ca3af;
  margin: 0;
}

.dark .section-title {
  color: rgba(255, 255, 255, 0.3);
}

/* ---- Tools Grid ---- */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* ---- Stats Card ---- */
.stats-card {
  border-radius: 12px;
  background: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.dark .stats-card {
  background: #111113;
  border-color: rgba(255, 255, 255, 0.06);
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.04);
  transition: background 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.stats-row:last-child {
  border-bottom: none;
}

.stats-row:hover {
  background: rgba(99, 102, 241, 0.03);
}

.dark .stats-row {
  border-bottom-color: rgba(255, 255, 255, 0.04);
}

.dark .stats-row:hover {
  background: rgba(99, 102, 241, 0.06);
}

.stats-rank {
  font-size: 11px;
  font-family: ui-monospace, monospace;
  font-weight: 600;
  color: #9ca3af;
  width: 20px;
  text-align: right;
  flex-shrink: 0;
}

.stats-icon {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: rgba(99, 102, 241, 0.06);
  border: 0.5px solid rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  flex-shrink: 0;
}

.dark .stats-icon {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
}

.stats-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .stats-name {
  color: #e5e7eb;
}

.stats-bar-wrap {
  width: 120px;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
  overflow: hidden;
}

.dark .stats-bar-wrap {
  background: rgba(255, 255, 255, 0.06);
}

.stats-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: #6366f1;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .stats-bar-fill {
  background: #818cf8;
}

.stats-count {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  flex-shrink: 0;
  width: 56px;
  text-align: right;
}

.dark .stats-count {
  color: rgba(255, 255, 255, 0.3);
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
  background: rgba(99, 102, 241, 0.06);
  border: 0.5px solid rgba(99, 102, 241, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  margin-bottom: 4px;
}

.dark .empty-icon-wrap {
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
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
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }

  .clear-btn {
    align-self: flex-start;
  }

  .tools-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .stats-bar-wrap {
    width: 80px;
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

  .stats-row {
    padding: 10px 14px;
    gap: 8px;
  }

  .stats-bar-wrap {
    display: none;
  }
}
</style>
