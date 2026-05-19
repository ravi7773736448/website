import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Globe, AlertTriangle, BarChart3, Settings, ArrowLeft } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/websites', label: 'Websites', icon: Globe },
  { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
]

const Sidebar = ({ className = '', onClose = () => {} }) => {
  return (
    <aside className={`fixed left-0 top-0 h-screen w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col z-50 ${className}`}>
      <div className="h-14 flex items-center px-3 border-b border-zinc-800 justify-between">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-md bg-emerald-500/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-sm font-semibold text-white">PingGuard</span>
        </div>

        <button
          onClick={onClose}
          className="md:hidden p-2 mr-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-md"
          aria-label="Close sidebar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => {
                  try {
                    if (onClose && typeof window !== 'undefined' && window.innerWidth < 768) onClose()
                  } catch (e) {
                    // ignore
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-zinc-800/80 text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-500">
          PingGuard v1.0
        </div>
      </div>
    </aside>
  )
}

export default Sidebar