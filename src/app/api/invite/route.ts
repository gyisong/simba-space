import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const { email, name, role } = await request.json()

  if (!email || !name || !role) {
    return NextResponse.json({ error: '이메일, 이름, 권한을 모두 입력해주세요.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { name, role },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback`,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (data.user) {
    const { error: profileError } = await supabase.from('user_profiles').insert({
      id: data.user.id,
      name,
      role,
      is_active: true,
    })
    if (profileError) {
      return NextResponse.json({ error: `초대는 됐지만 프로필 생성 실패: ${profileError.message}` }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
