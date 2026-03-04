export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  category: string
  keywords: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
}

export const categories: Category[] = [
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

export const tools: Tool[] = [
  // 文本工具
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: 'JSON 美化、压缩、校验',
    icon: 'Document',
    category: 'text',
    keywords: ['json', '格式化', '美化', '压缩', '校验']
  },
  {
    id: 'text-diff',
    name: '文本对比',
    description: '对比两段文本的差异',
    icon: 'DocumentCopy',
    category: 'text',
    keywords: ['文本', '对比', 'diff', '差异']
  },
  {
    id: 'text-counter',
    name: '字数统计',
    description: '统计字符、单词、行数',
    icon: 'DataLine',
    category: 'text',
    keywords: ['字数', '统计', '字符', '单词']
  },
  {
    id: 'case-converter',
    name: '大小写转换',
    description: '各种大小写格式转换',
    icon: 'Sort',
    category: 'text',
    keywords: ['大小写', '转换', 'camel', 'snake']
  },
  {
    id: 'text-dedup',
    name: '文本去重',
    description: '按行去重，支持多种去重规则',
    icon: 'Minus',
    category: 'text',
    keywords: ['去重', '去重复', '文本', 'dedup']
  },

  // 编码转换
  {
    id: 'base64',
    name: 'Base64 编解码',
    description: '文本与 Base64 互转',
    icon: 'Switch',
    category: 'encode',
    keywords: ['base64', '编码', '解码']
  },
  {
    id: 'url-encode',
    name: 'URL 编解码',
    description: 'URL 编码与解码',
    icon: 'Link',
    category: 'encode',
    keywords: ['url', '编码', '解码', 'encode']
  },
  {
    id: 'unicode',
    name: 'Unicode 转换',
    description: 'Unicode 与中文互转',
    icon: 'Collection',
    category: 'encode',
    keywords: ['unicode', '中文', '转换']
  },
  {
    id: 'html-entity',
    name: 'HTML 实体转换',
    description: 'HTML 实体编解码',
    icon: 'Promotion',
    category: 'encode',
    keywords: ['html', '实体', '转义']
  },

  // 图片工具
  {
    id: 'qrcode-generator',
    name: '二维码生成',
    description: '文本生成二维码图片',
    icon: 'Grid',
    category: 'image',
    keywords: ['二维码', 'qrcode', '生成']
  },
  {
    id: 'image-base64',
    name: '图片 Base64 转换',
    description: '图片与 Base64 互转',
    icon: 'PictureFilled',
    category: 'image',
    keywords: ['图片', 'base64', '转换']
  },
  {
    id: 'image-compress',
    name: '图片压缩',
    description: '在线压缩图片体积',
    icon: 'FolderChecked',
    category: 'image',
    keywords: ['图片', '压缩', 'compress']
  },

  // 代码工具
  {
    id: 'code-formatter',
    name: '代码格式化',
    description: 'JS/CSS/HTML/SQL 格式化',
    icon: 'Tickets',
    category: 'code',
    keywords: ['代码', '格式化', 'js', 'css', 'html']
  },
  {
    id: 'json-to-ts',
    name: 'JSON 转 TS',
    description: 'JSON 生成 TypeScript 类型定义',
    icon: 'SetUp',
    category: 'code',
    keywords: ['json', 'typescript', 'ts', '类型', '接口', 'interface']
  },
  {
    id: 'mybatis-generator',
    name: 'MyBatis 代码生成',
    description: '根据建表 SQL 生成实体类、Mapper、XML',
    icon: 'Files',
    category: 'code',
    keywords: ['mybatis', '代码生成', 'mapper', 'xml', 'java', 'sql', '建表']
  },
  {
    id: 'regex-tester',
    name: '正则测试',
    description: '正则表达式在线测试',
    icon: 'Search',
    category: 'code',
    keywords: ['正则', 'regex', '测试', '匹配']
  },
  {
    id: 'markdown-preview',
    name: 'Markdown 预览',
    description: 'Markdown 实时预览',
    icon: 'DocumentChecked',
    category: 'code',
    keywords: ['markdown', 'md', '预览']
  },

  // 时间日期
  {
    id: 'timestamp',
    name: '时间戳转换',
    description: '时间戳与日期互转',
    icon: 'Timer',
    category: 'datetime',
    keywords: ['时间戳', 'timestamp', '日期', '转换']
  },
  {
    id: 'date-calculator',
    name: '日期计算',
    description: '日期差值与推算',
    icon: 'Calendar',
    category: 'datetime',
    keywords: ['日期', '计算', '差值']
  },
  {
    id: 'cron-converter',
    name: 'Cron 表达式',
    description: 'Cron 表达式生成与反向解析',
    icon: 'AlarmClock',
    category: 'datetime',
    keywords: ['cron', '定时', '表达式', '定时任务', '计划任务']
  },
  {
    id: 'timezone-converter',
    name: '时区转换',
    description: '不同时区时间互转',
    icon: 'Clock',
    category: 'datetime',
    keywords: ['时区', '时间', '转换', 'timezone', 'UTC']
  },

  // 生成器
  {
    id: 'uuid-generator',
    name: 'UUID 生成',
    description: '生成 UUID v4',
    icon: 'Key',
    category: 'generator',
    keywords: ['uuid', '生成', 'guid']
  },
  {
    id: 'password-generator',
    name: '随机密码生成',
    description: '生成安全随机密码',
    icon: 'Lock',
    category: 'generator',
    keywords: ['密码', '随机', '生成', 'password']
  },
  {
    id: 'number-converter',
    name: '进制转换',
    description: '2/8/10/16 进制互转',
    icon: 'Operation',
    category: 'generator',
    keywords: ['进制', '转换', '二进制', '十六进制']
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    description: '占位文本生成，支持中英文',
    icon: 'Reading',
    category: 'generator',
    keywords: ['lorem', 'ipsum', '占位', '文本', '生成']
  },

  // 加密解密
  {
    id: 'hash-generator',
    name: 'Hash 生成',
    description: 'MD5/SHA1/SHA256 生成',
    icon: 'CircleCheck',
    category: 'crypto',
    keywords: ['hash', 'md5', 'sha', '加密']
  },
  {
    id: 'jwt-decoder',
    name: 'JWT 解析',
    description: '解析 JWT Token',
    icon: 'Postcard',
    category: 'crypto',
    keywords: ['jwt', 'token', '解析']
  },

  // 颜色工具
  {
    id: 'color-converter',
    name: '颜色转换',
    description: 'HEX/RGB/HSL 互转',
    icon: 'Brush',
    category: 'color',
    keywords: ['颜色', 'hex', 'rgb', 'hsl']
  },
  {
    id: 'gradient-generator',
    name: '渐变生成器',
    description: 'CSS 渐变色生成',
    icon: 'Sunny',
    category: 'color',
    keywords: ['渐变', 'gradient', 'css']
  },
  {
    id: 'contrast-checker',
    name: '对比度检测',
    description: 'WCAG 文字背景对比度检测',
    icon: 'View',
    category: 'color',
    keywords: ['对比度', 'WCAG', '颜色', '无障碍', 'contrast']
  },

  // 网络工具
  {
    id: 'ip-lookup',
    name: 'IP 地址查询',
    description: '查询 IP 地址及地理位置信息',
    icon: 'Position',
    category: 'network',
    keywords: ['ip', '地址', '查询', '位置', '网络']
  },
  {
    id: 'browser-info',
    name: '浏览器信息',
    description: '获取浏览器和设备详细信息',
    icon: 'Monitor',
    category: 'network',
    keywords: ['浏览器', '设备', '信息', 'browser']
  },
  {
    id: 'url-parser',
    name: 'URL 解析',
    description: '解析 URL 地址的各个组成部分',
    icon: 'Link',
    category: 'network',
    keywords: ['url', '解析', '地址', '链接']
  },
  {
    id: 'useragent-parser',
    name: 'UserAgent 分析',
    description: '解析 UserAgent 识别浏览器和系统',
    icon: 'Cpu',
    category: 'network',
    keywords: ['useragent', 'ua', '浏览器', '分析']
  },
  {
    id: 'subnet-calculator',
    name: '子网掩码计算',
    description: '计算 IP 子网信息和可用主机范围',
    icon: 'Connection',
    category: 'network',
    keywords: ['子网', '掩码', 'cidr', 'ip', '计算']
  },

  // 计算工具
  {
    id: 'unit-converter',
    name: '单位换算',
    description: '长度/重量/温度/面积/体积换算',
    icon: 'Odometer',
    category: 'calculator',
    keywords: ['单位', '换算', '长度', '重量', '温度', '面积']
  },
  {
    id: 'file-size-converter',
    name: '文件大小换算',
    description: 'KB/MB/GB/TB 文件大小换算',
    icon: 'Coin',
    category: 'calculator',
    keywords: ['文件', '大小', 'KB', 'MB', 'GB', '换算']
  },

  // 开发辅助
  {
    id: 'http-status-codes',
    name: 'HTTP 状态码',
    description: 'HTTP 状态码速查表',
    icon: 'ChatDotRound',
    category: 'dev',
    keywords: ['http', '状态码', 'status', '200', '404', '500']
  },
  {
    id: 'ascii-table',
    name: 'ASCII 码表',
    description: 'ASCII 字符对照表',
    icon: 'Menu',
    category: 'dev',
    keywords: ['ascii', '码表', '字符', '编码']
  },
  {
    id: 'mime-types',
    name: 'MIME 类型',
    description: 'MIME 类型速查表',
    icon: 'Stamp',
    category: 'dev',
    keywords: ['mime', '类型', '文件', 'content-type']
  },
]

export const getToolsByCategory = (categoryId: string): Tool[] => {
  return tools.filter(tool => tool.category === categoryId)
}

export const searchTools = (keyword: string): Tool[] => {
  const lowerKeyword = keyword.toLowerCase()
  return tools.filter(tool =>
    tool.name.toLowerCase().includes(lowerKeyword) ||
    tool.description.toLowerCase().includes(lowerKeyword) ||
    tool.keywords.some(k => k.includes(lowerKeyword))
  )
}
