'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SetPasswordPage() {
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    // URL 해시에 access_token이 있으면 (implicit flow) 세션 설정
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.slice(1))
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      if (access_token && refresh_token) {
        const supabase = createClient()
        supabase.auth.setSession({ access_token, refresh_token }).then(() => {
          window.history.replaceState(null, '', window.location.pathname)
          setReady(true)
        })
      } else {
        setReady(true)
      }
    } else {
      setReady(true)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 해요.')
      return
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않아요.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => { window.location.href = '/' }, 2000)
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '12px 14px', border: '1px solid #ffd6e7',
    borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', color: '#2d1f29',
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf6f9' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: 48, textAlign: 'center', boxShadow: '0 2px 16px rgba(240,160,190,0.12)', maxWidth: 380, width: '100%' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
          <h3 style={{ margin: '0 0 8px', color: '#4a2d40', fontWeight: 700 }}>가입 완료!</h3>
          <p style={{ color: '#9d7a8a', fontSize: 14 }}>잠시 후 홈으로 이동해요.</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf6f9' }}>
        <div style={{ color: '#9d7a8a', fontSize: 14 }}>잠시만요...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf6f9' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 40, boxShadow: '0 2px 16px rgba(240,160,190,0.12)', maxWidth: 380, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔐</div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#4a2d40' }}>비밀번호 설정</h1>
          <p style={{ margin: '6px 0 0', color: '#9d7a8a', fontSize: 13 }}>사용할 비밀번호를 입력해주세요</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#ef4444', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>
              비밀번호 *
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={input}
              placeholder="6자 이상"
              autoComplete="new-password"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>
              비밀번호 확인 *
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              style={input}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', background: 'linear-gradient(135deg, #f472b6, #db2777)',
            border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15,
            cursor: 'pointer', opacity: loading ? 0.6 : 1,
          }}>
            {loading ? '설정 중...' : '완료'}
          </button>
        </form>
      </div>
    </div>
  )
}
