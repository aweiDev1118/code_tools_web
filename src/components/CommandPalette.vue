<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { tools } from '@/config/tools'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'select': [toolId: string]
}>()

const router = useRouter()
const searchQuery = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const recentToolIds = computed<string[]>(() => {
  try {
    const history = localStorage.getItem('tool-history')
    if (!history) return []
    const parsed = JSON.parse(history)
    if (Array.isArray(parsed)) return parsed.slice(0, 5)
    return []
  } catch {
    return []
  }
})

const filteredTools = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    const recentIds = recentToolIds.value
    const recent = recentIds
      .map(id => tools.find(t => t.id === id))
      .filter(Boolean) as typeof tools
    const rest = tools.filter(t => !recentIds.includes(t.id))
    return [...recent, ...rest].slice(0, 10)
  }
  return tools.filter(tool =>
    tool.id.toLowerCase().includes(query) ||
    tool.name.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query) ||
    tool.keywords.some(k => k.toLowerCase().includes(query))
  ).slice(0, 10)
})

const close = () => {
  emit('update:visible', false)
}

const selectTool = (tool: typeof tools[0]) => {
  close()
  emit('select', tool.id)
  router.push(`/tool/${tool.id}`)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredTools.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const tool = filteredTools.value[selectedIndex.value]
    if (tool) selectTool(tool)
  } else if (e.key === 'Escape') {
    close()
  }
}

watch(() => props.visible, async (val) => {
  if (val) {
    searchQuery.value = ''
    selectedIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
  }
})

watch(searchQuery, () => {
  selectedIndex.value = 0
})
</script>

<template>
  <Transition name="palette">
    <div v-if="visible" class="palette-overlay" @click.self="close">
      <div class="palette-modal" @keydown="handleKeydown">
        <div class="palette-search">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref="inputRef"
            v-model="searchQuery"
            class="palette-input"
            placeholder="搜索工具..."
            autocomplete="off"
            spellcheck="false"
          />
          <kbd class="esc-hint">ESC</kbd>
        </div>

        <div class="palette-results">
          <div
            v-for="(tool, index) in filteredTools"
            :key="tool.id"
            class="palette-item"
            :class="{ active: index === selectedIndex }"
            @click="selectTool(tool)"
            @mouseenter="selectedIndex = index"
          >
            <div class="item-info">
              <span class="item-name">{{ tool.name }}</span>
              <span class="item-desc">{{ tool.description }}</span>
            </div>
            <span class="item-category">{{ tool.category }}</span>
          </div>
          <div v-if="filteredTools.length === 0" class="palette-empty">
            未找到匹配的工具
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.palette-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.palette-modal {
  width: 100%;
  max-width: 640px;
  margin: 0 16px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 20px 60px -10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.palette-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.search-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #9ca3af;
}

.palette-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  color: #111827;
  caret-color: #6366f1;
}

.palette-input::placeholder {
  color: #9ca3af;
}

.esc-hint {
  font-size: 11px;
  font-family: inherit;
  color: #9ca3af;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
}

.palette-results {
  max-height: 380px;
  overflow-y: auto;
  padding: 6px;
}

.palette-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.12s ease;
}

.palette-item.active {
  background: #f0f0ff;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-desc {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-category {
  font-size: 11px;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 6px;
  padding: 2px 8px;
  flex-shrink: 0;
  white-space: nowrap;
}

.palette-empty {
  padding: 32px 16px;
  text-align: center;
  font-size: 14px;
  color: #9ca3af;
}

/* Dark mode */
:global(.dark) .palette-modal {
  background: #1a1b23;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.2),
    0 20px 60px -10px rgba(0, 0, 0, 0.6);
}

:global(.dark) .palette-search {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

:global(.dark) .palette-input {
  color: #f9fafb;
}

:global(.dark) .esc-hint {
  background: #2d2e3a;
  border-color: rgba(255, 255, 255, 0.1);
  color: #6b7280;
}

:global(.dark) .palette-item.active {
  background: rgba(99, 102, 241, 0.15);
}

:global(.dark) .item-name {
  color: #f9fafb;
}

:global(.dark) .item-desc {
  color: #9ca3af;
}

:global(.dark) .item-category {
  color: #818cf8;
  background: rgba(99, 102, 241, 0.12);
}

/* Transition */
.palette-enter-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.palette-leave-active {
  transition: opacity 0.14s ease, transform 0.12s ease;
}

.palette-enter-from {
  opacity: 0;
}

.palette-leave-to {
  opacity: 0;
}

.palette-enter-from .palette-modal,
.palette-leave-to .palette-modal {
  transform: scale(0.96) translateY(-8px);
}

.palette-enter-active .palette-modal,
.palette-leave-active .palette-modal {
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
