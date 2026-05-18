'use client'

import { createClient } from '@/lib/supabase/client'

export default function ToggleHiddenButton({ id, isHidden }: { id: string; isHidden: boolean }) {
  async function toggle() {
    const supabase = createClient()
    await supabase.from('guestbook').update({ is_hidden: !isHidden }).eq('id', id)
    window.location.reload()
  }

  return (
    <button onClick={toggle} style={{
      padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
      background: isHidden ? '#fef2f2' : '#f3f4f6',
      border: isHidden ? '1px solid #fecaca' : '1px solid #e5e7eb',
      color: isHidden ? '#ef4444' : '#6b7280',
    }}>
      {isHidden ? '숨김' : '공개'}
    </button>
  )
}
