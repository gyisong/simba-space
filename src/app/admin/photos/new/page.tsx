import { createClient } from '@/lib/supabase/server'
import PhotoForm from '@/components/admin/PhotoForm'

export default async function NewPhotoPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('photo_categories')
    .select('id, name')
    .order('sort_order', { ascending: true })

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>사진 업로드 📷</h1>
      <PhotoForm categories={categories ?? []} />
    </div>
  )
}
