import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import UserRoleForm from '@/components/admin/UserRoleForm'
import InviteForm from '@/components/admin/InviteForm'

export default async function UsersPage() {
  const user = await getCurrentUser()
  if (user?.role !== 'superadmin') redirect('/admin')

  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, name, role, is_active, created_at')
    .order('created_at')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>계정 관리</h1>
          <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>팀원 {profiles?.length ?? 0}명</p>
        </div>
        <InviteForm />
      </div>

      {!profiles?.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', color: '#b8a0b0' }}>
          등록된 계정이 없어요.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profiles.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 24px', boxShadow: '0 2px 8px rgba(240,160,190,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#4a2d40' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#c4a8b8', marginTop: 2 }}>
                  가입: {new Date(p.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
              <UserRoleForm user={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
