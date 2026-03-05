<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Tool } from '@/config/tools'
import { useFavorites } from '@/composables/useFavorites'

defineProps<{
  tool: Tool
}>()

const { t } = useI18n()
const { isFavorite, toggleFavorite } = useFavorites()
</script>

<template>
  <router-link :to="`/tool/${tool.id}`" class="tool-card-link">
    <div class="tool-card">
      <div class="card-content">
        <!-- Icon with gradient background -->
        <div class="card-icon">
          <el-icon size="20"><component :is="tool.icon" /></el-icon>
        </div>

        <!-- Title & Description -->
        <div class="card-info">
          <h3 class="card-title">{{ t('tool.' + tool.id + '.name') }}</h3>
          <p class="card-desc">{{ t('tool.' + tool.id + '.desc') }}</p>
        </div>

        <!-- Favorite star -->
        <div
          class="card-favorite"
          :class="{ 'is-favorite': isFavorite(tool.id) }"
          @click.prevent.stop="toggleFavorite(tool.id)"
        >
          <el-icon size="14">
            <StarFilled v-if="isFavorite(tool.id)" />
            <Star v-else />
          </el-icon>
        </div>

        <!-- Chevron arrow -->
        <div class="card-arrow">
          <el-icon size="14"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
/* ---- Card link wrapper ---- */
.tool-card-link {
  text-decoration: none;
  display: block;
}

/* ---- Card base ---- */
.tool-card {
  position: relative;
  padding: 18px;
  border-radius: 12px;
  background: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.1);
}

/* ---- Dark mode card ---- */
.dark .tool-card {
  background: #111113;
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

.dark .tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ---- Content layout ---- */
.card-content {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

/* ---- Icon: 40x40, gradient bg, white icon ---- */
.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.2);
  transition: box-shadow 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tool-card:hover .card-icon {
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  transform: scale(1.02);
}

.dark .card-icon {
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
}

.dark .tool-card:hover .card-icon {
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.5);
}

/* ---- Text info ---- */
.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.dark .card-title {
  color: #f1f5f9;
}

.card-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.45;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.dark .card-desc {
  color: #94a3b8;
}

/* ---- Favorite: simple color toggle ---- */
.card-favorite {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.16s ease, background 0.16s ease, transform 0.16s ease;
  flex-shrink: 0;
  z-index: 1;
}

.card-favorite:hover {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  transform: scale(1.1);
}

.card-favorite.is-favorite {
  color: #f59e0b;
}

.dark .card-favorite {
  color: #475569;
}

.dark .card-favorite:hover {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.12);
}

.dark .card-favorite.is-favorite {
  color: #fbbf24;
}

/* ---- Arrow: slides in from left on hover ---- */
.card-arrow {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.16s ease;
  flex-shrink: 0;
}

.tool-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
  color: #6366f1;
}

.dark .card-arrow {
  color: #64748b;
}

.dark .tool-card:hover .card-arrow {
  color: #818cf8;
}

/* ========================================
   Mobile responsive (iPhone 12-17)
   ======================================== */

@media (max-width: 430px) {
  .tool-card {
    padding: 12px;
    border-radius: 12px;
    min-height: 68px;
  }

  .tool-card:hover {
    transform: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .tool-card:active {
    background: #f8faff;
    transform: scale(0.99);
  }

  .dark .tool-card:active {
    background: #131829;
  }

  .card-content {
    gap: 10px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .tool-card:hover .card-icon {
    transform: none;
  }

  .card-title {
    font-size: 14px;
    margin-bottom: 2px;
  }

  .card-desc {
    font-size: 12px;
  }

  .card-arrow {
    display: none;
  }

  .card-favorite {
    width: 26px;
    height: 26px;
  }
}

/* iPhone mini (375px) */
@media (max-width: 375px) {
  .tool-card {
    padding: 10px;
    min-height: 60px;
  }

  .card-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .card-title {
    font-size: 13px;
  }

  .card-desc {
    font-size: 11px;
  }
}

/* iPhone Pro Max / Plus (428-430px) */
@media (min-width: 428px) and (max-width: 430px) {
  .tool-card {
    padding: 14px;
    min-height: 72px;
  }

  .card-title {
    font-size: 15px;
  }

  .card-desc {
    font-size: 13px;
  }
}

/* Landscape */
@media (max-width: 844px) and (orientation: landscape) {
  .tool-card {
    padding: 10px 12px;
    min-height: 52px;
  }

  .card-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .card-title {
    font-size: 13px;
    margin-bottom: 1px;
  }

  .card-desc {
    font-size: 11px;
  }
}
</style>
