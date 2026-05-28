import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import GuestbookForm from '@/components/GuestbookForm'
import GuestbookDeleteButton from '@/components/GuestbookDeleteButton'

function maskIP(ip: string | null): string | null {
  if (!ip || ip === 'unknown') return null
  const parts = ip.split('.')
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.xxx.xxx`
  return ip.slice(0, 8) + '...'
}

export default async function GuestbookPage() {
  const supabase = await createClient()
  const [{ data: entries }, user] = await Promise.all([
    supabase
      .from('guestbook')
      .select('id, name, message, created_at, ip_address, password_hash')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false }),
    getCurrentUser(),
  ])

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: '#4a2d40' }}>방명록 💌</h1>
      <p style={{ margin: '0 0 28px', color: '#9d7a8a', fontSize: 14 }}>simba에게 메시지를 남겨주세요 🌸</p>

      <GuestbookForm isLoggedIn={!!user} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!entries?.length ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', color: '#b8a0b0' }}>
            아직 방명록이 없어요. 첫 번째 메시지를 남겨주세요!
          </div>
        ) : entries.map(entry => {
          const maskedIP = maskIP(entry.ip_address)
          return (
            <div key={entry.id} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: '0 2px 10px rgba(240,160,190,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#4a2d40' }}>🌸 {entry.name}</span>
                  <span style={{ fontSize: 12, color: '#c4a8b8' }}>
                    {new Date(entry.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  {maskedIP && (
                    <span style={{ fontSize: 11, color: '#d4a8b8' }}>{maskedIP}</span>
                  )}
                </div>
                <GuestbookDeleteButton id={entry.id} isAdmin={isAdmin} hasPassword={!!entry.password_hash} />
              </div>
              <p style={{ margin: 0, fontSize: 14, color: '#5c4a5a', lineHeight: 1.7 }}>{entry.message}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
