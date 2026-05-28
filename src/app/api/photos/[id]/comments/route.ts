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
    const { name, message, password, parent_id } = await request.json()
    const user = await getCurrentUser()
    const isLoggedIn = !!user

    if (!name || !message || (!isLoggedIn && !password)) {
      return NextResponse.json({ error: '이름, 메시지, 비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('photo_comments').insert({
      photo_id,
      parent_id: parent_id ?? null,
      name,
      message,
      password_hash: password ? hashPassword(password) : null,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
