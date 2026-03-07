<template>
  <div class="sql-formatter">
    <div class="tool-header">
      <h2>SQL 格式化工具</h2>
      <p class="tool-desc">格式化、美化或压缩 SQL 语句</p>
    </div>

    <div class="options-bar">
      <div class="option-item">
        <label>缩进大小</label>
        <el-select v-model="indentSize" size="small" style="width: 100px">
          <el-option label="2 空格" :value="2" />
          <el-option label="4 空格" :value="4" />
        </el-select>
      </div>
      <div class="option-item">
        <label>关键字大写</label>
        <el-switch v-model="uppercaseKeywords" />
      </div>
      <div class="option-item">
        <label>SQL 方言</label>
        <el-select v-model="dialect" size="small" style="width: 130px">
          <el-option label="Standard" value="standard" />
          <el-option label="MySQL" value="mysql" />
          <el-option label="PostgreSQL" value="postgresql" />
        </el-select>
      </div>
    </div>

    <div class="editor-area">
      <div class="panel input-panel">
        <div class="panel-header">
          <span>输入 SQL</span>
          <div class="panel-actions">
            <el-button size="small" @click="loadExample">示例 SQL</el-button>
            <el-button size="small" @click="clearAll">清空</el-button>
          </div>
        </div>
        <el-input
          v-model="inputSql"
          type="textarea"
          :rows="12"
          placeholder="在此粘贴或输入 SQL 语句..."
          class="sql-textarea"
          resize="vertical"
        />
        <div class="action-buttons">
          <el-button type="primary" @click="formatSql">格式化</el-button>
          <el-button @click="minifySql">压缩</el-button>
        </div>
      </div>

      <div class="panel output-panel">
        <div class="panel-header">
          <span>输出结果</span>
          <div class="panel-actions">
            <el-button size="small" @click="copyOutput" :disabled="!outputSql">
              {{ copied ? '已复制' : '复制' }}
            </el-button>
          </div>
        </div>
        <pre class="output-pre" :class="{ 'has-error': !!errorMsg }">{{ outputSql || errorMsg || '格式化结果将显示在此处...' }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const inputSql = ref('')
const outputSql = ref('')
const errorMsg = ref('')
const copied = ref(false)
const indentSize = ref(2)
const uppercaseKeywords = ref(true)
const dialect = ref('standard')

// 关键字集合（按方言扩展）
const MAIN_CLAUSE_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
  'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'ORDER BY', 'GROUP BY',
  'HAVING', 'LIMIT', 'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'DELETE',
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'DROP', 'TRUNCATE',
]

const MYSQL_EXTRA = ['STRAIGHT_JOIN', 'SQL_CALC_FOUND_ROWS']
const POSTGRESQL_EXTRA = ['RETURNING', 'ON CONFLICT', 'DO NOTHING', 'DO UPDATE']

const INDENT_KEYWORDS = ['AND', 'OR', 'ON', 'THEN', 'ELSE']
const EXAMPLE_SQL = `SELECT u.id, u.name, u.email, o.order_date, SUM(oi.quantity * oi.price) AS total_amount FROM users u INNER JOIN orders o ON u.id = o.user_id INNER JOIN order_items oi ON o.id = oi.order_id WHERE u.status = 'active' AND o.order_date >= '2024-01-01' AND (oi.quantity > 0 OR oi.price > 0) GROUP BY u.id, u.name, u.email, o.order_date HAVING total_amount > 100 ORDER BY total_amount DESC LIMIT 50`

function getKeywords(): string[] {
  const base = [...MAIN_CLAUSE_KEYWORDS]
  if (dialect.value === 'mysql') return [...base, ...MYSQL_EXTRA]
  if (dialect.value === 'postgresql') return [...base, ...POSTGRESQL_EXTRA]
  return base
}

function applyCase(word: string): string {
  if (uppercaseKeywords.value) return word.toUpperCase()
  return word.toLowerCase()
}

function tokenize(sql: string): string[] {
  // Split while preserving string literals
  const tokens: string[] = []
  let i = 0
  let current = ''

  while (i < sql.length) {
    const ch = sql[i]

    // Handle single-quoted string literals
    if (ch === "'") {
      if (current.trim()) tokens.push(current.trim())
      current = ''
      let literal = "'"
      i++
      while (i < sql.length) {
        if (sql[i] === "'" && sql[i - 1] !== '\\') {
          literal += "'"
          i++
          break
        }
        literal += sql[i]
        i++
      }
      tokens.push(literal)
      continue
    }

    // Handle double-quoted identifiers
    if (ch === '"') {
      if (current.trim()) tokens.push(current.trim())
      current = ''
      let ident = '"'
      i++
      while (i < sql.length) {
        ident += sql[i]
        if (sql[i] === '"') { i++; break }
        i++
      }
      tokens.push(ident)
      continue
    }

    // Handle backtick identifiers (MySQL)
    if (ch === '`') {
      if (current.trim()) tokens.push(current.trim())
      current = ''
      let ident = '`'
      i++
      while (i < sql.length) {
        ident += sql[i]
        if (sql[i] === '`') { i++; break }
        i++
      }
      tokens.push(ident)
      continue
    }

    if (ch === '(' || ch === ')' || ch === ',') {
      if (current.trim()) tokens.push(current.trim())
      tokens.push(ch)
      current = ''
      i++
      continue
    }

    if (/\s/.test(ch)) {
      if (current.trim()) tokens.push(current.trim())
      current = ''
      i++
      continue
    }

    current += ch
    i++
  }

  if (current.trim()) tokens.push(current.trim())
  return tokens
}

function formatSqlLogic(sql: string): string {
  const indent = ' '.repeat(indentSize.value)
  const keywords = getKeywords().sort((a, b) => b.length - a.length)

  // Normalize whitespace first
  const normalized = sql.replace(/\s+/g, ' ').trim()

  // Identify multi-word keywords by joining tokens
  let working = normalized

  // Replace multi-word keywords with placeholders to simplify parsing
  // We'll process inline
  const tokens = tokenize(working)

  // Merge consecutive tokens that form compound keywords
  const merged: string[] = []
  let ti = 0
  while (ti < tokens.length) {
    // Check if a string literal
    if (tokens[ti].startsWith("'") || tokens[ti].startsWith('"') || tokens[ti].startsWith('`')) {
      merged.push(tokens[ti])
      ti++
      continue
    }

    let found = false
    // Try to match multi-word keyword (up to 3 tokens)
    for (let len = 3; len >= 2; len--) {
      const slice = tokens.slice(ti, ti + len)
      if (slice.some(t => t.startsWith("'") || t.startsWith('"'))) break
      const joined = slice.join(' ').toUpperCase()
      if (keywords.includes(joined)) {
        merged.push(joined)
        ti += len
        found = true
        break
      }
    }

    if (!found) {
      const upper = tokens[ti].toUpperCase()
      if (keywords.includes(upper)) {
        merged.push(upper)
      } else {
        merged.push(tokens[ti])
      }
      ti++
    }
  }

  // Now build formatted output
  const lines: string[] = []
  let indentLevel = 0
  let i = 0
  let caseDepth = 0

  const mainClauses = new Set(MAIN_CLAUSE_KEYWORDS.map(k => k.toUpperCase()))
  const indentKw = new Set(INDENT_KEYWORDS.map(k => k.toUpperCase()))

  while (i < merged.length) {
    const token = merged[i]
    const upper = typeof token === 'string' ? token.toUpperCase() : token

    if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
      // String/identifier literal - append to last line
      if (lines.length > 0) {
        lines[lines.length - 1] += ' ' + token
      } else {
        lines.push(token)
      }
      i++
      continue
    }

    if (upper === 'CASE') {
      caseDepth++
      if (lines.length > 0) {
        lines[lines.length - 1] += ' ' + applyCase('CASE')
      } else {
        lines.push(indent.repeat(indentLevel) + applyCase('CASE'))
      }
      indentLevel++
      i++
      continue
    }

    if (upper === 'END') {
      indentLevel = Math.max(0, indentLevel - 1)
      caseDepth = Math.max(0, caseDepth - 1)
      lines.push(indent.repeat(indentLevel) + applyCase('END'))
      i++
      continue
    }

    if (mainClauses.has(upper)) {
      // Reset to base indent level (0) for main clauses
      indentLevel = caseDepth > 0 ? 1 : 0
      lines.push(indent.repeat(indentLevel) + applyCase(upper))
      indentLevel = caseDepth > 0 ? 2 : 1
      i++
      continue
    }

    if (indentKw.has(upper)) {
      const kwIndent = caseDepth > 0 ? 2 : 1
      lines.push(indent.repeat(kwIndent) + applyCase(upper))
      i++
      continue
    }

    if (token === '(') {
      indentLevel++
      if (lines.length > 0) {
        lines[lines.length - 1] += ' ('
      } else {
        lines.push(indent.repeat(indentLevel - 1) + '(')
      }
      i++
      continue
    }

    if (token === ')') {
      indentLevel = Math.max(0, indentLevel - 1)
      lines.push(indent.repeat(indentLevel) + ')')
      i++
      continue
    }

    if (token === ',') {
      if (lines.length > 0) {
        lines[lines.length - 1] += ','
      }
      i++
      continue
    }

    // Regular token - append to last line or add indented
    if (lines.length === 0) {
      lines.push(indent.repeat(indentLevel) + token)
    } else {
      const lastLine = lines[lines.length - 1]
      // If last line is a keyword-only line, start a new indented continuation
      const lastTrimmed = lastLine.trim()
      const isKeywordLine = [...mainClauses, ...indentKw, 'CASE'].some(kw =>
        lastTrimmed.toUpperCase() === kw
      )
      if (isKeywordLine) {
        lines.push(indent.repeat(indentLevel) + token)
      } else {
        lines[lines.length - 1] += ' ' + token
      }
    }
    i++
  }

  return lines.join('\n')
}

function formatSql() {
  errorMsg.value = ''
  if (!inputSql.value.trim()) {
    ElMessage.warning('请输入 SQL 语句')
    return
  }
  try {
    outputSql.value = formatSqlLogic(inputSql.value)
  } catch (e) {
    errorMsg.value = '格式化失败: ' + (e instanceof Error ? e.message : String(e))
    outputSql.value = ''
  }
}

function minifySql() {
  errorMsg.value = ''
  if (!inputSql.value.trim()) {
    ElMessage.warning('请输入 SQL 语句')
    return
  }
  // Remove string literals temporarily, collapse whitespace, restore literals
  const literals: string[] = []
  const placeholder = (i: number) => `__STR_${i}__`

  let sql = inputSql.value
  sql = sql.replace(/'([^'\\]|\\.)*'/g, (match) => {
    const idx = literals.length
    literals.push(match)
    return placeholder(idx)
  })

  sql = sql.replace(/\s+/g, ' ').trim()

  literals.forEach((lit, i) => {
    sql = sql.replace(placeholder(i), lit)
  })

  outputSql.value = sql
}

function clearAll() {
  inputSql.value = ''
  outputSql.value = ''
  errorMsg.value = ''
}

function loadExample() {
  inputSql.value = EXAMPLE_SQL
}

async function copyOutput() {
  if (!outputSql.value) return
  try {
    await navigator.clipboard.writeText(outputSql.value)
    copied.value = true
    ElMessage.success('已复制到剪贴板')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.sql-formatter {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 20px;
}

.tool-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 6px;
  color: var(--el-text-color-primary);
}

.tool-desc {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.options-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-item label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.editor-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .editor-area {
    grid-template-columns: 1fr;
  }
}

.panel {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color);
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.panel-actions {
  display: flex;
  gap: 6px;
}

.sql-textarea :deep(.el-textarea__inner) {
  border: none;
  border-radius: 0;
  resize: vertical;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-fill-color-light);
}

.output-pre {
  flex: 1;
  margin: 0;
  padding: 12px 14px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  min-height: 280px;
  overflow: auto;
}

.output-pre.has-error {
  color: var(--el-color-danger);
}
</style>
