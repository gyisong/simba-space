import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "simba's space"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #ede9fe 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 배경 장식 원 */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(244,114,182,0.12)', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(192,132,252,0.12)', display: 'flex',
        }} />

        {/* 메인 카드 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 32,
          padding: '56px 80px',
          boxShadow: '0 8px 40px rgba(240,160,190,0.2)',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://simba-space.vercel.app/lion.png"
            width={100}
            height={100}
            alt="lion"
            style={{ marginBottom: 24 }}
          />
          <div style={{
            fontSize: 52, fontWeight: 700, color: '#4a2d40',
            marginBottom: 14, display: 'flex',
          }}>
            simba&apos;s space
          </div>
          <div style={{
            fontSize: 26, color: '#9d7a8a', display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <span>NGO 사업 기획자</span>
            <span style={{ color: '#fda4c8', margin: '0 8px' }}>·</span>
            <span>기업-NGO 협력 전문가</span>
          </div>
        </div>

        {/* 하단 URL */}
        <div style={{
          position: 'absolute', bottom: 40,
          fontSize: 20, color: '#c4a8b8', display: 'flex',
        }}>
          simba-space.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
