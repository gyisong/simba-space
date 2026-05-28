import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'superadmin' && user.role !== 'admin')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
  }

  const { message } = await req.json()
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('user_profiles')
    .update({ status_message: message || null })
    .eq('id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
