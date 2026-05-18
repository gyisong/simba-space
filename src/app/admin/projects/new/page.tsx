import ProjectForm from '@/components/admin/ProjectForm'

export default function NewProjectPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>새 사업 추가</h1>
      <ProjectForm />
    </div>
  )
}
