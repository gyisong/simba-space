'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  photoId: string
  commentId: string
  isAdmin: boolean
  hasPassword: boolean
}

export default function PhotoCommentDeleteButton({ photoId, commentId, isAdmin, hasPassword }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isAdmin && !hasPassword) return null

  async function handleAdminDelete() {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    await fetch(`/api/photos/${photoId}/comments/${commentId}`, { method: 'DELETE' })
    router.refresh()
  }

  async function handlePasswordDelete(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch(`/api/photos/${photoId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? '오류가 발생했습니다.'); setLoading(false); return }
    router.refresh()
  }

  if (open) {
    return (
      <form onSubmit={handlePasswordDelete} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" required autoFocus
            style={{ padding: '3px 8px', border: '1px solid #ffd6e7', borderRadius: 6, fontSize: 12, outline: 'none', width: 90, fontFamily: 'inherit' }} />
          <button type="submit" disabled={loading} style={{ padding: '3px 8px', background: '#ef4444', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer' }}>
            {loading ? '...' : '확인'}
          </button>
          <button type="button" onClick={() => { setOpen(false); setError('') }} style={{ padding: '3px 8px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 6, color: '#9d7a8a', fontSize: 12, cursor: 'pointer' }}>
            취소
          </button>
        </div>
        {error && <span style={{ fontSize: 11, color: '#ef4444' }}>{error}</span>}
      </form>
    )
  }

  return (
    <button onClick={isAdmin ? handleAdminDelete : () => setOpen(true)}
      style={{ padding: '2px 8px', background: '#fff', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>
      삭제
    </button>
  )
}
