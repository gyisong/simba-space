import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DiaryForm from '@/components/admin/DiaryForm'

export default async function EditDiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: diary } = await supabase.from('diary').select('*').eq('id', id).single()
  if (!diary) notFound()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>일기 수정 📔</h1>
      <DiaryForm diary={diary} />
    </div>
  )
}
