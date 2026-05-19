import { AlertTriangle, Clock, Sparkles } from 'lucide-react'

const mockIncidents = [
  {
    id: 1,
    website: 'legacy-system.com',
    errorType: 'Connection Timeout',
    duration: '45 minutes',
    summary: 'The website became unresponsive after the server experienced high CPU usage. Automatic recovery was triggered after the timeout threshold was reached.',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    website: 'dashboard.app',
    errorType: 'High Latency',
    duration: '15 minutes',
    summary: 'Response times spiked significantly due to increased traffic and database query inefficiencies. The AI analysis suggests optimizing database indexes.',
    timestamp: '5 hours ago',
  },
  {
    id: 3,
    website: 'api.service.io',
    errorType: 'SSL Certificate Error',
    duration: '2 hours',
    summary: 'SSL certificate validation failed due to an expired certificate. The monitoring system detected the mismatch during the health check handshake.',
    timestamp: '1 day ago',
  },
]

const IncidentCard = ({ incident }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-white">{incident.website}</span>
        </div>
        <span className="text-xs text-zinc-500">{incident.timestamp}</span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span className="text-zinc-400">{incident.duration}</span>
        </div>
        <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
          {incident.errorType}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-zinc-800/30 rounded-md">
        <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">{incident.summary}</p>
      </div>
    </div>
  )
}

const IncidentSummary = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-medium text-white">AI Incident Summaries</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockIncidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  )
}

export default IncidentSummary