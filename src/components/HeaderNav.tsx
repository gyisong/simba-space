'use client'

import Link from 'next/link'
import { useState } from 'react'
import NavLinks from './NavLinks'
import LogoutButton from './LogoutButton'

interface HeaderNavProps {
  userName?: string
  showReports: boolean
  showCalendar: boolean
  showAdmin: boolean
}

export default function HeaderNav({ userName, showReports, showCalendar, showAdmin }: HeaderNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="메뉴 열기/닫기"
        aria-expanded={open}
      >
        {open ? '✕' : '☰'}
      </button>
      <nav className={`header-nav${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
        <NavLinks showReports={showReports} showCalendar={showCalendar} showAdmin={showAdmin} />
        {userName ? (
          <LogoutButton name={userName} />
        ) : (
          <Link
            href="/login"
            style={{
              background: 'linear-gradient(135deg, #f472b6, #db2777)',
              color: '#fff', padding: '6px 16px', borderRadius: 20,
              textDecoration: 'none', fontWeight: 600,
            }}
          >
            로그인
          </Link>
        )}
      </nav>
    </>
  )
}
