'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinksProps {
  showReports: boolean
  showCalendar: boolean
  showAdmin: boolean
}

export default function NavLinks({ showReports, showCalendar, showAdmin }: NavLinksProps) {
  const pathname = usePathname()

  function linkStyle(href: string, extra?: React.CSSProperties): React.CSSProperties {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href))
    return {
      color: active ? '#e06b9a' : '#7c5c6e',
      textDecoration: 'none',
      fontWeight: active ? 700 : 400,
      borderBottom: active ? '2px solid #e06b9a' : '2px solid transparent',
      paddingBottom: 2,
      ...extra,
    }
  }

  return (
    <>
      <Link href="/portfolio" style={linkStyle('/portfolio')}>포트폴리오</Link>
      <Link href="/guestbook" style={linkStyle('/guestbook')}>방명록</Link>
      <Link href="/contact" style={linkStyle('/contact')}>문의</Link>
      {showReports && <Link href="/reports" style={linkStyle('/reports')}>주간보고</Link>}
      {showCalendar && <Link href="/calendar" style={linkStyle('/calendar')}>캘린더</Link>}
      {showAdmin && (
        <Link href="/admin" style={linkStyle('/admin', { color: pathname.startsWith('/admin') ? '#a855f7' : '#c084fc', fontWeight: pathname.startsWith('/admin') ? 700 : 600 })}>관리</Link>
      )}
    </>
  )
}
