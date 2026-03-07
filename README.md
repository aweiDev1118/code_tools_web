# DevToolbox - 开发者工具箱

一个纯前端实现的聚合型技术工具站，面向开发者和技术人员，提供日常开发中常用的在线工具集合。所有功能均在浏览器端完成，无需后端服务，保证数据隐私安全。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 框架**: Element Plus
- **样式方案**: Tailwind 风格 + Scoped CSS
- **状态管理**: Pinia + LocalStorage
- **路由**: Vue Router 4
- **国际化**: vue-i18n v9（中文简体/繁体、英文、日文、韩文、越南文）
- **PWA**: vite-plugin-pwa

## 核心特性

- 纯前端实现，无后端依赖
- 响应式设计，支持移动端
- 暗黑模式支持（浅色/深色/跟随系统）
- 全局搜索（Cmd+K / Ctrl+K 命令面板）
- 工具收藏功能（LocalStorage）
- 使用历史记录与统计
- 多语言支持（6 种语言）
- PWA 支持（离线可用）
- SEO 优化（动态 title + meta）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 9001）
npm run dev

# 构建生产版本
npm run build
```

---

## 功能模块（48 个工具）

### 文本工具（6 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| JSON 格式化 | JSON 美化、压缩、校验 | 原生 JSON.parse/stringify | ✅ 已实现 |
| 文本对比 | 两段文本差异对比 | diff 库 | ✅ 已实现 |
| 字数统计 | 字数、字符、行数统计 | 原生 String 方法 | ✅ 已实现 |
| 大小写转换 | 各种大小写格式转换 | 原生 String 方法 | ✅ 已实现 |
| 文本去重 | 按行去重，支持多种规则 | Set 数据结构 | ✅ 已实现 |
| CSV/TSV 工具 | CSV/TSV 解析、预览、转换 | 自定义解析 | ✅ v2.0 新增 |

### 编码转换（5 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| Base64 编解码 | 文本与 Base64 互转 | 原生 btoa/atob | ✅ 已实现 |
| URL 编解码 | URL 编码与解码 | encodeURIComponent | ✅ 已实现 |
| Unicode 转换 | Unicode 与中文互转 | String.fromCharCode | ✅ 已实现 |
| HTML 实体转换 | HTML 实体编解码 | 自定义映射表 | ✅ 已实现 |
| JSON ↔ YAML | JSON 与 YAML 格式互转 | js-yaml 库 | ✅ v2.0 新增 |

### 图片工具（3 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 二维码生成 | 文本生成二维码 | qrcode 库 | ✅ 已实现 |
| 图片 Base64 转换 | 图片与 Base64 互转 | FileReader API | ✅ 已实现 |
| 图片压缩 | 在线压缩图片体积 | Canvas API | ✅ 已实现 |

### 代码工具（7 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 代码格式化 | JS/CSS/HTML/SQL 格式化 | prettier | ✅ 已实现 |
| JSON 转 TS | JSON 生成 TypeScript 类型 | 自定义实现 | ✅ 已实现 |
| MyBatis 代码生成 | 根据建表 SQL 生成实体类、Mapper、XML | 自定义实现 | ✅ 已实现 |
| 正则测试 | 正则表达式在线测试 | 原生 RegExp | ✅ 已实现 |
| Markdown 预览 | Markdown 实时预览 | marked + highlight.js | ✅ 已实现 |
| SQL 格式化 | SQL 语句格式化、美化、压缩 | 自定义 tokenizer | ✅ v2.0 新增 |
| JSON Schema | 从 JSON 生成 JSON Schema 定义 | 自定义推导算法 | ✅ v2.0 新增 |

### 时间日期（4 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 时间戳转换 | 时间戳与日期互转 | 原生 Date | ✅ 已实现 |
| 日期计算 | 日期差值计算 | 原生 Date | ✅ 已实现 |
| Cron 表达式 | Cron 表达式生成与反向解析 | 自定义实现 | ✅ 已实现 |
| 时区转换 | 不同时区时间转换 | Intl.DateTimeFormat | ✅ 已实现 |

### 生成器（5 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| UUID 生成 | 生成 UUID v4 | crypto.randomUUID | ✅ 已实现 |
| 随机密码生成 | 可配置的密码生成 | 自定义算法 | ✅ 已实现 |
| 进制转换 | 2/8/10/16 进制互转 | parseInt/toString | ✅ 已实现 |
| Lorem Ipsum | 占位文本生成，支持中英文 | 预设文本随机组合 | ✅ 已实现 |
| Emoji 选择器 | Emoji 表情搜索与复制 | 预设 Emoji 数据集 | ✅ v2.0 新增 |

### 加密解密（4 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| Hash 生成 | MD5/SHA1/SHA256 生成 | crypto-js 库 | ✅ 已实现 |
| JWT 解析 | 解析 JWT Token | 原生 atob 解析 | ✅ 已实现 |
| AES 加密解密 | AES 对称加密解密（CBC/ECB/CTR） | crypto-js 库 | ✅ v2.0 新增 |
| RSA 密钥生成 | 生成 RSA 公钥/私钥对 | Web Crypto API | ✅ v2.0 新增 |

### 颜色工具（4 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 颜色转换 | HEX/RGB/HSL 互转 | 自定义算法 | ✅ 已实现 |
| 渐变生成器 | CSS 渐变色生成 | 自定义实现 | ✅ 已实现 |
| 对比度检测 | WCAG 文字背景对比度检测 | WCAG 算法 | ✅ 已实现 |
| 调色板生成 | 从基础色生成完整调色板 | HSL 色彩空间算法 | ✅ v2.0 新增 |

### 网络工具（5 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| IP 地址查询 | 查询 IP 地址及地理位置信息 | 第三方 API | ✅ 已实现 |
| 浏览器信息 | 获取浏览器和设备详细信息 | 原生 navigator API | ✅ 已实现 |
| URL 解析 | 解析 URL 地址的各个组成部分 | 原生 URL API | ✅ 已实现 |
| UserAgent 分析 | 解析 UserAgent 识别浏览器和系统 | 自定义解析 | ✅ 已实现 |
| 子网掩码计算 | 计算 IP 子网信息和可用主机范围 | 自定义算法 | ✅ 已实现 |

### 计算工具（2 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| 单位换算 | 长度/重量/温度/面积/体积 | 自定义换算表 | ✅ 已实现 |
| 文件大小换算 | KB/MB/GB/TB 换算 | 自定义算法 | ✅ 已实现 |

### 开发辅助（3 个）

| 工具名称 | 功能描述 | 实现方案 | 状态 |
|---------|---------|---------|------|
| HTTP 状态码 | 状态码速查表 | 静态数据展示 | ✅ 已实现 |
| ASCII 码表 | ASCII 字符对照表 | 静态数据展示 | ✅ 已实现 |
| MIME 类型 | MIME 类型速查 | 静态数据展示 | ✅ 已实现 |

---

## 项目结构

```
src/
├── components/           # 公共组件
│   └── CommandPalette.vue   # Cmd+K 全局命令面板
├── config/
│   └── tools.ts          # 工具注册表（元数据）
├── i18n/
│   ├── index.ts          # i18n 入口
│   └── locales/          # 多语言文件（zh-CN/zh-TW/en/ja/ko/vi）
├── router/
│   └── index.ts          # 路由配置
├── utils/
│   ├── clipboard.ts      # 剪贴板工具
│   └── icons.ts          # 图标映射
├── views/
│   ├── HomeView.vue      # 首页
│   ├── CategoryView.vue  # 分类页
│   ├── FavoritesView.vue # 收藏页
│   ├── HistoryView.vue   # 历史记录页
│   └── tools/            # 工具组件（48 个单文件组件）
└── App.vue
```

## 添加新工具

1. 在 `src/views/tools/` 下创建工具组件 `YourTool.vue`
2. 在 `src/config/tools.ts` 中注册工具元数据
3. 在 `src/router/index.ts` 中添加路由
4. 在 `src/i18n/locales/` 各语言文件中添加 `tool.your-tool` 的 name/desc 翻译

## 第三方依赖

```json
{
  "vue": "^3.4.x",
  "vue-router": "^4.x",
  "pinia": "^2.x",
  "element-plus": "^2.x",
  "vue-i18n": "^9.14.x",
  "crypto-js": "^4.x",
  "qrcode": "^1.x",
  "highlight.js": "^11.x",
  "marked": "^11.x",
  "js-yaml": "^4.x",
  "vite-plugin-pwa": "^0.x"
}
```

## 参考站点

- [IT Tools](https://it-tools.tech/)
- [菜鸟工具](https://c.runoob.com/)
- [在线工具](https://tool.lu/)
- [MikuTools](https://tools.miku.ac/)
- [即时工具](https://www.67tool.com/)
- [CyberChef](https://gchq.github.io/CyberChef/)

## 后续扩展方向

- 插件系统 — 允许用户自定义工具
- 数据同步 — 云端同步收藏和设置
- API 服务 — 提供工具 API 接口
- 桌面版 — Electron 打包桌面应用
- 浏览器扩展 — Chrome/Firefox 插件版本

## License

MIT
