import { createClient } from '@/lib/supabase/server'
import ToggleHiddenButton from '@/components/admin/ToggleHiddenButton'

export default async function AdminGuestbookPage() {
  const supabase = await createClient()
  const { data: entries } = await supabase
    .from('guestbook')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>방명록 관리</h1>
        <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>전체 {entries?.length ?? 0}개</p>
      </div>

      {!entries?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          방명록이 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map(e => (
            <div key={e.id} style={{
              background: '#fff', borderRadius: 14, padding: '16px 20px',
              boxShadow: '0 2px 8px rgba(240,160,190,0.07)',
              opacity: e.is_hidden ? 0.55 : 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#4a2d40' }}>{e.name}</span>
                  <span style={{ fontSize: 12, color: '#c4a8b8' }}>
                    {new Date(e.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <ToggleHiddenButton id={e.id} isHidden={e.is_hidden} />
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#5c4a5a', lineHeight: 1.7 }}>{e.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
