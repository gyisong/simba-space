'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #ffd6e7',
  borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  color: '#2d1f29',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#7c5c6e', marginBottom: 6,
}

function getMonday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(new Date().setDate(diff)).toISOString().slice(0, 10)
}

interface ReportFormProps {
  userId: string
  reportId?: string
  initialData?: {
    project_name: string
    period_start: string
    period_end: string
    activities: string
    next_plan: string
    issues: string
  }
}

export default function ReportForm({ userId, reportId, initialData }: ReportFormProps) {
  const today = new Date().toISOString().slice(0, 10)
  const isEdit = !!reportId

  const [form, setForm] = useState({
    project_name: initialData?.project_name ?? '',
    period_start: initialData?.period_start ?? getMonday(),
    period_end: initialData?.period_end ?? today,
    activities: initialData?.activities ?? '',
    next_plan: initialData?.next_plan ?? '',
    issues: initialData?.issues ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      if (isEdit) {
        const { error } = await supabase
          .from('weekly_reports')
          .update({ ...form })
          .eq('id', reportId)
          .eq('user_id', userId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('weekly_reports').insert({ ...form, user_id: userId })
        if (error) throw error
      }
      window.location.href = '/reports'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 12px rgba(240,160,190,0.1)' }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 14 }}>
          {error}
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>사업명 *</label>
        <input name="project_name" value={form.project_name} onChange={handleChange} required style={input} placeholder="관련 사업명" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={label}>보고 시작일 *</label>
          <input type="date" name="period_start" value={form.period_start} onChange={handleChange} required style={input} />
        </div>
        <div>
          <label style={label}>보고 종료일 *</label>
          <input type="date" name="period_end" value={form.period_end} onChange={handleChange} required style={input} />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>이번 주 활동 *</label>
        <textarea name="activities" value={form.activities} onChange={handleChange} required rows={4}
          style={{ ...input, resize: 'vertical', lineHeight: 1.8 }} placeholder="이번 주에 진행한 활동을 입력하세요" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={label}>다음 주 계획 *</label>
        <textarea name="next_plan" value={form.next_plan} onChange={handleChange} required rows={3}
          style={{ ...input, resize: 'vertical', lineHeight: 1.8 }} placeholder="다음 주 예정 활동을 입력하세요" />
      </div>
      <div style={{ marginBottom: 28 }}>
        <label style={label}>이슈 / 건의사항</label>
        <textarea name="issues" value={form.issues} onChange={handleChange} rows={2}
          style={{ ...input, resize: 'vertical', lineHeight: 1.8 }} placeholder="이슈나 건의사항 (선택)" />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={loading}
          style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #f472b6, #db2777)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? (isEdit ? '저장 중...' : '제출 중...') : (isEdit ? '수정 저장' : '주간보고 제출')}
        </button>
        <button type="button" onClick={() => window.history.back()}
          style={{ padding: '12px 28px', background: '#fff', border: '1px solid #ffd6e7', borderRadius: 12, color: '#9d7a8a', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
          취소
        </button>
      </div>
    </form>
  )
}
