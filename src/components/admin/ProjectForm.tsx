'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Project {
  id: string
  title: string
  region: string
  start_date: string
  end_date: string | null
  partner_company: string
  impact_text: string
  description: string
  cover_image_url: string | null
  is_published: boolean
  sort_order: number
}

const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
  borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  color: '#2d1f29',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6,
}

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter()
  const isEdit = !!project

  const [form, setForm] = useState({
    title: project?.title ?? '',
    region: project?.region ?? '',
    start_date: project?.start_date ?? '',
    end_date: project?.end_date ?? '',
    partner_company: project?.partner_company ?? '',
    impact_text: project?.impact_text ?? '',
    description: project?.description ?? '',
    is_published: project?.is_published ?? false,
    sort_order: project?.sort_order ?? 0,
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState(project?.cover_image_url ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked
             : type === 'number' ? Number(value)
             : value,
    }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverImage(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      let cover_image_url = project?.cover_image_url ?? null

      if (coverImage) {
        const ext = coverImage.name.split('.').pop()
        const filename = `cover-${Date.now()}.${ext}`
        const { data: up, error: upErr } = await supabase.storage
          .from('project-images').upload(`projects/${filename}`, coverImage, { upsert: true })
        if (upErr) throw upErr
        const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(up.path)
        cover_image_url = urlData.publicUrl
      }

      const payload = { ...form, end_date: form.end_date || null, cover_image_url }

      if (isEdit) {
        const { error } = await supabase.from('projects').update(payload).eq('id', project.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').insert(payload)
        if (error) throw error
      }

      window.location.href = '/admin/projects'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={label}>사업명 *</label>
          <input name="title" value={form.title} onChange={handleChange} required style={input} placeholder="사업명" /></div>
        <div><label style={label}>지역 *</label>
          <input name="region" value={form.region} onChange={handleChange} required style={input} placeholder="예: 몽골 울란바토르" /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div><label style={label}>시작일 *</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required style={input} /></div>
        <div><label style={label}>종료일</label>
          <input type="date" name="end_date" value={form.end_date ?? ''} onChange={handleChange} style={input} /></div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={label}>파트너 기업 *</label>
        <input name="partner_company" value={form.partner_company} onChange={handleChange} required style={input} placeholder="예: KT&G" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={label}>임팩트 *</label>
        <input name="impact_text" value={form.impact_text} onChange={handleChange} required style={input} placeholder="예: 수혜자 200명, 봉사단원 30명" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={label}>상세 설명 *</label>
        <textarea name="description" value={form.description} onChange={handleChange} required rows={5}
          style={{ ...input, resize: 'vertical', lineHeight: 1.7 }} placeholder="사업 상세 설명을 입력하세요" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={label}>대표 이미지</label>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: 14 }} />
        {coverPreview && (
          <img src={coverPreview} alt="preview" style={{ marginTop: 10, height: 160, objectFit: 'cover', borderRadius: 10, display: 'block' }} />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div><label style={label}>정렬 순서</label>
          <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} style={input} min={0} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
          <input type="checkbox" id="is_published" checked={form.is_published}
            onChange={e => setForm(prev => ({ ...prev, is_published: e.target.checked }))}
            style={{ width: 16, height: 16, cursor: 'pointer' }} />
          <label htmlFor="is_published" style={{ ...label, margin: 0, cursor: 'pointer' }}>공개</label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={loading}
          style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
        </button>
        <button type="button" onClick={() => window.history.back()}
          style={{ padding: '12px 28px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 12, color: '#9d7a8a', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
          취소
        </button>
      </div>
    </form>
  )
}
