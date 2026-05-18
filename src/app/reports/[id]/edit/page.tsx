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
