import { useState, useEffect } from 'react'
import { fetchWebsites, fetchWebsiteAnalytics, fetchWebsiteIncidents } from '../services/website.api.js'
import { RefreshCw, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react'

export default function Analytics() {
  const [websites, setWebsites] = useState([])
  const [analyticsData, setAnalyticsData] = useState({})
  const [incidentData, setIncidentData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState(24)

  useEffect(() => {
    loadData()
  }, [selectedPeriod])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchWebsites()
      const websitesList = data.websites || []
      setWebsites(websitesList)

      if (websitesList.length === 0) {
        setAnalyticsData({})
        setIncidentData({})
        setError(null)
        setLoading(false)
        return
      }

      const analyticsPromises = websitesList.slice(0, 10).map(async (website) => {
        try {
          const [analytics, incidents] = await Promise.all([
            fetchWebsiteAnalytics(website._id, selectedPeriod).catch(err => {
              console.log('Analytics error for', website._id, err?.message)
              return null
            }),
            fetchWebsiteIncidents(website._id, 30).catch(() => ({ incidents: [] }))
          ])
          return { 
            id: website._id, 
            analytics: analytics?.analytics || null,
            incidents: incidents?.incidents || []
          }
        } catch (err) {
          console.log('Error loading data for', website._id, err?.message)
          return { id: website._id, analytics: null, incidents: [] }
        }
      })

      const results = await Promise.all(analyticsPromises)
      const analyticsMap = {}
      const incidentsMap = {}
      results.forEach(r => {
        analyticsMap[r.id] = r.analytics
        incidentsMap[r.id] = r.incidents
      })
      console.log('Analytics data loaded:', Object.keys(analyticsMap))
      setAnalyticsData(analyticsMap)
      setIncidentData(incidentsMap)
      setError(null)
    } catch (err) {
      console.error('Load analytics error:', err)
      setError(err.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const calculateOverallStats = () => {
    const allStats = Object.values(analyticsData).filter(a => a)
    const allIncidents = Object.values(incidentData).flat()
    
    if (allStats.length === 0) return { uptime: 0, avgResponse: 0, totalIncidents: 0, totalChecks: 0 }

    const uptime = allStats.reduce((sum, a) => sum + (a.uptime || 0), 0) / allStats.length
    const avgResponse = allStats.reduce((sum, a) => sum + (a.responseTime?.average || 0), 0) / allStats.length
    const totalChecks = allStats.reduce((sum, a) => sum + (a.totalChecks || 0), 0)

    return {
      uptime: Math.round(uptime * 10) / 10,
      avgResponse: Math.round(avgResponse),
      totalIncidents: allIncidents.length,
      totalChecks
    }
  }

  const getResponseTimeColor = (ms) => {
    if (ms < 500) return '#22c55e'
    if (ms < 1500) return '#eab308'
    return '#ef4444'
  }

  const getUptimeColor = (percentage) => {
    if (percentage >= 99) return '#22c55e'
    if (percentage >= 95) return '#eab308'
    return '#ef4444'
  }

  const stats = calculateOverallStats()

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
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#f5f5f5', marginBottom: '4px' }}>Analytics</h1>
          <p style={{ fontSize: '14px', color: '#888888' }}>Monitor your website performance and uptime</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[6, 24, 72, 168].map(hours => (
            <button
              key={hours}
              onClick={() => setSelectedPeriod(hours)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedPeriod === hours ? '#f5f5f5' : 'transparent',
                color: selectedPeriod === hours ? '#0a0a0a' : '#888888',
                border: `1px solid ${selectedPeriod === hours ? '#f5f5f5' : '#1f1f1f'}`,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {hours < 24 ? `${hours}h` : `${hours / 24}d`}
            </button>
          ))}
        </div>
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

      {websites.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#111111',
          borderRadius: '12px',
          border: '1px solid #1f1f1f'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#161616', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Activity className="w-6 h-6 text-zinc-500" />
          </div>
          <p style={{ fontSize: '16px', color: '#f5f5f5', marginBottom: '8px' }}>No data available</p>
          <p style={{ fontSize: '14px', color: '#666666' }}>Add websites to see analytics</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span style={{ fontSize: '13px', color: '#888888' }}>Avg Uptime</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: '700', color: getUptimeColor(stats.uptime) }}>
                {stats.uptime}%
              </p>
            </div>

            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Clock className="w-5 h-5 text-amber-500" />
                <span style={{ fontSize: '13px', color: '#888888' }}>Avg Response</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: '700', color: getResponseTimeColor(stats.avgResponse) }}>
                {stats.avgResponse}ms
              </p>
            </div>

            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span style={{ fontSize: '13px', color: '#888888' }}>Incidents</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: '700', color: stats.totalIncidents > 0 ? '#ef4444' : '#f5f5f5' }}>
                {stats.totalIncidents}
              </p>
            </div>

            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span style={{ fontSize: '13px', color: '#888888' }}>Total Checks</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#f5f5f5' }}>
                {stats.totalChecks.toLocaleString()}
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#f5f5f5', marginBottom: '16px' }}>Website Performance</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {websites.slice(0, 10).map(website => {
              const analytics = analyticsData[website._id]
              
              return (
                <div
                  key={website._id}
                  style={{
                    backgroundColor: '#111111',
                    border: '1px solid #1f1f1f',
                    borderRadius: '12px',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f5f5f5', marginBottom: '4px' }}>
                        {website.name || website.url}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#666666' }}>{website.url}</p>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: analytics?.uptime ? `${getUptimeColor(analytics.uptime)}20` : '#161616',
                      color: analytics?.uptime ? getUptimeColor(analytics.uptime) : '#666666'
                    }}>
                      {analytics?.uptime !== undefined ? `${analytics.uptime}%` : 'No data'}
                    </span>
                  </div>

                  {analytics?.uptime !== undefined ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', marginBottom: '4px' }}>Avg Response</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: getResponseTimeColor(analytics.responseTime?.average || 0) }}>
                          {analytics.responseTime?.average || 0}ms
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', marginBottom: '4px' }}>Min Response</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#f5f5f5' }}>
                          {analytics.responseTime?.min || 0}ms
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', marginBottom: '4px' }}>Max Response</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#f5f5f5' }}>
                          {analytics.responseTime?.max || 0}ms
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', marginBottom: '4px' }}>Incidents</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: incidentData[website._id]?.length > 0 ? '#ef4444' : '#f5f5f5' }}>
                          {incidentData[website._id]?.length || 0}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', marginBottom: '4px' }}>Avg Response</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#666666' }}>-</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', marginBottom: '4px' }}>Min Response</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#666666' }}>-</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', marginBottom: '4px' }}>Max Response</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#666666' }}>0</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', marginBottom: '4px' }}>Incidents</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#666666' }}>0</p>
                      </div>
                    </div>
                  )}

                  {analytics?.hourlyData && analytics.hourlyData.length > 0 && (
                    <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#161616', borderRadius: '8px' }}>
                      <p style={{ fontSize: '12px', color: '#888888', marginBottom: '12px' }}>Response Time (last {selectedPeriod}h)</p>
                      <div style={{ display: 'flex', gap: '2px', height: '60px', alignItems: 'flex-end' }}>
                        {analytics.hourlyData.slice(-24).map((point, i) => {
                          const height = Math.min(100, (point.avgResponseTime / 3000) * 100)
                          return (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                height: `${height}%`,
                                backgroundColor: getResponseTimeColor(point.avgResponseTime),
                                borderRadius: '2px 2px 0 0',
                                minWidth: '4px'
                              }}
                              title={`${new Date(point.timestamp).toLocaleTimeString()}: ${point.avgResponseTime}ms`}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}