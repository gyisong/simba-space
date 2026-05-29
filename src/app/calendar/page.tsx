import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import CalendarEventForm from '@/components/CalendarEventForm'
import CalendarClient from '@/components/CalendarClient'

export default async function CalendarPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/calendar')

  const supabase = await createClient()
  const [{ data: allEvents }, { data: profiles }] = await Promise.all([
    supabase
      .from('calendar_events')
      .select('id, title, event_date, category, note, user_id')
      .order('event_date', { ascending: false }),
    supabase.from('user_profiles').select('id, name'),
  ])

  const nameMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.name]))
  const isAdmin = user.role === 'admin' || user.role === 'superadmin'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>캘린더</h1>
          <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>전체 {allEvents?.length ?? 0}건</p>
        </div>
        <CalendarEventForm userId={user.id} />
      </div>

      <CalendarClient
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allEvents={(allEvents ?? []) as any}
        nameMap={nameMap}
        userId={user.id}
        isAdmin={isAdmin}
      />
    </div>
  )
}
