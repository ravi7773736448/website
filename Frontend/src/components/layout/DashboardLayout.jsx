import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'

const DashboardLayout = ({ title = 'Dashboard', children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      <div className={`md:hidden fixed inset-0 z-50 pointer-events-none ${sidebarOpen ? 'pointer-events-auto' : ''}`}>
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />

        <div className={`fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar className="w-64" onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      <div className="md:pl-56">
        <TopNavbar title={title} isMobile={true} sidebarOpen={sidebarOpen} onSidebarToggle={() => setSidebarOpen((s) => !s)} />
        <main className="p-4 md:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout