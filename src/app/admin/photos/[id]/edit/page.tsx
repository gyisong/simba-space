import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PhotoEditForm from '@/components/admin/PhotoEditForm'

export default async function EditPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: photo }, { data: categories }] = await Promise.all([
    supabase.from('photos').select('id, title, description, category_id, image_url').eq('id', id).single(),
    supabase.from('photo_categories').select('id, name').order('sort_order', { ascending: true }),
  ])

  if (!photo) notFound()

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>사진 수정 ✏️</h1>
      <PhotoEditForm photo={photo} categories={categories ?? []} />
    </div>
  )
}
