'use client'

import { createClient } from '@/lib/supabase/client'

export default function ToggleReadButton({ id, isRead }: { id: string; isRead: boolean }) {
  async function toggle() {
    const supabase = createClient()
    await supabase.from('contact_messages').update({ is_read: !isRead }).eq('id', id)
    window.location.reload()
  }

  return (
    <button onClick={toggle} style={{
      padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
      background: isRead ? '#f3f4f6' : '#dcfce7',
      border: isRead ? '1px solid #e5e7eb' : '1px solid #bbf7d0',
      color: isRead ? '#6b7280' : '#16a34a',
    }}>
      {isRead ? '읽음' : '미확인'}
    </button>
  )
}
