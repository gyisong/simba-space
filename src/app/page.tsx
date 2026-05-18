import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>

      {/* 프로필 카드 */}
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '36px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        boxShadow: '0 2px 16px rgba(240,160,190,0.12)',
        marginBottom: 32,
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'linear-gradient(135deg, #f472b6, #c084fc)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, flexShrink: 0,
        }}>
          🦁
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#4a2d40' }}>simba</h1>
          <p style={{ margin: '6px 0 0', color: '#9d7a8a', fontSize: 14, lineHeight: 1.7 }}>
            NGO 사업 기획자 ✦ 기업-NGO 협력 전문가<br />
            사람과 사람을 잇는 일을 합니다 🌿
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <Link href="/portfolio" style={{
              background: 'linear-gradient(135deg, #f472b6, #db2777)',
              color: '#fff', padding: '7px 18px', borderRadius: 20,
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
            }}>
              포트폴리오 보기
            </Link>
            <Link href="/contact" style={{
              border: '1px solid #fda4c8', color: '#e06b9a',
              padding: '7px 18px', borderRadius: 20,
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
            }}>
              문의하기
            </Link>
          </div>
        </div>
      </div>

      {/* 2열 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* 최근 사업 */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(240,160,190,0.1)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#4a2d40', display: 'flex', alignItems: 'center', gap: 8 }}>
            🌍 최근 사업
          </h2>
          <p style={{ color: '#b8a0b0', fontSize: 13, margin: 0 }}>
            등록된 사업이 없습니다.<br />simba 페이지에서 추가해주세요.
          </p>
          <Link href="/portfolio" style={{ display: 'inline-block', marginTop: 16, fontSize: 13, color: '#e06b9a', textDecoration: 'none', fontWeight: 600 }}>
            전체 보기 →
          </Link>
        </div>

        {/* 방명록 */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(240,160,190,0.1)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#4a2d40', display: 'flex', alignItems: 'center', gap: 8 }}>
            💌 방명록
          </h2>
          <p style={{ color: '#b8a0b0', fontSize: 13, margin: 0 }}>
            아직 방명록이 없어요.<br />첫 번째 메시지를 남겨주세요!
          </p>
          <Link href="/guestbook" style={{ display: 'inline-block', marginTop: 16, fontSize: 13, color: '#e06b9a', textDecoration: 'none', fontWeight: 600 }}>
            방명록 쓰기 →
          </Link>
        </div>
      </div>

      {/* 소개 배너 */}
      <div style={{
        background: 'linear-gradient(135deg, #fdf2f8, #ede9fe)',
        borderRadius: 20, padding: 28,
        boxShadow: '0 2px 12px rgba(240,160,190,0.1)',
      }}>
        <h2 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#4a2d40' }}>
          ✨ 이 공간은
        </h2>
        <p style={{ margin: 0, color: '#7c5c6e', fontSize: 14, lineHeight: 1.8 }}>
          기업과 NGO를 잇는 사업들을 기록하고 공유하는 공간이에요.<br />
          함께 일하는 팀과 소통하고, 우리가 만들어가는 임팩트를 담아갑니다 🌱
        </p>
      </div>

    </div>
  )
}
