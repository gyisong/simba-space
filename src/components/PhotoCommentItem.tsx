'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoCommentForm from './PhotoCommentForm'

interface Comment {
  id: string
  name: string
  message: string
  password_hash: string | null
  created_at: string
  parent_id: string | null
}

interface Props {
  photoId: string
  comment: Comment
  replies: Comment[]
  isAdmin: boolean
  isLoggedIn: boolean
  userName?: string
}

function CommentRow({ photoId, comment, isAdmin, isLoggedIn, userName, isReply = false, onReplyOpen }: {
  photoId: string
  comment: Comment
  isAdmin: boolean
  isLoggedIn: boolean
  userName?: string
  isReply?: boolean
  onReplyOpen?: () => void
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [editMessage, setEditMessage] = useState(comment.message)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputStyle: React.CSSProperties = {
    padding: '4px 8px', border: '1px solid #ffd6e7', borderRadius: 6,
    fontSize: 12, outline: 'none', fontFamily: 'inherit', color: '#2d1f29',
  }

  async function handleDelete() {
    if (isAdmin) {
      if (!confirm('댓글을 삭제하시겠습니까?')) return
      await fetch(`/api/photos/${photoId}/comments/${comment.id}`, { method: 'DELETE' })
      router.refresh(); return
    }
    setDeleteOpen(true)
  }

  async function handlePasswordDelete(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch(`/api/photos/${photoId}/comments/${comment.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: deletePassword }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    router.refresh()
  }

  async function handleEditSave() {
    if (!editMessage.trim()) return
    setLoading(true)
    await fetch(`/api/photos/${photoId}/comments/${comment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: editMessage }),
    })
    setEditing(false); setLoading(false); router.refresh()
  }

  const showDelete = isAdmin || !!comment.password_hash
  const containerStyle: React.CSSProperties = isReply
    ? { marginLeft: 20, marginTop: 6, background: '#fff', border: '1px solid #ffeef5', borderRadius: 10, padding: '10px 14px' }
    : { background: '#fdf9fb', borderRadius: 12, padding: '12px 14px' }

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isReply && <span style={{ fontSize: 12, color: '#c084fc' }}>↳</span>}
          <span style={{ fontWeight: 700, fontSize: 13, color: '#4a2d40' }}>{isReply ? '' : '🌸 '}{comment.name}</span>
          <span style={{ fontSize: 12, color: '#c4a8b8' }}>{new Date(comment.created_at).toLocaleDateString('ko-KR')}</span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
          {!isReply && isLoggedIn && (
            <button onClick={onReplyOpen} style={{ padding: '2px 8px', background: '#fdf2f8', border: '1px solid #ffd6e7', borderRadius: 6, color: '#db2777', fontSize: 11, cursor: 'pointer' }}>
              답글
            </button>
          )}
          {isAdmin && (
            <button onClick={() => setEditing(e => !e)} style={{ padding: '2px 8px', background: '#fdf2f8', border: '1px solid #ffd6e7', borderRadius: 6, color: '#9d7a8a', fontSize: 11, cursor: 'pointer' }}>
              수정
            </button>
          )}
          {showDelete && (
            <button onClick={handleDelete} style={{ padding: '2px 8px', background: '#fff', border: '1px solid #fecaca', borderRadius: 6, color: '#ef4444', fontSize: 11, cursor: 'pointer' }}>
              삭제
            </button>
          )}
        </div>
      </div>

      {/* 수정 */}
      {editing && (
        <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
          <input value={editMessage} onChange={e => setEditMessage(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          <button onClick={handleEditSave} disabled={loading} style={{ padding: '4px 10px', background: '#db2777', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer' }}>저장</button>
          <button onClick={() => setEditing(false)} style={{ padding: '4px 10px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 6, color: '#9d7a8a', fontSize: 12, cursor: 'pointer' }}>취소</button>
        </div>
      )}

      {/* 내용 */}
      {!editing && <p style={{ margin: 0, fontSize: 14, color: '#5c4a5a', lineHeight: 1.7 }}>{comment.message}</p>}

      {/* 비번 삭제 */}
      {deleteOpen && !isAdmin && (
        <form onSubmit={handlePasswordDelete} style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="비밀번호" required autoFocus style={{ ...inputStyle, width: 90 }} />
            <button type="submit" disabled={loading} style={{ padding: '4px 8px', background: '#ef4444', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer' }}>확인</button>
            <button type="button" onClick={() => { setDeleteOpen(false); setError('') }} style={{ padding: '4px 8px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 6, color: '#9d7a8a', fontSize: 12, cursor: 'pointer' }}>취소</button>
          </div>
          {error && <span style={{ fontSize: 11, color: '#ef4444' }}>{error}</span>}
        </form>
      )}
    </div>
  )
}

export default function PhotoCommentItem({ photoId, comment, replies, isAdmin, isLoggedIn, userName }: Props) {
  const [replyOpen, setReplyOpen] = useState(false)

  return (
    <div>
      <CommentRow
        photoId={photoId} comment={comment}
        isAdmin={isAdmin} isLoggedIn={isLoggedIn} userName={userName}
        onReplyOpen={() => setReplyOpen(o => !o)}
      />
      {replies.map(reply => (
        <CommentRow key={reply.id} photoId={photoId} comment={reply} isAdmin={isAdmin} isLoggedIn={isLoggedIn} userName={userName} isReply />
      ))}
      {replyOpen && (
        <div style={{ marginLeft: 20, marginTop: 8 }}>
          <PhotoCommentForm photoId={photoId} parentId={comment.id} isLoggedIn={isLoggedIn} userName={userName} onCancel={() => setReplyOpen(false)} />
        </div>
      )}
    </div>
  )
}
