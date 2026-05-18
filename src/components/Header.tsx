import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import HeaderNav from './HeaderNav'

export default async function Header() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  return (
    <header style={{ background: '#fff0f5', borderBottom: '1px solid #ffd6e7' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: '#e06b9a', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          🌸 simba&apos;s space
        </Link>
        <HeaderNav
          userName={user?.name}
          showReports={!!user}
          showCalendar={!!user}
          showAdmin={isAdmin}
          showAnnouncements={!!user}
        />
      </div>
    </header>
  )
}
