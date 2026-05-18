import { createClient } from '@/lib/supabase/server'
import DeleteReportButton from '@/components/admin/DeleteReportButton'

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const [{ data: reports }, { data: profiles }] = await Promise.all([
    supabase
      .from('weekly_reports')
      .select('id, project_name, period_start, period_end, activities, next_plan, issues, created_at, user_id')
      .order('created_at', { ascending: false }),
    supabase.from('user_profiles').select('id, name'),
  ])

  const nameMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.name]))

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>주간보고 전체</h1>
        <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>전체 {reports?.length ?? 0}건</p>
      </div>

      {!reports?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          등록된 주간보고가 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reports.map(r => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 10px rgba(240,160,190,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{r.project_name}</span>
                    <span style={{ fontSize: 12, background: '#fdf2f8', color: '#e06b9a', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
                      {nameMap[r.user_id] ?? '알 수 없음'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: '#9d7a8a', marginTop: 4 }}>
                    {r.period_start} ~ {r.period_end}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: '#c4a8b8' }}>
                    제출: {new Date(r.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  <DeleteReportButton id={r.id} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#fdf6f9', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#9d7a8a', marginBottom: 6 }}>이번 주 활동</div>
                  <p style={{ margin: 0, fontSize: 13, color: '#5c4a5a', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{r.activities}</p>
                </div>
                <div style={{ background: '#fdf6f9', borderRadius: 10, padding: '12px 16px' }}>
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
