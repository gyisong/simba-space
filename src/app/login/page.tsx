'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const input: React.CSSProperties = {
  width: '100%', padding: '11px 14px', border: '1px solid #ffd6e7',
  borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit',
  boxSizing: 'border-box', color: '#2d1f29',
}

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 기존 세션 감지: 활성 계정이면 홈으로, 비활성이면 로그아웃
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_active')
        .eq('id', session.user.id)
        .single()
      if (profile?.is_active) {
        window.location.href = redirect.startsWith('/') ? redirect : '/'
      } else {
        await supabase.auth.signOut()
      }
    })
  }, [redirect])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    // 비활성 계정 체크
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_active')
      .eq('id', data.user.id)
      .single()

    if (!profile?.is_active) {
      await supabase.auth.signOut()
      setError('비활성화된 계정입니다. 관리자에게 문의하세요.')
      setLoading(false)
      return
    }

    window.location.href = redirect.startsWith('/') ? redirect : '/'
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>이메일</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={input}
          placeholder="이메일 주소"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={input}
          placeholder="비밀번호"
        />
      </div>

      {error && (
        <p style={{ margin: 0, fontSize: 13, color: '#ef4444', textAlign: 'center' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%', padding: '13px', background: 'linear-gradient(135deg, #f472b6, #db2777)',
          border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15,
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
          fontFamily: 'inherit',
        }}
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fdf6f9' }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px rgba(240,160,190,0.12)', padding: 40 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, textAlign: 'center', color: '#4a2d40' }}>로그인</h1>
        <p style={{ margin: '0 0 28px', fontSize: 13, textAlign: 'center', color: '#9d7a8a' }}>simba&apos;s space</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
