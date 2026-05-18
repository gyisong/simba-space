import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import UserRoleForm from '@/components/admin/UserRoleForm'
import InviteForm from '@/components/admin/InviteForm'
import ReinviteButton from '@/components/admin/ReinviteButton'

export default async function UsersPage() {
  const user = await getCurrentUser()
  if (user?.role !== 'admin' && user?.role !== 'superadmin') redirect('/admin')

  const supabase = createAdminClient()

  const [{ data: profilesData }, { data: authData }] = await Promise.all([
    supabase.from('user_profiles').select('id, name, role, is_active, created_at').order('created_at'),
    supabase.auth.admin.listUsers(),
  ])

  const emailMap = Object.fromEntries(
    (authData?.users ?? []).map(u => [u.id, u.email ?? ''])
  )

  const profiles = profilesData ?? []

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>🔑 계정 관리</h1>
          <p style={{ margin: '4px 0 0', color: '#9d7a8a', fontSize: 13 }}>팀원 {profiles.length}명</p>
        </div>
        <InviteForm />
      </div>

      {/* 기능 안내 */}
      <div style={{ background: '#fdf2f8', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#4a2d40', marginBottom: 4 }}>기능 안내</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 13, color: '#7c5c6e' }}>
            <span style={{ fontWeight: 600 }}>역할</span>
            <span style={{ color: '#9d7a8a' }}> — member: 주간보고·캘린더만 / simba: 관리 메뉴 전체·팀원 초대 포함</span>
          </div>
          <div style={{ fontSize: 13, color: '#7c5c6e' }}>
            <span style={{ fontWeight: 600 }}>활성 체크박스</span>
            <span style={{ color: '#9d7a8a' }}> — 해제 시 로그인 차단 (계정·데이터 유지, 다시 체크하면 복구)</span>
          </div>
          <div style={{ fontSize: 13, color: '#7c5c6e' }}>
            <span style={{ fontWeight: 600 }}>재초대</span>
            <span style={{ color: '#9d7a8a' }}> — 기존 계정 초기화 후 비밀번호 설정 메일 재발송</span>
          </div>
        </div>
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
                  {!p.is_active && (
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#fef2f2', color: '#ef4444', fontWeight: 600 }}>
                      비활성
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#c4a8b8', marginTop: 2 }}>
                  {emailMap[p.id] && <span style={{ marginRight: 8 }}>{emailMap[p.id]}</span>}
                  초대: {new Date(p.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <ReinviteButton userId={p.id} email={emailMap[p.id] ?? ''} name={p.name} role={p.role} />
                <UserRoleForm user={p} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
