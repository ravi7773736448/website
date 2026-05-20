import { useState, useEffect } from 'react'
import { fetchWebsites, deleteWebsite, triggerWebsiteCheck } from '../services/website.api.js'
import { Plus, RefreshCw, Trash2, ExternalLink, Search, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function Websites() {
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    loadWebsites()
  }, [])

  const loadWebsites = async () => {
    try {
      setLoading(true)
      const data = await fetchWebsites()
      setWebsites(data.websites || [])
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load websites')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this website?')) return
    
    try {
      setActionLoading(id)
      await deleteWebsite(id)
      setWebsites(prev => prev.filter(w => w._id !== id))
    } catch (err) {
      alert(err.message || 'Failed to delete website')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCheck = async (id) => {
    try {
      setActionLoading(id)
      await triggerWebsiteCheck(id)
      await loadWebsites()
    } catch (err) {
      alert(err.message || 'Failed to trigger check')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'UP':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case 'DOWN':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'SLOW':
        return <Clock className="w-5 h-5 text-amber-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-zinc-500" />
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      UP: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      DOWN: 'bg-red-500/10 text-red-400 border-red-500/20',
      SLOW: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      UNKNOWN: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
    }
    return styles[status] || styles.UNKNOWN
  }

  const filteredWebsites = websites.filter(w => 
    w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#f5f5f5', marginBottom: '4px' }}>Websites</h1>
          <p style={{ fontSize: '14px', color: '#888888' }}>Manage your monitored websites</p>
        </div>
        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#f5f5f5',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          Add Website
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

      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search websites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              paddingLeft: '36px',
              paddingRight: '12px',
              backgroundColor: '#161616',
              border: '1px solid #1f1f1f',
              borderRadius: '8px',
              color: '#f5f5f5',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {filteredWebsites.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#111111',
          borderRadius: '12px',
          border: '1px solid #1f1f1f'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#161616', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ExternalLink className="w-6 h-6 text-zinc-500" />
          </div>
          <p style={{ fontSize: '16px', color: '#f5f5f5', marginBottom: '8px' }}>No websites found</p>
          <p style={{ fontSize: '14px', color: '#666666' }}>Add your first website to start monitoring</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '16px' 
        }}>
          {filteredWebsites.map(website => (
            <div
              key={website._id}
              style={{
                backgroundColor: '#111111',
                border: '1px solid #1f1f1f',
                borderRadius: '12px',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f5f5f5', marginBottom: '4px' }}>
                    {website.name || website.url}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {website.url}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(website.status)}`}>
                  {website.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uptime</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#f5f5f5' }}>{website.uptimePercentage || 100}%</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#f5f5f5' }}>
                    {website.lastResponseTime ? `${website.lastResponseTime}ms` : '-'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Checks</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#f5f5f5' }}>{website.totalChecks || 0}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleCheck(website._id)}
                  disabled={actionLoading === website._id}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    height: '36px',
                    backgroundColor: '#161616',
                    border: '1px solid #1f1f1f',
                    borderRadius: '6px',
                    color: '#888888',
                    fontSize: '13px',
                    cursor: actionLoading === website._id ? 'not-allowed' : 'pointer'
                  }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${actionLoading === website._id ? 'animate-spin' : ''}`} />
                  Check
                </button>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#161616',
                    border: '1px solid #1f1f1f',
                    borderRadius: '6px',
                    color: '#888888',
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => handleDelete(website._id)}
                  disabled={actionLoading === website._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'transparent',
                    border: '1px solid #1f1f1f',
                    borderRadius: '6px',
                    color: '#ef4444',
                    cursor: actionLoading === website._id ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}