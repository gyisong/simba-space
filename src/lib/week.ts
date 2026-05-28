const DAYS = ['일', '월', '화', '수', '목', '금', '토']

/** dateStr 기준 해당 주 월요일 (YYYY-MM-DD) */
export function getMondayOf(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return d.toISOString().slice(0, 10)
}

/** 월요일 기준 해당 주 일요일 (YYYY-MM-DD) */
export function getSundayOf(mondayStr: string): string {
  const d = new Date(mondayStr)
  d.setDate(d.getDate() + 6)
  return d.toISOString().slice(0, 10)
}

/** "5/26(월) ~ 6/1(일)" 형식 레이블 */
export function formatWeekLabel(mondayStr: string, sundayStr: string): string {
  const fmt = (s: string) => {
    const d = new Date(s)
    return `${d.getMonth() + 1}/${d.getDate()}(${DAYS[d.getDay()]})`
  }
  return `${fmt(mondayStr)} ~ ${fmt(sundayStr)}`
}

/** dateStr이 속한 주의 일요일이 today보다 이전이면 마감 */
export function isWeekClosed(dateStr: string, today: string): boolean {
  const sunday = getSundayOf(getMondayOf(dateStr))
  return sunday < today
}
