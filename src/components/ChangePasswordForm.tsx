'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const input: React.CSSProperties = {
  width: '100%', padding: '12px 14px', border: '1px solid #ffd6e7',
  borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', color: '#2d1f29',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6,
}

export default function ChangePasswordForm({ email }: { email: string }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (next.length < 6) {
      setError('새 비밀번호는 6자 이상이어야 해요.')
      return
    }
    if (next !== confirm) {
      setError('새 비밀번호가 일치하지 않아요.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // 현재 비밀번호 확인
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: current })
    if (signInErr) {
      setError('현재 비밀번호가 올바르지 않아요.')
      setLoading(false)
      return
    }

    // 비밀번호 변경
    const { error: updateErr } = await supabase.auth.updateUser({ password: next })
    if (updateErr) {
      setError(updateErr.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🌸</div>
        <h3 style={{ margin: '0 0 8px', color: '#4a2d40', fontWeight: 700 }}>변경 완료!</h3>
        <p style={{ color: '#9d7a8a', fontSize: 14, margin: 0 }}>비밀번호가 성공적으로 변경되었어요.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#ef4444', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div>
        <label style={label}>현재 비밀번호 *</label>
        <input
          type="password"
          value={current}
          onChange={e => setCurrent(e.target.value)}
          required
          style={input}
          placeholder="현재 비밀번호"
          autoComplete="current-password"
        />
      </div>

      <div>
        <label style={label}>새 비밀번호 *</label>
        <input
          type="password"
          value={next}
          onChange={e => setNext(e.target.value)}
          required
          style={input}
          placeholder="6자 이상"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label style={label}>새 비밀번호 확인 *</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          style={input}
          placeholder="새 비밀번호를 다시 입력하세요"
          autoComplete="new-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%', padding: '13px',
          background: 'linear-gradient(135deg, #f472b6, #db2777)',
          border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15,
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
          fontFamily: 'inherit', marginTop: 4,
        }}
      >
        {loading ? '변경 중...' : '비밀번호 변경'}
      </button>
    </form>
  )
}
