<script setup lang="ts">
import { ref, computed, watch, h, defineComponent, PropType, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { copyToClipboard } from '@/utils/clipboard'

const input = ref('')
const indentSize = ref(2)
const errorMsg = ref('')
const viewMode = ref<'tree' | 'text'>('tree')
const expandedKeys = ref<Set<string>>(new Set())
const defaultExpandLevel = ref(3)

// 拖拽调整宽度
const leftWidth = ref(50) // 左侧面板宽度百分比
const isDragging = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const startDrag = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return

  const container = containerRef.value
  const rect = container.getBoundingClientRect()
  const offsetX = e.clientX - rect.left
  const percentage = (offsetX / rect.width) * 100

  // 限制范围 20% - 80%
  leftWidth.value = Math.min(80, Math.max(20, percentage))
}

const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
}

onMounted(() => {
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})

const parsedJson = computed(() => {
  if (!input.value.trim()) {
    errorMsg.value = ''
    return null
  }
  try {
    const obj = JSON.parse(input.value)
    errorMsg.value = ''
    return obj
  } catch (e) {
    errorMsg.value = (e as Error).message
    return null
  }
})

const output = computed(() => {
  if (parsedJson.value === null) return ''
  return JSON.stringify(parsedJson.value, null, indentSize.value)
})

// 切换展开状态
const toggleExpand = (key: string) => {
  if (expandedKeys.value.has(key)) {
    expandedKeys.value.delete(key)
  } else {
    expandedKeys.value.add(key)
  }
  expandedKeys.value = new Set(expandedKeys.value)
}

// 递归收集所有 key
const collectAllKeys = (obj: any, prefix = 'root', level = 0): string[] => {
  const keys: string[] = []
  if (obj === null || typeof obj !== 'object') return keys

  keys.push(prefix)

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const childKey = `${prefix}[${index}]`
      keys.push(...collectAllKeys(item, childKey, level + 1))
    })
  } else {
    Object.keys(obj).forEach(key => {
      const childKey = `${prefix}.${key}`
      keys.push(...collectAllKeys(obj[key], childKey, level + 1))
    })
  }

  return keys
}

// 收集指定层级内的 key
const collectKeysToLevel = (obj: any, maxLevel: number, prefix = 'root', level = 0): string[] => {
  const keys: string[] = []
  if (obj === null || typeof obj !== 'object') return keys
  if (level >= maxLevel) return keys

  keys.push(prefix)

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const childKey = `${prefix}[${index}]`
      keys.push(...collectKeysToLevel(item, maxLevel, childKey, level + 1))
    })
  } else {
    Object.keys(obj).forEach(key => {
      const childKey = `${prefix}.${key}`
      keys.push(...collectKeysToLevel(obj[key], maxLevel, childKey, level + 1))
    })
  }

  return keys
}

// 全部展开
const expandAll = () => {
  if (!parsedJson.value) return
  const allKeys = collectAllKeys(parsedJson.value)
  expandedKeys.value = new Set(allKeys)
}

// 全部折叠
const collapseAll = () => {
  expandedKeys.value = new Set()
}

// 展开到指定层级
const expandToLevel = (level: number) => {
  if (!parsedJson.value) return
  const keys = collectKeysToLevel(parsedJson.value, level)
  expandedKeys.value = new Set(keys)
}

// 监听 JSON 变化，自动展开前几层
watch(parsedJson, (newVal) => {
  if (newVal) {
    expandToLevel(defaultExpandLevel.value)
  }
}, { immediate: true })

const format = () => {
  if (!input.value.trim()) return
  try {
    const obj = JSON.parse(input.value)
    input.value = JSON.stringify(obj, null, indentSize.value)
    errorMsg.value = ''
    ElMessage.success('格式化成功')
  } catch (e) {
    errorMsg.value = (e as Error).message
    ElMessage.error('JSON 格式错误')
  }
}

const compress = () => {
  if (!input.value.trim()) return
  try {
    const obj = JSON.parse(input.value)
    input.value = JSON.stringify(obj)
    errorMsg.value = ''
    ElMessage.success('压缩成功')
  } catch (e) {
    errorMsg.value = (e as Error).message
    ElMessage.error('JSON 格式错误')
  }
}

const copy = () => {
  if (!output.value) return
  copyToClipboard(output.value)
}

const copyValue = (value: any) => {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  copyToClipboard(text)
}

const clear = () => {
  input.value = ''
  errorMsg.value = ''
  expandedKeys.value = new Set()
}

const loadSample = () => {
  input.value = JSON.stringify({
    name: "开发工具箱",
    version: "1.0.0",
    active: true,
    count: 42,
    config: null,
    features: ["JSON格式化", "Base64编码", "时间戳转换"],
    settings: {
      theme: "light",
      language: "zh-CN",
      advanced: {
        debug: false,
        timeout: 3000
      }
    },
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" }
    ]
  }, null, 2)
}

// JSON 节点组件 - 使用渲染函数
const JsonNode = defineComponent({
  name: 'JsonNode',
  props: {
    data: { type: null as unknown as PropType<any>, required: true },
    path: { type: String, required: true },
    expandedKeys: { type: Object as PropType<Set<string>>, required: true },
    level: { type: Number, default: 0 },
    keyName: { type: String, default: '' },
    isLast: { type: Boolean, default: true },
    isArrayItem: { type: Boolean, default: false },
    arrayIndex: { type: Number, default: -1 }
  },
  emits: ['toggle', 'copy'],
  setup(props, { emit }) {
    const getType = (value: any): string => {
      if (value === null) return 'null'
      if (Array.isArray(value)) return 'array'
      return typeof value
    }

    const isExpandable = (value: any): boolean => {
      const type = getType(value)
      if (type === 'object') return Object.keys(value).length > 0
      if (type === 'array') return value.length > 0
      return false
    }

    const isExpanded = () => props.expandedKeys.has(props.path)

    return () => {
      const type = getType(props.data)
      const expandable = isExpandable(props.data)
      const expanded = isExpanded()
      const indent = props.level * 24

      // 展开/折叠图标 - 使用 SVG
      const toggleIcon = expandable
        ? h('span', {
            class: ['toggle-btn', expanded ? 'expanded' : 'collapsed'],
            onClick: (e: Event) => { e.stopPropagation(); emit('toggle', props.path) }
          }, [
            h('svg', {
              viewBox: '0 0 24 24',
              width: '10',
              height: '10',
              fill: 'currentColor'
            }, [
              expanded
                ? h('path', { d: 'M19 13H5v-2h14v2z' }) // 减号
                : h('path', { d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' }) // 加号
            ])
          ])
        : h('span', { class: 'toggle-placeholder' })

      // Key 名称
      const keyDisplay = props.keyName
        ? [
            h('span', { class: 'json-key' }, `"${props.keyName}"`),
            h('span', { class: 'json-colon' }, ': ')
          ]
        : props.isArrayItem
          ? [] // 数组项不显示索引
          : []

      // 值显示
      let valueDisplay: any[] = []

      if (!expandable) {
        // 基本类型值
        let content
        if (type === 'string') content = `"${props.data}"`
        else if (type === 'null') content = 'null'
        else content = String(props.data)
        valueDisplay = [h('span', { class: `json-value json-${type}` }, content)]
      } else if (!expanded) {
        // 折叠状态
        if (type === 'array') {
          valueDisplay = [
            h('span', { class: 'json-bracket' }, '['),
            h('span', { class: 'json-collapsed' }, `${props.data.length} items`),
            h('span', { class: 'json-bracket' }, ']')
          ]
        } else {
          valueDisplay = [
            h('span', { class: 'json-collapsed-obj' }, [
              h('span', { class: 'json-bracket' }, '{'),
              h('span', { class: 'json-collapsed' }, `${Object.keys(props.data).length} keys`),
              h('span', { class: 'json-bracket' }, '}')
            ])
          ]
        }
      } else {
        // 展开状态 - 只显示开括号
        valueDisplay = [h('span', { class: 'json-bracket' }, type === 'array' ? '[' : '{')]
      }

      // 逗号
      const comma = (!props.isLast && (!expandable || !expanded))
        ? h('span', { class: 'json-comma' }, ',')
        : null

      // 主行
      const lineContent = [toggleIcon, ...keyDisplay, ...valueDisplay, comma]
      const line = h('div', {
        class: ['json-line', { expandable }],
        style: { paddingLeft: `${indent}px` },
        onClick: () => expandable && emit('toggle', props.path)
      }, lineContent)

      // 子节点
      let children: any[] = []
      if (expandable && expanded) {
        if (type === 'array') {
          children = props.data.map((item: any, index: number) =>
            h(JsonNode, {
              key: index,
              data: item,
              path: `${props.path}[${index}]`,
              expandedKeys: props.expandedKeys,
              level: props.level + 1,
              isArrayItem: true,
              arrayIndex: index,
              isLast: index === props.data.length - 1,
              onToggle: (key: string) => emit('toggle', key),
              onCopy: (val: any) => emit('copy', val)
            })
          )
        } else {
          const keys = Object.keys(props.data)
          children = keys.map((key, index) =>
            h(JsonNode, {
              key,
              data: props.data[key],
              path: `${props.path}.${key}`,
              expandedKeys: props.expandedKeys,
              level: props.level + 1,
              keyName: key,
              isLast: index === keys.length - 1,
              onToggle: (k: string) => emit('toggle', k),
              onCopy: (val: any) => emit('copy', val)
            })
          )
        }

        // 闭合括号
        const closeBracket = h('div', {
          class: 'json-line',
          style: { paddingLeft: `${indent}px` }
        }, [
          h('span', { class: 'toggle-placeholder' }),
          h('span', { class: 'json-bracket' }, type === 'array' ? ']' : '}'),
          !props.isLast ? h('span', { class: 'json-comma' }, ',') : null
        ])
        children.push(closeBracket)
      }

      return h('div', { class: 'json-node' }, [line, ...children])
    }
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">JSON 格式化</h1>
      <p class="text-gray-500">格式化、压缩、校验 JSON 数据，支持树形可视化</p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <el-button type="primary" @click="format">格式化</el-button>
      <el-button @click="compress">压缩</el-button>
      <el-button @click="copy">复制结果</el-button>
      <el-button @click="clear">清空</el-button>
      <el-button @click="loadSample" text>加载示例</el-button>
      <div class="ml-auto flex items-center gap-2">
        <span class="text-sm text-gray-500">缩进:</span>
        <el-select v-model="indentSize" style="width: 80px">
          <el-option :value="2" label="2 空格" />
          <el-option :value="4" label="4 空格" />
          <el-option :value="1" label="Tab" />
        </el-select>
      </div>
    </div>

    <!-- 可调整宽度的双栏布局 -->
    <div ref="containerRef" class="resizable-container">
      <el-card class="panel-card" :style="{ width: leftWidth + '%' }">
        <template #header>
          <div class="flex items-center justify-between">
            <span>输入</span>
            <el-tag v-if="errorMsg" type="danger" size="small">格式错误</el-tag>
            <el-tag v-else-if="input.trim()" type="success" size="small">有效 JSON</el-tag>
          </div>
        </template>
        <el-input
          v-model="input"
          type="textarea"
          :rows="20"
          placeholder="请输入 JSON 数据..."
          class="font-mono"
        />
        <div v-if="errorMsg" class="mt-2 text-sm text-red-500">
          {{ errorMsg }}
        </div>
      </el-card>

      <!-- 拖拽分隔条 -->
      <div class="resizer" :class="{ dragging: isDragging }" @mousedown="startDrag">
        <div class="resizer-line"></div>
      </div>

      <el-card class="panel-card json-output-card" :style="{ width: (100 - leftWidth) + '%' }">
        <template #header>
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span>输出</span>
            <div class="flex items-center gap-2">
              <el-radio-group v-model="viewMode" size="small">
                <el-radio-button value="tree">树形</el-radio-button>
                <el-radio-button value="text">文本</el-radio-button>
              </el-radio-group>
              <template v-if="viewMode === 'tree' && parsedJson">
                <el-button size="small" @click="expandAll">展开全部</el-button>
                <el-button size="small" @click="collapseAll">折叠全部</el-button>
              </template>
            </div>
          </div>
        </template>

        <!-- 文本视图 -->
        <el-input
          v-if="viewMode === 'text'"
          :model-value="output"
          type="textarea"
          :rows="20"
          readonly
          placeholder="格式化结果将显示在这里..."
          class="font-mono"
        />

        <!-- 树形视图 -->
        <div v-else class="json-tree-container">
          <div v-if="!parsedJson && !errorMsg" class="text-gray-400 text-center py-10">
            格式化结果将显示在这里...
          </div>
          <div v-else-if="parsedJson" class="json-tree">
            <JsonNode
              :data="parsedJson"
              :path="'root'"
              :expanded-keys="expandedKeys"
              :level="0"
              @toggle="toggleExpand"
              @copy="copyValue"
            />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.json-output-card :deep(.el-card__body) {
  padding: 0;
}

.json-tree-container {
  height: 480px;
  overflow: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.8;
  background: #fff;
}

.dark .json-tree-container {
  background: #1e1e1e;
}

.json-tree {
  padding: 16px;
}

/* 使用 :deep() 让样式穿透到渲染函数创建的元素 */
.json-tree :deep(.json-node) {
  position: relative;
}

.json-tree :deep(.json-line) {
  display: flex;
  align-items: center;
  min-height: 26px;
  cursor: default;
  white-space: nowrap;
}

.json-tree :deep(.json-line.expandable) {
  cursor: pointer;
}

.json-tree :deep(.json-line:hover) {
  background: rgba(0, 0, 0, 0.03);
}

.dark .json-tree :deep(.json-line:hover) {
  background: rgba(255, 255, 255, 0.05);
}

/* 展开/折叠按钮 */
.json-tree :deep(.toggle-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
  box-sizing: border-box;
}

.json-tree :deep(.toggle-btn svg) {
  display: block;
}

.json-tree :deep(.toggle-btn.expanded) {
  background: #ff6b6b;
  color: #fff;
}

.json-tree :deep(.toggle-btn.collapsed) {
  background: #20c997;
  color: #fff;
}

.json-tree :deep(.toggle-btn:hover) {
  opacity: 0.8;
}

.json-tree :deep(.toggle-placeholder) {
  width: 24px;
  flex-shrink: 0;
}

/* Key 名称 - 紫色 */
.json-tree :deep(.json-key) {
  color: #9c27b0;
  font-weight: 500;
}

.dark .json-tree :deep(.json-key) {
  color: #ce93d8;
}

.json-tree :deep(.json-colon) {
  color: #666;
  margin-right: 6px;
}

.dark .json-tree :deep(.json-colon) {
  color: #999;
}

/* 字符串值 - 绿色 */
.json-tree :deep(.json-string) {
  color: #2e7d32;
}

.dark .json-tree :deep(.json-string) {
  color: #81c784;
}

/* 数字值 - 蓝色 */
.json-tree :deep(.json-number) {
  color: #1565c0;
}

.dark .json-tree :deep(.json-number) {
  color: #64b5f6;
}

/* 布尔值 - 橙色 */
.json-tree :deep(.json-boolean) {
  color: #e65100;
  font-weight: 500;
}

.dark .json-tree :deep(.json-boolean) {
  color: #ffb74d;
}

/* null - 灰色 */
.json-tree :deep(.json-null) {
  color: #9e9e9e;
  font-style: italic;
}

/* 括号 */
.json-tree :deep(.json-bracket) {
  color: #666;
  font-weight: 500;
}

.dark .json-tree :deep(.json-bracket) {
  color: #999;
}

/* 折叠预览 */
.json-tree :deep(.json-collapsed) {
  color: #9e9e9e;
  font-size: 12px;
  margin: 0 4px;
  font-style: italic;
}

.json-tree :deep(.json-collapsed-obj) {
  display: inline;
}

/* 逗号 */
.json-tree :deep(.json-comma) {
  color: #666;
}

.dark .json-tree :deep(.json-comma) {
  color: #999;
}

/* 可调整宽度的容器 */
.resizable-container {
  display: flex;
  gap: 0;
  min-height: 500px;
}

.panel-card {
  flex-shrink: 0;
  min-width: 0;
  transition: none;
}

.resizer {
  width: 12px;
  flex-shrink: 0;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.resizer:hover .resizer-line,
.resizer.dragging .resizer-line {
  background: #6366f1;
  width: 4px;
}

.resizer-line {
  width: 2px;
  height: 60px;
  background: #e2e8f0;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.dark .resizer-line {
  background: #475569;
}

.dark .resizer:hover .resizer-line,
.dark .resizer.dragging .resizer-line {
  background: #818cf8;
}

.resizer.dragging {
  cursor: col-resize;
}

/* iPhone 适配 */
@media (max-width: 430px) {
  .resizable-container {
    flex-direction: column;
    gap: 12px;
    min-height: auto;
  }

  .panel-card {
    width: 100% !important;
  }

  .resizer {
    display: none;
  }

  .mb-6 h1 {
    font-size: 20px !important;
  }

  .mb-6 p {
    font-size: 13px !important;
  }

  .mb-4 {
    margin-bottom: 12px !important;
  }

  .mb-4 .el-button {
    padding: 10px 14px !important;
    font-size: 13px !important;
  }

  .ml-auto {
    margin-left: 0 !important;
    width: 100%;
    margin-top: 8px;
    justify-content: flex-start !important;
  }

  .gap-4 {
    gap: 12px !important;
  }

  :deep(.el-textarea__inner) {
    min-height: 200px !important;
    font-size: 14px !important;
  }

  .json-tree-container {
    height: 360px;
    font-size: 13px;
  }

  .json-output-card :deep(.el-card__header) {
    padding: 12px !important;
  }

  .json-output-card :deep(.el-card__header) .el-radio-group {
    margin-bottom: 8px;
  }
}

@media (max-width: 375px) {
  .resizable-container {
    flex-direction: column;
    gap: 10px;
  }

  .panel-card {
    width: 100% !important;
  }

  .resizer {
    display: none;
  }

  .mb-4 .el-button {
    padding: 8px 12px !important;
    font-size: 12px !important;
  }

  :deep(.el-textarea__inner) {
    min-height: 180px !important;
    font-size: 13px !important;
  }

  .json-tree-container {
    height: 320px;
    font-size: 12px;
  }
}

/* 平板适配 - 保持拖拽功能 */
@media (min-width: 431px) and (max-width: 768px) {
  .resizable-container {
    min-height: 400px;
  }

  .resizer-line {
    height: 50px;
  }
}
</style>
