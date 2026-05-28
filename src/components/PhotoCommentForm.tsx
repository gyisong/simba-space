'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  photoId: string
  parentId?: string
  isLoggedIn: boolean
  onCancel?: () => void
}

export default function PhotoCommentForm({ photoId, parentId, isLoggedIn, onCancel }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', border: '1px solid #ffd6e7',
    borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', color: '#2d1f29',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/photos/${photoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, password: password || undefined, parent_id: parentId }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? '오류가 발생했습니다.'); return }
      setName(''); setMessage(''); setPassword('')
      router.refresh()
      onCancel?.()
    } catch (e) {
      setError('오류: ' + String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 6, padding: '6px 10px', fontSize: 12 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: isLoggedIn ? '1fr' : '1fr 1fr', gap: 8 }}>
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="이름" maxLength={50} autoComplete="off" style={inputStyle} />
        {!isLoggedIn && (
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="비밀번호 (삭제 시 사용)" maxLength={100} autoComplete="new-password" style={inputStyle} />
        )}
      </div>
      <textarea
        value={message} onChange={e => setMessage(e.target.value)} required
        placeholder="댓글을 남겨주세요 🌸" rows={2} maxLength={300}
        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
      />
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ padding: '7px 16px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 8, color: '#9d7a8a', fontSize: 13, cursor: 'pointer' }}>
            취소
          </button>
        )}
        <button type="submit" disabled={loading} style={{ padding: '7px 16px', background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '등록 중...' : '등록'}
        </button>
      </div>
    </form>
  )
}
