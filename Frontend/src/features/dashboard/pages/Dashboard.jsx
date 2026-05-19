import { useState, useEffect } from "react";
import { 
  Activity, Shield, Terminal, Cpu, Clock, Bell, Globe, 
  BarChart3, ArrowRight, CheckCircle2, ChevronRight, Menu, 
  X, Play, AlertCircle, ExternalLink, Zap, Users, Code, 
  Lock, Check, Sparkles, AlertTriangle, Plus, Search,
  Settings, LogOut, Sliders, Server, RefreshCw, Filter, HelpCircle,
  TrendingUp, ArrowUpRight, ArrowDownRight, Compass
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiIncident, setAiIncident] = useState(null);
  
  // Form State for new monitor
  const [newMonitor, setNewMonitor] = useState({
    name: "",
    url: "",
    type: "HTTP",
    frequency: "30s",
    region: "US-East (N. Virginia)"
  });

  // Initial Monitors List (Mock state, highly interactive)
  const [monitors, setMonitors] = useState([
    { id: 1, name: "Production Landing Page", url: "https://pulseguard.io", type: "HTTP", status: "up", latency: "14ms", uptime: "99.99%", checked: "12s ago", region: "US-East", history: [12, 14, 15, 13, 14, 16, 15, 14, 13, 14, 15, 14, 13, 14] },
    { id: 2, name: "User Authentication API", url: "https://api.pulseguard.io/v1/auth", type: "REST API", status: "up", latency: "28ms", uptime: "99.98%", checked: "8s ago", region: "EU-Central", history: [22, 24, 25, 29, 31, 28, 26, 27, 28, 30, 29, 28, 27, 28] },
    { id: 3, name: "Primary Postgres Cluster", url: "db-primary.infra.pg", type: "TCP PING", status: "up", latency: "4ms", uptime: "100%", checked: "24s ago", region: "US-East", history: [4, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5, 4, 4, 4] },
    { id: 4, name: "Analytics Ingestion Queue", url: "https://analytics.pulseguard.io", type: "HTTP", status: "slow", latency: "148ms", uptime: "99.85%", checked: "15s ago", region: "AP-Southeast", history: [45, 68, 92, 110, 145, 152, 138, 148, 142, 150, 148, 155, 148, 148] },
    { id: 5, name: "Legacy Billing Microservice", url: "https://billing.legacy.pg", type: "HTTP", status: "down", latency: "0ms", uptime: "98.42%", checked: "2s ago", region: "US-West", history: [42, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { id: 6, name: "Static Assets CDN Edge", url: "https://cdn.pulseguard.io/assets", type: "HTTP", status: "up", latency: "9ms", uptime: "99.99%", checked: "30s ago", region: "AP-East", history: [8, 9, 10, 9, 8, 9, 10, 9, 8, 9, 9, 10, 9, 9] },
  ]);

  // Activity Logs
  const [logs, setLogs] = useState([
    { id: 1, time: "18:56:12", monitor: "Legacy Billing Microservice", event: "Connection timed out (504 Gateway)", status: "down" },
    { id: 2, time: "18:55:40", monitor: "Analytics Ingestion Queue", event: "Latency spike detected: 148ms (Threshold 100ms)", status: "slow" },
    { id: 3, time: "18:54:10", monitor: "User Authentication API", event: "SSL Certificate renewed successfully", status: "info" },
    { id: 4, time: "18:52:00", monitor: "Production Landing Page", event: "Global ping checklist: 100% healthy", status: "up" },
  ]);

  // Simulate real-time monitoring updates
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update response times randomly for UP/SLOW monitors
      setMonitors(prev => 
        prev.map(m => {
          if (m.status === "down") return m;
          
          const variance = Math.floor(Math.random() * 8) - 4;
          let currentLat = parseInt(m.latency);
          let newLat = Math.max(2, currentLat + variance);
          
          let status = m.status;
          if (m.id === 4) {
            if (newLat < 100) status = "up";
            else status = "slow";
          } else {
            if (newLat > 100) status = "slow";
            else status = "up";
          }

          // Update chart history
          const newHistory = [...m.history.slice(1), newLat];
          
          return {
            ...m,
            latency: `${newLat}ms`,
            status,
            checked: "just now",
            history: newHistory
          };
        })
      );

      // Randomly update "checked" timers after a few ticks
      setTimeout(() => {
        setMonitors(prev => prev.map(m => {
          if (m.checked === "just now") {
            return { ...m, checked: `${Math.floor(Math.random() * 10) + 1}s ago` };
          }
          return m;
        }));
      }, 1500);

    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Filter monitors
  const filteredMonitors = monitors.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeFilter === "all") return true;
    return m.status === activeFilter;
  });

  // Count stats
  const totalMonitors = monitors.length;
  const upMonitors = monitors.filter(m => m.status === "up").length;
  const slowMonitors = monitors.filter(m => m.status === "slow").length;
  const downMonitors = monitors.filter(m => m.status === "down").length;

  // Handle adding new monitor
  const handleAddMonitor = (e) => {
    e.preventDefault();
    if (!newMonitor.name || !newMonitor.url) return;

    const added = {
      id: Date.now(),
      name: newMonitor.name,
      url: newMonitor.url,
      type: newMonitor.type,
      status: "up",
      latency: "15ms",
      uptime: "100%",
      checked: "just now",
      region: newMonitor.region.split(" ")[0],
      history: [15, 16, 14, 15, 17, 15, 14, 15, 16, 15, 14, 15, 16, 15]
    };

    setMonitors([added, ...monitors]);
    
    // Add to activity logs
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      monitor: added.name,
      event: `New monitor created (${added.type}) - starting checks`,
      status: "info"
    };
    setLogs([newLog, ...logs]);

    // Reset Form & Close Modal
    setNewMonitor({
      name: "",
      url: "",
      type: "HTTP",
      frequency: "30s",
      region: "US-East (N. Virginia)"
    });
    setShowAddModal(false);
  };

  // Trigger AI analysis modal
  const handleTriggerAiAnalysis = (monitor) => {
    setSelectedMonitor(monitor);
    let summaryText = "";
    let severity = "info";

    if (monitor.status === "down") {
      severity = "CRITICAL OUTAGE";
      summaryText = `"${monitor.name}" (${monitor.url}) has failed to respond to network ping checks originating from 4 global edges. The target webserver actively returned an error: 'ERR_CONNECTION_REFUSED'. This points to either an inactive process daemon (nginx/systemd) or a faulty firewall rule block. Recurrence frequency is high.`;
    } else if (monitor.status === "slow") {
      severity = "PERFORMANCE WARNING";
      summaryText = `"${monitor.name}" is exhibiting high response times (average ${monitor.latency}) exceeding your configured alert threshold of 100ms. Telemetry analysis indicates primary latency occurs during the SSL handshake (TTFB is high), suggesting route congestion at the regional DNS proxy gateway.`;
    } else {
      severity = "SYSTEM HEALTHY";
      summaryText = `"${monitor.name}" is performing exceptionally well with latency averaging ${monitor.latency}. SSL validation checks are active and correct. Fallback routing pathways are stable. No diagnostic updates are required at this time.`;
    }

    setAiIncident({
      id: `#PG-AI-${monitor.id}`,
      severity,
      summary: summaryText,
      recommendation: monitor.status === "down" 
        ? "Verify that your service port is listening. Run 'sudo systemctl status nginx' on your host system to verify web service health."
        : monitor.status === "slow"
        ? "Configure CDN caching templates or increase your proxy timeout limits. Upstream caching is highly recommended to offload SSL handshakes."
        : "No manual steps needed. Uptime is stable."
    });
    setShowAiModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] font-sans flex selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* Background radial glows */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0"></div>

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 border-r border-[#1E293B] bg-[#070B14] hidden lg:flex flex-col justify-between shrink-0 relative z-10">
        <div>
          {/* Brand Header */}
          <div className="h-16 border-b border-[#1E293B] px-6 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
              <Activity size={16} className="text-white animate-pulse" />
            </div>
            <span className="text-md font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              PULSEGUARD
            </span>
          </div>

          {/* User Org Select */}
          <div className="p-4">
            <div className="flex items-center justify-between p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-left">
              <div>
                <span className="block text-[10px] text-[#64748B] uppercase font-mono">Current Space</span>
                <span className="text-xs font-bold text-white">Stripe Integration Lab</span>
              </div>
              <Compass size={14} className="text-[#94A3B8]" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-2 flex flex-col gap-1.5">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm font-semibold text-left">
              <Server size={16} />
              <span>Monitors</span>
              <span className="ml-auto bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                {totalMonitors}
              </span>
            </button>
            
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1E293B]/50 text-[#94A3B8] hover:text-white transition-colors text-sm font-semibold text-left">
              <Activity size={16} />
              <span>Incidents Matrix</span>
              {downMonitors > 0 && (
                <span className="ml-auto bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                  {downMonitors}
                </span>
              )}
            </button>

            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1E293B]/50 text-[#94A3B8] hover:text-white transition-colors text-sm font-semibold text-left">
              <Bell size={16} />
              <span>Alert Notifications</span>
            </button>

            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1E293B]/50 text-[#94A3B8] hover:text-white transition-colors text-sm font-semibold text-left">
              <Sliders size={16} />
              <span>SLA Settings</span>
            </button>

            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1E293B]/50 text-[#94A3B8] hover:text-white transition-colors text-sm font-semibold text-left">
              <Settings size={16} />
              <span>Global Space Config</span>
            </button>
          </nav>
        </div>

        {/* User Footbar */}
        <div className="p-4 border-t border-[#1E293B] bg-[#070B14]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                ST
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-white leading-none">Steve T.</span>
                <span className="text-[10px] text-[#64748B] font-mono leading-none">steve@stripe.com</span>
              </div>
            </div>
          </div>
          <Link 
            to="/" 
            className="w-full h-9 rounded-lg border border-[#1E293B] bg-[#0F172A] hover:bg-[#1E293B] text-xs font-semibold text-[#EF4444] flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut size={13} />
            <span>Logout from System</span>
          </Link>
        </div>
      </aside>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="flex-1 min-w-0 flex flex-col relative z-10">
        
        {/* Top Header Navbar */}
        <header className="h-16 border-b border-[#1E293B] bg-[#070B14]/40 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
              <input 
                type="text" 
                placeholder="Search active monitors or api routes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 text-xs font-medium text-white placeholder-[#64748B] outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator badge */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>Global telemetry active</span>
            </div>

            {/* Add Monitor Button */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-xs font-bold text-white rounded-lg flex items-center gap-1.5 shadow-lg shadow-blue-600/15 transition-all"
            >
              <Plus size={14} />
              <span>Create Monitor</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Canvas */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 hover:border-blue-500/20 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-1">Active Monitors</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono">{totalMonitors}</span>
                  <span className="text-[10px] font-mono text-[#64748B]">monitors active</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#1E293B] pt-3 mt-4 text-[10px] text-[#94A3B8]">
                <span>Global node edges</span>
                <span className="font-semibold text-white">4 nodes online</span>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 hover:border-blue-500/20 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-1">Average Latency</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono">18.2ms</span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
                    <ArrowDownRight size={10} /> -4.6%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#1E293B] pt-3 mt-4 text-[10px] text-[#94A3B8]">
                <span>SLA compliance range</span>
                <span className="font-semibold text-emerald-400">99.98% safe</span>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 hover:border-blue-500/20 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-1">Outages & Degradations</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-red-400">{downMonitors}</span>
                  <span className="text-[10px] font-mono text-amber-500 flex items-center gap-0.5">
                    {slowMonitors} degraded
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#1E293B] pt-3 mt-4 text-[10px] text-[#94A3B8]">
                <span>Alert triggers queued</span>
                <span className="font-semibold text-red-400">PagerDuty Slack active</span>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 hover:border-blue-500/20 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-1">Uptime SLA Ratio</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-emerald-400">99.96%</span>
                  <span className="text-[10px] font-mono text-[#64748B]">Target 99.95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#1E293B] pt-3 mt-4 text-[10px] text-[#94A3B8]">
                <span>Billing cycle cycle</span>
                <span className="font-semibold text-white">Renews in 12 days</span>
              </div>
            </div>

          </div>

          {/* ACTIVE ALERTS BANNER (If down monitors exist) */}
          {downMonitors > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-red-400">Outage Alert Active: Stripe Legacy Billing down</h4>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Global agents reported connections refused. Triggered alert routing via Webhooks and Slack alert streams.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleTriggerAiAnalysis(monitors.find(m => m.status === "down"))}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300 rounded-lg flex items-center justify-center gap-1.5 border border-red-500/30 self-start sm:self-center transition-all"
              >
                <Sparkles size={13} fill="currentColor" />
                <span>AI Debug Incident</span>
              </button>
            </div>
          )}

          {/* MONITORS DATA PANEL */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-lg">
            
            {/* Table Filters & Control Header */}
            <div className="p-5 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div>
                <h3 className="text-md font-bold text-white">Active Operational Monitors</h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">Filter, configure, and inspect individual API check status triggers.</p>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap bg-[#0B1120] border border-[#1E293B] rounded-lg p-0.5 text-xs font-semibold text-[#94A3B8] self-start sm:self-center">
                <button 
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1.5 rounded-md transition-all ${activeFilter === "all" ? "bg-[#1E293B] text-white" : "hover:text-white"}`}
                >
                  All ({totalMonitors})
                </button>
                <button 
                  onClick={() => setActiveFilter("up")}
                  className={`px-3 py-1.5 rounded-md transition-all ${activeFilter === "up" ? "bg-[#1E293B] text-white" : "hover:text-white"}`}
                >
                  Healthy ({upMonitors})
                </button>
                <button 
                  onClick={() => setActiveFilter("slow")}
                  className={`px-3 py-1.5 rounded-md transition-all ${activeFilter === "slow" ? "bg-[#1E293B] text-white" : "hover:text-white"}`}
                >
                  Degraded ({slowMonitors})
                </button>
                <button 
                  onClick={() => setActiveFilter("down")}
                  className={`px-3 py-1.5 rounded-md transition-all ${activeFilter === "down" ? "bg-[#1E293B] text-white" : "hover:text-white"}`}
                >
                  Down ({downMonitors})
                </button>
              </div>
            </div>

            {/* Monitors Table Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1E293B] bg-[#070B14]/40 text-xs uppercase font-mono font-bold text-[#64748B]">
                    <th className="px-6 py-4">Monitor Details</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Current Latency</th>
                    <th className="px-6 py-4">24h SLA</th>
                    <th className="px-6 py-4">Historical latency</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] text-sm">
                  {filteredMonitors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-xs text-[#64748B] font-mono">
                        No active monitors found matching your configuration filters.
                      </td>
                    </tr>
                  ) : (
                    filteredMonitors.map((m) => (
                      <tr key={m.id} className="hover:bg-[#1E293B]/20 transition-colors">
                        
                        {/* Monitor Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              m.status === "up" ? "bg-[#22C55E] shadow-sm shadow-[#22C55E]/50" :
                              m.status === "slow" ? "bg-[#F59E0B] shadow-sm shadow-[#F59E0B]/50" :
                              "bg-[#EF4444] shadow-sm shadow-[#EF4444]/50 animate-pulse"
                            }`}></span>
                            
                            <div className="text-left">
                              <span className="block font-bold text-white leading-tight">{m.name}</span>
                              <span className="text-[11px] font-mono text-[#64748B] mt-0.5 block">{m.url}</span>
                            </div>
                          </div>
                        </td>

                        {/* Type & Region */}
                        <td className="px-6 py-4 font-mono text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[#94A3B8] font-semibold">{m.type}</span>
                            <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                              <Globe size={10} />
                              {m.region}
                            </span>
                          </div>
                        </td>

                        {/* Latency & Checked */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5 text-left font-mono">
                            <span className={`font-bold text-xs ${
                              m.status === "up" ? "text-emerald-400" :
                              m.status === "slow" ? "text-amber-500" :
                              "text-red-400"
                            }`}>
                              {m.latency}
                            </span>
                            <span className="text-[10px] text-[#64748B]">checked {m.checked}</span>
                          </div>
                        </td>

                        {/* SLA compliance uptime */}
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-xs text-white bg-[#0B1120] border border-[#1E293B] px-2 py-0.5 rounded-md">
                            {m.uptime}
                          </span>
                        </td>

                        {/* Latency mini sparkline */}
                        <td className="px-6 py-4">
                          <div className="h-8 w-32 flex items-end gap-0.5">
                            {m.history.map((val, idx) => (
                              <div 
                                key={idx}
                                className={`w-full rounded-t-sm ${
                                  m.status === "down" ? "bg-red-500/10" :
                                  val > 100 ? "bg-amber-500" : "bg-blue-500/40"
                                }`}
                                style={{ height: `${val === 0 ? 5 : Math.min(100, (val / 150) * 100)}%` }}
                              ></div>
                            ))}
                          </div>
                        </td>

                        {/* Actions buttons */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleTriggerAiAnalysis(m)}
                              className="px-2.5 py-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-semibold text-blue-400 flex items-center gap-1 transition-all"
                            >
                              <Sparkles size={11} fill="currentColor" />
                              <span>AI Diagnostics</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* LOWER TWO-COLUMN SYSTEM GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left: Real-time Telemetry Event Logs */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 lg:col-span-3 flex flex-col justify-between">
              <div className="text-left mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Terminal size={14} className="text-blue-500 animate-pulse" />
                  Realtime Telemetry Event Stream
                </h4>
                <p className="text-xs text-[#94A3B8]">Continuous logging ticks mapping system outages and security pings.</p>
              </div>

              <div className="flex flex-col gap-3 h-64 overflow-y-auto mb-4 pr-2 text-left">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-3 bg-[#0B1120] border border-[#1E293B] rounded-xl text-xs font-mono">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#64748B] shrink-0 mt-0.5">{log.time}</span>
                      <div>
                        <span className="font-semibold text-white block">{log.monitor}</span>
                        <span className="text-[#94A3B8] text-[11px] block mt-0.5">{log.event}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold shrink-0 ${
                      log.status === "up" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      log.status === "slow" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      log.status === "down" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1E293B] pt-3 text-right">
                <button 
                  onClick={() => {
                    const newLog = {
                      id: Date.now(),
                      time: new Date().toLocaleTimeString(),
                      monitor: "Static Assets CDN Edge",
                      event: `Manual ping check forced successfully (status code 200)`,
                      status: "up"
                    };
                    setLogs([newLog, ...logs]);
                  }}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 ml-auto"
                >
                  <RefreshCw size={12} />
                  <span>Force Global Ping Sweep</span>
                </button>
              </div>
            </div>

            {/* Right: Quick Alert Configuration Matrix */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
              <div className="text-left mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Shield size={14} className="text-indigo-400" />
                  Active Alert Routings
                </h4>
                <p className="text-xs text-[#94A3B8]">Configure triggers notifying downstream support engineers.</p>
              </div>

              <div className="flex flex-col gap-3.5 text-left mb-6">
                
                <div className="flex items-center justify-between p-3 bg-[#0B1120] border border-[#1E293B] rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center font-bold text-[10px] font-mono">
                      SLK
                    </span>
                    <div>
                      <span className="block text-xs font-bold text-white">Slack Notifications</span>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">#ops-alerts channel</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0B1120] border border-[#1E293B] rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] font-mono">
                      PDY
                    </span>
                    <div>
                      <span className="block text-xs font-bold text-white">PagerDuty Stream</span>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">Critical SLA routing</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0B1120] border border-[#1E293B] rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-400 flex items-center justify-center font-bold text-[10px] font-mono">
                      MSK
                    </span>
                    <div>
                      <span className="block text-xs font-bold text-white">Custom Webhooks</span>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">Ingress endpoint payload</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#64748B] bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 rounded">
                    MUTED
                  </span>
                </div>

              </div>

              <div className="border-t border-[#1E293B] pt-3">
                <button className="w-full h-9 rounded-lg border border-[#1E293B] bg-[#0B1120] hover:bg-[#1E293B] text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors">
                  <span>Manage Integration Matrix</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* ================= ADD MONITOR MODAL (Production Ready Form) ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1120]/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#0F172A] border border-[#1E293B] w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Server size={18} className="text-blue-500" />
                Create New Endpoint Monitor
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-[#1E293B] rounded text-[#64748B] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddMonitor} className="p-6 space-y-4 text-left">
              
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Friendly Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Stripe Checkout Page"
                  value={newMonitor.name}
                  onChange={(e) => setNewMonitor({...newMonitor, name: e.target.value})}
                  className="w-full h-10 px-3 bg-[#0B1120] border border-[#1E293B] focus:border-blue-500 rounded-xl text-sm text-white placeholder-[#64748B] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Endpoint URL / HOST</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. https://api.stripe.com/v1/checkout"
                  value={newMonitor.url}
                  onChange={(e) => setNewMonitor({...newMonitor, url: e.target.value})}
                  className="w-full h-10 px-3 bg-[#0B1120] border border-[#1E293B] focus:border-blue-500 rounded-xl text-sm text-white placeholder-[#64748B] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Check Type</label>
                  <select 
                    value={newMonitor.type}
                    onChange={(e) => setNewMonitor({...newMonitor, type: e.target.value})}
                    className="w-full h-10 px-3 bg-[#0B1120] border border-[#1E293B] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="HTTP">HTTP/HTTPS</option>
                    <option value="REST API">REST API Endpoint</option>
                    <option value="TCP PING">TCP PING Host</option>
                    <option value="SSL CERT">SSL Cert Verification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Frequency</label>
                  <select 
                    value={newMonitor.frequency}
                    onChange={(e) => setNewMonitor({...newMonitor, frequency: e.target.value})}
                    className="w-full h-10 px-3 bg-[#0B1120] border border-[#1E293B] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="30s">Every 30s (Realtime)</option>
                    <option value="1m">Every 1 minute</option>
                    <option value="5m">Every 5 minutes</option>
                    <option value="15m">Every 15 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Primary Test Region</label>
                <select 
                  value={newMonitor.region}
                  onChange={(e) => setNewMonitor({...newMonitor, region: e.target.value})}
                  className="w-full h-10 px-3 bg-[#0B1120] border border-[#1E293B] focus:border-blue-500 rounded-xl text-xs text-white outline-none"
                >
                  <option value="US-East (N. Virginia)">US-East (N. Virginia)</option>
                  <option value="EU-Central (Frankfurt)">EU-Central (Frankfurt)</option>
                  <option value="AP-Southeast (Singapore)">AP-Southeast (Singapore)</option>
                  <option value="US-West (Oregon)">US-West (Oregon)</option>
                </select>
              </div>

              <div className="border-t border-[#1E293B] pt-4 mt-6 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-10 px-4 rounded-xl border border-[#1E293B] bg-[#0F172A] hover:bg-[#1E293B] text-xs font-bold text-white transition-colors"
                >
                  Cancel Creation
                </button>
                <button 
                  type="submit"
                  className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/15 transition-all"
                >
                  Deploy Active Monitor
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= AI DIAGNOSTICS INCIDENT MODAL ================= */}
      {showAiModal && aiIncident && selectedMonitor && (
        <div className="fixed inset-0 z-50 bg-[#0B1120]/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#0F172A] border border-[#1E293B] w-full max-w-xl rounded-2xl shadow-2xl relative z-10 overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" fill="currentColor" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">PulseGuard Generative AI Diagnostics</h3>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                className="p-1 hover:bg-[#1E293B] rounded text-[#64748B] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Incident Meta details */}
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                <div>
                  <h4 className="text-xs font-bold text-[#64748B]">ANALYSIS SOURCE</h4>
                  <span className="text-sm font-bold text-white block mt-0.5">{selectedMonitor.name}</span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${
                  selectedMonitor.status === "down" ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" :
                  selectedMonitor.status === "slow" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}>
                  {aiIncident.severity}
                </span>
              </div>

              {/* AI incident summary */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border border-blue-500/20 relative">
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-[9px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                  <Sparkles size={8} fill="currentColor" />
                  <span>PG-AI Engine</span>
                </div>
                
                <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">Automated Incident Summary</h5>
                <p className="text-xs text-[#F8FAFC] leading-relaxed font-sans">
                  {aiIncident.summary}
                </p>
              </div>

              {/* Actionable recommendation */}
              <div className="bg-[#0B1120] border border-[#1E293B] rounded-xl p-4 flex gap-3">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h6 className="text-[10px] font-bold text-white uppercase mb-1">PG-AI Recommended Mitigation</h6>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {aiIncident.recommendation}
                  </p>
                </div>
              </div>

              {/* Modal actions footer */}
              <div className="border-t border-[#1E293B] pt-4 mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => {
                    // Copy to clipboard simulation
                    navigator.clipboard?.writeText(aiIncident.summary);
                    alert("AI summary copied to clipboard for Ops reporting!");
                  }}
                  className="h-9 px-4 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E293B] text-xs font-semibold text-white transition-colors"
                >
                  Copy Summary Text
                </button>
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="h-9 px-5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg transition-all"
                >
                  Acknowledge Incident
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
