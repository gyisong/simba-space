'use client'

import { useState } from 'react'

interface Entry {
  id: string
  name: string
  message: string
  created_at: string
  is_hidden: boolean
  ip_address: string | null
}

export default function AdminGuestbookEntry({ entry }: { entry: Entry }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(entry.name)
  const [message, setMessage] = useState(entry.message)
  const [isHidden, setIsHidden] = useState(entry.is_hidden)
  const [loading, setLoading] = useState(false)

  async function handleToggleHidden() {
    setLoading(true)
    const newVal = !isHidden
    await fetch(`/api/guestbook/${entry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message, is_hidden: newVal }),
    })
    setIsHidden(newVal)
    setLoading(false)
  }

  async function handleSave() {
    setLoading(true)
    await fetch(`/api/guestbook/${entry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    })
    setEditing(false)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('이 방명록을 삭제하시겠습니까?')) return
    await fetch(`/api/guestbook/${entry.id}`, { method: 'DELETE' })
    window.location.reload()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '6px 10px', border: '1px solid #ffd6e7',
    borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit',
    color: '#2d1f29', boxSizing: 'border-box',
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '16px 20px',
      boxShadow: '0 2px 8px rgba(240,160,190,0.07)',
      opacity: isHidden ? 0.55 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {editing
            ? <input value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, width: 120 }} />
            : <span style={{ fontWeight: 700, fontSize: 14, color: '#4a2d40' }}>{name}</span>
          }
          <span style={{ fontSize: 12, color: '#c4a8b8' }}>
            {new Date(entry.created_at).toLocaleDateString('ko-KR')}
          </span>
          {entry.ip_address && (
            <span style={{ fontSize: 11, color: '#d4a8b8', background: '#fdf6f9', padding: '1px 8px', borderRadius: 10 }}>
              {entry.ip_address}
            </span>
          )}
          {isHidden && (
            <span style={{ fontSize: 11, background: '#f3f4f6', color: '#6b7280', padding: '1px 8px', borderRadius: 10 }}>숨김</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {editing ? (
            <>
              <button onClick={handleSave} disabled={loading}
                style={{ padding: '4px 12px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                저장
              </button>
              <button onClick={() => { setEditing(false); setName(entry.name); setMessage(entry.message) }}
                style={{ padding: '4px 12px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 6, color: '#9d7a8a', fontSize: 12, cursor: 'pointer' }}>
                취소
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)}
                style={{ padding: '4px 12px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 6, color: '#e06b9a', fontSize: 12, cursor: 'pointer' }}>
                수정
              </button>
              <button onClick={handleToggleHidden} disabled={loading}
                style={{ padding: '4px 12px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 6, color: '#9d7a8a', fontSize: 12, cursor: 'pointer' }}>
                {isHidden ? '공개' : '숨김'}
              </button>
              <button onClick={handleDelete}
                style={{ padding: '4px 12px', background: '#fff', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
      {editing
        ? <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
            style={{ ...inputStyle, resize: 'vertical' }} />
        : <p style={{ margin: 0, fontSize: 13, color: '#5c4a5a', lineHeight: 1.7 }}>{message}</p>
      }
    </div>
  )
}
