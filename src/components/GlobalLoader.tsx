'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function LoaderCore() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const startedRef = useRef(false)

  function startLoader() {
    clearInterval(intervalRef.current)
    clearTimeout(timeoutRef.current)
    startedRef.current = true
    setVisible(true)
    setProgress(8)
    let p = 8
    intervalRef.current = setInterval(() => {
      p += (88 - p) * 0.12 + Math.random() * 2
      if (p >= 88) { p = 88; clearInterval(intervalRef.current) }
      setProgress(p)
    }, 180)
  }

  function finishLoader() {
    clearInterval(intervalRef.current)
    setProgress(100)
    timeoutRef.current = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 450)
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
        @keyframes simbaRun {
          0%   { transform: translateY(0px)   rotate(-8deg) scale(1);    }
          25%  { transform: translateY(-10px) rotate(0deg)  scale(1.1);  }
          50%  { transform: translateY(-3px)  rotate(8deg)  scale(1.05); }
          75%  { transform: translateY(-12px) rotate(0deg)  scale(1.1);  }
          100% { transform: translateY(0px)   rotate(-8deg) scale(1);    }
        }
        @keyframes pawBlink {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50%      { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>

      {/* 상단 프로그레스 바 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        height: 10, background: '#fce7f3', pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #f9a8d4, #ec4899, #db2777)',
          transition: progress === 100 ? 'width 0.25s ease' : 'width 0.35s ease-out',
          borderRadius: '0 6px 6px 0',
          position: 'relative',
          boxShadow: '0 0 12px rgba(236,72,153,0.6)',
        }}>
          {/* 심바 */}
          <span style={{
            position: 'absolute',
            right: -26,
            top: -28,
            fontSize: 40,
            lineHeight: 1,
            display: 'block',
            animation: 'simbaRun 0.5s ease-in-out infinite',
            filter: 'drop-shadow(0 3px 6px rgba(219,39,119,0.35))',
            userSelect: 'none',
          }}>🦁</span>
        </div>
      </div>

      {/* 우하단 토스트 */}
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
        background: 'linear-gradient(135deg, #fce7f3, #fdf4ff)',
        border: '1px solid #fda4c8',
        borderRadius: 20, padding: '7px 16px',
        display: 'flex', alignItems: 'center', gap: 7,
        fontSize: 13, color: '#db2777', fontWeight: 600,
        boxShadow: '0 4px 16px rgba(236,72,153,0.18)',
        pointerEvents: 'none',
      }}>
        <span style={{ animation: 'pawBlink 0.6s ease-in-out infinite', display: 'inline-block' }}>🐾</span>
        심바가 달려오는 중...
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
