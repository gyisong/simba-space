import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  const supabase = await createClient()

  const [{ count: projectCount }, { count: messageCount }, { count: guestbookCount }] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('guestbook').select('*', { count: 'exact', head: true }),
  ])

  const cards = [
    { href: '/admin/projects', emoji: '🌿', title: '사업 관리', desc: `${projectCount ?? 0}개 등록됨`, color: '#fdf2f8' },
    { href: '/admin/messages', emoji: '💬', title: '문의 메시지', desc: `미확인 ${messageCount ?? 0}건`, color: '#fce7f3' },
    { href: '/admin/guestbook', emoji: '🌸', title: '방명록 관리', desc: `${guestbookCount ?? 0}개`, color: '#fdf4ff' },
    { href: '/admin/reports', emoji: '📈', title: '주간보고', desc: '팀 전체 조회', color: '#f0fdf4' },
    { href: '/admin/calendar', emoji: '🗓️', title: '캘린더', desc: '이번 달 일정', color: '#eff6ff' },
    { href: '/admin/diary', emoji: '🌷', title: '다이어리', desc: '나만의 기록', color: '#fff7ed' },
    { href: '/admin/users', emoji: '🔐', title: '계정 관리', desc: '팀원 초대·권한 관리', color: '#f5f3ff' },
  ]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#4a2d40' }}>simba 대시보드</h1>
        <p style={{ margin: '6px 0 0', color: '#9d7a8a', fontSize: 14 }}>안녕하세요, {user?.name} 님 👋</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map(card => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: card.color, borderRadius: 20, padding: '26px 24px', boxShadow: '0 4px 16px rgba(240,160,190,0.13)', border: '1px solid rgba(253,166,200,0.18)', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div style={{ fontSize: 36, marginBottom: 14, fontFamily: '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif', lineHeight: 1 }}>{card.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40', marginBottom: 5 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: '#b08898' }}>{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
