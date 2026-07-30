import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-150 ${
        hoverable ? 'hover:border-slate-300 hover:shadow-md' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`p-5 pb-3 border-b border-slate-100 ${className}`}>{children}</div>
}

export const CardTitle = ({ children, icon: Icon, className = '' }) => {
  return (
    <h3 className={`text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 ${className}`}>
      {Icon && <Icon className="w-4 h-4 text-blue-600 shrink-0" />}
      <span>{children}</span>
    </h3>
  )
}

export const CardDescription = ({ children, className = '' }) => {
  return <p className={`text-xs text-slate-500 font-normal mt-0.5 ${className}`}>{children}</p>
}

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>
}

export const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconBg = 'bg-blue-50 text-blue-600 border-blue-100',
  description,
  className = '',
}) => {
  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h4>
        </div>

        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconBg} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <span
              className={`flex items-center gap-1 font-bold ${
                changeType === 'increase'
                  ? 'text-emerald-600'
                  : changeType === 'decrease'
                  ? 'text-red-600'
                  : 'text-slate-500'
              }`}
            >
              {changeType === 'increase' && <TrendingUp className="w-3.5 h-3.5" />}
              {changeType === 'decrease' && <TrendingDown className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {description && <span className="text-[11px] text-slate-500 font-medium">{description}</span>}
        </div>
      )}
    </Card>
  )
}

export default Card
