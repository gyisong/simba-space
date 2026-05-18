import ContactForm from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: '#4a2d40' }}>문의하기 ✉️</h1>
      <p style={{ margin: '0 0 28px', color: '#9d7a8a', fontSize: 14 }}>
        협업 제안, 사업 문의 등 언제든지 연락주세요 🌿
      </p>
      <ContactForm />
    </div>
  )
}
