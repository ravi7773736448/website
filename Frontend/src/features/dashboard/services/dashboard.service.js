/**
 * Dashboard Service Layer
 * Transforms backend API responses into domain models for presentation
 */

/**
 * Map backend summary into card stats
 */
export const mapSummaryToStats = (summary) => {
  if (!summary) return [];

  return [
    {
      title: 'Total Websites',
      value: summary.total?.toString() || '0',
      subtitle: `${summary.total || 0} sites monitored`,
      icon: 'Globe',
      variant: 'default'
    },
    {
      title: 'Websites Up',
      value: summary.up?.toString() || '0',
      subtitle: `${summary.up || 0} healthy`,
      icon: 'CheckCircle',
      variant: 'success'
    },
    {
      title: 'Websites Down',
      value: summary.down?.toString() || '0',
      subtitle: 'Requires attention',
      icon: 'AlertCircle',
      variant: 'danger'
    },
    {
      title: 'Slow Sites',
      value: summary.slow?.toString() || '0',
      subtitle: 'Performance issues',
      icon: 'Clock',
      variant: 'warning'
    }
  ];
};

/**
 * Map backend website list into table-ready format
 */
export const mapWebsitesToTableRows = (websites) => {
  if (!websites || !Array.isArray(websites)) return [];

  return websites.map(site => ({
    id: site._id || site.id,
    name: site.name || new URL(site.url).hostname,
    url: site.url,
    status: site.status?.toLowerCase() || 'unknown',
    responseTime: site.lastResponseTime || 0,
    uptime: site.uptimePercentage || 100,
    lastChecked: site.lastCheckedAt || new Date()
  }));
};

/**
 * Get status badge configuration
 */
export const getStatusConfig = (status) => {
  const configs = {
    up: {
      label: 'UP',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      pulse: true
    },
    down: {
      label: 'DOWN',
      color: 'bg-red-500',
      textColor: 'text-red-400',
      pulse: true
    },
    slow: {
      label: 'SLOW',
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      pulse: true
    },
    unknown: {
      label: 'UNKNOWN',
      color: 'bg-zinc-500',
      textColor: 'text-zinc-400',
      pulse: false
    }
  };

  return configs[status?.toLowerCase()] || configs.unknown;
};

/**
 * Get response time color
 */
export const getResponseTimeColor = (ms) => {
  if (ms < 200) return 'text-emerald-400';
  if (ms < 500) return 'text-zinc-300';
  if (ms < 1000) return 'text-amber-400';
  return 'text-red-400';
};

/**
 * Get uptime badge color
 */
export const getUptimeBadgeColor = (uptime) => {
  if (uptime >= 99.9) return 'bg-emerald-500';
  if (uptime >= 95) return 'bg-amber-500';
  return 'bg-red-500';
};

/**
 * Format time difference for "last checked"
 */
export const formatLastCheckedTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/**
 * Transform full dashboard response into dashboard state
 */
export const transformDashboardResponse = (apiResponse) => {
  return {
    summary: apiResponse?.summary || {
      total: 0,
      up: 0,
      down: 0,
      slow: 0,
      unknown: 0
    },
    recentWebsites: mapWebsitesToTableRows(apiResponse?.recentWebsites || [])
  };
};

/**
 * Transform websites list response
 */
export const transformWebsitesResponse = (apiResponse) => {
  return {
    websites: mapWebsitesToTableRows(apiResponse?.websites || []),
    count: apiResponse?.count || 0
  };
};
