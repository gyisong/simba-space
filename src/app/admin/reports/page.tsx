import { createClient } from '@/lib/supabase/server'
import AdminReportsClient from '@/components/AdminReportsClient'

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const [{ data: allReports }, { data: profiles }] = await Promise.all([
    supabase
      .from('weekly_reports')
      .select('id, project_name, period_start, period_end, activities, next_plan, issues, feedback, created_at, user_id')
      .order('period_start', { ascending: false }),
    supabase.from('user_profiles').select('id, name'),
  ])

  const nameMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.name]))

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>📈 주간보고 전체</h1>
        <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>전체 {allReports?.length ?? 0}건</p>
      </div>

      <AdminReportsClient
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allReports={(allReports ?? []) as any}
        nameMap={nameMap}
      />
    </div>
  )
}
