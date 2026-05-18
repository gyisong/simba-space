import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  return (
    <header style={{ background: '#fff0f5', borderBottom: '1px solid #ffd6e7' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: '#e06b9a', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          🌸 simba&apos;s space
        </Link>
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 14 }}>
          <Link href="/portfolio" style={{ color: '#7c5c6e', textDecoration: 'none' }}>포트폴리오</Link>
          <Link href="/guestbook" style={{ color: '#7c5c6e', textDecoration: 'none' }}>방명록</Link>
          <Link href="/contact" style={{ color: '#7c5c6e', textDecoration: 'none' }}>문의</Link>
          {user && (
            <>
              <Link href="/reports" style={{ color: '#7c5c6e', textDecoration: 'none' }}>주간보고</Link>
              <Link href="/calendar" style={{ color: '#7c5c6e', textDecoration: 'none' }}>캘린더</Link>
            </>
          )}
          {isAdmin && (
            <Link href="/admin" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: 600 }}>관리</Link>
          )}
          {user ? (
            <LogoutButton name={user.name} />
          ) : (
            <Link href="/login" style={{ background: '#f9a8c9', color: '#fff', padding: '6px 16px', borderRadius: 20, textDecoration: 'none', fontWeight: 600 }}>
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
