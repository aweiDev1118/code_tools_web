import type { CronState, CronField } from './cron'
import { FIELD_RANGES, WEEK_LABELS, createDefaultField } from './cron'

// ─── Parse helpers ───────────────────────────────────────────────────────────

function parseFieldExpr(expr: string, fieldKey: keyof typeof FIELD_RANGES): CronField {
  const range = FIELD_RANGES[fieldKey]
  const base = createDefaultField(range.min, range.max)

  if (expr === '*') {
    return { ...base, type: 'every' }
  }

  if (expr === '?') {
    return { ...base, type: 'noSpecific' }
  }

  if (expr === 'L') {
    return { ...base, type: 'last' }
  }

  // nL – last weekday of month, e.g. "5L"
  const lastWeekdayMatch = /^(\d+)L$/.exec(expr)
  if (lastWeekdayMatch) {
    return { ...base, type: 'lastWeekday', start: Number(lastWeekdayMatch[1]) }
  }

  // nW – nearest weekday, e.g. "15W"
  const weekdayMatch = /^(\d+)W$/.exec(expr)
  if (weekdayMatch) {
    return { ...base, type: 'weekday', start: Number(weekdayMatch[1]) }
  }

  // n#m – nth weekday, e.g. "5#2"
  const nthMatch = /^(\d+)#(\d+)$/.exec(expr)
  if (nthMatch) {
    return { ...base, type: 'nthWeekday', week: Number(nthMatch[1]), nth: Number(nthMatch[2]) }
  }

  // n,m,p – specific values
  if (expr.includes(',')) {
    const values = expr.split(',').map(Number)
    return { ...base, type: 'specific', values }
  }

  // n-m/step or n-m – range (optionally with step, treat as interval start from n)
  const rangeStepMatch = /^(\d+)-(\d+)\/(\d+)$/.exec(expr)
  if (rangeStepMatch) {
    return {
      ...base,
      type: 'interval',
      start: Number(rangeStepMatch[1]),
      end: Number(rangeStepMatch[2]),
      interval: Number(rangeStepMatch[3]),
    }
  }

  const rangeMatch = /^(\d+)-(\d+)$/.exec(expr)
  if (rangeMatch) {
    return { ...base, type: 'range', start: Number(rangeMatch[1]), end: Number(rangeMatch[2]) }
  }

  // */n – interval from min, e.g. "*/5"
  const everyStepMatch = /^\*\/(\d+)$/.exec(expr)
  if (everyStepMatch) {
    return { ...base, type: 'interval', start: range.min, interval: Number(everyStepMatch[1]) }
  }

  // n/m – interval from n, e.g. "0/5"
  const intervalMatch = /^(\d+)\/(\d+)$/.exec(expr)
  if (intervalMatch) {
    return {
      ...base,
      type: 'interval',
      start: Number(intervalMatch[1]),
      interval: Number(intervalMatch[2]),
    }
  }

  // plain number
  const num = Number(expr)
  if (!Number.isNaN(num)) {
    return { ...base, type: 'specific', values: [num] }
  }

  // fallback
  return { ...base, type: 'every' }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Parse a cron expression string (5, 6, or 7 fields) into a CronState.
 * 5-field: min hour day month week  (default sec=0, year=*)
 * 6-field: sec min hour day month week  (default year=*)
 * 7-field: sec min hour day month week year
 */
export function parseCronExpression(expr: string): CronState {
  const parts = expr.trim().split(/\s+/)

  let secExpr: string
  let minExpr: string
  let hourExpr: string
  let dayExpr: string
  let monthExpr: string
  let weekExpr: string
  let yearExpr: string

  if (parts.length === 5) {
    ;[minExpr, hourExpr, dayExpr, monthExpr, weekExpr] = parts
    secExpr = '0'
    yearExpr = '*'
  } else if (parts.length === 6) {
    ;[secExpr, minExpr, hourExpr, dayExpr, monthExpr, weekExpr] = parts
    yearExpr = '*'
  } else {
    ;[secExpr, minExpr, hourExpr, dayExpr, monthExpr, weekExpr, yearExpr] = parts
  }

  return {
    second: parseFieldExpr(secExpr, 'second'),
    minute: parseFieldExpr(minExpr, 'minute'),
    hour: parseFieldExpr(hourExpr, 'hour'),
    day: parseFieldExpr(dayExpr, 'day'),
    month: parseFieldExpr(monthExpr, 'month'),
    week: parseFieldExpr(weekExpr, 'week'),
    year: parseFieldExpr(yearExpr, 'year'),
  }
}

// ─── Field description ────────────────────────────────────────────────────────

const FIELD_LABEL: Record<string, string> = {
  second: '秒',
  minute: '分钟',
  hour: '小时',
  day: '天',
  month: '月',
  week: '周',
  year: '年',
}

/**
 * Describe a single cron field expression in Chinese.
 */
export function describeField(fieldExpr: string, fieldName: string): string {
  const label = FIELD_LABEL[fieldName] ?? fieldName

  if (fieldExpr === '*') return `每${label}`
  if (fieldExpr === '?') return '不指定'
  if (fieldExpr === 'L') return '最后一天'

  const lastWeekdayMatch = /^(\d+)L$/.exec(fieldExpr)
  if (lastWeekdayMatch) {
    const w = Number(lastWeekdayMatch[1])
    return `最后一个星期${WEEK_LABELS[w] ?? w}`
  }

  const weekdayMatch = /^(\d+)W$/.exec(fieldExpr)
  if (weekdayMatch) {
    return `最近${weekdayMatch[1]}号的工作日`
  }

  const nthMatch = /^(\d+)#(\d+)$/.exec(fieldExpr)
  if (nthMatch) {
    const w = Number(nthMatch[1])
    return `第${nthMatch[2]}个星期${WEEK_LABELS[w] ?? w}`
  }

  if (fieldExpr.includes(',')) {
    return fieldExpr.split(',').join('和')
  }

  const rangeMatch = /^(\d+)-(\d+)$/.exec(fieldExpr)
  if (rangeMatch) {
    return `${rangeMatch[1]}到${rangeMatch[2]}`
  }

  const everyStepMatch = /^\*\/(\d+)$/.exec(fieldExpr)
  if (everyStepMatch) {
    return `每隔${everyStepMatch[1]}${label}`
  }

  const intervalMatch = /^(\d+)\/(\d+)$/.exec(fieldExpr)
  if (intervalMatch) {
    return `从${intervalMatch[1]}开始，每隔${intervalMatch[2]}${label}`
  }

  // plain number
  if (/^\d+$/.test(fieldExpr)) {
    return fieldExpr
  }

  return fieldExpr
}

// ─── Human-readable description ───────────────────────────────────────────────

/**
 * Generate a human-readable Chinese description for a cron expression.
 */
export function describeCronExpression(expr: string): string {
  const parts = expr.trim().split(/\s+/)

  let secExpr: string
  let minExpr: string
  let hourExpr: string
  let dayExpr: string
  let monthExpr: string
  let weekExpr: string
  let yearExpr: string

  if (parts.length === 5) {
    ;[minExpr, hourExpr, dayExpr, monthExpr, weekExpr] = parts
    secExpr = '0'
    yearExpr = '*'
  } else if (parts.length === 6) {
    ;[secExpr, minExpr, hourExpr, dayExpr, monthExpr, weekExpr] = parts
    yearExpr = '*'
  } else {
    ;[secExpr, minExpr, hourExpr, dayExpr, monthExpr, weekExpr, yearExpr] = parts
  }

  // Special common cases
  const isEvery = (e: string) => e === '*' || e === '?'
  const isZero = (e: string) => e === '0'
  const isSpecific = (e: string) => /^\d+$/.test(e)

  // 每秒执行一次
  if (isEvery(secExpr) && isEvery(minExpr) && isEvery(hourExpr)) {
    return '每秒执行一次'
  }

  // 每分钟执行一次 (second is 0 or specific)
  if (isZero(secExpr) && isEvery(minExpr) && isEvery(hourExpr)) {
    return '每分钟执行一次'
  }

  // 每小时整点执行
  if (isZero(secExpr) && isZero(minExpr) && isEvery(hourExpr)) {
    return '每小时整点执行'
  }

  // 每天凌晨0点执行
  if (isZero(secExpr) && isZero(minExpr) && isZero(hourExpr) && isEvery(dayExpr) && isEvery(monthExpr) && isEvery(weekExpr)) {
    return '每天凌晨0点执行'
  }

  // 每隔N分钟
  const intervalMinMatch = /^(?:0|\*)\/(\d+)$/.exec(minExpr)
  if (isZero(secExpr) && intervalMinMatch && isEvery(hourExpr)) {
    return `每隔${intervalMinMatch[1]}分钟执行一次`
  }

  // 周一至周五 N时M分S秒执行
  const weekRangeMatch = /^(\d+)-(\d+)$/.exec(weekExpr)
  if (weekRangeMatch && !isEvery(weekExpr)) {
    const wStart = WEEK_LABELS[Number(weekRangeMatch[1])] ?? weekRangeMatch[1]
    const wEnd = WEEK_LABELS[Number(weekRangeMatch[2])] ?? weekRangeMatch[2]
    const timePart = buildTimePart(secExpr, minExpr, hourExpr)
    return `周${wStart}至周${wEnd} ${timePart}执行`
  }

  // 每月N日 N时M分S秒执行
  if (isSpecific(dayExpr) && !isEvery(weekExpr) === false && (isEvery(weekExpr) || weekExpr === '?')) {
    const timePart = buildTimePart(secExpr, minExpr, hourExpr)
    return `每月${dayExpr}日 ${timePart}执行`
  }

  // Generic fallback: compose parts
  const segments: string[] = []

  if (yearExpr !== '*') {
    segments.push(`${describeField(yearExpr, 'year')}年`)
  }
  if (!isEvery(monthExpr)) {
    segments.push(`${describeField(monthExpr, 'month')}月`)
  }
  if (!isEvery(dayExpr)) {
    segments.push(`${describeField(dayExpr, 'day')}日`)
  }
  if (!isEvery(weekExpr)) {
    segments.push(`星期${describeField(weekExpr, 'week')}`)
  }

  const timePart = buildTimePart(secExpr, minExpr, hourExpr)
  segments.push(`${timePart}执行`)

  return segments.join(' ')
}

function buildTimePart(secExpr: string, minExpr: string, hourExpr: string): string {
  const h = /^\d+$/.test(hourExpr) ? hourExpr : describeField(hourExpr, 'hour')
  const m = /^\d+$/.test(minExpr) ? minExpr : describeField(minExpr, 'minute')
  const s = /^\d+$/.test(secExpr) ? secExpr : describeField(secExpr, 'second')

  if (/^\d+$/.test(hourExpr) && /^\d+$/.test(minExpr) && /^\d+$/.test(secExpr)) {
    return `${h}时${m}分${s}秒`
  }

  return `${h}${/^\d+$/.test(hourExpr) ? '时' : ''}${m}${/^\d+$/.test(minExpr) ? '分' : ''}${s}${/^\d+$/.test(secExpr) ? '秒' : ''}`
}

// ─── Matching ─────────────────────────────────────────────────────────────────

/**
 * Check if a numeric value matches a cron field expression.
 * For 'L' returns true (caller must handle day-of-month context).
 */
export function matchesCronField(value: number, fieldExpr: string): boolean {
  if (fieldExpr === '*' || fieldExpr === '?') return true
  if (fieldExpr === 'L') return true // caller handles

  // nW / nL / n#m — caller handles specifics, approximate match
  if (/^\d+[WL]$/.test(fieldExpr)) return true
  if (/^\d+#\d+$/.test(fieldExpr)) return true

  // n,m,p
  if (fieldExpr.includes(',')) {
    return fieldExpr.split(',').map(Number).includes(value)
  }

  // n-m
  const rangeMatch = /^(\d+)-(\d+)$/.exec(fieldExpr)
  if (rangeMatch) {
    return value >= Number(rangeMatch[1]) && value <= Number(rangeMatch[2])
  }

  // */n
  const everyStepMatch = /^\*\/(\d+)$/.exec(fieldExpr)
  if (everyStepMatch) {
    return value % Number(everyStepMatch[1]) === 0
  }

  // n/m
  const intervalMatch = /^(\d+)\/(\d+)$/.exec(fieldExpr)
  if (intervalMatch) {
    const start = Number(intervalMatch[1])
    const step = Number(intervalMatch[2])
    return value >= start && (value - start) % step === 0
  }

  // plain number
  return value === Number(fieldExpr)
}

// ─── Days in month ────────────────────────────────────────────────────────────

/**
 * Return the number of days in the given month (1-indexed).
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

// ─── Next run times ───────────────────────────────────────────────────────────

/**
 * Calculate the next N execution times for a cron expression.
 */
export function getNextRunTimes(expr: string, count: number = 10, from?: Date): Date[] {
  const parts = expr.trim().split(/\s+/)

  let secExpr: string
  let minExpr: string
  let hourExpr: string
  let dayExpr: string
  let monthExpr: string
  let weekExpr: string
  let yearExpr: string

  if (parts.length === 5) {
    ;[minExpr, hourExpr, dayExpr, monthExpr, weekExpr] = parts
    secExpr = '0'
    yearExpr = '*'
  } else if (parts.length === 6) {
    ;[secExpr, minExpr, hourExpr, dayExpr, monthExpr, weekExpr] = parts
    yearExpr = '*'
  } else {
    ;[secExpr, minExpr, hourExpr, dayExpr, monthExpr, weekExpr, yearExpr] = parts
  }

  const results: Date[] = []
  const start = from ? new Date(from) : new Date()

  // Start from the next second
  start.setMilliseconds(0)
  start.setSeconds(start.getSeconds() + 1)

  let current = new Date(start)
  let iterations = 0
  const MAX_ITERATIONS = 100000

  while (results.length < count && iterations < MAX_ITERATIONS) {
    iterations++

    const year = current.getFullYear()
    const month = current.getMonth() + 1 // 1-indexed
    const day = current.getDate()
    const hour = current.getHours()
    const minute = current.getMinutes()
    const second = current.getSeconds()
    const weekday = current.getDay() // 0=Sun

    // Year check
    if (!matchesCronField(year, yearExpr)) {
      // Skip to next year
      current = new Date(year + 1, 0, 1, 0, 0, 0, 0)
      continue
    }

    // Month check
    if (!matchesCronField(month, monthExpr)) {
      // Skip to first day of next month
      current = new Date(year, month, 1, 0, 0, 0, 0) // month is already 1-indexed, Date month is 0-indexed so month (not month-1+1=month) is correct
      continue
    }

    // Day / weekday check
    const dayMatch = matchesCronField(day, dayExpr)
    const weekMatch = matchesCronField(weekday, weekExpr)

    // In Quartz cron: if both day and week are specified (not ?), either can match.
    // If one is ?, use the other.
    const dayIsNoSpecific = dayExpr === '?'
    const weekIsNoSpecific = weekExpr === '?'

    let dateMatch: boolean
    if (dayIsNoSpecific && weekIsNoSpecific) {
      dateMatch = true
    } else if (dayIsNoSpecific) {
      dateMatch = weekMatch
    } else if (weekIsNoSpecific) {
      dateMatch = dayMatch
    } else {
      // Both specified — OR semantics (Quartz)
      dateMatch = dayMatch || weekMatch
    }

    if (!dateMatch) {
      // Skip to next day
      current = new Date(year, month - 1, day + 1, 0, 0, 0, 0)
      continue
    }

    // Hour check
    if (!matchesCronField(hour, hourExpr)) {
      // Skip to next hour
      current = new Date(year, month - 1, day, hour + 1, 0, 0, 0)
      continue
    }

    // Minute check
    if (!matchesCronField(minute, minExpr)) {
      // Skip to next minute
      current = new Date(year, month - 1, day, hour, minute + 1, 0, 0)
      continue
    }

    // Second check
    if (!matchesCronField(second, secExpr)) {
      current = new Date(year, month - 1, day, hour, minute, second + 1, 0)
      continue
    }

    results.push(new Date(current))
    current = new Date(year, month - 1, day, hour, minute, second + 1, 0)
  }

  return results
}
