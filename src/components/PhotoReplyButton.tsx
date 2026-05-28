'use client'

import { useState } from 'react'
import PhotoCommentForm from './PhotoCommentForm'

interface Props {
  photoId: string
  parentId: string
  isLoggedIn: boolean
}

export default function PhotoReplyButton({ photoId, parentId, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)

  if (open) {
    return (
      <div style={{ marginTop: 8 }}>
        <PhotoCommentForm photoId={photoId} parentId={parentId} isLoggedIn={isLoggedIn} onCancel={() => setOpen(false)} />
      </div>
    )
  }

  return (
    <button onClick={() => setOpen(true)} style={{ padding: '2px 8px', background: '#fdf2f8', border: '1px solid #ffd6e7', borderRadius: 6, color: '#db2777', fontSize: 11, cursor: 'pointer' }}>
      답글
    </button>
  )
}
