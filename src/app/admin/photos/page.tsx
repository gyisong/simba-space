import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminPhotoDeleteButton from '@/components/admin/AdminPhotoDeleteButton'

export default async function AdminPhotosPage() {
  const supabase = await createClient()
  const { data: photos } = await supabase
    .from('photos')
    .select('id, title, image_url, created_at')
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>사진첩 관리 📷</h1>
        <Link href="/admin/photos/new" style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #f472b6, #db2777)', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          + 업로드
        </Link>
      </div>

      {!photos?.length ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center', color: '#b8a0b0' }}>
          업로드된 사진이 없어요.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {photos.map(photo => (
            <div key={photo.id} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 10px rgba(240,160,190,0.1)' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#fdf2f8' }}>
                <img src={photo.image_url} alt={photo.title ?? '사진'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#4a2d40', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {photo.title ?? '제목 없음'}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#c4a8b8' }}>{new Date(photo.created_at).toLocaleDateString('ko-KR')}</p>
                </div>
                <AdminPhotoDeleteButton id={photo.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
