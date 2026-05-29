'use client'

import { useState } from 'react'
import ReportMonthFilter from '@/components/ReportMonthFilter'
import DeleteCalendarEventButton from '@/components/admin/DeleteCalendarEventButton'

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  외근: { bg: '#dbeafe', color: '#1d4ed8' },
  출장: { bg: '#ede9fe', color: '#7c3aed' },
  휴가: { bg: '#dcfce7', color: '#16a34a' },
  대회의실: { bg: '#fef9c3', color: '#b45309' },
  공통: { bg: '#fdf2f8', color: '#e06b9a' },
  기타: { bg: '#f3f4f6', color: '#6b7280' },
}

type CalendarEvent = {
  id: string
  title: string
  event_date: string
  category: string
  note: string | null
  user_id: string
}

type Props = {
  allEvents: CalendarEvent[]
  nameMap: Record<string, string>
  userId: string
  isAdmin: boolean
}

function getYears(events: CalendarEvent[]) {
  const set = new Set<number>()
  for (const ev of events) set.add(new Date(ev.event_date + 'T12:00:00').getFullYear())
  if (!set.size) set.add(new Date().getFullYear())
  return Array.from(set).sort((a, b) => b - a)
}

function getMonths(events: CalendarEvent[], year: number) {
  const set = new Set<number>()
  for (const ev of events) {
    const d = new Date(ev.event_date + 'T12:00:00')
    if (d.getFullYear() === year) set.add(d.getMonth() + 1)
  }
  return Array.from(set).sort((a, b) => a - b)
}

function pickMonth(months: number[], now: Date) {
  const cur = now.getMonth() + 1
  return months.includes(cur) ? cur : months[months.length - 1] ?? cur
}

export default function CalendarClient({ allEvents, nameMap, userId, isAdmin }: Props) {
  const now = new Date()
  const years = getYears(allEvents)
  const initialMonths = getMonths(allEvents, years[0])

  const [selectedYear, setSelectedYear] = useState(years[0])
  const [selectedMonth, setSelectedMonth] = useState(pickMonth(initialMonths, now))

  const availableMonths = getMonths(allEvents, selectedYear)

  function handleYearChange(year: number) {
    const months = getMonths(allEvents, year)
    setSelectedYear(year)
    setSelectedMonth(pickMonth(months, now))
  }

  const filtered = allEvents
    .filter(ev => {
      const d = new Date(ev.event_date + 'T12:00:00')
      return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth
    })
    .sort((a, b) => a.event_date.localeCompare(b.event_date))

  const byDay = new Map<string, typeof filtered>()
  for (const ev of filtered) {
    if (!byDay.has(ev.event_date)) byDay.set(ev.event_date, [])
    byDay.get(ev.event_date)!.push(ev)
  }

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
                  const canDelete = isAdmin || ev.user_id === userId
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
    </>
  )
}
