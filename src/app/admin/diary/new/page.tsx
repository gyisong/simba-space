import DiaryForm from '@/components/admin/DiaryForm'

export default function NewDiaryPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>새 글 쓰기 📔</h1>
      <DiaryForm />
    </div>
  )
}
