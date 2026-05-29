import { createClient } from '@/lib/supabase/server'
import PhotosClient from '@/components/PhotosClient'

const PAGE_SIZE = 12

export default async function PhotosPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const supabase = await createClient()

  const photosQuery = supabase
    .from('photos')
    .select('id, title, image_url, created_at, category_id, photo_comments(count)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1)

  const [{ data: categories }, { data: photos, count }] = await Promise.all([
    supabase.from('photo_categories').select('id, name').order('sort_order', { ascending: true }),
    category ? photosQuery.eq('category_id', category) : photosQuery,
  ])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: '#4a2d40' }}>사진첩 📷</h1>
      <p style={{ margin: '0 0 20px', color: '#9d7a8a', fontSize: 14 }}>simba의 소중한 순간들 🌸</p>

      <PhotosClient
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialPhotos={(photos ?? []) as any}
        initialTotal={count ?? 0}
        categories={categories ?? []}
        initialCategory={category}
      />
    </div>
  )
}
