import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import DeleteReportButton from '@/components/admin/DeleteReportButton'


export default async function ReportsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/reports')

  const supabase = await createClient()
  const { data: reports } = await supabase
    .from('weekly_reports')
    .select('id, project_name, period_start, period_end, activities, next_plan, issues, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>주간보고</h1>
          <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>총 {reports?.length ?? 0}건</p>
        </div>
        <Link href="/reports/new"
          style={{ background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff', padding: '10px 20px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          + 새 보고서
        </Link>
      </div>

      {!reports?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          아직 제출한 보고서가 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reports.map(r => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 10px rgba(240,160,190,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{r.project_name}</span>
                  <div style={{ fontSize: 13, color: '#9d7a8a', marginTop: 4 }}>
                    {r.period_start} ~ {r.period_end}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: '#c4a8b8' }}>
                    {new Date(r.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  <Link href={`/reports/${r.id}/edit`}
                    style={{ padding: '5px 12px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 8, color: '#e06b9a', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
                    수정
                  </Link>
                  <DeleteReportButton id={r.id} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#fdf6f9', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#9d7a8a', marginBottom: 6 }}>이번 주 활동</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#5c4a5a', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{r.activities}</p>
                </div>
                <div style={{ background: '#fdf6f9', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#9d7a8a', marginBottom: 6 }}>다음 주 계획</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#5c4a5a', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{r.next_plan}</p>
                </div>
              </div>
              {r.issues && (
                <div style={{ marginTop: 10, background: '#fef9c3', borderRadius: 10, padding: '10px 14px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#b45309' }}>이슈: </span>
                  <span style={{ fontSize: 13, color: '#5c4a5a' }}>{r.issues}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
