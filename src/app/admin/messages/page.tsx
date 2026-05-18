import { createClient } from '@/lib/supabase/server'
import ToggleReadButton from '@/components/admin/ToggleReadButton'

export default async function AdminMessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  const unreadCount = messages?.filter(m => !m.is_read).length ?? 0

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>문의 메시지</h1>
        <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>
          미확인 {unreadCount}건 / 전체 {messages?.length ?? 0}건
        </p>
      </div>

      {!messages?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          문의 메시지가 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map(m => (
            <div key={m.id} style={{
              background: '#fff', borderRadius: 16, padding: '20px 24px',
              boxShadow: '0 2px 10px rgba(240,160,190,0.08)',
              borderLeft: m.is_read ? '3px solid #e5e7eb' : '3px solid #fda4c8',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{m.name}</span>
                  <span style={{ marginLeft: 10, fontSize: 13, color: '#9d7a8a' }}>{m.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: '#c4a8b8' }}>
                    {new Date(m.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  <ToggleReadButton id={m.id} isRead={m.is_read} />
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: '#5c4a5a', lineHeight: 1.7 }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
