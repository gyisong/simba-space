import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from './LogoutButton'
import NavLinks from './NavLinks'

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
          <NavLinks showReports={!!user} showCalendar={!!user} showAdmin={isAdmin} />
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
