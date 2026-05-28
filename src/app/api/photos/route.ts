import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null
    const description = formData.get('description') as string | null
    const category_id = formData.get('category_id') as string | null

    if (!file) return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 })

    const ext = file.name.split('.').pop()
    const filename = `photo-${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const supabase = createAdminClient()
    const { data: up, error: upErr } = await supabase.storage
      .from('photos')
      .upload(filename, buffer, { contentType: file.type, upsert: true })

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(up.path)

    const { error: dbErr } = await supabase.from('photos').insert({
      title: title || null,
      description: description || null,
      image_url: urlData.publicUrl,
      category_id: category_id || null,
    })

    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
