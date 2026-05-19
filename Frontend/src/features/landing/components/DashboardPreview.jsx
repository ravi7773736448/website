import React from 'react'
import useFadeIn from './useFadeIn.js'
import useWindowWidth from './useWindowWidth.js'

export default function DashboardPreview() {
  const [ref, visible] = useFadeIn()
  const width = useWindowWidth()
  const isMobile = width < 768

  const sites = [
    { name: 'api.stripe.com', status: 'UP', ms: '142ms', color: '#10b981' },
    { name: 'app.notion.so', status: 'UP', ms: '89ms', color: '#10b981' },
    { name: 'status.github.com', status: 'SLOW', ms: '1.2s', color: '#f59e0b' },
    { name: 'mysite.vercel.app', status: 'DOWN', ms: '—', color: '#ef4444' },
  ]

  // Simple SVG line chart data
  const chartPoints = [65, 72, 58, 80, 74, 68, 82]
  const max = 100, min = 0
  const w = 260, h = 80
  const pts = chartPoints.map((v, i) => `${(i / (chartPoints.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`)

  return (
    <section id="product" ref={ref} style={{ padding: isMobile ? '0 16px 80px' : '0 24px 120px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '56px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em', color: '#555555', textTransform: 'uppercase', marginBottom: '16px' }}>Product</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '600', letterSpacing: '-0.025em', color: '#f5f5f5', margin: 0 }}>
            A dashboard built for clarity
          </h2>
        </div>

        {/* Dashboard Panel */}
        <div style={{
          backgroundColor: '#111111', borderRadius: '16px',
          border: '1px solid #1a1a1a', overflow: 'hidden',
          maxWidth: '900px', margin: '0 auto',
        }}>
          {/* Panel Top Bar */}
          <div style={{ backgroundColor: '#0f0f0f', borderBottom: '1px solid #1a1a1a', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['#ef4444', '#f59e0b', '#10b981'].map((c, i) => (
                <span key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c, opacity: 0.6 }} />
              ))}
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Overview', 'Incidents', 'Analytics'].map((tab, i) => (
                  <span key={tab} style={{
                    fontSize: '12px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer',
                    backgroundColor: i === 0 ? '#1f1f1f' : 'transparent',
                    color: i === 0 ? '#f5f5f5' : '#555555', fontWeight: i === 0 ? '500' : '400'
                  }}>{tab}</span>
                ))}
              </div>
            )}
            <span style={{ fontSize: '12px', color: '#555555' }}>Last 7 days</span>
          </div>

          {/* Panel Body */}
          <div style={{ padding: isMobile ? '16px' : '24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '20px' }}>
            {/* Website Status List */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#555555', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Monitored Sites</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sites.map((site, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: '8px', backgroundColor: '#0f0f0f',
                    border: '1px solid #1a1a1a',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: site.color, flexShrink: 0, boxShadow: `0 0 6px ${site.color}60` }} />
                      <span style={{ fontSize: '13px', color: '#d0d0d0', fontFamily: 'ui-monospace, monospace' }}>{site.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: site.color, backgroundColor: `${site.color}14`, borderRadius: '4px', padding: '2px 7px' }}>{site.status}</span>
                      <span style={{ fontSize: '12px', color: '#555555', fontFamily: 'ui-monospace, monospace', display: isMobile ? 'none' : 'block' }}>{site.ms}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics + Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Uptime metric */}
              <div style={{ backgroundColor: '#0f0f0f', borderRadius: '10px', border: '1px solid #1a1a1a', padding: '20px 24px' }}>
                <div style={{ fontSize: '11px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Uptime (7d avg)</div>
                <div style={{ fontSize: '42px', fontWeight: '700', color: '#10b981', letterSpacing: '-0.04em', lineHeight: 1 }}>99.7%</div>
                <div style={{ fontSize: '12px', color: '#555555', marginTop: '8px' }}>3 incidents resolved</div>
              </div>

              {/* Response Time Chart */}
              <div style={{ backgroundColor: '#0f0f0f', borderRadius: '10px', border: '1px solid #1a1a1a', padding: '20px 24px', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Response Time (ms)</div>
                <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="80" style={{ display: 'block' }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points={pts.join(' ')}
                    fill="none" stroke="#10b981" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                  <polygon
                    points={`0,${h} ${pts.join(' ')} ${w},${h}`}
                    fill="url(#chartGrad)"
                  />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <span key={d} style={{ fontSize: '10px', color: '#444444' }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
