'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MessageReplyForm({ messageId, initialReply }: { messageId: string; initialReply?: string | null }) {
  const [reply, setReply] = useState(initialReply ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    const supabase = createClient()
    await supabase
      .from('contact_messages')
      .update({ reply: reply || null, replied_at: reply ? new Date().toISOString() : null })
      .eq('id', messageId)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #fdf2f8' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#9d7a8a', marginBottom: 8 }}>✉️ 답변</div>
      <textarea
        value={reply}
        onChange={e => setReply(e.target.value)}
        placeholder="답변 내용을 입력하세요 (비우면 답변 삭제)"
        rows={3}
        maxLength={2000}
        style={{
          width: '100%', padding: '10px 12px', border: '1px solid #ffd6e7',
          borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit',
          color: '#2d1f29', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="submit" disabled={loading} style={{
          padding: '8px 20px',
          background: saved ? '#10b981' : 'linear-gradient(135deg, #f472b6, #db2777)',
          border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600,
          fontSize: 13, cursor: 'pointer', opacity: loading ? 0.6 : 1,
        }}>
          {saved ? '저장 ✓' : loading ? '저장 중...' : '답변 저장'}
        </button>
      </div>
    </form>
  )
}
