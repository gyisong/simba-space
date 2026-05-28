import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function PhotosPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const supabase = await createClient()

  const [{ data: categories }, photosResult] = await Promise.all([
    supabase.from('photo_categories').select('id, name').order('sort_order', { ascending: true }),
    supabase
      .from('photos')
      .select('id, title, image_url, created_at, category_id, photo_comments(count)')
      .eq('is_hidden' as never, false)
      .order('created_at', { ascending: false })
      .then(res => {
        // category_id 필터는 별도 처리
        return res
      }),
  ])

  let photos = photosResult.data ?? []
  if (category) photos = photos.filter(p => p.category_id === category)

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 18px', borderRadius: 20, fontSize: 13, fontWeight: active ? 700 : 400,
    background: active ? 'linear-gradient(135deg, #f472b6, #db2777)' : '#fff',
    color: active ? '#fff' : '#9d7a8a',
    border: active ? 'none' : '1px solid #ffd6e7',
    textDecoration: 'none', cursor: 'pointer', whiteSpace: 'nowrap' as const,
  })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: '#4a2d40' }}>사진첩 📷</h1>
      <p style={{ margin: '0 0 20px', color: '#9d7a8a', fontSize: 14 }}>simba의 소중한 순간들 🌸</p>

      {/* 카테고리 탭 */}
      {(categories?.length ?? 0) > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          <Link href="/photos" style={tabStyle(!category)}>전체</Link>
          {categories!.map(cat => (
            <Link key={cat.id} href={`/photos?category=${cat.id}`} style={tabStyle(category === cat.id)}>
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {!photos.length ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', color: '#b8a0b0' }}>
          사진이 없어요.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {photos.map(photo => {
            const commentCount = (photo.photo_comments as unknown as { count: number }[])?.[0]?.count ?? 0
            return (
              <Link key={photo.id} href={`/photos/${photo.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(240,160,190,0.1)', cursor: 'pointer' }}>
                  <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#fdf2f8', position: 'relative' }}>
                    <img src={photo.image_url} alt={photo.title ?? '사진'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {commentCount > 0 && (
                      <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        💬 {commentCount}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '10px 14px' }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#4a2d40' }}>{photo.title ?? ''}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#c4a8b8' }}>
                      {new Date(photo.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
