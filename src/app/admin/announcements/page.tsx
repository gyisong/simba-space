import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import AnnouncementForm from '@/components/admin/AnnouncementForm'
import AnnouncementDeleteButton from '@/components/admin/AnnouncementDeleteButton'

export default async function AdminAnnouncementsPage() {
  const user = await getCurrentUser()
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, content, is_pinned, created_at')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>📢 공지사항 관리</h1>
        <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>전체 {announcements?.length ?? 0}개</p>
      </div>

      <AnnouncementForm authorId={user!.id} />

      {!announcements?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          등록된 공지사항이 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {announcements.map(a => (
            <div key={a.id} style={{
              background: '#fff', borderRadius: 16, padding: '20px 24px',
              boxShadow: '0 2px 10px rgba(240,160,190,0.08)',
              borderLeft: a.is_pinned ? '3px solid #f472b6' : '3px solid #ffd6e7',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {a.is_pinned && (
                      <span style={{ fontSize: 12, background: '#fdf2f8', color: '#e06b9a', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                        📌 고정
                      </span>
                    )}
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{a.title}</span>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: 14, color: '#5c4a5a', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{a.content}</p>
                  <span style={{ fontSize: 12, color: '#c4a8b8' }}>
                    {new Date(a.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <AnnouncementDeleteButton id={a.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
