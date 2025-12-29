import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('@/views/CategoryView.vue')
  },
  // 文本工具
  {
    path: '/tool/json-formatter',
    name: 'JsonFormatter',
    component: () => import('@/views/tools/JsonFormatter.vue')
  },
  {
    path: '/tool/text-diff',
    name: 'TextDiff',
    component: () => import('@/views/tools/TextDiff.vue')
  },
  {
    path: '/tool/text-counter',
    name: 'TextCounter',
    component: () => import('@/views/tools/TextCounter.vue')
  },
  {
    path: '/tool/case-converter',
    name: 'CaseConverter',
    component: () => import('@/views/tools/CaseConverter.vue')
  },
  // 编码转换
  {
    path: '/tool/base64',
    name: 'Base64',
    component: () => import('@/views/tools/Base64Tool.vue')
  },
  {
    path: '/tool/url-encode',
    name: 'UrlEncode',
    component: () => import('@/views/tools/UrlEncodeTool.vue')
  },
  {
    path: '/tool/unicode',
    name: 'Unicode',
    component: () => import('@/views/tools/UnicodeTool.vue')
  },
  {
    path: '/tool/html-entity',
    name: 'HtmlEntity',
    component: () => import('@/views/tools/HtmlEntityTool.vue')
  },
  // 图片工具
  {
    path: '/tool/qrcode-generator',
    name: 'QrcodeGenerator',
    component: () => import('@/views/tools/QrcodeGenerator.vue')
  },
  {
    path: '/tool/image-base64',
    name: 'ImageBase64',
    component: () => import('@/views/tools/ImageBase64.vue')
  },
  {
    path: '/tool/image-compress',
    name: 'ImageCompress',
    component: () => import('@/views/tools/ImageCompress.vue')
  },
  // 代码工具
  {
    path: '/tool/code-formatter',
    name: 'CodeFormatter',
    component: () => import('@/views/tools/CodeFormatter.vue')
  },
  {
    path: '/tool/mybatis-generator',
    name: 'MyBatisGenerator',
    component: () => import('@/views/tools/MyBatisGenerator.vue')
  },
  {
    path: '/tool/regex-tester',
    name: 'RegexTester',
    component: () => import('@/views/tools/RegexTester.vue')
  },
  {
    path: '/tool/markdown-preview',
    name: 'MarkdownPreview',
    component: () => import('@/views/tools/MarkdownPreview.vue')
  },
  // 时间日期
  {
    path: '/tool/timestamp',
    name: 'Timestamp',
    component: () => import('@/views/tools/TimestampTool.vue')
  },
  {
    path: '/tool/date-calculator',
    name: 'DateCalculator',
    component: () => import('@/views/tools/DateCalculator.vue')
  },
  // 生成器
  {
    path: '/tool/uuid-generator',
    name: 'UuidGenerator',
    component: () => import('@/views/tools/UuidGenerator.vue')
  },
  {
    path: '/tool/password-generator',
    name: 'PasswordGenerator',
    component: () => import('@/views/tools/PasswordGenerator.vue')
  },
  {
    path: '/tool/number-converter',
    name: 'NumberConverter',
    component: () => import('@/views/tools/NumberConverter.vue')
  },
  // 加密解密
  {
    path: '/tool/hash-generator',
    name: 'HashGenerator',
    component: () => import('@/views/tools/HashGenerator.vue')
  },
  {
    path: '/tool/jwt-decoder',
    name: 'JwtDecoder',
    component: () => import('@/views/tools/JwtDecoder.vue')
  },
  // 颜色工具
  {
    path: '/tool/color-converter',
    name: 'ColorConverter',
    component: () => import('@/views/tools/ColorConverter.vue')
  },
  {
    path: '/tool/gradient-generator',
    name: 'GradientGenerator',
    component: () => import('@/views/tools/GradientGenerator.vue')
  },
  // 网络工具
  {
    path: '/tool/ip-lookup',
    name: 'IpLookup',
    component: () => import('@/views/tools/IpLookup.vue')
  },
  {
    path: '/tool/browser-info',
    name: 'BrowserInfo',
    component: () => import('@/views/tools/BrowserInfo.vue')
  },
  {
    path: '/tool/url-parser',
    name: 'UrlParser',
    component: () => import('@/views/tools/UrlParser.vue')
  },
  {
    path: '/tool/useragent-parser',
    name: 'UserAgentParser',
    component: () => import('@/views/tools/UserAgentParser.vue')
  },
  {
    path: '/tool/subnet-calculator',
    name: 'SubnetCalculator',
    component: () => import('@/views/tools/SubnetCalculator.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
