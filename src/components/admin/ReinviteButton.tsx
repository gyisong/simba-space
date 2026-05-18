'use client'

import { useState } from 'react'

interface Props {
  userId: string
  email: string
  name: string
  role: string
}

export default function ReinviteButton({ userId, email, name, role }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleReinvite() {
    if (!confirm(`${email} 에게 초대 메일을 재발송할까요?\n기존 계정이 초기화됩니다.`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/reinvite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, name, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error ?? '오류가 발생했습니다.')
      } else {
        setDone(true)
        setTimeout(() => window.location.reload(), 1500)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleReinvite} disabled={loading || done}
      style={{
        padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600,
        background: done ? '#dcfce7' : '#fff',
        border: done ? '1px solid #bbf7d0' : '1px solid #ffd6e7',
        color: done ? '#16a34a' : '#e06b9a',
      }}>
      {loading ? '...' : done ? '발송됨' : '재초대'}
    </button>
  )
}
