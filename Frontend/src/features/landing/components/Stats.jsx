import React from 'react'
import useFadeIn from './useFadeIn.js'
import useWindowWidth from './useWindowWidth.js'

export default function Stats() {
  const [ref, visible] = useFadeIn()
  const width = useWindowWidth()
  const isMobile = width < 768
  
  const stats = [
    { value: '99.9%', label: 'Uptime Accuracy' },
    { value: '<1 min', label: 'Alert Response Time' },
    { value: 'AI', label: 'Incident Summaries' },
    { value: 'Live', label: 'Status Updates' },
  ]

  return (
    <section ref={ref} style={{ padding: isMobile ? '0 16px 80px' : '0 24px 120px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '1px', backgroundColor: '#1a1a1a', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ backgroundColor: '#0a0a0a', padding: isMobile ? '24px 16px' : '40px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? '28px' : '34px', fontWeight: '700', color: '#f5f5f5', letterSpacing: '-0.03em', marginBottom: '6px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#555555', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
