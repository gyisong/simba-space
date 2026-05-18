'use client'

import { createClient } from '@/lib/supabase/client'

export default function AnnouncementDeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm('이 공지를 삭제할까요?')) return
    const supabase = createClient()
    await supabase.from('announcements').delete().eq('id', id)
    window.location.reload()
  }

  return (
    <button onClick={handleDelete} style={{
      background: 'none', border: '1px solid #fecaca', color: '#ef4444',
      padding: '4px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
    }}>
      삭제
    </button>
  )
}
