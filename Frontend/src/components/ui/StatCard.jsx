const StatCard = ({ title, value, subtitle, icon: Icon, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-zinc-900/50',
    success: 'bg-emerald-500/5 border-emerald-500/20',
    danger: 'bg-red-500/5 border-red-500/20',
    warning: 'bg-amber-500/5 border-amber-500/20',
  }

  const iconColorStyles = {
    default: 'text-zinc-400',
    success: 'text-emerald-500',
    danger: 'text-red-500',
    warning: 'text-amber-500',
  }

  return (
    <div className={`p-4 rounded-lg border border-zinc-800 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg bg-zinc-800/50 ${iconColorStyles[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard