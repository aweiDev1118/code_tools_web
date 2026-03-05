<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface MimeEntry {
  mime: string
  extensions: string
  descKey: string
}

type Category = 'text' | 'image' | 'audio' | 'video' | 'application'

const activeTab = ref<Category>('text')
const searchQuery = ref('')

const dataConfig: Record<Category, MimeEntry[]> = {
  text: [
    { mime: 'text/plain', extensions: '.txt', descKey: 'tool.mime-types.textPlain' },
    { mime: 'text/html', extensions: '.html, .htm', descKey: 'tool.mime-types.textHtml' },
    { mime: 'text/css', extensions: '.css', descKey: 'tool.mime-types.textCss' },
    { mime: 'text/javascript', extensions: '.js, .mjs', descKey: 'tool.mime-types.textJs' },
    { mime: 'text/xml', extensions: '.xml', descKey: 'tool.mime-types.textXml' },
    { mime: 'text/csv', extensions: '.csv', descKey: 'tool.mime-types.textCsv' },
    { mime: 'text/markdown', extensions: '.md, .markdown', descKey: 'tool.mime-types.textMarkdown' },
    { mime: 'text/calendar', extensions: '.ics', descKey: 'tool.mime-types.textCalendar' },
    { mime: 'text/tab-separated-values', extensions: '.tsv', descKey: 'tool.mime-types.textTsv' },
    { mime: 'text/yaml', extensions: '.yaml, .yml', descKey: 'tool.mime-types.textYaml' },
  ],
  image: [
    { mime: 'image/png', extensions: '.png', descKey: 'tool.mime-types.imagePng' },
    { mime: 'image/jpeg', extensions: '.jpg, .jpeg', descKey: 'tool.mime-types.imageJpeg' },
    { mime: 'image/gif', extensions: '.gif', descKey: 'tool.mime-types.imageGif' },
    { mime: 'image/webp', extensions: '.webp', descKey: 'tool.mime-types.imageWebp' },
    { mime: 'image/svg+xml', extensions: '.svg', descKey: 'tool.mime-types.imageSvg' },
    { mime: 'image/bmp', extensions: '.bmp', descKey: 'tool.mime-types.imageBmp' },
    { mime: 'image/x-icon', extensions: '.ico', descKey: 'tool.mime-types.imageIco' },
    { mime: 'image/tiff', extensions: '.tif, .tiff', descKey: 'tool.mime-types.imageTiff' },
    { mime: 'image/avif', extensions: '.avif', descKey: 'tool.mime-types.imageAvif' },
    { mime: 'image/heic', extensions: '.heic', descKey: 'tool.mime-types.imageHeic' },
  ],
  audio: [
    { mime: 'audio/mpeg', extensions: '.mp3', descKey: 'tool.mime-types.audioMp3' },
    { mime: 'audio/wav', extensions: '.wav', descKey: 'tool.mime-types.audioWav' },
    { mime: 'audio/ogg', extensions: '.ogg, .oga', descKey: 'tool.mime-types.audioOgg' },
    { mime: 'audio/aac', extensions: '.aac', descKey: 'tool.mime-types.audioAac' },
    { mime: 'audio/flac', extensions: '.flac', descKey: 'tool.mime-types.audioFlac' },
    { mime: 'audio/webm', extensions: '.weba', descKey: 'tool.mime-types.audioWebm' },
    { mime: 'audio/x-m4a', extensions: '.m4a', descKey: 'tool.mime-types.audioM4a' },
    { mime: 'audio/midi', extensions: '.mid, .midi', descKey: 'tool.mime-types.audioMidi' },
    { mime: 'audio/opus', extensions: '.opus', descKey: 'tool.mime-types.audioOpus' },
  ],
  video: [
    { mime: 'video/mp4', extensions: '.mp4', descKey: 'tool.mime-types.videoMp4' },
    { mime: 'video/webm', extensions: '.webm', descKey: 'tool.mime-types.videoWebm' },
    { mime: 'video/ogg', extensions: '.ogv', descKey: 'tool.mime-types.videoOgg' },
    { mime: 'video/avi', extensions: '.avi', descKey: 'tool.mime-types.videoAvi' },
    { mime: 'video/quicktime', extensions: '.mov', descKey: 'tool.mime-types.videoMov' },
    { mime: 'video/x-matroska', extensions: '.mkv', descKey: 'tool.mime-types.videoMkv' },
    { mime: 'video/x-flv', extensions: '.flv', descKey: 'tool.mime-types.videoFlv' },
    { mime: 'video/3gpp', extensions: '.3gp', descKey: 'tool.mime-types.video3gp' },
    { mime: 'video/mpeg', extensions: '.mpeg, .mpg', descKey: 'tool.mime-types.videoMpeg' },
  ],
  application: [
    { mime: 'application/json', extensions: '.json', descKey: 'tool.mime-types.appJson' },
    { mime: 'application/xml', extensions: '.xml', descKey: 'tool.mime-types.appXml' },
    { mime: 'application/pdf', extensions: '.pdf', descKey: 'tool.mime-types.appPdf' },
    { mime: 'application/zip', extensions: '.zip', descKey: 'tool.mime-types.appZip' },
    { mime: 'application/gzip', extensions: '.gz', descKey: 'tool.mime-types.appGzip' },
    { mime: 'application/octet-stream', extensions: '.bin', descKey: 'tool.mime-types.appOctet' },
    { mime: 'application/javascript', extensions: '.js', descKey: 'tool.mime-types.appJs' },
    { mime: 'application/x-www-form-urlencoded', extensions: '—', descKey: 'tool.mime-types.appForm' },
    { mime: 'application/wasm', extensions: '.wasm', descKey: 'tool.mime-types.appWasm' },
    { mime: 'application/x-tar', extensions: '.tar', descKey: 'tool.mime-types.appTar' },
    { mime: 'application/x-7z-compressed', extensions: '.7z', descKey: 'tool.mime-types.app7z' },
    { mime: 'application/vnd.ms-excel', extensions: '.xls', descKey: 'tool.mime-types.appXls' },
    { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extensions: '.xlsx', descKey: 'tool.mime-types.appXlsx' },
    { mime: 'application/vnd.ms-powerpoint', extensions: '.ppt', descKey: 'tool.mime-types.appPpt' },
    { mime: 'application/msword', extensions: '.doc', descKey: 'tool.mime-types.appDoc' },
    { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extensions: '.docx', descKey: 'tool.mime-types.appDocx' },
  ],
}

const tabs = computed(() => [
  { key: 'text' as Category, label: t('tool.mime-types.tabText') },
  { key: 'image' as Category, label: t('tool.mime-types.tabImage') },
  { key: 'audio' as Category, label: t('tool.mime-types.tabAudio') },
  { key: 'video' as Category, label: t('tool.mime-types.tabVideo') },
  { key: 'application' as Category, label: t('tool.mime-types.tabApplication') },
])

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const sourceEntries = searchQuery.value.trim()
    ? Object.values(dataConfig).flat()
    : dataConfig[activeTab.value]

  const withDesc = sourceEntries.map(entry => ({
    ...entry,
    description: t(entry.descKey),
  }))

  if (!q) return withDesc

  return withDesc.filter(
    (row) =>
      row.mime.toLowerCase().includes(q) ||
      row.extensions.toLowerCase().includes(q) ||
      row.description.toLowerCase().includes(q),
  )
})

const isSearching = computed(() => searchQuery.value.trim().length > 0)
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.mime-types.name') }}</h1>
      <p class="text-gray-500 dark:text-gray-400">{{ t('tool.mime-types.subtitle') }}</p>
    </div>

    <el-card class="mb-6">
      <el-input
        v-model="searchQuery"
        :placeholder="t('tool.mime-types.searchPlaceholder')"
        clearable
        prefix-icon="Search"
      />
    </el-card>

    <el-card>
      <el-tabs v-if="!isSearching" v-model="activeTab">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.key"
          :label="tab.label"
          :name="tab.key"
        />
      </el-tabs>

      <div v-if="isSearching" class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {{ t('tool.mime-types.searchResultCount', { count: filteredRows.length }) }}
      </div>

      <el-table :data="filteredRows" stripe class="w-full">
        <el-table-column :label="t('tool.mime-types.colMime')" min-width="280">
          <template #default="{ row }">
            <span class="font-mono text-sm text-blue-600 dark:text-blue-400">{{ row.mime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('tool.mime-types.colExtension')" width="180">
          <template #default="{ row }">
            <span class="font-mono text-sm text-gray-600 dark:text-gray-300">{{ row.extensions }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('tool.mime-types.colDescription')" prop="description" min-width="220" />
      </el-table>

      <div v-if="filteredRows.length === 0" class="text-center text-gray-400 py-12">
        {{ t('tool.mime-types.noResults') }}
      </div>
    </el-card>
  </div>
</template>
