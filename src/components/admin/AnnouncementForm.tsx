'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
  borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit',
  color: '#2d1f29', boxSizing: 'border-box',
}

export default function AnnouncementForm({ authorId }: { authorId: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('announcements').insert({ title, content, is_pinned: isPinned, author_id: authorId })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    window.location.reload()
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff',
      padding: '10px 20px', borderRadius: 12, border: 'none',
      fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 24,
    }}>
      + 공지 작성
    </button>
  )

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fff', borderRadius: 20, padding: 28,
      boxShadow: '0 2px 12px rgba(240,160,190,0.1)', marginBottom: 24,
    }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>공지 작성</h3>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#ef4444', fontSize: 13 }}>
          {error}
        </div>
      )}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>제목 *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required maxLength={200} style={input} placeholder="공지 제목" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>내용 *</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required rows={4} maxLength={3000}
          style={{ ...input, resize: 'vertical', lineHeight: 1.7 }} placeholder="공지 내용" />
      </div>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" id="pinned" checked={isPinned} onChange={e => setIsPinned(e.target.checked)}
          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#e06b9a' }} />
        <label htmlFor="pinned" style={{ fontSize: 13, color: '#7c5c6e', cursor: 'pointer' }}>📌 상단 고정</label>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" disabled={loading} style={{
          padding: '10px 24px', background: 'linear-gradient(135deg, #f472b6, #db2777)',
          border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14,
          cursor: 'pointer', opacity: loading ? 0.6 : 1,
        }}>
          {loading ? '등록 중...' : '등록'}
        </button>
        <button type="button" onClick={() => setOpen(false)} style={{
          padding: '10px 24px', background: '#fff', border: '1px solid #ffd6e7',
          borderRadius: 10, color: '#9d7a8a', fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>
          취소
        </button>
      </div>
    </form>
  )
}
