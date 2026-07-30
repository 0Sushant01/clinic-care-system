import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * Clinic Care System — Card Components
 * Includes Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, GlassCard, and StatCard
 */

export const Card = ({ children, className = '', hoverable = false, ...props }) => (
  <div
    className={`bg-slate-900/80 border border-slate-800/80 rounded-2xl shadow-md overflow-hidden transition-all duration-200 ease-in-out ${
      hoverable ? 'hover:border-slate-700 hover:shadow-lg hover:-translate-y-0.5' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </div>
)

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-5 pb-3 border-b border-slate-800/60 ${className}`} {...props}>
    {children}
  </div>
)

export const CardTitle = ({ children, className = '', icon: Icon, ...props }) => (
  <h3 className={`text-base font-semibold text-white tracking-tight flex items-center gap-2 ${className}`} {...props}>
    {Icon && <Icon className="w-5 h-5 text-indigo-400" />}
    {children}
  </h3>
)

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs text-slate-400 mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
)

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-4 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
)

export const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`glass-card rounded-2xl p-6 ${className}`} {...props}>
    {children}
  </div>
)

export const StatCard = ({
  title,
  value,
  change,
  changeType = 'increase',
  icon: Icon,
  iconBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  description,
  className = '',
}) => {
  return (
    <Card hoverable className={`p-5 border-slate-800/80 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-white mt-1.5 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${iconBg} shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-semibold rounded-md px-1.5 py-0.5 ${
                changeType === 'increase'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {changeType === 'increase' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {change}
            </span>
          )}
          {description && <span className="text-slate-400 font-medium">{description}</span>}
        </div>
      )}
    </Card>
  )
}

export default Card
