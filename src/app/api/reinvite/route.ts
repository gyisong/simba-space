import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const { userId, email, name, role } = await request.json()

  const supabase = createAdminClient()

  // 기존 유저 삭제 (user_profiles는 CASCADE로 자동 삭제)
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
  if (deleteError) {
    return NextResponse.json({ error: `삭제 실패: ${deleteError.message}` }, { status: 400 })
  }

  // 재초대
  const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { name, role },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback?next=/auth/set-password`,
  })

  if (inviteError) {
    return NextResponse.json({ error: `초대 실패: ${inviteError.message}` }, { status: 400 })
  }

  if (data.user) {
    await supabase.from('user_profiles').insert({
      id: data.user.id,
      name,
      role,
      is_active: true,
    })
  }

  return NextResponse.json({ success: true })
}
