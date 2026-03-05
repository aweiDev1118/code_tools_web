<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { v4 as uuidv4 } from 'uuid'
import { copyToClipboard } from '@/utils/clipboard'

const { t } = useI18n()

const count = ref(5)
const uppercase = ref(false)
const noDash = ref(false)
const uuids = ref<string[]>([])

const generate = () => {
  const result: string[] = []
  for (let i = 0; i < count.value; i++) {
    let uuid = uuidv4()
    if (noDash.value) {
      uuid = uuid.replace(/-/g, '')
    }
    if (uppercase.value) {
      uuid = uuid.toUpperCase()
    }
    result.push(uuid)
  }
  uuids.value = result
}

const copy = (text: string) => {
  copyToClipboard(text)
}

const copyAll = () => {
  if (!uuids.value.length) return
  copyToClipboard(uuids.value.join('\n'), t('tool.uuid-generator.copiedAll'))
}

// 初始化生成
generate()
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('tool.uuid-generator.name') }}</h1>
      <p class="text-gray-500">{{ t('tool.uuid-generator.subtitle') }}</p>
    </div>

    <el-card class="mb-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <span class="text-sm">{{ t('tool.uuid-generator.countLabel') }}:</span>
          <el-input-number v-model="count" :min="1" :max="100" size="small" />
        </div>
        <el-checkbox v-model="uppercase">{{ t('tool.uuid-generator.uppercase') }}</el-checkbox>
        <el-checkbox v-model="noDash">{{ t('tool.uuid-generator.noDash') }}</el-checkbox>
        <div class="ml-auto flex gap-2">
          <el-button type="primary" @click="generate">{{ t('common.generate') }}</el-button>
          <el-button @click="copyAll">{{ t('tool.uuid-generator.copyAll') }}</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <div class="space-y-2">
        <div
          v-for="(uuid, index) in uuids"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded group"
        >
          <code class="font-mono text-sm">{{ uuid }}</code>
          <el-button
            size="small"
            class="opacity-0 group-hover:opacity-100 transition-opacity"
            @click="copy(uuid)"
          >
            {{ t('common.copy') }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
