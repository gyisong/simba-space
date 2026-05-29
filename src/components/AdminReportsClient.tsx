'use client'

import { useState } from 'react'
import ReportMonthFilter from '@/components/ReportMonthFilter'
import DeleteReportButton from '@/components/admin/DeleteReportButton'
import ReportFeedbackForm from '@/components/admin/ReportFeedbackForm'
import { getMondayOf, getSundayOf, formatWeekLabel } from '@/lib/week'

type Report = {
  id: string
  project_name: string
  period_start: string
  period_end: string
  activities: string
  next_plan: string
  issues: string | null
  feedback: string | null
  created_at: string
  user_id: string
}

type Props = {
  allReports: Report[]
  nameMap: Record<string, string>
}

function getYears(reports: Report[]) {
  const set = new Set<number>()
  for (const r of reports) set.add(new Date(r.period_start).getFullYear())
  if (!set.size) set.add(new Date().getFullYear())
  return Array.from(set).sort((a, b) => b - a)
}

function getMonths(reports: Report[], year: number) {
  const set = new Set<number>()
  for (const r of reports) {
    const d = new Date(r.period_start)
    if (d.getFullYear() === year) set.add(d.getMonth() + 1)
  }
  return Array.from(set).sort((a, b) => a - b)
}

function pickMonth(months: number[], now: Date) {
  const cur = now.getMonth() + 1
  return months.includes(cur) ? cur : months[months.length - 1] ?? cur
}

export default function AdminReportsClient({ allReports, nameMap }: Props) {
  const now = new Date()
  const years = getYears(allReports)
  const initialMonths = getMonths(allReports, years[0])

  const [selectedYear, setSelectedYear] = useState(years[0])
  const [selectedMonth, setSelectedMonth] = useState(pickMonth(initialMonths, now))

  const availableMonths = getMonths(allReports, selectedYear)

  function handleYearChange(year: number) {
    const months = getMonths(allReports, year)
    setSelectedYear(year)
    setSelectedMonth(pickMonth(months, now))
  }

  const filtered = allReports.filter(r => {
    const d = new Date(r.period_start)
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth
  })

  const byWeek = new Map<string, typeof filtered>()
  for (const r of filtered) {
    const monday = getMondayOf(r.period_start)
    if (!byWeek.has(monday)) byWeek.set(monday, [])
    byWeek.get(monday)!.push(r)
  }
  const sortedWeeks = Array.from(byWeek.entries()).sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <>
      <ReportMonthFilter
        years={years}
        months={availableMonths}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={handleYearChange}
        onMonthChange={setSelectedMonth}
      />

      {!filtered.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          {selectedYear}년 {selectedMonth}월에 제출된 보고서가 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {sortedWeeks.map(([monday, weekReports]) => {
            const sunday = getSundayOf(monday)
            return (
              <div key={monday}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: '#db2777',
                    background: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
                    border: '1px solid #fda4c8', borderRadius: 20, padding: '4px 14px',
                  }}>
                    {formatWeekLabel(monday, sunday)}
                  </span>
                  <span style={{ fontSize: 12, color: '#c4a8b8' }}>{weekReports.length}명 제출</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8, borderLeft: '2px solid #ffd6e7' }}>
                  {weekReports.map(r => (
                    <div key={r.id} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 10px rgba(240,160,190,0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{r.project_name}</span>
                          <span style={{ fontSize: 12, background: '#f5f3ff', color: '#7c3aed', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
                            {nameMap[r.user_id] ?? '알 수 없음'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                          <span style={{ fontSize: 12, color: '#c4a8b8' }}>{r.period_start} ~ {r.period_end}</span>
                          <DeleteReportButton id={r.id} />
                        </div>
                      </div>
                      <div className="grid-2col-sm">
                        <div style={{ background: '#fdf6f9', borderRadius: 10, padding: '12px 16px' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#9d7a8a', marginBottom: 6 }}>이번 주 활동</div>
                          <p style={{ margin: 0, fontSize: 13, color: '#5c4a5a', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{r.activities}</p>
                        </div>
                        <div style={{ background: '#fdf6f9', borderRadius: 10, padding: '12px 16px' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#9d7a8a', marginBottom: 6 }}>다음 주 계획</div>
                          <p style={{ margin: 0, fontSize: 13, color: '#5c4a5a', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{r.next_plan}</p>
                        </div>
                      </div>
                      {r.issues && (
                        <div style={{ marginTop: 10, background: '#fef9c3', borderRadius: 10, padding: '10px 14px' }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#b45309' }}>이슈: </span>
                          <span style={{ fontSize: 13, color: '#5c4a5a' }}>{r.issues}</span>
                        </div>
                      )}
                      <ReportFeedbackForm reportId={r.id} initialFeedback={r.feedback} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
