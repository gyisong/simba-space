import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DiaryDeleteButton from '@/components/admin/DiaryDeleteButton'

export default async function DiaryPage() {
  const supabase = await createClient()
  const { data: entries } = await supabase
    .from('diary')
    .select('id, title, is_private, created_at')
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>다이어리 📔</h1>
          <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>{entries?.length ?? 0}개의 기록</p>
        </div>
        <Link href="/admin/diary/new"
          style={{ background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff', padding: '10px 20px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          + 새 글 쓰기
        </Link>
      </div>

      {!entries?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          아직 기록이 없어요. 첫 글을 남겨보세요!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map(e => (
            <div key={e.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 24px', boxShadow: '0 2px 8px rgba(240,160,190,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{e.title}</span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                    background: e.is_private ? '#fef3c7' : '#dcfce7',
                    color: e.is_private ? '#b45309' : '#16a34a',
                  }}>
                    {e.is_private ? '비공개' : '공개'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#c4a8b8', marginTop: 4 }}>
                  {new Date(e.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/admin/diary/${e.id}`}
                  style={{ padding: '6px 14px', background: '#fdf2f8', border: '1px solid #ffd6e7', borderRadius: 8, color: '#e06b9a', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                  수정
                </Link>
                <DiaryDeleteButton id={e.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
