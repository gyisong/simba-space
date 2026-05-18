import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects').select('*').eq('id', id).eq('is_published', true).single()
  if (!project) notFound()

  const { data: images } = await supabase
    .from('project_images').select('*').eq('project_id', id).order('sort_order')

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px' }}>
      <Link href="/portfolio" style={{ color: '#e06b9a', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
        ← 포트폴리오로 돌아가기
      </Link>

      <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', marginTop: 20, boxShadow: '0 2px 20px rgba(240,160,190,0.12)' }}>
        {/* 커버 이미지 */}
        <div style={{ height: 280, background: 'linear-gradient(135deg, #fdf2f8, #ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {project.cover_image_url ? (
            <img src={project.cover_image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 72 }}>🌍</span>
          )}
        </div>

        <div style={{ padding: '32px 36px' }}>
          <h1 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: '#4a2d40' }}>{project.title}</h1>

          {/* 메타 정보 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '📍', text: project.region },
              { icon: '🤝', text: project.partner_company },
              { icon: '📅', text: `${project.start_date} ~ ${project.end_date ?? '진행 중'}` },
              { icon: '✨', text: project.impact_text },
            ].map(({ icon, text }) => (
              <span key={text} style={{ fontSize: 13, color: '#7c5c6e', background: '#fdf2f8', padding: '6px 14px', borderRadius: 20 }}>
                {icon} {text}
              </span>
            ))}
          </div>

          {/* 상세 설명 */}
          <div style={{ fontSize: 15, color: '#5c4a5a', lineHeight: 1.9, whiteSpace: 'pre-wrap', marginBottom: 32 }}>
            {project.description}
          </div>

          {/* 갤러리 */}
          {images && images.length > 0 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#4a2d40', marginBottom: 16 }}>📸 갤러리</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {images.map(img => (
                  <div key={img.id}>
                    <img src={img.image_url} alt={img.caption ?? ''} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12 }} />
                    {img.caption && <p style={{ fontSize: 12, color: '#9d7a8a', margin: '6px 0 0', textAlign: 'center' }}>{img.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
