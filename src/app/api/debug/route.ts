import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ user: null, error: error?.message ?? '세션 없음' })
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: allProfiles } = await supabase.from('user_profiles').select('*')

  return NextResponse.json({ user: { id: user.id, email: user.email }, profile, profileError, allProfiles })
}
