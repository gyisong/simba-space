'use client'

import { useState } from 'react'

const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
  borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  color: '#2d1f29',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6,
}

export default function InviteForm() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ email: '', name: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'member' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResult({ type: 'error', message: data.error ?? '오류가 발생했습니다.' })
      } else {
        setResult({ type: 'success', message: `${form.email}로 초대 메일을 보냈습니다.` })
        setForm({ email: '', name: '' })
        setTimeout(() => { setOpen(false); setResult(null); window.location.reload() }, 2000)
      }
    } catch {
      setResult({ type: 'error', message: '네트워크 오류가 발생했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{ background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff', padding: '10px 20px', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
        + 팀원 초대
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(240,160,190,0.1)', marginBottom: 24 }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>팀원 초대</h3>

      {result && (
        <div style={{
          background: result.type === 'success' ? '#dcfce7' : '#fef2f2',
          border: `1px solid ${result.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          color: result.type === 'success' ? '#16a34a' : '#ef4444',
          borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13,
        }}>
          {result.message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 20 }}>
        <div>
          <label style={label}>이메일 *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required style={input} placeholder="team@example.com" />
        </div>
        <div>
          <label style={label}>이름 *</label>
          <input name="name" value={form.name} onChange={handleChange} required style={input} placeholder="홍길동" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" disabled={loading}
          style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? '전송 중...' : '초대 메일 보내기'}
        </button>
        <button type="button" onClick={() => { setOpen(false); setResult(null) }}
          style={{ padding: '10px 24px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 10, color: '#9d7a8a', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          취소
        </button>
      </div>
    </form>
  )
}
