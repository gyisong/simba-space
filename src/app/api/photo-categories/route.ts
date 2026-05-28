import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }
  try {
    const { name, sort_order } = await request.json()
    if (!name?.trim()) return NextResponse.json({ error: '카테고리 이름을 입력해주세요.' }, { status: 400 })
    const supabase = createAdminClient()
    const { error } = await supabase.from('photo_categories').insert({ name: name.trim(), sort_order: sort_order ?? 0 })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
