import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import useWindowWidth from './useWindowWidth.js'
import axios from 'axios'

export default function Hero() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const width = useWindowWidth()
  const isMobile = width < 768

  const handleWebsite = async (e) => {
    e.preventDefault()
    if (!url) {
      setError('Please enter a URL')
      return
    }
    setError('')
    try {
      await axios.post("/api/website", { url }, { withCredentials: true })
      
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add website')
    }
  }



  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '100px 16px 60px' : '120px 24px 100px',
      position: 'relative', overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Subtle radial glow behind heading */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: isMobile ? '100%' : '700px', height: isMobile ? '300px' : '400px',
        background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Heading */}
        <h1 style={{ fontSize: 'clamp(36px, 8vw, 68px)', fontWeight: '700', lineHeight: '1.06', letterSpacing: '-0.04em', color: '#f5f5f5', margin: '0 0 24px', }}>
          Monitor Your Websites<br />
          <span style={{ color: '#e0e0e0' }}>Before Users Notice</span><br />
          Problems
        </h1>

        {/* Subtext */}
        <p style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: '400', color: '#888888', lineHeight: '1.7', margin: '0 auto 48px', maxWidth: '520px' }}>
          AI-powered uptime monitoring with realtime alerts, incident tracking, intelligent summaries, and response time analytics.
        </p>


        {/* Input + CTA */}
        <div
          style={{
            maxWidth: '540px',
            margin: '0 auto 16px',
          }}
        >
          <form
            onSubmit={handleWebsite}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              style={{
                flex: 1,
                width: isMobile ? '100%' : 'auto',
                minWidth: isMobile ? '100%' : '260px',
                backgroundColor: '#111111',
                border: '1px solid #1f1f1f',
                borderRadius: '9px',
                padding: '13px 16px',
                fontSize: '14px',
                fontFamily: 'ui-monospace, monospace',
                color: '#f5f5f5',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#333333')}
              onBlur={(e) => (e.target.style.borderColor = '#1f1f1f')}
            />

            <button
              type="submit"
              style={{
                backgroundColor: '#f5f5f5',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '9px',
                padding: '13px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                width: isMobile ? '100%' : 'auto',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#e0e0e0')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#f5f5f5')
              }
            >
              Start Monitoring <ArrowRight size={14} />
            </button>
            {error && <p style={{ fontSize: '12px', color: '#ef4444', margin: '8px 0 0', textAlign: 'center' }}>{error}</p>}
          </form>
        </div> 

        <p style={{ fontSize: '12px', color: '#555555' }}></p>
      </div>
    </section>
  )
}
