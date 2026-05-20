import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, Search, ChevronDown, LogOut, User, Settings, Menu, X } from 'lucide-react'
import { setUser } from '../../features/auth/state/auth.slice.js'
import { logout } from '../../features/auth/services/auth.api.js'

const TopNavbar = ({ title = 'Dashboard', isMobile = false, sidebarOpen = false, onSidebarToggle = () => {} }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  const handleProfileClick = () => {
    navigate('/profile')
    setShowUserMenu(false)
  }

  const handleSettingsClick = () => {
    navigate('/settings')
    setShowUserMenu(false)
  }

  const userName = user?.username || user?.fullName || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''
  const userAvatar = user?.avatar || user?.photo || null

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Continue with logout even if API call fails
    }
    // Clear Redux state (HTTP-only cookie is cleared by backend)
    dispatch(setUser(null))
    setShowUserMenu(false)
    navigate('/login')
  }

  return (
    <header className="h-14 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={onSidebarToggle}
            className="p-2 mr-1 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-md md:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <h1 className="text-base font-medium text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 pl-9 pr-4 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 w-64"
          />
        </div>

        <button className="relative p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-zinc-900 rounded-md transition-colors"
          >
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName}
                className="w-7 h-7 rounded-md object-cover"
              />
            ) : (
              <div className="w-7 h-7 bg-zinc-800 rounded-md flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            )}
            <span className="hidden md:block text-sm text-zinc-300">{userName}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg overflow-hidden">
              <div className="px-3 py-2 border-b border-zinc-800">
                <p className="text-sm text-white truncate">{userName}</p>
                {userEmail && <p className="text-xs text-zinc-500 truncate">{userEmail}</p>}
              </div>
              <button onClick={handleProfileClick} className="w-full px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Profile
              </button>
              <button onClick={handleSettingsClick} className="w-full px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center gap-2">
                <Settings className="w-3.5 h-3.5" />
                Settings
              </button>
              <button onClick={handleLogout} className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-800 flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNavbar