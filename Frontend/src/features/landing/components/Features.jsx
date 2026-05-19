import React, { useState } from 'react'
import { Shield, Sparkles, Bell, BarChart2 } from 'lucide-react'
import useFadeIn from './useFadeIn.js'
import useWindowWidth from './useWindowWidth.js'

function FeatureCard({ icon, title, desc, delay, visible, isMobile }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? '#161616' : '#111111',
        borderRadius: '12px', padding: isMobile ? '24px' : '32px',
        border: `1px solid ${hovered ? '#2a2a2a' : '#1a1a1a'}`,
        transition: 'all 0.2s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: `${delay}s`,
      }}
    >
      <div style={{ color: '#555555', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#f5f5f5', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#888888', margin: 0, lineHeight: '1.7' }}>{desc}</p>
    </div>
  )
}

export default function Features() {
  const [ref, visible] = useFadeIn()
  const width = useWindowWidth()
  const isMobile = width < 768
  
  const features = [
    {
      icon: <Shield size={18} strokeWidth={1.5} />,
      title: 'Realtime Monitoring',
      desc: 'We ping your websites every 60 seconds from multiple global locations. Know the moment something changes.'
    },
    {
      icon: <Sparkles size={18} strokeWidth={1.5} />,
      title: 'AI Incident Summaries',
      desc: 'When downtime ends, our AI generates a professional incident report automatically so you stay informed.'
    },
    {
      icon: <Bell size={18} strokeWidth={1.5} />,
      title: 'Instant Alerts',
      desc: 'Get notified by email the moment your website goes down or recovers. Never miss a critical event.'
    },
    {
      icon: <BarChart2 size={18} strokeWidth={1.5} />,
      title: 'Response Analytics',
      desc: 'Track response times, uptime percentage, and historical performance trends over time with rich charts.'
    },
  ]

  return (
    <section id="features" ref={ref} style={{ padding: isMobile ? '0 16px 80px' : '0 24px 120px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.6s ease 0.1s' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: isMobile ? '40px' : '56px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em', color: '#555555', textTransform: 'uppercase', marginBottom: '16px' }}>Features</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '600', letterSpacing: '-0.025em', color: '#f5f5f5', margin: 0, lineHeight: 1.2 }}>
            Everything you need<br />for reliable uptime
          </h2>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
          {features.map((feat, i) => (
            <FeatureCard key={i} {...feat} delay={i * 0.08} visible={visible} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  )
}
