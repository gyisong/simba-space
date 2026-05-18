'use client'

import { createClient } from '@/lib/supabase/client'

export default function DeleteCalendarEventButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm('일정을 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('calendar_events').delete().eq('id', id)
    window.location.reload()
  }

  return (
    <button onClick={handleDelete}
      style={{ padding: '4px 12px', background: '#fff', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>
      삭제
    </button>
  )
}
