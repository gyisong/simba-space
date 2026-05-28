'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPhotoDeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('사진을 삭제하시겠습니까? 댓글도 모두 삭제됩니다.')) return
    setLoading(true)
    await fetch(`/api/photos/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      style={{ padding: '4px 10px', background: '#fff', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', fontSize: 12, cursor: loading ? 'not-allowed' : 'pointer', flexShrink: 0 }}>
      {loading ? '...' : '삭제'}
    </button>
  )
}
