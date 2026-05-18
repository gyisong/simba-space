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
    { href: '/admin/projects', emoji: '🌍', title: '사업 관리', desc: `${projectCount ?? 0}개 등록됨`, color: '#fdf2f8' },
    { href: '/admin/messages', emoji: '📬', title: '문의 메시지', desc: `미확인 ${messageCount ?? 0}건`, color: '#eff6ff' },
    { href: '/admin/guestbook', emoji: '💌', title: '방명록 관리', desc: `${guestbookCount ?? 0}개`, color: '#f0fdf4' },
    { href: '/admin/reports', emoji: '📋', title: '주간보고', desc: '팀 전체 조회', color: '#fef9c3' },
    { href: '/admin/calendar', emoji: '📅', title: '캘린더', desc: '이번 달 일정', color: '#ecfdf5' },
    { href: '/admin/diary', emoji: '📔', title: '다이어리', desc: '나만의 기록', color: '#fefce8' },
    ...(user?.role === 'superadmin' ? [{ href: '/admin/users', emoji: '👥', title: '계정 관리', desc: '팀원 관리', color: '#f5f3ff' }] : []),
  ]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#4a2d40' }}>관리자 대시보드</h1>
        <p style={{ margin: '6px 0 0', color: '#9d7a8a', fontSize: 14 }}>안녕하세요, {user?.name} 님 👋</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map(card => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: card.color, borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(240,160,190,0.1)', cursor: 'pointer' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{card.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40', marginBottom: 4 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: '#9d7a8a' }}>{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
