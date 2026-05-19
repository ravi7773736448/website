import { useState } from 'react'
import { X, Globe, Mail, Clock } from 'lucide-react'

const AddWebsiteModal = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    url: '',
    interval: '60',
    emailAlerts: true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(formData)
    setFormData({ url: '', interval: '60', emailAlerts: true })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-base font-medium text-white">Add Website</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Website URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                required
                className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Monitoring Interval</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select
                value={formData.interval}
                onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-700 appearance-none cursor-pointer"
              >
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 1 minute</option>
                <option value="300">Every 5 minutes</option>
                <option value="600">Every 10 minutes</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.emailAlerts}
                  onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 rounded-full peer-checked:bg-emerald-500/20 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-zinc-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-emerald-500 transition-all" />
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-sm text-zinc-400">Email alerts</span>
              </div>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-10 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-md hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Website'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddWebsiteModal