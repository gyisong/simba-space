import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DeleteProjectButton from '@/components/admin/DeleteProjectButton'

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, region, is_published, start_date, end_date, partner_company')
    .order('sort_order')
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>사업 관리</h1>
          <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>{projects?.length ?? 0}개 등록됨</p>
        </div>
        <Link href="/admin/projects/new"
          style={{ background: 'linear-gradient(135deg, #fda4c8, #f472b6)', color: '#fff', padding: '10px 20px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          + 새 사업 추가
        </Link>
      </div>

      {!projects?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 40, textAlign: 'center', color: '#b8a0b0' }}>
          등록된 사업이 없어요. 첫 번째 사업을 추가해보세요!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 16, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(240,160,190,0.08)', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{p.title}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                    background: p.is_published ? '#dcfce7' : '#f3f4f6',
                    color: p.is_published ? '#16a34a' : '#9ca3af',
                  }}>
                    {p.is_published ? '공개' : '비공개'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#9d7a8a' }}>
                  📍 {p.region} · 🤝 {p.partner_company} · {p.start_date} ~ {p.end_date ?? '진행 중'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/admin/projects/${p.id}`}
                  style={{ padding: '6px 14px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 8, color: '#e06b9a', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                  수정
                </Link>
                <DeleteProjectButton id={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
