import { useState } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const timeFilters = ['1H', '24H', '7D', '30D']

const generateUptimeData = (days) => {
  const data = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      uptime: 98 + Math.random() * 2,
    })
  }
  return data
}

const generateResponseData = (hours) => {
  const data = []
  for (let i = hours - 1; i >= 0; i--) {
    const date = new Date()
    date.setHours(date.getHours() - i)
    data.push({
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      response: 50 + Math.random() * 150,
    })
  }
  return data
}

const UptimeChart = () => {
  const [filter, setFilter] = useState('7D')
  const days = filter === '1H' ? 24 : filter === '24H' ? 1 : filter === '7D' ? 7 : 30
  const data = generateUptimeData(days)

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Uptime Trend</h3>
        <div className="flex gap-1">
          {timeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                filter === f
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[95, 100]} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '6px' }}
              labelStyle={{ color: '#a1a1aa', fontSize: 12 }}
              itemStyle={{ color: '#10b981', fontSize: 12 }}
              formatter={(value) => [`${value.toFixed(2)}%`, 'Uptime']}
            />
            <Area type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} fill="url(#uptimeGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const ResponseTimeChart = () => {
  const [filter, setFilter] = useState('24H')
  const hours = filter === '1H' ? 1 : filter === '24H' ? 24 : filter === '7D' ? 168 : 720
  const data = generateResponseData(filter === '7D' ? 24 : filter === '30D' ? 72 : hours)

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Response Time</h3>
        <div className="flex gap-1">
          {timeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                filter === f
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}ms`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '6px' }}
              labelStyle={{ color: '#a1a1aa', fontSize: 12 }}
              itemStyle={{ color: '#3b82f6', fontSize: 12 }}
              formatter={(value) => [`${value.toFixed(0)}ms`, 'Response Time']}
            />
            <Line type="monotone" dataKey="response" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export { UptimeChart, ResponseTimeChart }