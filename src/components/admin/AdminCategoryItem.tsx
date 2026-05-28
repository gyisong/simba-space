'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminCategoryItem({ id, name, sortOrder }: { id: string; name: string; sortOrder: number }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editOrder, setEditOrder] = useState(sortOrder)
  const [loading, setLoading] = useState(false)

  const inputStyle: React.CSSProperties = {
    padding: '6px 10px', border: '1px solid #ffd6e7', borderRadius: 6,
    fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#2d1f29',
  }

  async function handleSave() {
    setLoading(true)
    await fetch(`/api/photo-categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, sort_order: editOrder }),
    })
    setEditing(false); setLoading(false); router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`"${name}" 카테고리를 삭제할까요? 사진의 카테고리가 해제됩니다.`)) return
    await fetch(`/api/photo-categories/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (editing) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 2px 8px rgba(240,160,190,0.1)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={editName} onChange={e => setEditName(e.target.value)} style={{ ...inputStyle, flex: 2, minWidth: 120 }} />
        <input type="number" value={editOrder} onChange={e => setEditOrder(Number(e.target.value))} style={{ ...inputStyle, width: 60 }} />
        <button onClick={handleSave} disabled={loading} style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 13, cursor: 'pointer' }}>저장</button>
        <button onClick={() => setEditing(false)} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 6, color: '#9d7a8a', fontSize: 13, cursor: 'pointer' }}>취소</button>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 2px 8px rgba(240,160,190,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 11, color: '#c4a8b8', minWidth: 24 }}>#{editOrder}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#4a2d40' }}>{name}</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => setEditing(true)} style={{ padding: '4px 12px', background: '#fdf2f8', border: '1px solid #ffd6e7', borderRadius: 6, color: '#db2777', fontSize: 12, cursor: 'pointer' }}>수정</button>
        <button onClick={handleDelete} style={{ padding: '4px 12px', background: '#fff', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>삭제</button>
      </div>
    </div>
  )
}
