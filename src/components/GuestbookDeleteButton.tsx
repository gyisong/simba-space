'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GuestbookDeleteButton({ id, isAdmin }: { id: string; isAdmin: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (isAdmin) {
      if (!confirm('이 방명록을 삭제하시겠습니까?')) return
      await fetch(`/api/guestbook/${id}`, { method: 'DELETE' })
      router.refresh()
      return
    }
    setOpen(true)
  }

  async function handlePasswordDelete(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch(`/api/guestbook/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? '오류가 발생했습니다.')
      setLoading(false)
      return
    }
    router.refresh()
  }

  if (open) {
    return (
      <form onSubmit={handlePasswordDelete} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              autoFocus
              style={{ padding: '4px 10px', border: '1px solid #ffd6e7', borderRadius: 6, fontSize: 12, outline: 'none', width: 100, fontFamily: 'inherit' }}
            />
            <button type="submit" disabled={loading}
              style={{ padding: '4px 10px', background: '#ef4444', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              확인
            </button>
            <button type="button" onClick={() => { setOpen(false); setError('') }}
              style={{ padding: '4px 10px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 6, color: '#9d7a8a', fontSize: 12, cursor: 'pointer' }}>
              취소
            </button>
          </div>
          {error && <span style={{ fontSize: 11, color: '#ef4444' }}>{error}</span>}
        </div>
      </form>
    )
  }

  return (
    <button onClick={handleDelete}
      style={{ padding: '3px 10px', background: '#fff', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
      삭제
    </button>
  )
}
