'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminCategoryAddForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputStyle: React.CSSProperties = {
    padding: '9px 12px', border: '1px solid #ffd6e7', borderRadius: 8,
    fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#2d1f29', boxSizing: 'border-box',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/photo-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, sort_order: sortOrder }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setName(''); setSortOrder(0)
    router.refresh()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {error && <div style={{ width: '100%', color: '#ef4444', fontSize: 13 }}>{error}</div>}
      <div style={{ flex: 2, minWidth: 160 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#9d7a8a', marginBottom: 4 }}>이름 *</label>
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="카테고리 이름" maxLength={30} style={{ ...inputStyle, width: '100%' }} />
      </div>
      <div style={{ width: 80 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#9d7a8a', marginBottom: 4 }}>순서</label>
        <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} style={{ ...inputStyle, width: '100%' }} />
      </div>
      <button type="submit" disabled={loading} style={{ padding: '9px 20px', background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer' }}>
        추가
      </button>
    </form>
  )
}
