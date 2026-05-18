'use client'

import { createClient } from '@/lib/supabase/client'

export default function LogoutButton({ name }: { name: string }) {
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13, color: '#9d7a8a' }}>👋 {name}</span>
      <a
        href="/settings"
        style={{ background: 'none', border: '1px solid #ffd6e7', color: '#9d7a8a', padding: '4px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer', textDecoration: 'none' }}
      >
        비밀번호 변경
      </a>
      <button
        onClick={handleLogout}
        style={{ background: 'none', border: '1px solid #ffd6e7', color: '#9d7a8a', padding: '4px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer' }}
      >
        로그아웃
      </button>
    </div>
  )
}
