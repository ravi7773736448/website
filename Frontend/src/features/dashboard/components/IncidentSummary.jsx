import { useEffect, useState } from 'react'
import { AlertTriangle, Clock, Sparkles, Loader2 } from 'lucide-react'
import { fetchAllIncidents } from '../services/website.api'

const formatDuration = (ms) => {
  const minutes = Math.round(ms / 60000)
  if (minutes < 60) return `${minutes} minutes`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hours`
  return `${Math.round(hours / 24)} days`
}

const formatTimestamp = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

const IncidentCard = ({ incident }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-white">{incident.websiteName}</span>
        </div>
        <span className="text-xs text-zinc-500">{formatTimestamp(incident.createdAt)}</span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span className="text-zinc-400">{formatDuration(incident.duration)}</span>
        </div>
        <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
          {incident.errorType}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-zinc-800/30 rounded-md">
        <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">{incident.aiSummary}</p>
      </div>
    </div>
  )
}

const IncidentSummary = () => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const data = await fetchAllIncidents(6)
        setIncidents(data.incidents || [])
      } catch (err) {
        setError(err.message || 'Failed to load incidents')
      } finally {
        setLoading(false)
      }
    }
    loadIncidents()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-medium text-white">AI Incident Summaries</h3>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : incidents.length === 0 ? (
        <p className="text-sm text-zinc-500">No incidents yet</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <IncidentCard key={incident._id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  )
}

export default IncidentSummary