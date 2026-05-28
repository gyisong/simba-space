import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth'
import { createHash } from 'crypto'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const { commentId } = await params
  const supabase = createAdminClient()
  const user = await getCurrentUser()

  if (user?.role === 'admin' || user?.role === 'superadmin') {
    await supabase.from('photo_comments').delete().eq('id', commentId)
    return NextResponse.json({ success: true })
  }

  const { password } = await request.json()
  if (!password) return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 })

  const { data: comment } = await supabase.from('photo_comments').select('password_hash').eq('id', commentId).single()
  if (!comment) return NextResponse.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 })
  if (!comment.password_hash) return NextResponse.json({ error: '이 댓글은 비밀번호가 없습니다.' }, { status: 403 })
  if (hashPassword(password) !== comment.password_hash) return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 403 })

  await supabase.from('photo_comments').delete().eq('id', commentId)
  return NextResponse.json({ success: true })
}
