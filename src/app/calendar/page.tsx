import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import CalendarEventForm from '@/components/CalendarEventForm'
import DeleteCalendarEventButton from '@/components/admin/DeleteCalendarEventButton'
import ReportMonthFilter from '@/components/ReportMonthFilter'

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  외근: { bg: '#dbeafe', color: '#1d4ed8' },
  출장: { bg: '#ede9fe', color: '#7c3aed' },
  휴가: { bg: '#dcfce7', color: '#16a34a' },
  대회의실: { bg: '#fef9c3', color: '#b45309' },
  공통: { bg: '#fdf2f8', color: '#e06b9a' },
  기타: { bg: '#f3f4f6', color: '#6b7280' },
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/calendar')

  const supabase = await createClient()
  const params = await searchParams
  const now = new Date()

  const [{ data: allEvents }, { data: profiles }] = await Promise.all([
    supabase
      .from('calendar_events')
      .select('id, title, event_date, category, note, user_id')
      .order('event_date', { ascending: false }),
    supabase.from('user_profiles').select('id, name'),
  ])

  const nameMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.name]))

  const yearSet = new Set<number>()
  for (const ev of allEvents ?? []) yearSet.add(new Date(ev.event_date + 'T12:00:00').getFullYear())
  if (!yearSet.size) yearSet.add(now.getFullYear())
  const years = Array.from(yearSet).sort((a, b) => b - a)

  const selectedYear = params.year ? parseInt(params.year) : years[0]

  const monthSet = new Set<number>()
  for (const ev of allEvents ?? []) {
    const d = new Date(ev.event_date + 'T12:00:00')
    if (d.getFullYear() === selectedYear) monthSet.add(d.getMonth() + 1)
  }
  const availableMonths = Array.from(monthSet).sort((a, b) => a - b)

  const selectedMonth = params.month
    ? parseInt(params.month)
    : availableMonths.includes(now.getMonth() + 1)
      ? now.getMonth() + 1
      : availableMonths[availableMonths.length - 1] ?? now.getMonth() + 1

  const filtered = (allEvents ?? []).filter(ev => {
    const d = new Date(ev.event_date + 'T12:00:00')
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth
  }).sort((a, b) => a.event_date.localeCompare(b.event_date))

  const byDay = new Map<string, typeof filtered>()
  for (const ev of filtered) {
    if (!byDay.has(ev.event_date)) byDay.set(ev.event_date, [])
    byDay.get(ev.event_date)!.push(ev)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>캘린더</h1>
          <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>전체 {allEvents?.length ?? 0}건</p>
        </div>
        <CalendarEventForm userId={user.id} />
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
          {selectedYear}년 {selectedMonth}월 일정이 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {Array.from(byDay.entries()).map(([date, dayEvents]) => (
            <div key={date}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#9d7a8a', marginBottom: 8, paddingLeft: 4 }}>
                {new Date(date + 'T12:00:00').toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dayEvents.map(ev => {
                  const c = CATEGORY_COLORS[ev.category] ?? CATEGORY_COLORS['기타']
                  const canDelete = ev.user_id === user.id || user.role === 'admin' || user.role === 'superadmin'
                  return (
                    <div key={ev.id} style={{ background: '#fff', borderRadius: 12, padding: '12px 18px', boxShadow: '0 2px 8px rgba(240,160,190,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: c.bg, color: c.color, fontWeight: 600 }}>
                          {ev.category}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#4a2d40' }}>{ev.title}</span>
                        <span style={{ fontSize: 12, color: '#c4a8b8' }}>{nameMap[ev.user_id] ?? ''}</span>
                        {ev.note && <span style={{ fontSize: 12, color: '#9d7a8a' }}>· {ev.note}</span>}
                      </div>
                      {canDelete && <DeleteCalendarEventButton id={ev.id} />}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
