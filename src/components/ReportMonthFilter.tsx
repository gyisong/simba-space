'use client'

interface Props {
  years: number[]
  months: number[]
  selectedYear: number
  selectedMonth: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
}

export default function ReportMonthFilter({ years, months, selectedYear, selectedMonth, onYearChange, onMonthChange }: Props) {
  const MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12]

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 10px rgba(240,160,190,0.08)', marginBottom: 28 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {years.map(y => (
          <button key={y} onClick={() => onYearChange(y)}
            style={{
              padding: '6px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
              background: y === selectedYear ? 'linear-gradient(135deg, #f472b6, #db2777)' : '#fdf2f8',
              color: y === selectedYear ? '#fff' : '#9d7a8a',
              transition: 'all 0.15s',
            }}>
            {y}년
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {MONTHS.map(m => {
          const hasData = months.includes(m)
          const isSelected = m === selectedMonth
          return (
            <button key={m} onClick={() => hasData && onMonthChange(m)} disabled={!hasData}
              style={{
                padding: '5px 14px', borderRadius: 20, border: isSelected ? '1.5px solid #f472b6' : '1.5px solid transparent',
                cursor: hasData ? 'pointer' : 'default', fontSize: 13, fontWeight: isSelected ? 700 : 500,
                background: isSelected ? 'linear-gradient(135deg, #fce7f3, #fdf4ff)' : hasData ? '#fdf2f8' : '#f9f9f9',
                color: isSelected ? '#db2777' : hasData ? '#9d7a8a' : '#d1c4cc',
                transition: 'all 0.15s',
              }}>
              {m}월
            </button>
          )
        })}
      </div>
    </div>
  )
}
