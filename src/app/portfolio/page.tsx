import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, region, start_date, end_date, partner_company, impact_text, cover_image_url')
    .eq('is_published', true)
    .order('sort_order')
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#4a2d40' }}>사업 포트폴리오</h1>
        <p style={{ margin: '8px 0 0', color: '#9d7a8a', fontSize: 14 }}>
          기업과 NGO를 잇는 사업들을 소개합니다 🌿
        </p>
      </div>

      {!projects?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          아직 등록된 사업이 없어요.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {projects.map(p => (
            <Link key={p.id} href={`/portfolio/${p.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 14px rgba(240,160,190,0.1)' }}>
                <div style={{ height: 180, background: 'linear-gradient(135deg, #fdf2f8, #ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {p.cover_image_url ? (
                    <img src={p.cover_image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 48 }}>🌍</span>
                  )}
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>{p.title}</h3>
                  <div style={{ fontSize: 13, color: '#9d7a8a', marginBottom: 10 }}>
                    📍 {p.region} · 🤝 {p.partner_company}
                  </div>
                  <div style={{ fontSize: 12, color: '#b8a0b0', marginBottom: 12 }}>
                    {p.start_date} ~ {p.end_date ?? '진행 중'}
                  </div>
                  <div style={{ fontSize: 13, color: '#e06b9a', fontWeight: 600, background: '#fdf2f8', padding: '6px 12px', borderRadius: 20, display: 'inline-block' }}>
                    ✨ {p.impact_text}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
