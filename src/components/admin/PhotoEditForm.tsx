'use client'

import { useState } from 'react'

interface Category { id: string; name: string }
interface Photo { id: string; title: string | null; description: string | null; category_id: string | null; image_url: string }

export default function PhotoEditForm({ photo, categories }: { photo: Photo; categories: Category[] }) {
  const [title, setTitle] = useState(photo.title ?? '')
  const [description, setDescription] = useState(photo.description ?? '')
  const [categoryId, setCategoryId] = useState(photo.category_id ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
    borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', color: '#2d1f29',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category_id: categoryId || null }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? '오류가 발생했습니다.'); return }
      setDone(true)
      setTimeout(() => { window.location.href = '/admin/photos' }, 1000)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(240,160,190,0.1)', maxWidth: 560 }}>
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 16 }}>{error}</div>}
      {done && <div style={{ background: '#fdf2f8', border: '1px solid #ffd6e7', color: '#db2777', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 16 }}>✓ 저장됐어요!</div>}

      <div style={{ marginBottom: 16 }}>
        <img src={photo.image_url} alt="" style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 10, objectFit: 'contain', border: '1px solid #ffd6e7' }} />
      </div>

      {categories.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>카테고리</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">카테고리 없음</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>제목</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요" maxLength={100} style={inputStyle} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>설명</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="설명을 입력하세요" rows={3} maxLength={500}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={() => window.location.href = '/admin/photos'}
          style={{ flex: 1, padding: '11px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 10, color: '#9d7a8a', fontSize: 14, cursor: 'pointer' }}>취소</button>
        <button type="submit" disabled={loading}
          style={{ flex: 2, padding: '11px', background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
