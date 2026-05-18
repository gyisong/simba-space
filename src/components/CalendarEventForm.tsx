'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = ['외근', '출장', '휴가', '대회의실', '공통', '기타'] as const

const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
  borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  color: '#2d1f29',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6,
}

export default function CalendarEventForm({ userId }: { userId: string }) {
  const today = new Date().toISOString().slice(0, 10)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', event_date: today, category: '공통', note: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('calendar_events').insert({ ...form, user_id: userId })
      if (error) throw error
      window.location.reload()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{ background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff', padding: '10px 20px', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
        + 일정 추가
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(240,160,190,0.1)', marginBottom: 24 }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>일정 추가</h3>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#ef4444', fontSize: 13 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={label}>제목 *</label>
          <input name="title" value={form.title} onChange={handleChange} required style={input} placeholder="일정 제목" />
        </div>
        <div>
          <label style={label}>날짜 *</label>
          <input type="date" name="event_date" value={form.event_date} onChange={handleChange} required style={input} />
        </div>
        <div>
          <label style={label}>분류 *</label>
          <select name="category" value={form.category} onChange={handleChange} style={{ ...input, background: '#fff' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={label}>메모</label>
        <input name="note" value={form.note} onChange={handleChange} style={input} placeholder="메모 (선택)" />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" disabled={loading}
          style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? '추가 중...' : '추가하기'}
        </button>
        <button type="button" onClick={() => setOpen(false)}
          style={{ padding: '10px 24px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 10, color: '#9d7a8a', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          취소
        </button>
      </div>
    </form>
  )
}
