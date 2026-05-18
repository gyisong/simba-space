import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ChangePasswordForm from '@/components/ChangePasswordForm'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/settings')

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>계정 설정</h1>
        <p style={{ margin: '6px 0 0', color: '#9d7a8a', fontSize: 13 }}>{user.email}</p>
      </div>

      <div style={{
        background: '#fff', borderRadius: 20, padding: 32,
        boxShadow: '0 2px 16px rgba(240,160,190,0.12)',
      }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>
          🔐 비밀번호 변경
        </h2>
        <ChangePasswordForm email={user.email} />
      </div>
    </div>
  )
}
