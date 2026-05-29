'use client'

import { useState } from 'react'
import Link from 'next/link'

const PAGE_SIZE = 12

type Photo = {
  id: string
  title: string | null
  image_url: string
  created_at: string
  category_id: string | null
  photo_comments: { count: number }[]
}

type Category = {
  id: string
  name: string
}

type Props = {
  initialPhotos: Photo[]
  initialTotal: number
  categories: Category[]
  initialCategory?: string
}

export default function PhotosClient({ initialPhotos, initialTotal, categories, initialCategory }: Props) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [total, setTotal] = useState(initialTotal)
  const [currentCategory, setCurrentCategory] = useState<string | null>(initialCategory ?? null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  async function fetchPhotos(category: string | null, page: number) {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (category) params.set('category', category)
    const res = await fetch(`/api/photos?${params}`)
    const data = await res.json()
    setPhotos(data.photos)
    setTotal(data.total)
    setLoading(false)
  }

  function handleTabClick(category: string | null) {
    if (category === currentCategory) return
    setCurrentCategory(category)
    setCurrentPage(1)
    fetchPhotos(category, 1)
  }

  function handlePageClick(page: number) {
    if (page === currentPage) return
    setCurrentPage(page)
    fetchPhotos(currentCategory, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 18px', borderRadius: 20, fontSize: 13, fontWeight: active ? 700 : 400,
    background: active ? 'linear-gradient(135deg, #f472b6, #db2777)' : '#fff',
    color: active ? '#fff' : '#9d7a8a',
    border: active ? 'none' : '1px solid #ffd6e7',
    cursor: 'pointer', whiteSpace: 'nowrap',
  })

  const pageButtonStyle = (active: boolean): React.CSSProperties => ({
    width: 36, height: 36, borderRadius: 18,
    background: active ? 'linear-gradient(135deg, #f472b6, #db2777)' : '#fff',
    color: active ? '#fff' : '#9d7a8a',
    border: active ? 'none' : '1px solid #ffd6e7',
    cursor: 'pointer', fontSize: 14, fontWeight: active ? 700 : 400,
  })

  return (
    <div>
      {categories.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          <button onClick={() => handleTabClick(null)} style={tabStyle(currentCategory === null)}>전체</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleTabClick(cat.id)} style={tabStyle(currentCategory === cat.id)}>
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ position: 'relative', minHeight: 200 }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}>
            <span style={{ color: '#e06b9a', fontSize: 14 }}>불러오는 중...</span>
          </div>
        )}

        {!photos.length && !loading ? (
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

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => handlePageClick(p)} style={pageButtonStyle(p === currentPage)}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
