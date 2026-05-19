import React from 'react'
import useWindowWidth from './useWindowWidth.js'

export default function Footer() {
  const width = useWindowWidth()
  const isMobile = width < 768

  return (
    <footer style={{ borderTop: '1px solid #1a1a1a', padding: isMobile ? '24px 16px' : '32px 24px' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#3a3a3a' }}>·</span>
          <span style={{ fontSize: '13px', color: '#555555' }}>© {new Date().getFullYear()} PingGuard. All rights reserved.</span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', marginTop: isMobile ? '8px' : 0 }}>
          {[
            { label: 'GitHub', href: 'https://github.com' },
            { label: 'Docs', href: '#' },
            { label: 'Status', href: '#' },
            { label: 'Privacy', href: '#' },
          ].map(link => (
            <a
              key={link.label} href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              style={{ fontSize: '13px', color: '#555555', textDecoration: 'none', transition: 'color 0.15s ease' }}
              onMouseEnter={e => e.target.style.color = '#888888'}
              onMouseLeave={e => e.target.style.color = '#555555'}
            >{link.label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
