'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StatusMessageEditor({
  message,
  isAdmin,
}: {
  message: string | null
  isAdmin: boolean
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(message ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    await fetch('/api/status-message', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: value.trim() }),
    })
    setLoading(false)
    setEditing(false)
    router.refresh()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setEditing(false); setValue(message ?? '') }
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          maxLength={60}
          placeholder="오늘의 한마디 🌸"
          style={{
            padding: '5px 12px', border: '1px solid #ffd6e7', borderRadius: 20,
            fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#4a2d40',
            background: '#fdf2f8', width: 220,
          }}
        />
        <button onClick={handleSave} disabled={loading}
          style={{ padding: '5px 14px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 20, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? '저장 중' : '저장'}
        </button>
        <button onClick={() => { setEditing(false); setValue(message ?? '') }}
          style={{ padding: '5px 12px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 20, color: '#9d7a8a', fontSize: 12, cursor: 'pointer' }}>
          취소
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
      {value ? (
        <span style={{ fontSize: 13, color: '#7c5c6e', background: '#fdf2f8', padding: '4px 12px', borderRadius: 20 }}>
          {value}
        </span>
      ) : (
        isAdmin && (
          <span style={{ fontSize: 13, color: '#c4a8b8' }}>오늘의 한마디를 남겨보세요</span>
        )
      )}
      {isAdmin && (
        <button onClick={() => setEditing(true)}
          style={{ padding: '3px 10px', background: 'none', border: '1px solid #ffd6e7', borderRadius: 20, color: '#c4a8b8', fontSize: 11, cursor: 'pointer' }}>
          ✏️ {value ? '수정' : '작성'}
        </button>
      )}
    </div>
  )
}
