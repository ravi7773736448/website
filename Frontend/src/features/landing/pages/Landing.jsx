import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Stats from '../components/Stats.jsx'
import Features from '../components/Features.jsx'
import DashboardPreview from '../components/DashboardPreview.jsx'
import CTA from '../components/CTA.jsx'
import Footer from '../components/Footer.jsx'
import Aurora from '../components/Aurora.jsx'

const Landing = () => {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', position: 'relative' }}>

      {/* Aurora — fixed so it stays visible across all sections while scrolling */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <Aurora
          colorStops={['#0a0a0a', '#10b981', '#0a0a0a']}
          blend={0.5}
          amplitude={1.0}
          speed={0.8}
        />
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <DashboardPreview />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}

export default Landing