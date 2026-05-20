import { useState, useEffect, useRef } from 'react'
import { Activity, Wifi, WifiOff, Clock, CheckCircle, XCircle } from 'lucide-react'

const MAX_POINTS = 60

const LiveHeartbeat = ({ websites = [] }) => {
  const [heartbeatData, setHeartbeatData] = useState({})
  const [currentStatus, setCurrentStatus] = useState({})
  const prevStatusRef = useRef({})
  
  useEffect(() => {
    if (websites.length === 0) return
    
    const interval = setInterval(() => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
      
      const newStatus = {}
      const newHeartbeat = {}
      
      websites.slice(0, 6).forEach(site => {
        const status = site.status || 'UNKNOWN'
        newStatus[site._id] = status
        
        const value = status === 'UP' ? 1 : status === 'SLOW' ? 0.5 : status === 'DOWN' ? -1 : 0
        
        if (!heartbeatData[site._id]) {
          newHeartbeat[site._id] = Array(MAX_POINTS).fill(null).map(() => ({ 
            time: '', 
            value: null 
          }))
        } else {
          newHeartbeat[site._id] = [...heartbeatData[site._id]]
        }
        
        const shouldPulse = prevStatusRef.current[site._id] !== status
        prevStatusRef.current[site._id] = status
        
        newHeartbeat[site._id].push({
          time: timeStr,
          value: shouldPulse ? value * 1.5 : value,
          status: status
        })
        
        if (newHeartbeat[site._id].length > MAX_POINTS) {
          newHeartbeat[site._id].shift()
        }
      })
      
      setCurrentStatus(newStatus)
      setHeartbeatData(newHeartbeat)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [websites])

  const getStatusColor = (status) => {
    switch (status) {
      case 'UP': return '#22c55e'
      case 'SLOW': return '#eab308'
      case 'DOWN': return '#ef4444'
      default: return '#71717a'
    }
  }

  const getYPosition = (value) => {
    if (value === null) return 50
    return 50 - (value * 35)
  }

  const generatePath = (data) => {
    if (!data || data.length < 2) return ''
    
    const points = data.map((d, i) => {
      const x = (i / (MAX_POINTS - 1)) * 100
      const y = getYPosition(d.value)
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')}`
  }

  if (websites.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-medium text-white">Live Heartbeat</h3>
        </div>
        <div className="h-32 flex items-center justify-center text-zinc-500">
          <p className="text-sm">Add websites to see live status</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <h3 className="text-sm font-medium text-white">Live Heartbeat</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-zinc-500">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {websites.slice(0, 6).map(site => {
          const data = heartbeatData[site._id] || []
          const status = currentStatus[site._id] || site.status || 'UNKNOWN'
          const statusColor = getStatusColor(status)
          
          return (
            <div key={site._id} className="relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {status === 'UP' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                  {status === 'DOWN' && <XCircle className="w-3 h-3 text-red-500" />}
                  {status === 'SLOW' && <Clock className="w-3 h-3 text-amber-500" />}
                  {status === 'UNKNOWN' && <Wifi className="w-3 h-3 text-zinc-500" />}
                  <span className="text-xs text-zinc-300 truncate max-w-[120px]">
                    {site.name || site.url}
                  </span>
                </div>
                <span 
                  className="text-xs font-medium px-2 py-0.5 rounded"
                  style={{ 
                    backgroundColor: `${statusColor}20`,
                    color: statusColor
                  }}
                >
                  {status}
                </span>
              </div>
              
              <div className="h-12 bg-zinc-950/50 rounded overflow-hidden relative">
                <svg viewBox="0 0 100 70" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`gradient-${site._id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={statusColor} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={statusColor} stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  
                  {data.length > 0 && (
                    <path
                      d={generatePath(data)}
                      fill="none"
                      stroke={`url(#gradient-${site._id})`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        filter: `drop-shadow(0 0 4px ${statusColor})`,
                        animation: 'pulse 1s ease-in-out infinite'
                      }}
                    />
                  )}
                  
                  {data.length > 0 && data[data.length - 1].value !== null && (
                    <circle
                      cx="100"
                      cy={getYPosition(data[data.length - 1].value)}
                      r="3"
                      fill={statusColor}
                      style={{
                        filter: `drop-shadow(0 0 6px ${statusColor})`
                      }}
                    />
                  )}
                </svg>
                
                {data.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-0.5 w-full bg-zinc-800" />
                    <div className="absolute w-2 h-2 rounded-full bg-zinc-600 animate-ping" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}

export default LiveHeartbeat