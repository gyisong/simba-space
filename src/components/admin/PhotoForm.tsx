'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PhotoForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
    borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', color: '#2d1f29',
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('사진을 선택해주세요.'); return }
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const filename = `photo-${Date.now()}.${ext}`
      const { data: up, error: upErr } = await supabase.storage.from('photos').upload(filename, file, { upsert: true })
      if (upErr) { setError(upErr.message); return }
      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(up.path)
      const { error: dbErr } = await supabase.from('photos').insert({
        title: title || null,
        description: description || null,
        image_url: urlData.publicUrl,
      })
      if (dbErr) { setError(dbErr.message); return }
      window.location.href = '/admin/photos'
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(240,160,190,0.1)', maxWidth: 560 }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* 이미지 선택 */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 8 }}>사진 *</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required
          style={{ fontSize: 13, color: '#4a2d40' }} />
        {preview && (
          <img src={preview} alt="미리보기" style={{ marginTop: 12, maxWidth: '100%', maxHeight: 300, borderRadius: 10, objectFit: 'contain', border: '1px solid #ffd6e7' }} />
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>제목 (선택)</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요" maxLength={100} style={inputStyle} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6 }}>설명 (선택)</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="설명을 입력하세요" rows={3} maxLength={500}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={() => window.location.href = '/admin/photos'}
          style={{ flex: 1, padding: '11px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 10, color: '#9d7a8a', fontSize: 14, cursor: 'pointer' }}>
          취소
        </button>
        <button type="submit" disabled={loading}
          style={{ flex: 2, padding: '11px', background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '업로드 중...' : '업로드'}
        </button>
      </div>
    </form>
  )
}
