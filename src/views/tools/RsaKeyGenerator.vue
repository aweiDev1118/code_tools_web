<template>
  <div class="max-w-4xl mx-auto">
    <el-card class="mb-4">
      <template #header>
        <div class="flex items-center gap-2">
          <span class="text-lg font-semibold">RSA 密钥生成器</span>
        </div>
      </template>

      <div class="flex flex-wrap gap-4 mb-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">密钥长度：</span>
          <el-select v-model="keySize" style="width: 120px">
            <el-option label="1024 位" :value="1024" />
            <el-option label="2048 位" :value="2048" />
            <el-option label="4096 位" :value="4096" />
          </el-select>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">算法：</span>
          <el-select v-model="algorithm" style="width: 200px">
            <el-option label="RSA-OAEP（加密用）" value="RSA-OAEP" />
            <el-option label="RSASSA-PKCS1-v1_5（签名用）" value="RSASSA-PKCS1-v1_5" />
          </el-select>
        </div>

        <el-button type="primary" :loading="generating" @click="generateKeyPair">
          {{ generating ? '生成中...' : '生成密钥对' }}
        </el-button>
      </div>
    </el-card>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">公钥（Public Key）</span>
            <div class="flex gap-2">
              <el-button size="small" :disabled="!publicKeyPem" @click="copyKey('public')">
                复制
              </el-button>
              <el-button size="small" :disabled="!publicKeyPem" @click="downloadKey('public')">
                下载 .pem
              </el-button>
            </div>
          </div>
        </template>
        <el-input
          v-model="publicKeyPem"
          type="textarea"
          :rows="12"
          placeholder="点击「生成密钥对」后，公钥将显示在此处"
          readonly
          resize="none"
          style="font-family: monospace; font-size: 12px"
        />
      </el-card>

      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">私钥（Private Key）</span>
            <div class="flex gap-2">
              <el-button size="small" :disabled="!privateKeyPem" @click="copyKey('private')">
                复制
              </el-button>
              <el-button size="small" :disabled="!privateKeyPem" @click="downloadKey('private')">
                下载 .pem
              </el-button>
            </div>
          </div>
        </template>
        <el-input
          v-model="privateKeyPem"
          type="textarea"
          :rows="12"
          placeholder="点击「生成密钥对」后，私钥将显示在此处"
          readonly
          resize="none"
          style="font-family: monospace; font-size: 12px"
        />
      </el-card>
    </div>

    <el-card class="mt-4">
      <template #header>
        <span class="font-medium">使用说明</span>
      </template>
      <ul class="text-sm text-gray-600 space-y-1 list-disc list-inside">
        <li>RSA-OAEP 算法适用于数据加密/解密场景</li>
        <li>RSASSA-PKCS1-v1_5 算法适用于数字签名/验签场景</li>
        <li>密钥长度越大，安全性越高，但生成和运算速度越慢</li>
        <li>推荐使用 2048 位或 4096 位密钥以确保安全性</li>
        <li>私钥请妥善保管，切勿泄露</li>
        <li>所有运算均在本地浏览器完成，密钥不会上传至服务器</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const keySize = ref<1024 | 2048 | 4096>(2048)
const algorithm = ref<'RSA-OAEP' | 'RSASSA-PKCS1-v1_5'>('RSA-OAEP')
const generating = ref(false)
const publicKeyPem = ref('')
const privateKeyPem = ref('')

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

function formatPem(b64: string, type: string): string {
  const lines = b64.match(/.{1,64}/g) || []
  return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`
}

async function generateKeyPair() {
  generating.value = true
  publicKeyPem.value = ''
  privateKeyPem.value = ''

  try {
    const usages: KeyUsage[] =
      algorithm.value === 'RSA-OAEP' ? ['encrypt', 'decrypt'] : ['sign', 'verify']

    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: algorithm.value,
        modulusLength: keySize.value,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      usages
    )

    const pubDer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    const privDer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

    publicKeyPem.value = formatPem(toBase64(pubDer), 'PUBLIC KEY')
    privateKeyPem.value = formatPem(toBase64(privDer), 'PRIVATE KEY')

    ElMessage.success('密钥对生成成功')
  } catch (error) {
    ElMessage.error('密钥生成失败，请重试')
  } finally {
    generating.value = false
  }
}

async function copyKey(type: 'public' | 'private') {
  const pem = type === 'public' ? publicKeyPem.value : privateKeyPem.value
  try {
    await navigator.clipboard.writeText(pem)
    ElMessage.success(type === 'public' ? '公钥已复制' : '私钥已复制')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

function downloadKey(type: 'public' | 'private') {
  const pem = type === 'public' ? publicKeyPem.value : privateKeyPem.value
  const filename = type === 'public' ? 'public_key.pem' : 'private_key.pem'
  const blob = new Blob([pem], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>
