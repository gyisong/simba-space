import { createClient } from '@/lib/supabase/server'
import AdminCategoryItem from '@/components/admin/AdminCategoryItem'
import AdminCategoryAddForm from '@/components/admin/AdminCategoryAddForm'
import Link from 'next/link'

export default async function AdminPhotoCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('photo_categories')
    .select('id, name, sort_order')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link href="/admin/photos" style={{ color: '#c4a8b8', fontSize: 13, textDecoration: 'none' }}>← 사진첩</Link>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#4a2d40' }}>카테고리 관리</h1>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(240,160,190,0.1)', marginBottom: 20 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#4a2d40' }}>카테고리 추가</h2>
        <AdminCategoryAddForm />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!categories?.length ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', color: '#b8a0b0' }}>
            카테고리가 없어요.
          </div>
        ) : categories.map(cat => (
          <AdminCategoryItem key={cat.id} id={cat.id} name={cat.name} sortOrder={cat.sort_order} />
        ))}
      </div>
    </div>
  )
}
