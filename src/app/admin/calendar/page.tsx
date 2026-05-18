import { createClient } from '@/lib/supabase/server'
import DeleteCalendarEventButton from '@/components/admin/DeleteCalendarEventButton'

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  외근: { bg: '#dbeafe', color: '#1d4ed8' },
  출장: { bg: '#ede9fe', color: '#7c3aed' },
  휴가: { bg: '#dcfce7', color: '#16a34a' },
  대회의실: { bg: '#fef9c3', color: '#b45309' },
  공통: { bg: '#fdf2f8', color: '#e06b9a' },
  기타: { bg: '#f3f4f6', color: '#6b7280' },
}

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-')
  return `${year}년 ${parseInt(month)}월`
}

export default async function AdminCalendarPage() {
  const supabase = await createClient()

  const [{ data: events }, { data: profiles }] = await Promise.all([
    supabase
      .from('calendar_events')
      .select('id, title, event_date, category, note, user_id')
      .order('event_date', { ascending: false }),
    supabase.from('user_profiles').select('id, name'),
  ])

  const nameMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.name]))

  // 월별 → 날짜별 2단계 그룹
  const byMonth = new Map<string, Map<string, typeof events>>()
  for (const ev of events ?? []) {
    const mKey = getMonthKey(ev.event_date)
    if (!byMonth.has(mKey)) byMonth.set(mKey, new Map())
    const byDay = byMonth.get(mKey)!
    if (!byDay.has(ev.event_date)) byDay.set(ev.event_date, [])
    byDay.get(ev.event_date)!.push(ev)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>🗓️ 캘린더 관리</h1>
        <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>전체 {events?.length ?? 0}건</p>
      </div>

      {!events?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          등록된 일정이 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {Array.from(byMonth.entries()).map(([monthKey, byDay]) => (
            <div key={monthKey}>
              {/* 월 헤더 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>{getMonthLabel(monthKey)}</span>
                <span style={{ fontSize: 12, color: '#c4a8b8', background: '#fdf2f8', borderRadius: 20, padding: '2px 10px' }}>
                  {Array.from(byDay.values()).reduce((s, v) => s + (v?.length ?? 0), 0)}건
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {Array.from(byDay.entries()).map(([date, dayEvents]) => (
                  <div key={date}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#9d7a8a', marginBottom: 8, paddingLeft: 4 }}>
                      {new Date(date + 'T12:00:00').toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {dayEvents?.map(ev => {
                        const c = CATEGORY_COLORS[ev.category] ?? CATEGORY_COLORS['기타']
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
                            <DeleteCalendarEventButton id={ev.id} />
                          </div>
                        )
                      })}
                    </div>
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
