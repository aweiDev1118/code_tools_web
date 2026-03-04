import { ref, watch, computed } from 'vue'
import { tools } from '@/config/tools'
import type { Tool } from '@/config/tools'

const STORAGE_KEY = 'tools-history'
const MAX_HISTORY = 100

export interface HistoryEntry {
  toolId: string
  timestamp: number
}

const history = ref<HistoryEntry[]>(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
)

watch(history, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useHistory() {
  const addHistory = (toolId: string) => {
    const entry: HistoryEntry = { toolId, timestamp: Date.now() }
    history.value = [entry, ...history.value].slice(0, MAX_HISTORY)
  }

  const recentTools = computed<(Tool & { lastUsed: number })[]>(() => {
    const seen = new Set<string>()
    const result: (Tool & { lastUsed: number })[] = []
    for (const entry of history.value) {
      if (seen.has(entry.toolId)) continue
      seen.add(entry.toolId)
      const tool = tools.find(t => t.id === entry.toolId)
      if (tool) {
        result.push({ ...tool, lastUsed: entry.timestamp })
      }
    }
    return result
  })

  const usageStats = computed<{ tool: Tool; count: number }[]>(() => {
    const counts = new Map<string, number>()
    for (const entry of history.value) {
      counts.set(entry.toolId, (counts.get(entry.toolId) || 0) + 1)
    }
    return [...counts.entries()]
      .map(([id, count]) => {
        const tool = tools.find(t => t.id === id)
        return tool ? { tool, count } : null
      })
      .filter((item): item is { tool: Tool; count: number } => item !== null)
      .sort((a, b) => b.count - a.count)
  })

  const totalUsage = computed(() => history.value.length)

  const clearHistory = () => {
    history.value = []
  }

  return { history, addHistory, recentTools, usageStats, totalUsage, clearHistory }
}
