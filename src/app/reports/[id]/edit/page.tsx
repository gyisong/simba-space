import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import ReportForm from '@/components/ReportForm'

export default async function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/reports')

  const supabase = await createClient()
  const { data: report } = await supabase
    .from('weekly_reports')
    .select('id, project_name, period_start, period_end, activities, next_plan, issues, user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!report) notFound()

  const isAdmin = user.role === 'superadmin' || user.role === 'admin'
  const today = new Date().toISOString().slice(0, 10)

  // period_start 기준 해당 주 일요일이 지났으면 마감
  const d = new Date(report.period_start)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1) + 6) // 해당 주 일요일
  const sundayOfWeek = d.toISOString().slice(0, 10)
  const isClosed = sundayOfWeek < today

  if (isClosed && !isAdmin) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>주간보고 수정</h1>
        <div style={{ background: '#fdf6f9', border: '1px solid #ffd6e7', borderRadius: 16, padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#4a2d40', marginBottom: 8 }}>마감된 보고서입니다</div>
          <div style={{ fontSize: 14, color: '#9d7a8a' }}>해당 주({report.period_start} 포함)의 일요일({sundayOfWeek})이 지나 수정할 수 없어요.</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>주간보고 수정</h1>
      <ReportForm
        userId={user.id}
        reportId={report.id}
        initialData={{
          project_name: report.project_name,
          period_start: report.period_start,
          period_end: report.period_end,
          activities: report.activities,
          next_plan: report.next_plan,
          issues: report.issues ?? '',
        }}
      />
    </div>
  )
}
