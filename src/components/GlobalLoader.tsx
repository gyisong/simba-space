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
      if (!a) return
      if (a.target === '_blank' || a.download) return
      try {
        const url = new URL(a.href, location.href)
        const isSameOrigin = url.origin === location.origin
        const isSamePath = url.pathname + url.search === location.pathname + location.search
        if (isSameOrigin && !isSamePath) startLoader()
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
          0%   { transform: translateY(0px)  rotate(-6deg); }
          25%  { transform: translateY(-7px) rotate(0deg); }
          50%  { transform: translateY(-2px) rotate(6deg); }
          75%  { transform: translateY(-9px) rotate(0deg); }
          100% { transform: translateY(0px)  rotate(-6deg); }
        }
        @keyframes tailWag {
          0%, 100% { transform: rotate(-20deg); }
          50%       { transform: rotate(20deg); }
        }
      `}</style>

      {/* 최상단 바 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        height: 7, background: '#fce7f3', pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #f9a8d4, #ec4899, #db2777)',
          transition: progress === 100 ? 'width 0.25s ease' : 'width 0.35s ease-out',
          borderRadius: '0 4px 4px 0',
          position: 'relative',
          boxShadow: '0 0 10px rgba(236,72,153,0.5)',
        }}>
          {/* 심바 아이콘 */}
          <span style={{
            position: 'absolute',
            right: -22,
            top: -20,
            fontSize: 30,
            lineHeight: 1,
            display: 'block',
            animation: 'simbaRun 0.55s ease-in-out infinite',
            filter: 'drop-shadow(0 2px 4px rgba(219,39,119,0.3))',
            userSelect: 'none',
          }}>
            🦁
          </span>
        </div>
      </div>

      {/* 하단 진행 텍스트 (선택적, 우하단 작게) */}
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
        background: 'linear-gradient(135deg, #fce7f3, #fdf4ff)',
        border: '1px solid #fda4c8',
        borderRadius: 20, padding: '6px 14px',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: '#db2777', fontWeight: 600,
        boxShadow: '0 4px 16px rgba(236,72,153,0.15)',
        pointerEvents: 'none',
        animation: 'none',
      }}>
        <span style={{ animation: 'tailWag 0.5s ease-in-out infinite', display: 'inline-block' }}>🐾</span>
        <span>심바가 달려오는 중...</span>
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
