import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { createHash } from 'crypto'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (user?.role === 'admin' || user?.role === 'superadmin') {
    await supabase.from('guestbook').delete().eq('id', id)
    return NextResponse.json({ success: true })
  }

  const { password } = await request.json()
  if (!password) return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 })

  const { data: entry } = await supabase
    .from('guestbook')
    .select('password_hash')
    .eq('id', id)
    .single()

  if (!entry) return NextResponse.json({ error: '항목을 찾을 수 없습니다.' }, { status: 404 })
  if (!entry.password_hash) {
    return NextResponse.json({ error: '이 게시글은 비밀번호가 설정되어 있지 않아요.' }, { status: 403 })
  }
  if (hashPassword(password) !== entry.password_hash) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 403 })
  }

  await supabase.from('guestbook').delete().eq('id', id)
  return NextResponse.json({ success: true })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const body = await request.json()
  const update: Record<string, unknown> = {}
  if (body.name !== undefined) update.name = body.name
  if (body.message !== undefined) update.message = body.message
  if (body.is_hidden !== undefined) update.is_hidden = body.is_hidden

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: '수정할 내용이 없습니다.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('guestbook').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
