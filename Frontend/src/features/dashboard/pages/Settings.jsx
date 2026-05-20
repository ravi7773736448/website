import { useState } from 'react'
import { Settings, Mail, Bell, Shield, Key, Plus, Trash2, Globe, Sparkles, RefreshCw, Eye, EyeOff, Save, ToggleLeft, ToggleRight, Check } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    globalInterval: 30,
    primaryRegion: 'US-East (N. Virginia)',
    retentionDays: 30,
    failoverRetries: 2,
    autoResolve: true,
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    alertEmail: 'developer@sentinel.io',
    webhookEnabled: false,
    webhookUrl: 'https://api.sentinel.io/v1/webhooks/pingguard',
    discordEnabled: false,
    discordUrl: '',
    slackEnabled: false,
    slackUrl: '',
  })

  // Simulated API Keys state
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production Grafana Feed', prefix: 'pg_live_8f3d', token: 'pg_live_8f3d••••••••••••••••••••3c9e', created: '2026-05-18' },
    { id: 2, name: 'Local CLI Tool', prefix: 'pg_live_2a7e', token: 'pg_live_2a7e••••••••••••••••••••9e8f', created: '2026-05-20' },
  ])
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState(null)

  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target
    setNotifications(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 800)
  }

  const generateApiKey = () => {
    if (!newKeyName.trim()) return
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    const fullToken = `pg_live_${randomHex.slice(0, 16)}`
    
    const newKey = {
      id: Date.now(),
      name: newKeyName,
      prefix: `pg_live_${randomHex.slice(0, 4)}`,
      token: `${fullToken.slice(0, 12)}••••••••••••••••••••${fullToken.slice(-4)}`,
      created: new Date().toISOString().split('T')[0]
    }
    
    setApiKeys(prev => [newKey, ...prev])
    setGeneratedKey(fullToken)
    setNewKeyName('')
  }

  const deleteApiKey = (id) => {
    if (confirm('Are you sure you want to revoke this API key? All applications using it will be immediately blocked.')) {
      setApiKeys(prev => prev.filter(key => key.id !== id))
    }
  }

  const tabs = [
    { id: 'general', label: 'Global Polling', icon: Globe },
    { id: 'notifications', label: 'Alert Channels', icon: Bell },
    { id: 'apikeys', label: 'Developer APIs', icon: Key },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight font-sans">Settings</h1>
          <p className="text-xs text-text-secondary mt-1">Configure global cron checks, notification parameters, and manage access credentials.</p>
        </div>
        
        {saveSuccess && (
          <div className="flex items-center gap-2 bg-up-soft border border-up/25 text-[#065f46] px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono animate-in fade-in slide-in-from-top-1">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* Tabs Layout */}
      <div className="grid gap-8 md:grid-cols-4">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setGeneratedKey(null)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-primary-soft text-brand-primary shadow-sm font-semibold border border-brand-primary/10'
                  : 'text-text-secondary bg-brand-surface border border-border hover:bg-surface-low hover:text-brand-primary'
              }`}
            >
              <tab.icon className="w-4.5 h-4.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="md:col-span-3">
          {activeTab === 'general' && (
            <div className="pg-card bg-brand-surface p-8 space-y-6 border border-border">
              <h3 className="text-base font-bold text-text-primary uppercase tracking-wider font-sans mb-4 border-b border-border pb-3">Global Monitoring Parameters</h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider font-sans">Global Check Interval</label>
                  <select
                    name="globalInterval"
                    value={generalSettings.globalInterval}
                    onChange={handleGeneralChange}
                    className="pg-input cursor-pointer"
                  >
                    <option value={10}>10 Seconds (Enterprise)</option>
                    <option value={30}>30 Seconds (Standard)</option>
                    <option value={60}>1 Minute (Professional)</option>
                    <option value={300}>5 Minutes (Developer)</option>
                  </select>
                  <p className="text-[10px] text-text-muted">Global default polling interval for active target endpoints.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider font-sans">Primary Region Region</label>
                  <select
                    name="primaryRegion"
                    value={generalSettings.primaryRegion}
                    onChange={handleGeneralChange}
                    className="pg-input cursor-pointer"
                  >
                    <option>US-East (N. Virginia)</option>
                    <option>US-West (Oregon)</option>
                    <option>EU-Central (Frankfurt)</option>
                    <option>AP-South (Mumbai)</option>
                  </select>
                  <p className="text-[10px] text-text-muted">Origin cluster to dispatch checks from by default.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider font-sans">Telemetry History Retention</label>
                  <select
                    name="retentionDays"
                    value={generalSettings.retentionDays}
                    onChange={handleGeneralChange}
                    className="pg-input cursor-pointer"
                  >
                    <option value={7}>7 Days (Lite)</option>
                    <option value={30}>30 Days (Standard)</option>
                    <option value={90}>90 Days (Professional)</option>
                    <option value={365}>365 Days (Enterprise)</option>
                  </select>
                  <p className="text-[10px] text-text-muted">Purge latency analytics logs older than selected timeframe.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider font-sans">Downtime Verification Retries</label>
                  <input
                    type="number"
                    name="failoverRetries"
                    min={1}
                    max={5}
                    value={generalSettings.failoverRetries}
                    onChange={handleGeneralChange}
                    className="pg-input font-mono"
                  />
                  <p className="text-[10px] text-text-muted">Wait for consecutive errors before dispatching incident alerts.</p>
                </div>
              </div>

              {/* Toggles */}
              <div className="border-t border-border pt-6 space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-text-primary font-sans">Auto-Resolve Incidents</p>
                    <p className="text-xs text-text-muted">Automatically close active downtime logs when targets start returning HTTP 2xx statuses.</p>
                  </div>
                  <input
                    type="checkbox"
                    name="autoResolve"
                    checked={generalSettings.autoResolve}
                    onChange={handleGeneralChange}
                    className="sr-only"
                  />
                  <div className="relative">
                    {generalSettings.autoResolve ? (
                      <ToggleRight className="w-10 h-10 text-brand-primary" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-text-faint" />
                    )}
                  </div>
                </label>
              </div>

              <div className="border-t border-border pt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="pg-card bg-brand-surface p-8 space-y-6 border border-border">
              <h3 className="text-base font-bold text-text-primary uppercase tracking-wider font-sans mb-4 border-b border-border pb-3">Incident Alert Delivery Channels</h3>
              
              <div className="space-y-6">
                {/* Email Alert Section */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4.5 h-4.5 text-text-secondary" />
                      <h4 className="text-sm font-bold text-text-primary font-sans">Email Alerts</h4>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed max-w-xl">
                      Dispatch immediate SMTP alert notifications to your developer account when endpoints return 5xx errors or DNS timeouts.
                    </p>
                    
                    {notifications.emailEnabled && (
                      <div className="pt-2">
                        <input
                          type="email"
                          name="alertEmail"
                          value={notifications.alertEmail}
                          onChange={handleNotificationChange}
                          className="pg-input max-w-md font-mono"
                          placeholder="recipient@domain.com"
                        />
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, emailEnabled: !prev.emailEnabled }))}
                    className="shrink-0"
                  >
                    {notifications.emailEnabled ? (
                      <ToggleRight className="w-10 h-10 text-brand-primary" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-text-faint" />
                    )}
                  </button>
                </div>

                {/* Webhook Alert Section */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4.5 h-4.5 text-text-secondary" />
                      <h4 className="text-sm font-bold text-text-primary font-sans">JSON Webhook Dispatcher</h4>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed max-w-xl">
                      Post POST requests carrying JSON incident payloads to custom receivers for automated Kubernetes pod recycling or failovers.
                    </p>
                    
                    {notifications.webhookEnabled && (
                      <div className="pt-2">
                        <input
                          type="url"
                          name="webhookUrl"
                          value={notifications.webhookUrl}
                          onChange={handleNotificationChange}
                          className="pg-input font-mono max-w-xl"
                          placeholder="https://api.domain.com/webhook"
                        />
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, webhookEnabled: !prev.webhookEnabled }))}
                    className="shrink-0"
                  >
                    {notifications.webhookEnabled ? (
                      <ToggleRight className="w-10 h-10 text-brand-primary" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-text-faint" />
                    )}
                  </button>
                </div>

                {/* Discord Alerts */}
                <div className="flex items-start justify-between gap-4 pb-6">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-text-secondary" />
                      <h4 className="text-sm font-bold text-text-primary font-sans">Discord Webhook Channel</h4>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed max-w-xl">
                      Deliver beautifully formatted discord rich embeds to team monitors containing error timestamps and HTTP codes.
                    </p>
                    
                    {notifications.discordEnabled && (
                      <div className="pt-2">
                        <input
                          type="url"
                          name="discordUrl"
                          value={notifications.discordUrl}
                          onChange={handleNotificationChange}
                          className="pg-input font-mono max-w-xl"
                          placeholder="https://discord.com/api/webhooks/..."
                        />
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, discordEnabled: !prev.discordEnabled }))}
                    className="shrink-0"
                  >
                    {notifications.discordEnabled ? (
                      <ToggleRight className="w-10 h-10 text-brand-primary" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-text-faint" />
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Channels</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'apikeys' && (
            <div className="pg-card bg-brand-surface p-8 space-y-6 border border-border">
              <h3 className="text-base font-bold text-text-primary uppercase tracking-wider font-sans mb-4 border-b border-border pb-3">Developer Access Keys</h3>
              
              <div className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  Query operational stats and register check monitors programmatically using bearer headers. Keep your API keys confidential.
                </p>

                {/* Key Generation Section */}
                <div className="bg-surface-low p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="E.g., Production CLI Client"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="pg-input flex-1"
                  />
                  <button
                    onClick={generateApiKey}
                    className="btn-primary shrink-0"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    <span>Create Key</span>
                  </button>
                </div>

                {generatedKey && (
                  <div className="p-4 bg-brand-primary-soft/20 border border-brand-primary/15 rounded-xl space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1 text-xs text-brand-primary font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>New Key Generated</span>
                    </div>
                    <p className="text-xs text-text-secondary font-medium">Copy this key now. It will not be shown again for security reasons:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 block p-3 bg-brand-surface border border-brand-primary/20 rounded-lg text-xs text-brand-primary font-bold font-mono select-all truncate">
                        {generatedKey}
                      </code>
                    </div>
                  </div>
                )}

                {/* Keys List */}
                <div className="border-t border-border pt-6">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider font-sans mb-3">Active API Keys</h4>
                  
                  {apiKeys.length === 0 ? (
                    <p className="text-xs text-text-muted italic">No active developer keys. Generate one above to access API.</p>
                  ) : (
                    <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-brand-surface">
                      {apiKeys.map(key => (
                        <div key={key.id} className="flex items-center justify-between p-4 hover:bg-surface-low/30 transition-colors">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-text-primary font-sans">{key.name}</p>
                            <div className="flex items-center gap-4 text-[10px] text-text-muted font-mono">
                              <span>Token: {key.token}</span>
                              <span>•</span>
                              <span>Created: {key.created}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteApiKey(key.id)}
                            className="p-2 text-text-muted hover:text-down hover:bg-down-soft rounded-lg transition-colors"
                            title="Revoke Key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
