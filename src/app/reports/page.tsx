import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import ReportsClient from '@/components/ReportsClient'

export default async function ReportsPage() {
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

      <ReportsClient
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allReports={(allReports ?? []) as any}
        isAdmin={isAdmin}
        today={today}
      />
    </div>
  )
}
