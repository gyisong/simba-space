'use client'

import { createClient } from '@/lib/supabase/client'

export default function DeleteProjectButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const supabase = createClient()
    await supabase.from('projects').delete().eq('id', id)
    window.location.reload()
  }

  return (
    <button onClick={handleDelete}
      style={{ padding: '6px 14px', background: '#fff', border: '1px solid #fecaca', borderRadius: 8, color: '#ef4444', fontSize: 13, cursor: 'pointer' }}>
      삭제
    </button>
  )
}
