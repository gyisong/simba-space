import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function PhotosPage() {
  const supabase = await createClient()
  const { data: photos } = await supabase
    .from('photos')
    .select('id, title, image_url, created_at')
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: '#4a2d40' }}>사진첩 📷</h1>
      <p style={{ margin: '0 0 28px', color: '#9d7a8a', fontSize: 14 }}>simba의 소중한 순간들 🌸</p>

      {!photos?.length ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', color: '#b8a0b0' }}>
          아직 사진이 없어요.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {photos.map(photo => (
            <Link key={photo.id} href={`/photos/${photo.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(240,160,190,0.1)', cursor: 'pointer', transition: 'transform 0.15s', }}>
                <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#fdf2f8' }}>
                  <img
                    src={photo.image_url}
                    alt={photo.title ?? '사진'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                {photo.title && (
                  <div style={{ padding: '10px 14px' }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#4a2d40' }}>{photo.title}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#c4a8b8' }}>
                      {new Date(photo.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
