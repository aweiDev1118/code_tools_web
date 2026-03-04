import { ref, watch, computed } from 'vue'
import { tools } from '@/config/tools'
import type { Tool } from '@/config/tools'

const STORAGE_KEY = 'tools-favorites'

const favorites = ref<string[]>(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
)

watch(favorites, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useFavorites() {
  const isFavorite = (toolId: string): boolean => favorites.value.includes(toolId)

  const toggleFavorite = (toolId: string) => {
    if (isFavorite(toolId)) {
      favorites.value = favorites.value.filter(id => id !== toolId)
    } else {
      favorites.value = [...favorites.value, toolId]
    }
  }

  const favoriteTools = computed<Tool[]>(() => {
    return favorites.value
      .map(id => tools.find(t => t.id === id))
      .filter((t): t is Tool => !!t)
  })

  const favoriteCount = computed(() => favorites.value.length)

  return { favorites, isFavorite, toggleFavorite, favoriteTools, favoriteCount }
}
