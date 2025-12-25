<script setup lang="ts">
import { ref, computed } from 'vue'

const pattern = ref('')
const flags = ref(['g'])
const testString = ref('')

const flagOptions = [
  { value: 'g', label: 'g (全局匹配)' },
  { value: 'i', label: 'i (忽略大小写)' },
  { value: 'm', label: 'm (多行模式)' },
  { value: 's', label: 's (dotAll)' },
]

const result = computed(() => {
  if (!pattern.value || !testString.value) {
    return { valid: true, matches: [], error: '' }
  }

  try {
    const regex = new RegExp(pattern.value, flags.value.join(''))
    const matches: { match: string; index: number; groups?: Record<string, string> }[] = []
    let match

    if (flags.value.includes('g')) {
      while ((match = regex.exec(testString.value)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups
        })
      }
    } else {
      match = regex.exec(testString.value)
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups
        })
      }
    }

    return { valid: true, matches, error: '' }
  } catch (e) {
    return { valid: false, matches: [], error: (e as Error).message }
  }
})

const highlightedText = computed(() => {
  if (!pattern.value || !testString.value || !result.value.valid || result.value.matches.length === 0) {
    return testString.value
  }

  try {
    const regex = new RegExp(pattern.value, flags.value.join(''))
    return testString.value.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">$&</mark>')
  } catch {
    return testString.value
  }
})

const loadSample = () => {
  pattern.value = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'
  testString.value = `Contact us at:
support@example.com
sales@company.org
invalid-email
test.user@domain.co.uk`
  flags.value = ['g', 'i']
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">正则表达式测试</h1>
      <p class="text-gray-500">在线测试正则表达式匹配</p>
    </div>

    <div class="mb-4">
      <el-button @click="loadSample" text>加载邮箱匹配示例</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="space-y-4">
        <el-card>
          <template #header>正则表达式</template>
          <el-input
            v-model="pattern"
            placeholder="输入正则表达式，如: \d+"
            class="font-mono"
          >
            <template #prepend>/</template>
            <template #append>/{{ flags.join('') }}</template>
          </el-input>
          <div class="mt-4">
            <el-checkbox-group v-model="flags">
              <el-checkbox
                v-for="flag in flagOptions"
                :key="flag.value"
                :value="flag.value"
              >
                {{ flag.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="!result.valid" class="mt-4 text-red-500 text-sm">
            {{ result.error }}
          </div>
        </el-card>

        <el-card>
          <template #header>测试文本</template>
          <el-input
            v-model="testString"
            type="textarea"
            :rows="8"
            placeholder="输入要测试的文本..."
          />
        </el-card>
      </div>

      <div class="space-y-4">
        <el-card>
          <template #header>
            <div class="flex justify-between">
              <span>匹配结果</span>
              <el-tag v-if="result.matches.length > 0" type="success">
                {{ result.matches.length }} 个匹配
              </el-tag>
            </div>
          </template>
          <div
            v-if="testString"
            class="p-4 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm whitespace-pre-wrap"
            v-html="highlightedText"
          />
          <el-empty v-else description="输入测试文本" />
        </el-card>

        <el-card v-if="result.matches.length > 0">
          <template #header>匹配详情</template>
          <div class="space-y-2 max-h-60 overflow-auto">
            <div
              v-for="(m, index) in result.matches"
              :key="index"
              class="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
            >
              <div class="flex justify-between">
                <span class="font-mono text-primary-600">{{ m.match }}</span>
                <span class="text-gray-500">位置: {{ m.index }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
