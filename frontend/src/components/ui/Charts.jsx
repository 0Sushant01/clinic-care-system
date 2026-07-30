import React from 'react'

/**
 * Clinic Care System — Data Visualization Charts (Pure SVG & CSS)
 * Includes BarChart, AreaChart, DonutChart, and Sparkline
 */

export const Sparkline = ({ data = [10, 25, 18, 32, 28, 45, 40], color = '#6366f1', height = 40, width = 120 }) => {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 8) - 4
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

export const BarChart = ({
  data = [
    { label: 'Mon', value: 24 },
    { label: 'Tue', value: 38 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 30 },
    { label: 'Fri', value: 52 },
    { label: 'Sat', value: 20 },
  ],
  height = 200,
  barColor = 'bg-indigo-500',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value)) || 1

  return (
    <div className="w-full flex flex-col justify-between" style={{ height }}>
      <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 pb-2 border-b border-slate-800">
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.value / maxValue) * 100)
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow pointer-events-none z-10 whitespace-nowrap">
                {item.value} appointments
              </div>
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ease-out group-hover:brightness-125 ${barColor} opacity-90 hover:opacity-100`}
              />
            </div>
          )
        })}
      </div>

      <div className="flex justify-between gap-2 sm:gap-4 pt-2 text-[11px] font-medium text-slate-400">
        {data.map((item, idx) => (
          <span key={idx} className="flex-1 text-center truncate">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export const DonutChart = ({
  data = [
    { label: 'Completed', value: 65, color: '#10b981' },
    { label: 'Scheduled', value: 25, color: '#6366f1' },
    { label: 'Cancelled', value: 10, color: '#f43f5e' },
  ],
  size = 160,
  strokeWidth = 24,
}) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  let accumulatedAngle = 0

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="-rotate-90">
          {data.map((item, idx) => {
            const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`
            const strokeDashoffset = -accumulatedAngle
            accumulatedAngle += (item.value / total) * circumference

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out hover:opacity-80 cursor-pointer"
              />
            )
          })}
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-white tracking-tight">{total}</span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total</span>
        </div>
      </div>

      <div className="space-y-2 text-xs font-medium w-full">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300">{item.label}</span>
            </div>
            <span className="font-semibold text-white">{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BarChart
