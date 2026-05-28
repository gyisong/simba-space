'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('contact_messages').insert(form)
    setDone(true)
    setLoading(false)
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '12px 14px', border: '1px solid #ffd6e7',
    borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    color: '#2d1f29',
  }
  const label: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6,
  }

  if (done) return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 48, textAlign: 'center', boxShadow: '0 2px 16px rgba(240,160,190,0.12)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>💌</div>
      <h3 style={{ margin: '0 0 8px', color: '#4a2d40', fontWeight: 700 }}>메시지가 전달됐어요!</h3>
      <p style={{ color: '#9d7a8a', fontSize: 14 }}>빠른 시일 내에 답변 드릴게요 🌸</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(240,160,190,0.12)' }}>
      <div className="grid-2col-contact">
        <div><label style={label}>이름 *</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required maxLength={50} style={input} placeholder="이름" /></div>
        <div><label style={label}>이메일 *</label>
          <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required maxLength={255} style={input} placeholder="이메일 주소" /></div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={label}>메시지 *</label>
        <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required rows={5} maxLength={2000}
          style={{ ...input, resize: 'vertical', lineHeight: 1.7 }} placeholder="문의 내용을 입력해주세요" />
      </div>
      <button type="submit" disabled={loading}
        style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
        {loading ? '전송 중...' : '메시지 보내기 💌'}
      </button>
    </form>
  )
}
