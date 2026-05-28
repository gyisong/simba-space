'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', border: '1px solid #ffd6e7',
  borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', color: '#2d1f29',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6,
}

export default function NicknameForm({ currentName }: { currentName: string }) {
  const router = useRouter()
  const [name, setName] = useState(currentName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? '오류가 발생했습니다.'); return }
      setDone(true)
      setTimeout(() => { setDone(false); router.refresh() }, 1500)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#ef4444', fontSize: 13 }}>
          {error}
        </div>
      )}
      {done && (
        <div style={{ background: '#fdf2f8', border: '1px solid #ffd6e7', borderRadius: 10, padding: '10px 14px', color: '#db2777', fontSize: 13 }}>
          ✓ 닉네임이 변경되었어요!
        </div>
      )}
      <div>
        <label style={labelStyle}>닉네임 *</label>
        <input value={name} onChange={e => setName(e.target.value)} required maxLength={20} placeholder="닉네임을 입력하세요" style={inputStyle} />
      </div>
      <button type="submit" disabled={loading} style={{
        width: '100%', padding: '13px',
        background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #f472b6, #db2777)',
        border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15,
        cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
      }}>
        {loading ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
