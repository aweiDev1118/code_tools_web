<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { categories, getToolsByCategory, tools } from '@/config/tools'
import ToolCard from '@/components/common/ToolCard.vue'

const { t } = useI18n()

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.category-block').forEach(el => observer.observe(el))
})
</script>

<template>
  <div class="home-container">
    <!-- ---- Hero Section ---- -->
    <div class="hero-section">
      <!-- Aurora gradient decoration -->
      <div class="hero-bg-mesh" aria-hidden="true" />

      <div class="hero-content">
        <p class="hero-eyebrow">{{ t('home.title') }}</p>

        <!-- Gradient headline -->
        <h1 class="hero-title">
          <span class="hero-title-gradient">DevToolbox</span>
        </h1>

        <p class="hero-subtitle">{{ t('home.subtitle') }}</p>
        <p class="hero-desc">{{ t('home.description') }}</p>

        <!-- Stats pills row -->
        <div class="hero-stats">
          <div class="stat-pill">
            <span class="stat-value">{{ tools.length }}+</span>
            <span class="stat-label">{{ t('home.toolCount', { count: tools.length }) }}</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-pill">
            <span class="stat-value">{{ categories.length }}</span>
            <span class="stat-label">{{ t('home.allCategories') }}</span>
          </div>
        </div>

        <!-- Category pills: horizontal scroll -->
        <div class="category-pills-wrapper">
          <div class="category-pills">
            <router-link
              v-for="cat in categories"
              :key="cat.id"
              :to="`/category/${cat.id}`"
              class="category-pill"
            >
              <el-icon size="13"><component :is="cat.icon" /></el-icon>
              {{ t('category.' + cat.id) }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- ---- Tools by Category ---- -->
    <div class="tools-section">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-block"
      >
        <!-- Section header -->
        <div class="category-header">
          <div class="category-icon">
            <el-icon size="18"><component :is="category.icon" /></el-icon>
          </div>
          <h2 class="category-title">{{ t('category.' + category.id) }}</h2>
          <span class="category-count">
            {{ t('home.toolCount', { count: getToolsByCategory(category.id).length }) }}
          </span>
          <router-link :to="`/category/${category.id}`" class="category-more">
            {{ t('nav.allTools') }}
            <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>

        <!-- Tools grid -->
        <div class="tools-grid">
          <ToolCard
            v-for="tool in getToolsByCategory(category.id).slice(0, 4)"
            :key="tool.id"
            :tool="tool"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ========================================
   Hero Section
   ======================================== */

.hero-section {
  position: relative;
  padding: 80px 48px;
  margin-bottom: 64px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.6);
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.dark .hero-section {
  background: rgba(17, 17, 19, 0.6);
  border-color: rgba(255, 255, 255, 0.04);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Aurora gradient decoration */
.hero-bg-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(ellipse 70% 60% at 50% -10%, rgba(99, 102, 241, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 55%);
}

/* Subtle noise texture overlay */
.hero-bg-mesh::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 128px 128px;
}

.dark .hero-bg-mesh {
  background-image:
    radial-gradient(ellipse 70% 60% at 50% -10%, rgba(99, 102, 241, 0.18) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 80% 20%, rgba(139, 92, 246, 0.14) 0%, transparent 55%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 680px;
}

.hero-eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: #6366f1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 16px 0;
}

.dark .hero-eyebrow {
  color: #818cf8;
}

/* Large gradient headline */
.hero-title {
  font-size: 60px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.0;
  letter-spacing: -0.06em;
}

.hero-title-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  font-weight: 400;
  color: #374151;
  margin: 0 0 10px 0;
  line-height: 1.6;
  letter-spacing: -0.01em;
}

.dark .hero-subtitle {
  color: #cbd5e1;
}

.hero-desc {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 32px 0;
  line-height: 1.7;
}

.dark .hero-desc {
  color: #94a3b8;
}

/* ---- Stats pills ---- */
.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  border-radius: 100px;
  background: transparent;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.dark .hero-stats {
  border-color: rgba(255, 255, 255, 0.08);
}

.stat-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}

.dark .stat-label {
  color: #94a3b8;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1), transparent);
}

.dark .stat-divider {
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
}

/* ---- Category pills: horizontal scroll ---- */
.category-pills-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 0 -4px;
  padding: 0 4px;
}

.category-pills-wrapper::-webkit-scrollbar {
  display: none;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 100px;
  background: transparent;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  white-space: nowrap;
  scroll-snap-align: start;
  transition: all 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.category-pill:hover {
  background: rgba(99, 102, 241, 0.04);
  border-color: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  transform: translateY(-1px);
}

.dark .category-pill {
  border-color: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.dark .category-pill:hover {
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  transform: translateY(-1px);
}

/* ========================================
   Tools Section
   ======================================== */

.tools-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* IntersectionObserver entrance animation */
.category-block {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: rgba(255, 255, 255, 0.85);
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.category-block.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.category-block:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.1);
}

.dark .category-block {
  background: rgba(17, 17, 19, 0.75);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

.dark .category-block:hover {
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ---- Section header ---- */
.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.category-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.06);
  border: 0.5px solid rgba(99, 102, 241, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  flex-shrink: 0;
}

.dark .category-icon {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.category-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  letter-spacing: -0.02em;
}

.dark .category-title {
  color: #f1f5f9;
}

.category-count {
  font-size: 11px;
  font-weight: 600;
  color: #6366f1;
  padding: 3px 9px;
  border-radius: 100px;
  background: rgba(99, 102, 241, 0.06);
  border: 0.5px solid rgba(99, 102, 241, 0.12);
}

.dark .category-count {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.category-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  font-size: 13px;
  font-weight: 500;
  color: #6366f1;
  text-decoration: none;
  transition: gap 0.16s ease, color 0.16s ease;
}

.category-more:hover {
  gap: 8px;
  color: #4f46e5;
}

.dark .category-more {
  color: #818cf8;
}

.dark .category-more:hover {
  color: #a5b4fc;
}

/* ---- Tools grid ---- */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}

/* ========================================
   Mobile
   ======================================== */

@media (max-width: 430px) {
  .hero-section {
    padding: 28px 20px;
    margin-bottom: 20px;
    border-radius: 16px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-stats {
    width: 100%;
    justify-content: space-around;
  }

  .category-pills {
    flex-wrap: nowrap;
  }

  .tools-section {
    gap: 16px;
  }

  .category-block {
    padding: 16px;
    border-radius: 14px;
  }

  .category-header {
    flex-wrap: nowrap;
    margin-bottom: 14px;
  }

  .category-more {
    display: none;
  }

  .tools-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

@media (max-width: 375px) {
  .hero-title {
    font-size: 30px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .stat-value {
    font-size: 18px;
  }

  .category-block {
    padding: 12px;
  }
}

@media (min-width: 428px) and (max-width: 430px) {
  .hero-title {
    font-size: 38px;
  }
}

@media (max-width: 844px) and (orientation: landscape) {
  .hero-section {
    padding: 20px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: 32px;
  }

  .tools-section {
    gap: 12px;
  }

  .category-block {
    padding: 14px;
  }

  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>
