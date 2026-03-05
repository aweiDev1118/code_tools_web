import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useSeo() {
  const route = useRoute()
  const { t } = useI18n()

  watch(
    () => route.path,
    (path) => {
      const siteName = t('seo.siteName')
      let title = siteName
      let description = t('seo.homeDesc')

      if (path === '/') {
        title = `${t('seo.homeTitle')} - ${siteName}`
        description = t('seo.homeDesc')
      } else if (path === '/favorites') {
        title = `${t('seo.favoritesTitle')} - ${siteName}`
        description = t('seo.favoritesDesc')
      } else if (path === '/history') {
        title = `${t('seo.historyTitle')} - ${siteName}`
        description = t('seo.historyDesc')
      } else if (path.startsWith('/category/')) {
        const categoryId = route.params.id as string
        const categoryName = t(`category.${categoryId}`)
        title = `${categoryName} - ${siteName}`
        description = categoryName
      } else if (path.startsWith('/tool/')) {
        const toolId = path.replace('/tool/', '')
        const toolName = t(`tool.${toolId}.name`)
        const toolDesc = t(`tool.${toolId}.desc`)
        title = `${toolName} - ${siteName}`
        description = toolDesc
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
