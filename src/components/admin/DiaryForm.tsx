'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Diary {
  id: string
  title: string
  content: string
  is_private: boolean
}

const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
  borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  color: '#2d1f29',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6,
}

export default function DiaryForm({ diary }: { diary?: Diary }) {
  const isEdit = !!diary
  const [form, setForm] = useState({
    title: diary?.title ?? '',
    content: diary?.content ?? '',
    is_private: diary?.is_private ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      if (isEdit) {
        const { error } = await supabase.from('diary').update(form).eq('id', diary.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('diary').insert(form)
        if (error) throw error
      }
      window.location.href = '/admin/diary'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 14 }}>
          {error}
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>제목 *</label>
        <input name="title" value={form.title} onChange={handleChange} required style={input} placeholder="제목을 입력하세요" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>내용 *</label>
        <textarea name="content" value={form.content} onChange={handleChange} required rows={12}
          style={{ ...input, resize: 'vertical', lineHeight: 1.8 }} placeholder="오늘의 기록을 남겨보세요..." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <input type="checkbox" id="is_private" checked={form.is_private}
          onChange={e => setForm(prev => ({ ...prev, is_private: e.target.checked }))}
          style={{ width: 16, height: 16, cursor: 'pointer' }} />
        <label htmlFor="is_private" style={{ ...label, margin: 0, cursor: 'pointer' }}>비공개</label>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={loading}
          style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #fda4c8, #f472b6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? '저장 중...' : isEdit ? '수정하기' : '작성하기'}
        </button>
        <button type="button" onClick={() => window.history.back()}
          style={{ padding: '12px 28px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 12, color: '#9d7a8a', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
          취소
        </button>
      </div>
    </form>
  )
}
