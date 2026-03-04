// Field type options
export type CronFieldType = 'every' | 'range' | 'specific' | 'interval' | 'noSpecific' | 'last' | 'weekday' | 'lastWeekday' | 'nthWeekday'

export interface CronField {
  type: CronFieldType
  values: number[]     // for 'specific': selected values
  start: number        // for 'range'/'interval': start value
  end: number          // for 'range': end value
  interval: number     // for 'interval': step
  week: number         // for 'nthWeekday': which weekday (0-6)
  nth: number          // for 'nthWeekday': nth occurrence (1-5)
}

export interface CronState {
  second: CronField
  minute: CronField
  hour: CronField
  day: CronField
  month: CronField
  week: CronField
  year: CronField
}

export const FIELD_RANGES = {
  second: { min: 0, max: 59, label: '秒' },
  minute: { min: 0, max: 59, label: '分' },
  hour: { min: 0, max: 23, label: '时' },
  day: { min: 1, max: 31, label: '日' },
  month: { min: 1, max: 12, label: '月' },
  week: { min: 0, max: 6, label: '周' },
  year: { min: 2024, max: 2099, label: '年' },
} as const

export const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六']
export const MONTH_LABELS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

export interface CronPreset {
  label: string
  expression: string
  description: string
}

export const CRON_PRESETS: CronPreset[] = [
  { label: '每秒', expression: '* * * * * ? *', description: '每秒执行一次' },
  { label: '每分钟', expression: '0 * * * * ? *', description: '每分钟执行一次' },
  { label: '每小时', expression: '0 0 * * * ? *', description: '每小时整点执行' },
  { label: '每天零点', expression: '0 0 0 * * ? *', description: '每天凌晨0点执行' },
  { label: '每天6点', expression: '0 0 6 * * ? *', description: '每天早上6点执行' },
  { label: '每天12点', expression: '0 0 12 * * ? *', description: '每天中午12点执行' },
  { label: '每周一', expression: '0 0 0 ? * 1 *', description: '每周一凌晨0点执行' },
  { label: '每月1号', expression: '0 0 0 1 * ? *', description: '每月1号凌晨0点执行' },
  { label: '每5分钟', expression: '0 0/5 * * * ? *', description: '每隔5分钟执行一次' },
  { label: '每30分钟', expression: '0 0/30 * * * ? *', description: '每隔30分钟执行一次' },
  { label: '工作日9点', expression: '0 0 9 ? * 1-5 *', description: '工作日早上9点执行' },
  { label: '每年1月1日', expression: '0 0 0 1 1 ? *', description: '每年1月1日零点执行' },
]

export function createDefaultField(min: number, max: number): CronField {
  return {
    type: 'every',
    values: [],
    start: min,
    end: max,
    interval: 1,
    week: 1,
    nth: 1,
  }
}

export function getDefaultCronState(): CronState {
  return {
    second: createDefaultField(FIELD_RANGES.second.min, FIELD_RANGES.second.max),
    minute: createDefaultField(FIELD_RANGES.minute.min, FIELD_RANGES.minute.max),
    hour: createDefaultField(FIELD_RANGES.hour.min, FIELD_RANGES.hour.max),
    day: createDefaultField(FIELD_RANGES.day.min, FIELD_RANGES.day.max),
    month: createDefaultField(FIELD_RANGES.month.min, FIELD_RANGES.month.max),
    week: createDefaultField(FIELD_RANGES.week.min, FIELD_RANGES.week.max),
    year: createDefaultField(FIELD_RANGES.year.min, FIELD_RANGES.year.max),
  }
}

export function buildFieldExpression(field: CronField): string {
  switch (field.type) {
    case 'every':
      return '*'
    case 'range':
      return `${field.start}-${field.end}`
    case 'specific':
      return [...field.values].sort((a, b) => a - b).join(',')
    case 'interval':
      return `${field.start}/${field.interval}`
    case 'noSpecific':
      return '?'
    case 'last':
      return 'L'
    case 'weekday':
      return `${field.start}W`
    case 'lastWeekday':
      return `${field.start}L`
    case 'nthWeekday':
      return `${field.week}#${field.nth}`
    default:
      return '*'
  }
}

export function buildCronExpression(state: CronState): string {
  const parts = [
    buildFieldExpression(state.second),
    buildFieldExpression(state.minute),
    buildFieldExpression(state.hour),
    buildFieldExpression(state.day),
    buildFieldExpression(state.month),
    buildFieldExpression(state.week),
    buildFieldExpression(state.year),
  ]
  return parts.join(' ')
}

const VALID_CRON_FIELD_PATTERN = /^(\*|L|\?|\d+([LW]|#\d+)?|(\d+-\d+)(\/\d+)?|\d+\/\d+|(\d+,)+\d+|\d+(,\d+)*)$/

export function validateCronExpression(expr: string): { valid: boolean; error?: string } {
  const trimmed = expr.trim()
  if (!trimmed) {
    return { valid: false, error: 'Cron expression cannot be empty' }
  }

  const fields = trimmed.split(/\s+/)
  if (fields.length < 5 || fields.length > 7) {
    return { valid: false, error: `Expected 5-7 fields, got ${fields.length}` }
  }

  for (let i = 0; i < fields.length; i++) {
    if (!VALID_CRON_FIELD_PATTERN.test(fields[i])) {
      return { valid: false, error: `Invalid value in field ${i + 1}: "${fields[i]}"` }
    }
  }

  return { valid: true }
}
