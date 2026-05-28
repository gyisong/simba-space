import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth'
import { createHash } from 'crypto'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: photo_id } = await params
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const { name, message, parent_id } = await request.json()
    if (!name || !message) {
      return NextResponse.json({ error: '이름과 메시지를 입력해주세요.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('photo_comments').insert({
      photo_id,
      parent_id: parent_id ?? null,
      name,
      message,
      password_hash: null,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
