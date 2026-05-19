import { CheckCircle, AlertTriangle, Zap, Sparkles, Clock } from 'lucide-react'

const getRelativeTime = (minutes) => {
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}

const mockActivities = [
  { id: 1, type: 'recovery', message: 'example.com is back online', time: 2, icon: CheckCircle, color: 'text-emerald-400' },
  { id: 2, type: 'down', message: 'legacy-system.com went down', time: 5, icon: AlertTriangle, color: 'text-red-400' },
  { id: 3, type: 'slow', message: 'High latency detected on dashboard.app', time: 12, icon: Zap, color: 'text-amber-400' },
  { id: 4, type: 'ai', message: 'AI incident summary generated', time: 18, icon: Sparkles, color: 'text-blue-400' },
  { id: 5, type: 'recovery', message: 'api.service.io recovered', time: 25, icon: CheckCircle, color: 'text-emerald-400' },
  { id: 6, type: 'slow', message: 'Response time spike on new-project.dev', time: 35, icon: Zap, color: 'text-amber-400' },
]

const ActivityFeed = () => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <h3 className="text-sm font-medium text-white">Live Activity</h3>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {mockActivities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 pb-3 border-b border-zinc-800/50 last:border-0 last:pb-0"
          >
            <div className={`mt-0.5 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-300 leading-snug">{activity.message}</p>
            </div>
            <span className="text-xs text-zinc-600 flex-shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getRelativeTime(activity.time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityFeed