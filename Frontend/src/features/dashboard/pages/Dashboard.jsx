import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Globe, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import StatCard from '../../../components/ui/StatCard'
import WebsiteTable from '../components/WebsiteTable'
import ActivityFeed from '../components/ActivityFeed'
import { UptimeChart, ResponseTimeChart } from '../components/AnalyticsCharts'
import LiveHeartbeat from '../components/LiveHeartbeat'
import IncidentSummary from '../components/IncidentSummary'
import AddWebsiteModal from '../components/AddWebsiteModal'
import {
  loadDashboardSummary,
  loadWebsites,
  createWebsiteThunk,
  deleteWebsiteThunk,
  triggerWebsiteCheckThunk,
  clearError,
  clearSuccess
} from '../state/dashboard.slice'

const iconMap = {
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
}

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()

  const {
    stats,
    websites,
    isLoading,
    isLoadingSummary,
    error,
    successMessage
  } = useSelector(state => state.dashboard)

  // Load dashboard on mount
  useEffect(() => {
    dispatch(loadDashboardSummary())
    dispatch(loadWebsites())
  }, [dispatch])

  // Auto-refresh websites every 30 seconds to show live status updates
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(loadDashboardSummary())
      dispatch(loadWebsites())
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [dispatch])

  // Clear error/success messages after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError())
        if (successMessage) dispatch(clearSuccess())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, successMessage, dispatch])

  const handleAddWebsite = async (data) => {
    try {
      // Send the full API configuration payload to the backend
      const result = await dispatch(createWebsiteThunk(data)).unwrap()
      
      // Close modal immediately
      setIsModalOpen(false)
      
      // Trigger immediate check if website was created
      if (result.website?.id) {
        setTimeout(() => {
          dispatch(triggerWebsiteCheckThunk(result.website.id))
        }, 300)
      }
      
      // Reload dashboard after adding website
      setTimeout(() => {
        dispatch(loadDashboardSummary())
        dispatch(loadWebsites())
      }, 500)
      
      return result
    } catch (err) {
      console.error('Failed to add website:', err)
      throw err
    }
  }

  const handleDeleteWebsite = (id) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      dispatch(deleteWebsiteThunk(id)).then(() => {
        // Reload dashboard after deletion
        dispatch(loadDashboardSummary())
      })
    }
  }

  const handleCheckWebsite = (id) => {
    dispatch(triggerWebsiteCheckThunk(id))
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Monitor your websites in real-time</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-500 transition-colors flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          Add Website
        </button>
      </div>

      {/* Stats Cards */}
      {isLoadingSummary ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = iconMap[stat.icon]
            return (
              <StatCard
                key={index}
                {...stat}
                icon={Icon}
              />
            )
          })}
        </div>
      )}

      <LiveHeartbeat websites={websites} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-white">Monitored Websites</h3>
            <span className="text-xs text-zinc-500">{websites.length} website{websites.length !== 1 ? 's' : ''}</span>
          </div>
          <WebsiteTable
            websites={websites}
            onView={(id) => console.log('View website:', id)}
            onCheck={handleCheckWebsite}
            onDelete={handleDeleteWebsite}
          />
        </div>

        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UptimeChart />
        <ResponseTimeChart />
      </div>

      <IncidentSummary />

      <AddWebsiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddWebsite}
        isLoading={isLoading || false}
      />
    </div>
  )
}

export default Dashboard