import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import PhotoCommentForm from '@/components/PhotoCommentForm'
import PhotoCommentDeleteButton from '@/components/PhotoCommentDeleteButton'
import PhotoReplyButton from '@/components/PhotoReplyButton'

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: photo }, { data: comments }, user] = await Promise.all([
    supabase.from('photos').select('*').eq('id', id).single(),
    supabase.from('photo_comments').select('id, parent_id, name, message, password_hash, created_at').eq('photo_id', id).order('created_at', { ascending: true }),
    getCurrentUser(),
  ])

  if (!photo) notFound()

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
  const isLoggedIn = !!user

  const topLevel = (comments ?? []).filter(c => !c.parent_id)
  const replies = (comments ?? []).filter(c => !!c.parent_id)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
      {/* 사진 */}
      <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(240,160,190,0.12)', marginBottom: 24 }}>
        <img src={photo.image_url} alt={photo.title ?? '사진'} style={{ width: '100%', display: 'block', maxHeight: 600, objectFit: 'contain', background: '#fdf2f8' }} />
        {(photo.title || photo.description) && (
          <div style={{ padding: '16px 20px' }}>
            {photo.title && <h1 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: '#4a2d40' }}>{photo.title}</h1>}
            {photo.description && <p style={{ margin: 0, fontSize: 14, color: '#7c5c6e', lineHeight: 1.7 }}>{photo.description}</p>}
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#c4a8b8' }}>{new Date(photo.created_at).toLocaleDateString('ko-KR')}</p>
          </div>
        )}
      </div>

      {/* 댓글 */}
      <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(240,160,190,0.1)' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>댓글 {comments?.length ?? 0}개</h2>

        <div style={{ marginBottom: 20 }}>
          <PhotoCommentForm photoId={id} isLoggedIn={isLoggedIn} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topLevel.length === 0 && (
            <p style={{ textAlign: 'center', color: '#b8a0b0', fontSize: 14, margin: '12px 0' }}>첫 댓글을 남겨주세요 🌸</p>
          )}
          {topLevel.map(comment => {
            const commentReplies = replies.filter(r => r.parent_id === comment.id)
            return (
              <div key={comment.id}>
                {/* 댓글 */}
                <div style={{ background: '#fdf9fb', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#4a2d40' }}>🌸 {comment.name}</span>
                      <span style={{ fontSize: 12, color: '#c4a8b8' }}>{new Date(comment.created_at).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <PhotoReplyButton photoId={id} parentId={comment.id} isLoggedIn={isLoggedIn} />
                      <PhotoCommentDeleteButton photoId={id} commentId={comment.id} isAdmin={isAdmin} hasPassword={!!comment.password_hash} />
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: '#5c4a5a', lineHeight: 1.7 }}>{comment.message}</p>
                </div>

                {/* 대댓글 */}
                {commentReplies.map(reply => (
                  <div key={reply.id} style={{ marginLeft: 20, marginTop: 6, background: '#fff', border: '1px solid #ffeef5', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#c084fc' }}>↳</span>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#4a2d40' }}>{reply.name}</span>
                        <span style={{ fontSize: 12, color: '#c4a8b8' }}>{new Date(reply.created_at).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <PhotoCommentDeleteButton photoId={id} commentId={reply.id} isAdmin={isAdmin} hasPassword={!!reply.password_hash} />
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: '#5c4a5a', lineHeight: 1.7 }}>{reply.message}</p>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
