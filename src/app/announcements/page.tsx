import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export default async function AnnouncementsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/announcements')

  const supabase = await createClient()
  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, content, is_pinned, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>📢 공지사항</h1>
        <p style={{ margin: '6px 0 0', color: '#9d7a8a', fontSize: 13 }}>팀 공지를 확인하세요</p>
      </div>

      {!announcements?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          아직 공지사항이 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {announcements.map(a => (
            <div key={a.id} style={{
              background: '#fff', borderRadius: 16, padding: '22px 26px',
              boxShadow: '0 2px 12px rgba(240,160,190,0.1)',
              borderLeft: a.is_pinned ? '4px solid #f472b6' : '4px solid #ffd6e7',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {a.is_pinned && (
                  <span style={{ fontSize: 12, background: 'linear-gradient(135deg, #fce7f3, #fdf4ff)', color: '#e06b9a', padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>
                    📌 고정
                  </span>
                )}
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>{a.title}</h2>
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 14, color: '#5c4a5a', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{a.content}</p>
              <span style={{ fontSize: 12, color: '#c4a8b8' }}>
                {new Date(a.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
