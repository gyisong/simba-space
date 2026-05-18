import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ReportForm from '@/components/ReportForm'

export default async function NewReportPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/reports/new')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>주간보고 제출</h1>
      <ReportForm userId={user.id} />
    </div>
  )
}
