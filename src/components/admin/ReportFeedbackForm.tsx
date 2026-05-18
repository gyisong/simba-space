'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ReportFeedbackForm({ reportId, initialFeedback }: { reportId: string; initialFeedback?: string | null }) {
  const [feedback, setFeedback] = useState(initialFeedback ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    const supabase = createClient()
    await supabase.from('weekly_reports').update({ feedback: feedback || null }).eq('id', reportId)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: '#9d7a8a', whiteSpace: 'nowrap' }}>💬 피드백</span>
      <input
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="한 줄 피드백을 남겨주세요"
        style={{
          flex: 1, padding: '7px 12px', border: '1px solid #ffd6e7',
          borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#2d1f29',
        }}
      />
      <button type="submit" disabled={loading} style={{
        padding: '7px 16px',
        background: saved ? '#10b981' : 'linear-gradient(135deg, #f472b6, #db2777)',
        border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600,
        fontSize: 13, cursor: 'pointer', opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap',
      }}>
        {saved ? '저장 ✓' : '저장'}
      </button>
    </form>
  )
}
