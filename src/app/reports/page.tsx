import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import DeleteReportButton from '@/components/admin/DeleteReportButton'
import ReportMonthFilter from '@/components/ReportMonthFilter'

function getWeekOfMonth(dateStr: string): number {
  return Math.ceil(new Date(dateStr).getDate() / 7)
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/reports')

  const supabase = await createClient()
  const { data: allReports } = await supabase
    .from('weekly_reports')
    .select('id, project_name, period_start, period_end, activities, next_plan, issues, feedback, created_at')
    .eq('user_id', user.id)
    .order('period_start', { ascending: false })

  const isAdmin = user.role === 'superadmin' || user.role === 'admin'
  const today = new Date().toISOString().slice(0, 10)
  const now = new Date()
  const params = await searchParams

  // 보유한 연도 목록
  const yearSet = new Set<number>()
  for (const r of allReports ?? []) yearSet.add(new Date(r.period_start).getFullYear())
  if (!yearSet.size) yearSet.add(now.getFullYear())
  const years = Array.from(yearSet).sort((a, b) => b - a)

  const selectedYear = params.year ? parseInt(params.year) : years[0]

  // 선택 연도에서 보유한 월 목록
  const monthSet = new Set<number>()
  for (const r of allReports ?? []) {
    const d = new Date(r.period_start)
    if (d.getFullYear() === selectedYear) monthSet.add(d.getMonth() + 1)
  }
  const availableMonths = Array.from(monthSet).sort((a, b) => a - b)

  const selectedMonth = params.month
    ? parseInt(params.month)
    : availableMonths.includes(now.getMonth() + 1)
      ? now.getMonth() + 1
      : availableMonths[availableMonths.length - 1] ?? now.getMonth() + 1

  // 선택 연도+월 필터링 후 주차 그룹
  const filtered = (allReports ?? []).filter(r => {
    const d = new Date(r.period_start)
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth
  })

  const byWeek = new Map<number, typeof filtered>()
  for (const r of filtered) {
    const week = getWeekOfMonth(r.period_start)
    if (!byWeek.has(week)) byWeek.set(week, [])
    byWeek.get(week)!.push(r)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>주간보고</h1>
          <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>총 {allReports?.length ?? 0}건</p>
        </div>
        <Link href="/reports/new"
          style={{ background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff', padding: '10px 20px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          + 새 보고서
        </Link>
      </div>

      <Suspense>
        <ReportMonthFilter
          years={years}
          months={availableMonths}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      </Suspense>

      {!filtered.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          {selectedYear}년 {selectedMonth}월에 제출한 보고서가 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {Array.from(byWeek.entries()).map(([week, weekReports]) => (
            <div key={week}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: '#db2777',
                  background: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
                  border: '1px solid #fda4c8', borderRadius: 20, padding: '4px 14px',
                }}>
                  {week}주차
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8, borderLeft: '2px solid #ffd6e7' }}>
                {weekReports.map(r => (
                  <div key={r.id} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 10px rgba(240,160,190,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{r.project_name}</span>
                        <div style={{ fontSize: 12, color: '#9d7a8a', marginTop: 2 }}>
                          {r.period_start} ~ {r.period_end}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {isAdmin || r.period_end >= today ? (
                          <>
                            <Link href={`/reports/${r.id}/edit`}
                              style={{ padding: '5px 12px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 8, color: '#e06b9a', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
                              수정
                            </Link>
                            <DeleteReportButton id={r.id} />
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: '#c4a8b8', padding: '5px 10px', background: '#fdf6f9', borderRadius: 8, border: '1px solid #ffd6e7' }}>
                            🔒 마감
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid-2col-sm">
                      <div style={{ background: '#fdf6f9', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#9d7a8a', marginBottom: 6 }}>이번 주 활동</div>
                        <p style={{ margin: 0, fontSize: 13, color: '#5c4a5a', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{r.activities}</p>
                      </div>
                      <div style={{ background: '#fdf6f9', borderRadius: 10, padding: '12px 14px' }}>
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
                    {r.feedback && (
                      <div style={{ marginTop: 10, background: 'linear-gradient(135deg, #fce7f3, #fdf4ff)', borderRadius: 10, padding: '10px 14px', border: '1px solid #fda4c8' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#e06b9a' }}>💬 피드백: </span>
                        <span style={{ fontSize: 13, color: '#5c4a5a' }}>{r.feedback}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
