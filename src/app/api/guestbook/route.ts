import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
  const { name, message, password } = await request.json()
  if (!name || !message || !password) {
    return NextResponse.json({ error: '이름, 메시지, 비밀번호를 입력해주세요.' }, { status: 400 })
  }

  const ip_address = getIP(request)
  const password_hash = hashPassword(password)

  const supabase = await createClient()
  const { error } = await supabase.from('guestbook').insert({ name, message, ip_address, password_hash })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
