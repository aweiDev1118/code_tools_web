<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface ChangelogEntry {
  version: string
  date: string
  type: 'major' | 'minor' | 'patch'
  changes: readonly {
    category: 'feat' | 'fix' | 'perf' | 'refactor' | 'docs'
    items: readonly string[]
  }[]
}

const changelog: readonly ChangelogEntry[] = [
  {
    version: '2.0.0',
    date: '2026-03-07',
    type: 'major',
    changes: [
      {
        category: 'feat',
        items: [
          t('changelog.entries.v200.feat1'),
          t('changelog.entries.v200.feat2'),
          t('changelog.entries.v200.feat3'),
          t('changelog.entries.v200.feat4'),
          t('changelog.entries.v200.feat5'),
          t('changelog.entries.v200.feat6'),
          t('changelog.entries.v200.feat7'),
          t('changelog.entries.v200.feat8'),
          t('changelog.entries.v200.feat9'),
          t('changelog.entries.v200.feat10'),
        ],
      },
      {
        category: 'perf',
        items: [
          t('changelog.entries.v200.perf1'),
        ],
      },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-03-06',
    type: 'minor',
    changes: [
      {
        category: 'feat',
        items: [
          t('changelog.entries.v110.feat1'),
          t('changelog.entries.v110.feat2'),
          t('changelog.entries.v110.feat3'),
          t('changelog.entries.v110.feat4'),
          t('changelog.entries.v110.feat5'),
        ],
      },
      {
        category: 'refactor',
        items: [
          t('changelog.entries.v110.refactor1'),
        ],
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-01',
    type: 'major',
    changes: [
      {
        category: 'feat',
        items: [
          t('changelog.entries.v100.feat1'),
          t('changelog.entries.v100.feat2'),
          t('changelog.entries.v100.feat3'),
          t('changelog.entries.v100.feat4'),
          t('changelog.entries.v100.feat5'),
          t('changelog.entries.v100.feat6'),
          t('changelog.entries.v100.feat7'),
        ],
      },
    ],
  },
]

const totalChanges = computed(() =>
  changelog.reduce((sum, entry) =>
    sum + entry.changes.reduce((s, c) => s + c.items.length, 0), 0)
)

const categoryConfig: Record<string, { color: string; darkColor: string }> = {
  feat: { color: '#10b981', darkColor: '#34d399' },
  fix: { color: '#f59e0b', darkColor: '#fbbf24' },
  perf: { color: '#6366f1', darkColor: '#a5b4fc' },
  refactor: { color: '#8b5cf6', darkColor: '#c4b5fd' },
  docs: { color: '#64748b', darkColor: '#94a3b8' },
}

const versionTypeConfig: Record<string, { bg: string; border: string; text: string }> = {
  major: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  minor: { bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.2)', text: '#6366f1' },
  patch: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
}
</script>

<template>
  <div class="changelog-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-inner">
        <div class="header-left">
          <div class="header-icon">
            <el-icon size="22"><List /></el-icon>
          </div>
          <div class="header-info">
            <h1 class="header-title">{{ t('changelog.title') }}</h1>
            <p class="header-subtitle">
              {{ t('changelog.subtitle', { count: totalChanges }) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline">
      <div
        v-for="(entry, index) in changelog"
        :key="entry.version"
        class="timeline-entry"
      >
        <!-- Timeline connector -->
        <div class="timeline-track">
          <div class="timeline-dot" :class="entry.type" />
          <div v-if="index < changelog.length - 1" class="timeline-line" />
        </div>

        <!-- Entry content -->
        <div class="entry-content">
          <div class="entry-header">
            <div class="entry-meta">
              <span
                class="version-badge"
                :style="{
                  background: versionTypeConfig[entry.type].bg,
                  borderColor: versionTypeConfig[entry.type].border,
                  color: versionTypeConfig[entry.type].text,
                }"
              >
                v{{ entry.version }}
              </span>
              <span class="entry-date">
                <el-icon size="12"><Calendar /></el-icon>
                {{ entry.date }}
              </span>
            </div>
          </div>

          <div class="change-groups">
            <div
              v-for="group in entry.changes"
              :key="group.category"
              class="change-group"
            >
              <span
                class="category-tag"
                :style="{
                  color: categoryConfig[group.category].color,
                  background: categoryConfig[group.category].color + '12',
                  borderColor: categoryConfig[group.category].color + '30',
                }"
              >
                {{ t(`changelog.category.${group.category}`) }}
              </span>

              <ul class="change-list">
                <li
                  v-for="(item, i) in group.items"
                  :key="i"
                  class="change-item"
                >
                  <span class="change-dot" :style="{ background: categoryConfig[group.category].color }" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.changelog-container {
  max-width: 900px;
  margin: 0 auto;
}

/* ---- Header ---- */
.page-header {
  border-radius: 12px;
  background: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 36px;
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

/* ---- Timeline ---- */
.timeline {
  position: relative;
  padding-left: 0;
}

.timeline-entry {
  display: flex;
  gap: 24px;
  position: relative;
}

.timeline-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 20px;
  padding-top: 6px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2.5px solid;
  z-index: 1;
  background: #ffffff;
}

.dark .timeline-dot {
  background: #0a0b0d;
}

.timeline-dot.major {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.timeline-dot.minor {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.timeline-dot.patch {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.timeline-line {
  width: 1.5px;
  flex: 1;
  background: rgba(0, 0, 0, 0.08);
  margin-top: 8px;
  border-radius: 1px;
}

.dark .timeline-line {
  background: rgba(255, 255, 255, 0.08);
}

/* ---- Entry content ---- */
.entry-content {
  flex: 1;
  padding-bottom: 40px;
}

.entry-header {
  margin-bottom: 16px;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.version-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 650;
  font-family: ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.02em;
  border: 0.5px solid;
}

.entry-date {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #9ca3af;
  font-weight: 450;
}

.dark .entry-date {
  color: rgba(255, 255, 255, 0.35);
}

/* ---- Change groups ---- */
.change-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.change-group {
  background: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 16px 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.dark .change-group {
  background: #111113;
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.category-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 0.5px solid;
  margin-bottom: 10px;
}

.change-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.change-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.dark .change-item {
  color: #d1d5db;
}

.change-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 8px;
  opacity: 0.6;
}

/* ---- Mobile ---- */
@media (max-width: 768px) {
  .header-inner {
    padding: 20px;
  }

  .timeline-entry {
    gap: 16px;
  }

  .entry-content {
    padding-bottom: 28px;
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

  .timeline-entry {
    gap: 12px;
  }

  .timeline-track {
    width: 16px;
  }

  .timeline-dot {
    width: 10px;
    height: 10px;
  }

  .change-group {
    padding: 12px 14px;
  }

  .entry-meta {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
