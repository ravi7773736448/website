import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useWindowWidth from './useWindowWidth.js'
import { setUser } from '../../auth/state/auth.slice.js'
import { logout } from '../../auth/services/auth.api.js'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const width = useWindowWidth()
  const isMobile = width < 768

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const diff = currentY - lastScrollY.current
      setScrolled(currentY > 20)
      if (currentY > 110) {
        if (diff > 4) setVisible(false)
        else if (diff < -4) setVisible(true)
      } else {
        setVisible(true)
      }
      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear Redux state (HTTP-only cookie is cleared by backend)
      dispatch(setUser(null))
      navigate('/')
    }
  }

  const handleLogoClick = () => {
    if (user) navigate('/dashboard')
    else navigate('/')
  }

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '60px',
        backgroundColor: scrolled ? 'rgba(8,8,8,0.90)' : 'rgba(8,8,8,0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(255,255,255,0.04)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s ease, background-color 0.4s ease, border-color 0.4s ease',
        display: 'flex', alignItems: 'center',
      }}
    >
      <div style={{ maxWidth: '1140px', margin: '0 auto', width: '100%', padding: isMobile ? '0 16px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={handleLogoClick}>
          <span style={{ fontSize: '20px', fontWeight: '600', color: '#f5f5f5', letterSpacing: '-0.01em' }}>PingGuard</span>
        </div>

        {/* Nav Links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a key="home" href="#" onClick={(e) => { e.preventDefault(); navigate('/') }}
              style={{ fontSize: '14px', color: '#aaaaaa', textDecoration: 'none', transition: 'color 0.15s ease', cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.color = '#f5f5f5'}
              onMouseLeave={e => e.target.style.color = '#aaaaaa'}
            >Home</a>
            {['Features', 'Pricing', 'Docs'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                style={{ fontSize: '14px', color: '#aaaaaa', textDecoration: 'none', transition: 'color 0.15s ease', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#f5f5f5'}
                onMouseLeave={e => e.target.style.color = '#aaaaaa'}
              >{link}</a>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                style={{ fontSize: '13px', fontWeight: '500', color: '#0a0a0a', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '7px', padding: '7px 14px', cursor: 'pointer', transition: 'background 0.15s ease' }}
                onMouseEnter={e => e.target.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={e => e.target.style.backgroundColor = '#f5f5f5'}
              >Dashboard →</button>
              <button
                onClick={handleLogout}
                style={{ fontSize: '13px', fontWeight: '500', color: '#f5f5f5', backgroundColor: 'transparent', border: '1px solid #ef4444', borderRadius: '7px', padding: '7px 14px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
                onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}
              >Logout</button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{ fontSize: '13px', fontWeight: '500', color: '#f5f5f5', backgroundColor: 'transparent', border: '1px solid #4a4a4a', borderRadius: '7px', padding: isMobile ? '7px 10px' : '7px 14px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = '#6a6a6a' }}
                onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#4a4a4a' }}
              >Log in</button>
              <button
                onClick={() => navigate('/register')}
                style={{ fontSize: '13px', fontWeight: '500', color: '#0a0a0a', backgroundColor: '#f5f5f5', border: 'none', borderRadius: '7px', padding: '7px 14px', cursor: 'pointer', transition: 'background 0.15s ease' }}
                onMouseEnter={e => e.target.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={e => e.target.style.backgroundColor = '#f5f5f5'}
              >Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
