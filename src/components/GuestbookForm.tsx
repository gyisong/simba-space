'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function GuestbookForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('guestbook').insert({ name, message })
    setDone(true)
    setName('')
    setMessage('')
    setLoading(false)
    setTimeout(() => { setDone(false); window.location.reload() }, 1500)
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
    borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    color: '#2d1f29',
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(240,160,190,0.1)', marginBottom: 28 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#4a2d40' }}>💌 방명록 남기기</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 12, marginBottom: 12 }}>
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="이름" style={input} />
        <input value={message} onChange={e => setMessage(e.target.value)} required placeholder="메시지를 남겨주세요 🌸" style={input} />
      </div>
      <button type="submit" disabled={loading}
        style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
        {done ? '✓ 등록됐어요!' : loading ? '등록 중...' : '남기기'}
      </button>
    </form>
  )
}
