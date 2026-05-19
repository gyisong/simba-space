import { createClient } from '@/lib/supabase/server'
import AdminGuestbookEntry from '@/components/admin/AdminGuestbookEntry'

export default async function AdminGuestbookPage() {
  const supabase = await createClient()
  const { data: entries } = await supabase
    .from('guestbook')
    .select('id, name, message, created_at, is_hidden, ip_address')
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
            <AdminGuestbookEntry key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  )
}
