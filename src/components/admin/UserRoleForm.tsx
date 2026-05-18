'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  name: string
  role: string
  is_active: boolean
}

export default function UserRoleForm({ user }: { user: UserProfile }) {
  const [role, setRole] = useState(user.role)
  const [isActive, setIsActive] = useState(user.is_active)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('user_profiles').update({ role, is_active: isActive }).eq('id', user.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <select value={role} onChange={e => setRole(e.target.value)}
        style={{ padding: '6px 10px', border: '1px solid #ffd6e7', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}>
        <option value="member">member</option>
        <option value="admin">admin</option>
        <option value="superadmin">superadmin</option>
      </select>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', color: '#7c5c6e' }}>
        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
        활성
      </label>
      <button onClick={handleSave} disabled={loading}
        style={{
          padding: '6px 16px', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600,
          background: saved ? '#dcfce7' : 'linear-gradient(135deg, #fda4c8, #f472b6)',
          color: saved ? '#16a34a' : '#fff',
        }}>
        {loading ? '...' : saved ? '저장됨' : '저장'}
      </button>
    </div>
  )
}
