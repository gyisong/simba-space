import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  try {
    const { name } = await request.json()
    if (!name || name.trim().length < 1) {
      return NextResponse.json({ error: '닉네임을 입력해주세요.' }, { status: 400 })
    }
    if (name.trim().length > 20) {
      return NextResponse.json({ error: '닉네임은 20자 이하로 입력해주세요.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('user_profiles')
      .update({ name: name.trim() })
      .eq('id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
