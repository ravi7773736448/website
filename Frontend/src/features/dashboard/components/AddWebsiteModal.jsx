import { useState } from 'react'
import { X, Globe, Mail, Clock, Settings, Code, Activity } from 'lucide-react'

const AddWebsiteModal = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('simple')
  const [formData, setFormData] = useState({
    url: '',
    interval: '60',
    emailAlerts: true,
    method: 'GET',
    expectedStatus: '200',
    headers: '',
    body: '',
    timeout: '10000',
    responseValidationType: 'NONE',
    responseValidationValue: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    let parsedHeaders = undefined;
    if (activeTab === 'advanced' && formData.headers.trim()) {
      try {
        parsedHeaders = JSON.parse(formData.headers);
        if (typeof parsedHeaders !== 'object' || Array.isArray(parsedHeaders)) {
          throw new Error('Headers must be a JSON object');
        }
      } catch (err) {
        setError('Invalid JSON format for headers');
        return;
      }
    }
    
    try {
      const payload = {
        url: formData.url,
        checkInterval: parseInt(formData.interval, 10),
        alertEnabled: formData.emailAlerts,
      };

      if (activeTab === 'advanced') {
        payload.method = formData.method;
        payload.expectedStatus = parseInt(formData.expectedStatus, 10) || 200;
        if (parsedHeaders) payload.headers = parsedHeaders;
        if (formData.body.trim()) payload.body = formData.body;
        payload.timeout = parseInt(formData.timeout, 10) || 10000;
        payload.responseValidationType = formData.responseValidationType;
        if (formData.responseValidationValue.trim()) {
          payload.responseValidationValue = formData.responseValidationValue;
        }
      }

      await onSubmit?.(payload)
      setFormData({ 
        url: '', interval: '60', emailAlerts: true, 
        method: 'GET', expectedStatus: '200', headers: '', body: '',
        timeout: '10000', responseValidationType: 'NONE', responseValidationValue: ''
      })
      setActiveTab('simple')
      onClose()
    } catch (err) {
      setError(err?.message || 'Failed to add monitor')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
          <h2 className="text-base font-medium text-white">Add Monitor</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('simple')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'simple' 
                ? 'border-emerald-500 text-emerald-400 bg-zinc-800/50' 
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Simple Website
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'advanced' 
                ? 'border-emerald-500 text-emerald-400 bg-zinc-800/50' 
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Advanced API
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-md text-xs shrink-0">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              {activeTab === 'simple' ? 'Website URL' : 'API Endpoint URL'}
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="url"
                value={formData.url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value })
                  setError('')
                }}
                placeholder="https://example.com"
                disabled={isLoading}
                className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {activeTab === 'advanced' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">HTTP Method</label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-700 appearance-none cursor-pointer"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Expected Status</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    value={formData.expectedStatus}
                    onChange={(e) => setFormData({ ...formData, expectedStatus: e.target.value })}
                    placeholder="200"
                    className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Custom Headers (JSON format)</label>
                <div className="relative">
                  <Code className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <textarea
                    value={formData.headers}
                    onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                    placeholder={'{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'}
                    rows={3}
                    className="w-full py-2 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 font-mono resize-none"
                  />
                </div>
              </div>

              {(formData.method !== 'GET' && formData.method !== 'DELETE') && (
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Request Body (JSON format)</label>
                  <div className="relative">
                    <Code className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <textarea
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      placeholder={'{\n  "key": "value"\n}'}
                      rows={3}
                      className="w-full py-2 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 font-mono resize-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Timeout (ms)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    value={formData.timeout}
                    onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                    placeholder="10000"
                    className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Response Validation</label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <select
                    value={formData.responseValidationType}
                    onChange={(e) => setFormData({ ...formData, responseValidationType: e.target.value })}
                    className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-700 appearance-none cursor-pointer"
                  >
                    <option value="NONE">None</option>
                    <option value="CONTAINS">Contains Text</option>
                    <option value="JSON_MATCH">JSON Match</option>
                  </select>
                </div>
              </div>

              {formData.responseValidationType !== 'NONE' && (
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    {formData.responseValidationType === 'JSON_MATCH' ? 'JSON Structure Match' : 'Expected Text in Response'}
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={formData.responseValidationValue}
                      onChange={(e) => setFormData({ ...formData, responseValidationValue: e.target.value })}
                      placeholder={formData.responseValidationType === 'JSON_MATCH' ? '{"status": "ok"}' : 'success'}
                      className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

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

          <div className="flex items-center justify-between pb-2">
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

          <div className="flex gap-3 pt-2 shrink-0 border-t border-zinc-800 mt-2 pt-4">
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
                'Add Monitor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddWebsiteModal