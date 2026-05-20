import { useState, useEffect } from 'react'
import { fetchAllIncidents, fetchWebsites } from '../services/website.api.js'
import { RefreshCw, AlertTriangle, Clock, CheckCircle, XCircle, Filter } from 'lucide-react'

export default function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [websites, setWebsites] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [incidentsData, websitesData] = await Promise.all([
        fetchAllIncidents(50),
        fetchWebsites()
      ])
      
      setIncidents(incidentsData.incidents || [])
      
      const websiteMap = {}
      ;(websitesData.websites || []).forEach(w => {
        websiteMap[w._id] = w
      })
      setWebsites(websiteMap)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load incidents')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (ms) => {
    if (!ms) return '-'
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const formatTime = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleString()
  }

  const getDurationClass = (duration) => {
    if (!duration) return 'text-zinc-400'
    if (duration < 60000) return 'text-emerald-400'
    if (duration < 300000) return 'text-amber-400'
    return 'text-red-400'
  }

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true
    if (filter === 'active') return !incident.endTime
    if (filter === 'resolved') return incident.endTime
    return true
  })

  const activeCount = incidents.filter(i => !i.endTime).length
  const resolvedCount = incidents.filter(i => i.endTime).length

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <RefreshCw className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#f5f5f5', marginBottom: '4px' }}>Incidents</h1>
          <p style={{ fontSize: '14px', color: '#888888' }}>View downtime incidents across your websites</p>
        </div>
        <button
          onClick={loadData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#161616',
            border: '1px solid #1f1f1f',
            borderRadius: '8px',
            color: '#888888',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'all' ? '#f5f5f5' : 'transparent',
            color: filter === 'all' ? '#0a0a0a' : '#888888',
            border: `1px solid ${filter === 'all' ? '#f5f5f5' : '#1f1f1f'}`,
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          All ({incidents.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'active' ? '#ef4444' : 'transparent',
            color: filter === 'active' ? '#fff' : '#888888',
            border: `1px solid ${filter === 'active' ? '#ef4444' : '#1f1f1f'}`,
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter('resolved')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'resolved' ? '#22c55e' : 'transparent',
            color: filter === 'resolved' ? '#fff' : '#888888',
            border: `1px solid ${filter === 'resolved' ? '#22c55e' : '#1f1f1f'}`,
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Resolved ({resolvedCount})
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          marginBottom: '24px',
          color: '#ef4444'
        }}>
          {error}
        </div>
      )}

      {filteredIncidents.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#111111',
          borderRadius: '12px',
          border: '1px solid #1f1f1f'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#161616', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <p style={{ fontSize: '16px', color: '#f5f5f5', marginBottom: '8px' }}>No incidents found</p>
          <p style={{ fontSize: '14px', color: '#666666' }}>All your websites are running smoothly</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredIncidents.map((incident, index) => (
            <div
              key={incident._id || index}
              style={{
                backgroundColor: '#111111',
                border: '1px solid #1f1f1f',
                borderRadius: '12px',
                padding: '20px',
                borderLeft: incident.endTime ? '3px solid #22c55e' : '3px solid #ef4444'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      backgroundColor: incident.endTime ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: incident.endTime ? '#22c55e' : '#ef4444',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {incident.endTime ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {incident.endTime ? 'Resolved' : 'Active'}
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#f5f5f5' }}>
                      {websites[incident.websiteId]?.name || incident.websiteName || 'Unknown Website'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#666666' }}>
                    {websites[incident.websiteId]?.url || ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: getDurationClass(incident.duration), display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock className="w-4 h-4" />
                    {formatDuration(incident.duration)}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Started</p>
                  <p style={{ fontSize: '13px', color: '#f5f5f5' }}>{formatTime(incident.startTime)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ended</p>
                  <p style={{ fontSize: '13px', color: '#f5f5f5' }}>{formatTime(incident.endTime) || 'Still down'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Error Type</p>
                  <p style={{ fontSize: '13px', color: '#f5f5f5' }}>{incident.errorType || 'Unknown'}</p>
                </div>
              </div>

              {incident.aiSummary && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#161616', 
                  borderRadius: '8px',
                  marginTop: '12px'
                }}>
                  <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    AI Summary
                  </p>
                  <p style={{ fontSize: '13px', color: '#888888', lineHeight: '1.5' }}>
                    {incident.aiSummary}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}