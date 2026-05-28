import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth'
import { createHash } from 'crypto'

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

function getIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: Request) {
  try {
    const { name, message, password } = await request.json()
    const user = await getCurrentUser()
    const isLoggedIn = !!user

    if (!name || !message || (!isLoggedIn && !password)) {
      return NextResponse.json({ error: '이름, 메시지, 비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const ip_address = getIP(request)
    const password_hash = password ? hashPassword(password) : null

    const supabase = createAdminClient()
    const { error } = await supabase.from('guestbook').insert({ name, message, ip_address, password_hash })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
