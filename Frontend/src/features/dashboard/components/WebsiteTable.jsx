import { Globe, MoreHorizontal, RefreshCw, Eye, Trash2 } from 'lucide-react'
import { getStatusConfig, getResponseTimeColor, getUptimeBadgeColor, formatLastCheckedTime } from '../services/dashboard.service'

const WebsiteTable = ({ websites = [], onView, onCheck, onDelete }) => {
  const formatTime = (date) => formatLastCheckedTime(date)

  // Show empty state if no websites
  if (!websites || websites.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center">
        <Globe className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-400">No websites added yet</p>
        <p className="text-xs text-zinc-500 mt-1">Add your first website to start monitoring</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Website</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Response</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Uptime</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Last Check</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {websites.map((site) => {
              const statusInfo = getStatusConfig(site.status)
              return (
                <tr key={site.id} className="hover:bg-zinc-900/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 rounded-md flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{site.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{site.url}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`relative flex h-2 w-2`}>
                        {statusInfo.pulse && (
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusInfo.color}`} />
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${statusInfo.color}`} />
                      </span>
                      <span className={`text-xs font-medium ${statusInfo.textColor}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${getResponseTimeColor(site.responseTime)}`}>
                      {site.responseTime === 0 ? '-' : `${site.responseTime}ms`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getUptimeBadgeColor(site.uptime)}`}
                          style={{ width: `${site.uptime}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400">{site.uptime.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-500">{formatTime(site.lastChecked)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onCheck?.(site.id)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
                        title="Manual Check"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onView?.(site.id)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete?.(site.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WebsiteTable