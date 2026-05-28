import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import ReportForm from '@/components/ReportForm'
import { getMondayOf, getSundayOf } from '@/lib/week'

export default async function NewReportPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/reports/new')

  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)
  const monday = getMondayOf(today)
  const sunday = getSundayOf(monday)
  const { data: existing } = await supabase
    .from('weekly_reports')
    .select('id, project_name, period_start, period_end')
    .eq('user_id', user.id)
    .gte('period_start', monday)
    .lte('period_start', sunday)
    .single()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>주간보고 제출</h1>

      {existing && (
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 16,
          padding: '16px 20px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#92400e', marginBottom: 4 }}>
              ⚠️ 이번 주 보고서가 이미 있어요
            </div>
            <div style={{ fontSize: 13, color: '#b45309' }}>
              {existing.project_name} · {existing.period_start} ~ {existing.period_end}
            </div>
          </div>
          <Link href={`/reports/${existing.id}/edit`} style={{
            padding: '8px 18px', background: '#f59e0b', border: 'none', borderRadius: 10,
            color: '#fff', fontWeight: 600, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            기존 보고서 수정하기
          </Link>
        </div>
      )}

      <ReportForm userId={user.id} />
    </div>
  )
}
