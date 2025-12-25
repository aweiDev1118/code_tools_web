import { ElMessage } from 'element-plus'

/**
 * 复制文本到剪贴板（兼容多种环境）
 */
export async function copyToClipboard(text: string, successMsg = '已复制'): Promise<boolean> {
  // 方法1: 使用现代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      ElMessage.success(successMsg)
      return true
    } catch {
      // 继续尝试其他方法
    }
  }

  // 方法2: 使用 execCommand（兼容旧浏览器和非 HTTPS）
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // 防止滚动
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '-9999px'
    textArea.style.opacity = '0'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    // 兼容 iOS
    textArea.setSelectionRange(0, text.length)

    const success = document.execCommand('copy')
    document.body.removeChild(textArea)

    if (success) {
      ElMessage.success(successMsg)
      return true
    }
  } catch {
    // 继续处理错误
  }

  ElMessage.error('复制失败，请手动复制')
  return false
}
