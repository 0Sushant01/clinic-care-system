import React from 'react'

export const BarChart = ({ data = [] }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="w-full space-y-2">
      <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-slate-100 px-2">
        {data.map((item, idx) => {
          const heightPercent = Math.max(10, Math.round((item.value / maxValue) * 100))
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                {item.value}
              </span>
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full bg-blue-600/15 group-hover:bg-blue-600 rounded-t-lg transition-all duration-200 border-t-2 border-blue-600"
              />
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between px-2 text-[10px] font-semibold text-slate-400">
        {data.map((item, idx) => (
          <span key={idx} className="flex-1 text-center truncate">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export const DonutChart = ({ data = [] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-2">
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <div className="w-28 h-28 rounded-full border-8 border-blue-600 flex items-center justify-center bg-slate-50 shadow-inner">
          <div className="text-center">
            <span className="block text-lg font-extrabold text-slate-900 leading-none">{total}</span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2.5 w-full">
        {data.map((item, idx) => {
          const percentage = Math.round((item.value / total) * 100)
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || '#2563eb' }} />
                  {item.label}
                </span>
                <span className="text-slate-900">{percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%`, backgroundColor: item.color || '#2563eb' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
