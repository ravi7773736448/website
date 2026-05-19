import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import useFadeIn from './useFadeIn.js'
import useWindowWidth from './useWindowWidth.js'

export default function CTA() {
  const navigate = useNavigate()
  const [ref, visible] = useFadeIn()
  const width = useWindowWidth()
  const isMobile = width < 768

  return (
    <section ref={ref} style={{ padding: isMobile ? '0 16px 80px' : '0 24px 140px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '20px', padding: isMobile ? '60px 24px' : '80px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: '700', letterSpacing: '-0.04em', color: '#f5f5f5', margin: '0 0 16px', lineHeight: 1.1 }}>
            Start monitoring in minutes
          </h2>
          <p style={{ fontSize: isMobile ? '15px' : '16px', color: '#888888', margin: '0 0 40px', lineHeight: 1.6 }}>
            Set up takes less than 30 seconds. No configuration required.
          </p>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{ fontSize: '14px', fontWeight: '600', color: '#0a0a0a', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '9px', padding: '13px 24px', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: isMobile ? '100%' : 'auto' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            >Get Started <ArrowRight size={14} /></button>
            <button
              onClick={() => navigate('/login')}
              style={{ fontSize: '14px', fontWeight: '500', color: '#888888', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '9px', padding: '13px 24px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: isMobile ? '100%' : 'auto' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f5f5f5'; e.currentTarget.style.borderColor = '#3a3a3a' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.borderColor = '#2a2a2a' }}
            >View Demo</button>
          </div>
        </div>
      </div>
    </section>
  )
}
