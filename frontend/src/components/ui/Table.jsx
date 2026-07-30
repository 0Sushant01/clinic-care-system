import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export const TableContainer = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>
      <div className="w-full overflow-x-auto custom-scrollbar">{children}</div>
    </div>
  )
}

export const Table = ({ children, className = '' }) => {
  return <table className={`w-full text-left border-collapse text-xs min-w-[600px] sm:min-w-full ${className}`}>{children}</table>
}

export const TableHeader = ({ children, className = '' }) => {
  return <thead className={`bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold ${className}`}>{children}</thead>
}

export const TableHead = ({ children, className = '' }) => {
  return <th className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider ${className}`}>{children}</th>
}

export const TableBody = ({ children, className = '' }) => {
  return <tbody className={`divide-y divide-slate-100 bg-white text-slate-700 ${className}`}>{children}</tbody>
}

export const TableRow = ({ children, hoverable = true, className = '' }) => {
  return (
    <tr className={`transition-colors duration-150 ${hoverable ? 'hover:bg-slate-50/80' : ''} ${className}`}>
      {children}
    </tr>
  )
}

export const TableCell = ({ children, className = '' }) => {
  return <td className={`px-4 py-3.5 align-middle text-xs ${className}`}>{children}</td>
}

export const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-medium">
      <div>
        Showing <span className="font-bold text-slate-900">{totalItems > 0 ? startItem : 0}</span> to{' '}
        <span className="font-bold text-slate-900">{endItem}</span> of{' '}
        <span className="font-bold text-slate-900">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-slate-200 text-slate-900 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-600"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            isDisabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            icon={ChevronLeft}
          />
          <span className="px-2 font-semibold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            isDisabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            icon={ChevronRight}
          />
        </div>
      </div>
    </div>
  )
}

export default Table
