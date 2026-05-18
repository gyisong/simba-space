import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import UserRoleForm from '@/components/admin/UserRoleForm'
import InviteForm from '@/components/admin/InviteForm'
import ReinviteButton from '@/components/admin/ReinviteButton'

export default async function UsersPage() {
  const user = await getCurrentUser()
  if (user?.role !== 'superadmin') redirect('/admin')

  const supabase = createAdminClient()

  const [{ data: profilesData }, { data: authData }] = await Promise.all([
    supabase.from('user_profiles').select('id, name, role, is_active, created_at').order('created_at'),
    supabase.auth.admin.listUsers(),
  ])

  const emailMap = Object.fromEntries(
    (authData?.users ?? []).map(u => [u.id, u.email ?? ''])
  )
  // confirmed_at이 없으면 초대 후 가입 미완료 상태
  const unconfirmedIds = new Set(
    (authData?.users ?? []).filter(u => !u.confirmed_at).map(u => u.id)
  )

  const profiles = profilesData ?? []

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>계정 관리</h1>
          <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>팀원 {profiles.length}명</p>
        </div>
        <InviteForm />
      </div>

      {!profiles.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          등록된 계정이 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profiles.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 24px', boxShadow: '0 2px 8px rgba(240,160,190,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{p.name}</span>
                  {unconfirmedIds.has(p.id) && (
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#fef9c3', color: '#b45309', fontWeight: 600 }}>
                      미가입
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#c4a8b8', marginTop: 2 }}>
                  {emailMap[p.id] && <span style={{ marginRight: 8 }}>{emailMap[p.id]}</span>}
                  초대: {new Date(p.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {unconfirmedIds.has(p.id) && (
                  <ReinviteButton userId={p.id} email={emailMap[p.id] ?? ''} name={p.name} role={p.role} />
                )}
                <UserRoleForm user={p} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
