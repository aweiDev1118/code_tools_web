import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { tools, categories } from '@/config/tools'

const SITE_NAME = 'Web 技术工具站'

export function useSeo() {
  const route = useRoute()

  watch(
    () => route.path,
    (path) => {
      let title = SITE_NAME
      let description = '纯前端实现的聚合型技术工具站，面向开发者提供日常开发中常用的在线工具集合'

      if (path === '/') {
        title = `${SITE_NAME} - 开发者在线工具集合`
      } else if (path === '/favorites') {
        title = `我的收藏 - ${SITE_NAME}`
        description = '我收藏的常用开发工具'
      } else if (path === '/history') {
        title = `使用历史 - ${SITE_NAME}`
        description = '最近使用的开发工具和使用统计'
      } else if (path.startsWith('/category/')) {
        const categoryId = route.params.id as string
        const category = categories.find(c => c.id === categoryId)
        if (category) {
          title = `${category.name} - ${SITE_NAME}`
          description = `${category.name}分类下的在线工具集合`
        }
      } else if (path.startsWith('/tool/')) {
        const toolId = path.replace('/tool/', '')
        const tool = tools.find(t => t.id === toolId)
        if (tool) {
          title = `${tool.name} - ${SITE_NAME}`
          description = tool.description
        }
      }

      document.title = title

      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)
    },
    { immediate: true }
  )
}
