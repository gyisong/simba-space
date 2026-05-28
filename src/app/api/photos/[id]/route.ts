import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/auth'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const supabase = createAdminClient()
  const { data: photo } = await supabase.from('photos').select('image_url').eq('id', id).single()

  if (photo?.image_url) {
    const url = new URL(photo.image_url)
    const pathParts = url.pathname.split('/object/public/photos/')
    if (pathParts[1]) {
      await supabase.storage.from('photos').remove([decodeURIComponent(pathParts[1])])
    }
  }

  const { error } = await supabase.from('photos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
