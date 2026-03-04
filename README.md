# Web 技术工具站设计文档

## 一、项目概述

### 1.1 项目定位
一个纯前端实现的聚合型技术工具站，面向开发者和技术人员，提供日常开发中常用的在线工具集合。所有功能均在浏览器端完成，无需后端服务，保证数据隐私安全。

### 1.2 技术栈
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 框架**: Element Plus / Naive UI
- **样式方案**: TailwindCSS / UnoCSS
- **状态管理**: Pinia
- **路由**: Vue Router 4

### 1.3 核心特性
- 纯前端实现，无后端依赖
- 响应式设计，支持移动端
- 暗黑模式支持
- 工具收藏功能（LocalStorage）
- 使用历史记录
- PWA 支持（离线可用）

---

## 二、功能模块设计

### 2.1 文本/编码工具

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| JSON 格式化 | JSON 美化、压缩、校验 | 原生 JSON.parse/stringify | ✅ 已实现 |
| Base64 编解码 | 文本与 Base64 互转 | 原生 btoa/atob | ✅ 已实现 |
| URL 编解码 | URL 编码与解码 | encodeURIComponent/decodeURIComponent | ✅ 已实现 |
| Hash 生成 | MD5/SHA1/SHA256 | crypto-js 库 | ✅ 已实现 |
| 文本对比 | 两段文本差异对比 | diff 库 | ✅ 已实现 |
| 正则测试 | 正则表达式在线测试 | 原生 RegExp | ✅ 已实现 |
| Unicode 转换 | Unicode 与中文互转 | String.fromCharCode | ✅ 已实现 |
| 字符统计 | 字数、字符、行数统计 | 原生 String 方法 | ✅ 已实现 |
| 大小写转换 | 各种大小写格式转换 | 原生 String 方法 | ✅ 已实现 |
| 文本去重 | 按行去重 | Set 数据结构 | ✅ 已实现 |

### 2.2 图片工具

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 图片压缩 | 在线压缩图片体积 | Canvas API / browser-image-compression | ✅ 已实现 |
| 二维码生成 | 文本生成二维码 | qrcode 库 | ✅ 已实现 |
| Base64 转换 | 图片与 Base64 互转 | FileReader API | ✅ 已实现 |
| 格式转换 | PNG/JPG/WEBP 互转 | Canvas toDataURL | 待开发 |
| 图片裁剪 | 自定义裁剪图片 | Cropper.js | 待开发 |
| 二维码识别 | 识别图片中的二维码 | jsQR 库 | 待开发 |
| 图片取色 | 提取图片主色调 | Canvas getImageData | 待开发 |
| 图片水印 | 添加文字/图片水印 | Canvas API | 待开发 |
| 图片拼接 | 多图拼接成一张 | Canvas API | 待开发 |
| SVG 转 PNG | SVG 格式转 PNG | Canvas + XMLSerializer | 待开发 |

### 2.3 代码工具

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 代码格式化 | JS/CSS/HTML/SQL 格式化 | prettier / sql-formatter | ✅ 已实现 |
| Markdown 预览 | Markdown 实时预览 | marked + highlight.js | ✅ 已实现 |
| MyBatis 代码生成 | 根据建表 SQL 生成实体类、Mapper、XML | 自定义实现 | ✅ 已实现 |
| 代码压缩 | JS/CSS 代码压缩 | terser / cssnano | 待开发 |
| 语法高亮 | 代码语法高亮展示 | highlight.js / prism | 待开发 |
| CSS 转 JS | CSS 转 JS 对象格式 | 自定义解析 | 待开发 |
| SCSS 转 CSS | SCSS 编译为 CSS | sass.js | 待开发 |
| HTML 转 JSX | HTML 转 React JSX | htmltojsx | 待开发 |
| JSON 转 TS | JSON 生成 TypeScript 类型 | 自定义实现 | ✅ 已实现 |

### 2.4 颜色工具

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 颜色转换 | HEX/RGB/HSL 互转 | 自定义算法 | ✅ 已实现 |
| 渐变生成器 | CSS 渐变色生成 | 自定义实现 | ✅ 已实现 |
| 调色板 | 可视化颜色选择器 | 原生 input[type=color] / 自定义 | 待开发 |
| 色彩搭配 | 生成配色方案 | 色彩理论算法 | 待开发 |
| 对比度检测 | 文字背景对比度检测 | WCAG 算法 | ✅ 已实现 |

### 2.5 日期时间工具

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 时间戳转换 | 时间戳与日期互转 | 原生 Date / dayjs | ✅ 已实现 |
| 日期计算 | 日期差值计算 | 原生 Date / dayjs | ✅ 已实现 |
| Cron 表达式 | Cron 表达式生成与反向解析 | 自定义实现 | ✅ 已实现 |
| 时区转换 | 不同时区时间转换 | Intl.DateTimeFormat | ✅ 已实现 |
| 倒计时 | 目标日期倒计时 | 原生实现 | 待开发 |

### 2.6 生成器工具

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| UUID 生成 | 生成 UUID v4 | crypto.randomUUID / uuid 库 | ✅ 已实现 |
| 随机密码 | 可配置的密码生成 | 自定义算法 | ✅ 已实现 |
| 进制转换 | 2/8/10/16 进制互转 | parseInt/toString | ✅ 已实现 |
| Lorem Ipsum | 占位文本生成 | 预设文本随机组合 | ✅ 已实现 |
| 假数据生成 | 姓名/邮箱/地址等 | faker.js | 待开发 |
| 头像生成 | 随机头像/字母头像 | Canvas / DiceBear | 待开发 |

### 2.7 网络工具

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| IP 地址查询 | 查询 IP 地址及地理位置信息 | 第三方 API | ✅ 已实现 |
| 浏览器信息 | 获取浏览器和设备详细信息 | 原生 navigator API | ✅ 已实现 |
| URL 解析 | 解析 URL 地址的各个组成部分 | 原生 URL API | ✅ 已实现 |
| UserAgent 分析 | 解析 UserAgent 识别浏览器和系统 | 自定义解析 | ✅ 已实现 |
| 子网掩码计算 | 计算 IP 子网信息和可用主机范围 | 自定义算法 | ✅ 已实现 |

### 2.8 加密解密

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| Hash 生成 | MD5/SHA1/SHA256 生成 | crypto-js 库 | ✅ 已实现 |
| JWT 解析 | 解析 JWT Token | 原生 atob 解析 | ✅ 已实现 |

### 2.9 计算工具

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 单位换算 | 长度/重量/温度/面积/体积 | 自定义换算表 | ✅ 已实现 |
| 科学计算器 | 基础数学运算 | math.js | 待开发 |
| 文件大小换算 | KB/MB/GB 换算 | 自定义算法 | ✅ 已实现 |

### 2.10 开发辅助工具

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| HTML 实体转换 | HTML 实体编解码 | 自定义映射表 | ✅ 已实现 |
| HTTP 状态码 | 状态码速查表 | 静态数据展示 | ✅ 已实现 |
| MIME 类型 | MIME 类型速查 | 静态数据展示 | ✅ 已实现 |
| ASCII 码表 | ASCII 字符对照表 | 静态数据展示 | ✅ 已实现 |

---

## 三、页面结构设计

### 3.1 整体布局
```
┌─────────────────────────────────────────────────────┐
│                    Header                            │
│  Logo    搜索框    主题切换    GitHub                  │
├────────────┬────────────────────────────────────────┤
│            │                                        │
│   侧边栏    │              主内容区                   │
│   分类导航  │                                        │
│            │         工具卡片网格展示                 │
│   - 文本工具│              或                        │
│   - 图片工具│         具体工具操作界面                 │
│   - 代码工具│                                        │
│   - ...    │                                        │
│            │                                        │
├────────────┴────────────────────────────────────────┤
│                    Footer                            │
└─────────────────────────────────────────────────────┘
```

### 3.2 路由设计
```
/                     # 首页 - 工具总览/推荐
/category/:name       # 分类页 - 某分类下的工具列表
/tool/:name           # 工具页 - 具体工具操作界面
/favorites            # 收藏页 - 用户收藏的工具
/history              # 历史页 - 最近使用记录
/about                # 关于页
```

### 3.3 工具页面通用布局
```
┌─────────────────────────────────────────────────────┐
│  工具名称                            收藏 分享 反馈   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────┐   ┌───────────────────┐     │
│  │                   │   │                   │     │
│  │    输入区域       │ → │    输出区域       │     │
│  │                   │   │                   │     │
│  └───────────────────┘   └───────────────────┘     │
│                                                     │
│  [操作按钮: 转换/清空/复制/下载等]                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  使用说明 / 相关工具推荐                              │
└─────────────────────────────────────────────────────┘
```

---

## 四、目录结构

```
tools-web/
├── public/
│   ├── favicon.ico
│   └── manifest.json          # PWA 配置
├── src/
│   ├── assets/                # 静态资源
│   │   ├── icons/
│   │   └── styles/
│   ├── components/            # 公共组件
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── AppFooter.vue
│   │   ├── common/
│   │   │   ├── ToolCard.vue
│   │   │   ├── CodeEditor.vue
│   │   │   ├── CopyButton.vue
│   │   │   └── FileUploader.vue
│   │   └── tools/             # 各工具组件
│   │       ├── text/
│   │       ├── image/
│   │       ├── code/
│   │       └── ...
│   ├── composables/           # 组合式函数
│   │   ├── useClipboard.ts
│   │   ├── useStorage.ts
│   │   ├── useFavorites.ts
│   │   └── useHistory.ts
│   ├── config/                # 配置文件
│   │   └── tools.ts           # 工具配置清单
│   ├── router/                # 路由配置
│   │   └── index.ts
│   ├── stores/                # Pinia 状态
│   │   ├── app.ts
│   │   └── tools.ts
│   ├── utils/                 # 工具函数
│   │   ├── text/
│   │   ├── image/
│   │   ├── code/
│   │   └── ...
│   ├── views/                 # 页面视图
│   │   ├── HomeView.vue
│   │   ├── CategoryView.vue
│   │   ├── ToolView.vue
│   │   └── ...
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 五、核心实现示例

### 5.1 工具配置结构
```typescript
// src/config/tools.ts
export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  category: string
  keywords: string[]
  component: string
}

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化、压缩、校验 JSON 数据',
    icon: 'json',
    category: 'text',
    keywords: ['json', '格式化', '美化', '压缩'],
    component: 'JsonFormatter'
  },
  // ...更多工具
]

export const categories = [
  { id: 'text', name: '文本工具', icon: 'Document' },
  { id: 'encode', name: '编码转换', icon: 'Switch' },
  { id: 'image', name: '图片工具', icon: 'Picture' },
  { id: 'code', name: '代码工具', icon: 'EditPen' },
  { id: 'datetime', name: '时间日期', icon: 'Clock' },
  { id: 'generator', name: '生成器', icon: 'MagicStick' },
  { id: 'crypto', name: '加密解密', icon: 'Lock' },
  { id: 'color', name: '颜色工具', icon: 'Brush' },
  { id: 'network', name: '网络工具', icon: 'Connection' },
  { id: 'calculator', name: '计算工具', icon: 'Odometer' },
  { id: 'dev', name: '开发辅助', icon: 'SetUp' },
]
```

### 5.2 收藏功能
```typescript
// src/composables/useFavorites.ts
import { ref, watch } from 'vue'

const STORAGE_KEY = 'tools-favorites'

export function useFavorites() {
  const favorites = ref<string[]>(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  )

  watch(favorites, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  const isFavorite = (toolId: string) => favorites.value.includes(toolId)

  const toggleFavorite = (toolId: string) => {
    const index = favorites.value.indexOf(toolId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(toolId)
    }
  }

  return { favorites, isFavorite, toggleFavorite }
}
```

---

## 六、第三方依赖

### 6.1 核心依赖
```json
{
  "dependencies": {
    "vue": "^3.4.x",
    "vue-router": "^4.x",
    "pinia": "^2.x",
    "element-plus": "^2.x"
  }
}
```

### 6.2 工具相关依赖
```json
{
  "dependencies": {
    "crypto-js": "^4.x",           // 加密算法
    "diff": "^5.x",                // 文本对比
    "qrcode": "^1.x",              // 二维码生成
    "jsqr": "^1.x",                // 二维码识别
    "prettier": "^3.x",            // 代码格式化
    "highlight.js": "^11.x",       // 语法高亮
    "marked": "^11.x",             // Markdown 解析
    "dayjs": "^1.x",               // 日期处理
    "uuid": "^9.x",                // UUID 生成
    "cropperjs": "^1.x",           // 图片裁剪
    "browser-image-compression": "^2.x"  // 图片压缩
  }
}
```

---

## 七、开发计划

### 第一阶段：基础框架
- [x] 项目初始化与配置
- [x] 基础布局组件
- [x] 路由配置
- [x] 主题切换功能
- [x] 搜索功能

### 第二阶段：核心工具（优先级高）
- [x] JSON 格式化
- [x] Base64 编解码
- [x] 时间戳转换
- [x] 二维码生成
- [x] 图片压缩
- [x] 代码格式化

### 第三阶段：扩展工具
- [x] 文本对比
- [x] 正则测试
- [x] 颜色转换
- [x] UUID 生成
- [x] Hash 生成
- [x] Markdown 预览

### 第四阶段：完善功能
- [ ] PWA 支持
- [x] 收藏与历史
- [x] 使用统计
- [x] 移动端适配优化
- [x] SEO 优化

### 第五阶段：扩展工具
- [x] 文本去重
- [x] Lorem Ipsum 占位文本生成
- [x] JSON 转 TypeScript 类型
- [x] 对比度检测（WCAG）
- [x] 时区转换
- [x] 单位换算（长度/重量/温度/面积/体积）
- [x] 文件大小换算
- [x] HTTP 状态码速查
- [x] ASCII 码表
- [x] MIME 类型速查

---

## 八、参考站点

- [菜鸟工具](https://c.runoob.com/)
- [在线工具](https://tool.lu/)
- [MikuTools](https://tools.miku.ac/)
- [即时工具](https://www.67tool.com/)
- [IT Tools](https://it-tools.tech/)
- [CyberChef](https://gchq.github.io/CyberChef/)

---

## 九、后续扩展方向

1. **国际化支持** - 多语言切换
2. **插件系统** - 允许用户自定义工具
3. **数据同步** - 云端同步收藏和设置
4. **API 服务** - 提供工具 API 接口
5. **桌面版** - Electron 打包桌面应用
6. **浏览器扩展** - Chrome/Firefox 插件版本
