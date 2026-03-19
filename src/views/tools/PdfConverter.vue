<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import * as pdfjsLib from 'pdfjs-dist'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.worker.mjs`

const { t } = useI18n()

// 通用常量
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// 当前激活的 Tab
const activeTab = ref('pdf-to-images')

// ==================== Tab 1: PDF → Images ====================
const pdfPageImages = ref<string[]>([])
const pdfToImgLoading = ref(false)
const imgOutputFormat = ref<'png' | 'jpeg'>('png')
const imgScale = ref(2)
const imgQuality = ref(90)

// ==================== Tab 2: PDF → Word ====================
const pdfTextPages = ref<string[]>([])
const pdfToWordLoading = ref(false)

// ==================== Tab 3: Images → PDF ====================
const uploadedImages = ref<Array<{ id: string; name: string; dataUrl: string; width: number; height: number }>>([])
const imgToPdfLoading = ref(false)
const pageSize = ref<'a4' | 'letter'>('a4')
const orientation = ref<'portrait' | 'landscape'>('portrait')
const margin = ref(10)
const dragIndex = ref<number | null>(null)

// 预览文本（Tab 2）
const previewText = computed(() => {
  return pdfTextPages.value
    .map((text, i) => `--- ${t('tool.pdf-converter.page')} ${i + 1} ---\n${text}`)
    .join('\n\n')
})

// 校验文件大小
const validateFileSize = (file: File): boolean => {
  if (file.size > MAX_FILE_SIZE) {
    ElMessage.error(t('tool.pdf-converter.fileTooLarge'))
    return false
  }
  return true
}

// 读取文件为 ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (result instanceof ArrayBuffer) {
        resolve(result)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsArrayBuffer(file)
  })
}

// 读取文件为 DataURL
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        resolve(result)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsDataURL(file)
  })
}

// 获取图片尺寸
const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = dataUrl
  })
}

// ==================== Tab 1 逻辑 ====================

const handlePdfToImages = async (uploadFile: { raw: File }) => {
  const file = uploadFile.raw
  if (!file || !validateFileSize(file)) return false

  pdfToImgLoading.value = true
  pdfPageImages.value = []

  try {
    const arrayBuffer = await readFileAsArrayBuffer(file)
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages
    // 逐页渲染为图片，最终一次性赋值给 ref
    const renderPage = async (pageNum: number): Promise<string> => {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: imgScale.value })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!

      await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise

      const mimeType = imgOutputFormat.value === 'jpeg' ? 'image/jpeg' : 'image/png'
      const qualityParam = imgOutputFormat.value === 'jpeg' ? imgQuality.value / 100 : undefined
      return canvas.toDataURL(mimeType, qualityParam)
    }

    const pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1)
    const images: string[] = []
    for (const num of pageNumbers) {
      images.push(await renderPage(num))
    }

    pdfPageImages.value = [...images]
    ElMessage.success(t('tool.pdf-converter.convertSuccess'))
  } catch (error) {
    ElMessage.error(t('tool.pdf-converter.convertFailed'))
  } finally {
    pdfToImgLoading.value = false
  }

  return false
}

const downloadSingleImage = (dataUrl: string, index: number) => {
  const ext = imgOutputFormat.value === 'jpeg' ? 'jpg' : 'png'
  const link = document.createElement('a')
  link.download = `page-${index + 1}.${ext}`
  link.href = dataUrl
  link.click()
}

const downloadAllImages = async () => {
  for (let i = 0; i < pdfPageImages.value.length; i++) {
    downloadSingleImage(pdfPageImages.value[i], i)
    await new Promise(r => setTimeout(r, 300))
  }
  ElMessage.success(t('tool.pdf-converter.downloadAllSuccess'))
}

const clearPdfToImages = () => {
  pdfPageImages.value = []
}

// ==================== Tab 2 逻辑 ====================

const handlePdfToWord = async (uploadFile: { raw: File }) => {
  const file = uploadFile.raw
  if (!file || !validateFileSize(file)) return false

  pdfToWordLoading.value = true
  pdfTextPages.value = []

  try {
    const arrayBuffer = await readFileAsArrayBuffer(file)
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages
    // 逐页提取文本，最终一次性赋值给 ref
    const extractPage = async (pageNum: number): Promise<string> => {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      return textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join('')
    }

    const pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1)
    const pages: string[] = []
    for (const num of pageNumbers) {
      pages.push(await extractPage(num))
    }

    pdfTextPages.value = [...pages]
    ElMessage.success(t('tool.pdf-converter.extractSuccess'))
  } catch (error) {
    ElMessage.error(t('tool.pdf-converter.extractFailed'))
  } finally {
    pdfToWordLoading.value = false
  }

  return false
}

const downloadAsDocx = async () => {
  if (pdfTextPages.value.length === 0) return

  try {
    // 为每页创建段落，页与页之间添加分隔
    const paragraphs = pdfTextPages.value.flatMap((pageText, index) => {
      const pageParagraphs: Paragraph[] = [
        new Paragraph({
          children: [
            new TextRun({
              text: `— ${t('tool.pdf-converter.page')} ${index + 1} —`,
              bold: true,
              size: 28,
            }),
          ],
          spacing: { after: 200 },
        }),
      ]

      // 按换行拆分文本
      const lines = pageText.split('\n')
      const lineParagraphs = lines.map(
        (line) =>
          new Paragraph({
            children: [new TextRun({ text: line, size: 24 })],
            spacing: { after: 100 },
          })
      )

      return [...pageParagraphs, ...lineParagraphs]
    })

    const doc = new Document({
      sections: [{ children: paragraphs }],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, 'converted.docx')
    ElMessage.success(t('tool.pdf-converter.downloadSuccess'))
  } catch (error) {
    ElMessage.error(t('tool.pdf-converter.downloadFailed'))
  }
}

const clearPdfToWord = () => {
  pdfTextPages.value = []
}

// ==================== Tab 3 逻辑 ====================

const handleImagesUpload = async (uploadFile: { raw: File }) => {
  const file = uploadFile.raw
  if (!file || !validateFileSize(file)) return false

  try {
    const dataUrl = await readFileAsDataURL(file)
    const dimensions = await getImageDimensions(dataUrl)

    const newImage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: file.name,
      dataUrl,
      width: dimensions.width,
      height: dimensions.height,
    }

    uploadedImages.value = [...uploadedImages.value, newImage]
  } catch (error) {
    ElMessage.error(t('tool.pdf-converter.imageLoadFailed'))
  }

  return false
}

const removeImage = (id: string) => {
  uploadedImages.value = uploadedImages.value.filter((img) => img.id !== id)
}

// 拖拽排序相关
const handleDragStart = (index: number) => {
  dragIndex.value = index
}

const handleDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  if (dragIndex.value === null || dragIndex.value === index) return

  const items = [...uploadedImages.value]
  const dragItem = items[dragIndex.value]
  // 不可变方式重排：先移除再插入
  const filtered = items.filter((_, i) => i !== dragIndex.value)
  const newItems = [
    ...filtered.slice(0, index),
    dragItem,
    ...filtered.slice(index),
  ]
  uploadedImages.value = newItems
  dragIndex.value = index
}

const handleDragEnd = () => {
  dragIndex.value = null
}

const generatePdf = async () => {
  if (uploadedImages.value.length === 0) return

  imgToPdfLoading.value = true

  try {
    const isLandscape = orientation.value === 'landscape'
    const pdf = new jsPDF({
      orientation: orientation.value,
      unit: 'mm',
      format: pageSize.value,
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const marginVal = margin.value
    const contentWidth = pageWidth - marginVal * 2
    const contentHeight = pageHeight - marginVal * 2

    for (let i = 0; i < uploadedImages.value.length; i++) {
      if (i > 0) {
        pdf.addPage(pageSize.value, isLandscape ? 'landscape' : 'portrait')
      }

      const img = uploadedImages.value[i]
      const imgRatio = img.width / img.height
      const contentRatio = contentWidth / contentHeight

      let drawWidth: number
      let drawHeight: number

      if (imgRatio > contentRatio) {
        // 图片更宽，按宽度适配
        drawWidth = contentWidth
        drawHeight = contentWidth / imgRatio
      } else {
        // 图片更高，按高度适配
        drawHeight = contentHeight
        drawWidth = contentHeight * imgRatio
      }

      // 居中放置
      const x = marginVal + (contentWidth - drawWidth) / 2
      const y = marginVal + (contentHeight - drawHeight) / 2

      pdf.addImage(img.dataUrl, 'PNG', x, y, drawWidth, drawHeight)
    }

    pdf.save('combined.pdf')
    ElMessage.success(t('tool.pdf-converter.generateSuccess'))
  } catch (error) {
    ElMessage.error(t('tool.pdf-converter.generateFailed'))
  } finally {
    imgToPdfLoading.value = false
  }
}

const clearImages = () => {
  uploadedImages.value = []
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('tool.pdf-converter.name') }}
      </h1>
      <p class="text-gray-500">{{ t('tool.pdf-converter.subtitle') }}</p>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- ==================== Tab 1: PDF → Images ==================== -->
      <el-tab-pane :label="t('tool.pdf-converter.pdfToImages')" name="pdf-to-images">
        <el-card class="mb-4">
          <div class="flex flex-wrap gap-4 items-center mb-4">
            <div class="flex items-center gap-2">
              <span class="text-sm">{{ t('tool.pdf-converter.outputFormat') }}:</span>
              <el-radio-group v-model="imgOutputFormat" size="small">
                <el-radio-button value="png">PNG</el-radio-button>
                <el-radio-button value="jpeg">JPG</el-radio-button>
              </el-radio-group>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm">{{ t('tool.pdf-converter.scale') }}:</span>
              <el-radio-group v-model="imgScale" size="small">
                <el-radio-button :value="1">1x</el-radio-button>
                <el-radio-button :value="2">2x</el-radio-button>
                <el-radio-button :value="3">3x</el-radio-button>
              </el-radio-group>
            </div>
            <div v-if="imgOutputFormat === 'jpeg'" class="flex items-center gap-2">
              <span class="text-sm">{{ t('tool.pdf-converter.quality') }}:</span>
              <el-slider v-model="imgQuality" :min="10" :max="100" style="width: 120px" />
              <span class="text-sm w-10">{{ imgQuality }}%</span>
            </div>
          </div>

          <el-upload
            v-if="pdfPageImages.length === 0"
            drag
            :auto-upload="false"
            :show-file-list="false"
            accept=".pdf"
            :on-change="handlePdfToImages"
          >
            <div v-loading="pdfToImgLoading" class="upload-content">
              <el-icon size="48" class="text-gray-400"><Upload /></el-icon>
              <div class="text-gray-500 mt-2">{{ t('tool.pdf-converter.uploadPdfHint') }}</div>
              <div class="text-gray-400 text-xs mt-1">{{ t('tool.pdf-converter.maxSizeHint') }}</div>
            </div>
          </el-upload>

          <div v-if="pdfPageImages.length > 0">
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm text-gray-500">
                {{ t('tool.pdf-converter.totalPages', { count: pdfPageImages.length }) }}
              </span>
              <div class="flex gap-2">
                <el-button type="primary" @click="downloadAllImages">
                  {{ t('tool.pdf-converter.downloadAll') }}
                </el-button>
                <el-button @click="clearPdfToImages">{{ t('common.clear') }}</el-button>
              </div>
            </div>

            <div class="image-grid">
              <div
                v-for="(img, index) in pdfPageImages"
                :key="index"
                class="image-card"
              >
                <div class="image-preview">
                  <img :src="img" :alt="`Page ${index + 1}`" />
                </div>
                <div class="image-footer">
                  <span class="text-xs text-gray-500">
                    {{ t('tool.pdf-converter.page') }} {{ index + 1 }}
                  </span>
                  <el-button size="small" text type="primary" @click="downloadSingleImage(img, index)">
                    {{ t('tool.pdf-converter.download') }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- ==================== Tab 2: PDF → Word ==================== -->
      <el-tab-pane :label="t('tool.pdf-converter.pdfToWord')" name="pdf-to-word">
        <el-card class="mb-4">
          <el-upload
            v-if="pdfTextPages.length === 0"
            drag
            :auto-upload="false"
            :show-file-list="false"
            accept=".pdf"
            :on-change="handlePdfToWord"
          >
            <div v-loading="pdfToWordLoading" class="upload-content">
              <el-icon size="48" class="text-gray-400"><Upload /></el-icon>
              <div class="text-gray-500 mt-2">{{ t('tool.pdf-converter.uploadPdfHint') }}</div>
              <div class="text-gray-400 text-xs mt-1">{{ t('tool.pdf-converter.maxSizeHint') }}</div>
            </div>
          </el-upload>

          <div v-if="pdfTextPages.length > 0">
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm text-gray-500">
                {{ t('tool.pdf-converter.extractedPages', { count: pdfTextPages.length }) }}
              </span>
              <div class="flex gap-2">
                <el-button type="primary" @click="downloadAsDocx">
                  {{ t('tool.pdf-converter.downloadDocx') }}
                </el-button>
                <el-button @click="clearPdfToWord">{{ t('common.clear') }}</el-button>
              </div>
            </div>

            <el-input
              :model-value="previewText"
              type="textarea"
              :rows="16"
              readonly
              class="font-mono"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <!-- ==================== Tab 3: Images → PDF ==================== -->
      <el-tab-pane :label="t('tool.pdf-converter.imagesToPdf')" name="images-to-pdf">
        <el-card class="mb-4">
          <div class="flex flex-wrap gap-4 items-center mb-4">
            <div class="flex items-center gap-2">
              <span class="text-sm">{{ t('tool.pdf-converter.pageSize') }}:</span>
              <el-radio-group v-model="pageSize" size="small">
                <el-radio-button value="a4">A4</el-radio-button>
                <el-radio-button value="letter">Letter</el-radio-button>
              </el-radio-group>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm">{{ t('tool.pdf-converter.orientation') }}:</span>
              <el-radio-group v-model="orientation" size="small">
                <el-radio-button value="portrait">{{ t('tool.pdf-converter.portrait') }}</el-radio-button>
                <el-radio-button value="landscape">{{ t('tool.pdf-converter.landscape') }}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm">{{ t('tool.pdf-converter.margin') }}:</span>
              <el-slider v-model="margin" :min="0" :max="30" style="width: 120px" />
              <span class="text-sm w-12">{{ margin }}mm</span>
            </div>
          </div>

          <el-upload
            drag
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            multiple
            :on-change="handleImagesUpload"
          >
            <div class="upload-content">
              <el-icon size="48" class="text-gray-400"><Upload /></el-icon>
              <div class="text-gray-500 mt-2">{{ t('tool.pdf-converter.uploadImagesHint') }}</div>
              <div class="text-gray-400 text-xs mt-1">{{ t('tool.pdf-converter.dragReorderHint') }}</div>
            </div>
          </el-upload>

          <div v-if="uploadedImages.length > 0" class="mt-4">
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm text-gray-500">
                {{ t('tool.pdf-converter.totalImages', { count: uploadedImages.length }) }}
              </span>
              <div class="flex gap-2">
                <el-button
                  type="primary"
                  :loading="imgToPdfLoading"
                  @click="generatePdf"
                >
                  {{ t('tool.pdf-converter.generatePdf') }}
                </el-button>
                <el-button @click="clearImages">{{ t('common.clear') }}</el-button>
              </div>
            </div>

            <div class="image-grid">
              <div
                v-for="(img, index) in uploadedImages"
                :key="img.id"
                class="image-card draggable"
                draggable="true"
                @dragstart="handleDragStart(index)"
                @dragover="(e) => handleDragOver(e, index)"
                @dragend="handleDragEnd"
              >
                <div class="image-preview">
                  <img :src="img.dataUrl" :alt="img.name" />
                  <div class="image-index">{{ index + 1 }}</div>
                </div>
                <div class="image-footer">
                  <span class="text-xs text-gray-500 truncate" :title="img.name">
                    {{ img.name }}
                  </span>
                  <el-button
                    size="small"
                    text
                    type="danger"
                    @click="removeImage(img.id)"
                  >
                    {{ t('tool.pdf-converter.remove') }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.image-card {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  background: var(--el-bg-color);
  transition: box-shadow 0.2s, transform 0.2s;
}

.image-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.image-card.draggable {
  cursor: grab;
}

.image-card.draggable:active {
  cursor: grabbing;
}

.dark .image-card {
  border-color: var(--el-border-color-darker);
}

.dark .image-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.image-preview {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  padding: 8px;
  background: #f5f7fa;
}

.dark .image-preview {
  background: #2a2a2a;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-index {
  position: absolute;
  top: 6px;
  left: 6px;
  background: var(--el-color-primary);
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.image-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  gap: 4px;
}

.image-footer .truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
}

/* 响应式 */
@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .image-preview {
    height: 120px;
  }
}
</style>
