'use client'

import { useState } from 'react'

export default function GuestbookForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const input: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
    borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    color: '#2d1f29',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '오류가 발생했습니다.')
        return
      }
      setDone(true)
      setName('')
      setMessage('')
      setPassword('')
      setTimeout(() => { setDone(false); window.location.reload() }, 1500)
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(240,160,190,0.1)', marginBottom: 28 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#4a2d40' }}>💌 방명록 남기기</h3>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 12 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 10, marginBottom: 12 }}>
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="이름" style={input} />
        <input value={message} onChange={e => setMessage(e.target.value)} required placeholder="메시지를 남겨주세요 🌸" style={input} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="비밀번호" style={input} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#c4a8b8' }}>비밀번호는 나중에 삭제할 때 사용됩니다.</span>
        <button type="submit" disabled={loading}
          style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          {done ? '✓ 등록됐어요!' : loading ? '등록 중...' : '남기기'}
        </button>
      </div>
    </form>
  )
}
