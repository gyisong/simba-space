'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function LoaderCore() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const startedRef = useRef(false)
  const delayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const finishRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const safetyRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function hide() {
    setVisible(false)
    startedRef.current = false
    clearTimeout(safetyRef.current)
  }

  function startLoader() {
    clearTimeout(delayRef.current)
    clearTimeout(finishRef.current)
    clearTimeout(safetyRef.current)
    startedRef.current = true
    delayRef.current = setTimeout(() => {
      setVisible(true)
      // 안전장치: 3초 후 강제 종료 (pathname 변화 미감지 대비)
      safetyRef.current = setTimeout(hide, 3000)
    }, 200)
  }

  function finishLoader() {
    clearTimeout(delayRef.current)
    clearTimeout(safetyRef.current)
    finishRef.current = setTimeout(hide, 150)
  }

  useEffect(() => {
    if (!startedRef.current) return
    finishLoader()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank' || a.download) return
      try {
        const url = new URL(a.href, location.href)
        if (url.origin === location.origin && url.pathname + url.search !== location.pathname + location.search) {
          startLoader()
        }
      } catch {}
    }
    const onPopstate = () => startLoader()
    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPopstate)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPopstate)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes simbaJump {
          0%   { transform: translateY(0px)   rotate(0deg)  scale(1);    }
          20%  { transform: translateY(-50px) rotate(-8deg) scale(1.1);  }
          40%  { transform: translateY(-70px) rotate(5deg)  scale(1.15); }
          60%  { transform: translateY(-40px) rotate(-3deg) scale(1.08); }
          80%  { transform: translateY(-10px) rotate(2deg)  scale(1.02); }
          100% { transform: translateY(0px)   rotate(0deg)  scale(1);    }
        }
        @keyframes simbaShadow {
          0%   { transform: scaleX(1);    opacity: 0.25; }
          40%  { transform: scaleX(0.35); opacity: 0.08; }
          100% { transform: scaleX(1);    opacity: 0.25; }
        }
        @keyframes paw1 { 0%,60%,100% { opacity:0; } 10%,50% { opacity:1; } }
        @keyframes paw2 { 0%,20%,80%,100% { opacity:0; } 30%,70% { opacity:1; } }
        @keyframes paw3 { 0%,40%,100% { opacity:0; } 50%,90% { opacity:1; } }
        @keyframes loaderFadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes cardPop {
          from { transform:scale(0.85); opacity:0; }
          to   { transform:scale(1);   opacity:1; }
        }
        @keyframes dotBlink {
          0%,100% { opacity:0.3; } 50% { opacity:1; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(74,45,64,0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'loaderFadeIn 0.2s ease',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 32,
          padding: '48px 56px 40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: '0 24px 60px rgba(74,45,64,0.25)',
          animation: 'cardPop 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          minWidth: 240,
          colorScheme: 'light',
        }}>
          {/* 발자국 */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 8, height: 20, alignItems: 'center' }}>
            {(['paw1','paw2','paw3'] as const).map((name, i) => (
              <span key={i} style={{
                fontSize: 16, opacity: 0,
                animation: `${name} 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}>🐾</span>
            ))}
          </div>

          {/* 심바 + 그림자 */}
          <div style={{ position: 'relative', width: 100, height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
            <img src="/lion.png" alt="simba" width={72} height={72} style={{
              userSelect: 'none', display: 'block', position: 'absolute', bottom: 12,
              animation: 'simbaJump 0.9s cubic-bezier(0.36,0.07,0.19,0.97) infinite',
              filter: 'drop-shadow(0 8px 16px rgba(219,39,119,0.2))',
              objectFit: 'contain',
            }} />
            <div style={{
              width: 60, height: 10,
              background: 'radial-gradient(ellipse, rgba(74,45,64,0.35) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'simbaShadow 0.9s ease-in-out infinite',
              position: 'absolute', bottom: 0,
            }} />
          </div>

          <p style={{ margin: '20px 0 0', fontSize: 15, fontWeight: 700, color: '#4a2d40', letterSpacing: '-0.3px' }}>
            심바가 달려오는 중
            <span style={{ display: 'inline-flex', gap: 2, marginLeft: 2 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  animation: 'dotBlink 1s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                  color: '#e06b9a',
                }}>.</span>
              ))}
            </span>
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#c4a8b8' }}>잠시만 기다려주세요</p>
        </div>
      </div>
    </>
  )
}

export default function GlobalLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderCore />
    </Suspense>
  )
}
