import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import ChangePasswordForm from '@/components/ChangePasswordForm'
import NicknameForm from '@/components/NicknameForm'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/settings')

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name_changed_at')
    .eq('id', user.id)
    .single()

  let daysLeft = 0
  if (profile?.name_changed_at) {
    const daysSince = (Date.now() - new Date(profile.name_changed_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince < 30) daysLeft = Math.ceil(30 - daysSince)
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>정보변경</h1>
        <p style={{ margin: '6px 0 0', color: '#9d7a8a', fontSize: 13 }}>{user.email}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(240,160,190,0.12)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>
            😊 닉네임 변경
          </h2>
          {daysLeft > 0 && (
            <div style={{ background: '#fdf2f8', border: '1px solid #ffd6e7', borderRadius: 10, padding: '10px 14px', color: '#9d7a8a', fontSize: 13, marginBottom: 16 }}>
              닉네임은 30일마다 변경할 수 있어요. <strong style={{ color: '#db2777' }}>{daysLeft}일 후</strong>에 다시 변경 가능합니다.
            </div>
          )}
          <NicknameForm currentName={user.name} disabled={daysLeft > 0} />
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(240,160,190,0.12)' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>
            🔐 비밀번호 변경
          </h2>
          <ChangePasswordForm email={user.email} />
        </div>
      </div>
    </div>
  )
}
