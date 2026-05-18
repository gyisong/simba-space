import { createClient } from '@/lib/supabase/server'

export type UserRole = 'superadmin' | 'admin' | 'member'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  is_active: boolean
}

/** Server Component / Route Handler에서 현재 유저 + 권한 조회 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name, role, is_active')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_active) return null

  return {
    id: user.id,
    email: user.email ?? '',
    name: profile.name,
    role: profile.role as UserRole,
    is_active: profile.is_active,
  }
}

/** 운영관리자 이상 여부 (admin + superadmin) */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin' || user?.role === 'superadmin'
}

/** 시스템관리자 여부 */
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'superadmin'
}
