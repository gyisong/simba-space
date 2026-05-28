import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import GlobalLoader from '@/components/GlobalLoader'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://simba-space.vercel.app'),
  title: "simba's space",
  description: 'NGO 사업 기획자 simba의 공간 — 기업-NGO 협력 사업 포트폴리오',
  openGraph: {
    title: "simba's space",
    description: 'NGO 사업 기획자 simba의 공간 — 기업-NGO 협력 사업 포트폴리오',
    type: 'website',
    url: 'https://simba-space.vercel.app',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body style={{ margin: 0, fontFamily: 'var(--font-noto), sans-serif', background: '#fdf6f9', minHeight: '100vh' }}>
        <GlobalLoader />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
