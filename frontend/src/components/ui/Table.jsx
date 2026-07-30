import React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import Button from './Button'

/**
 * Clinic Care System — Data Table Components
 */

export const TableContainer = ({ children, className = '' }) => (
  <div className={`w-full overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-900/80 shadow-md custom-scrollbar ${className}`}>
    {children}
  </div>
)

export const Table = ({ children, className = '' }) => (
  <table className={`w-full text-left border-collapse text-sm ${className}`}>
    {children}
  </table>
)

export const TableHeader = ({ children, className = '' }) => (
  <thead className={`bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 ${className}`}>
    {children}
  </thead>
)

export const TableHead = ({ children, className = '' }) => (
  <th className={`px-4 py-3.5 ${className}`}>
    {children}
  </th>
)

export const TableBody = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-slate-800/60 text-slate-200 ${className}`}>
    {children}
  </tbody>
)

export const TableRow = ({ children, className = '', hoverable = true, onClick }) => (
  <tr
    onClick={onClick}
    className={`transition-colors duration-150 ease-in-out ${
      hoverable ? 'hover:bg-slate-800/50' : ''
    } ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
)

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-4 py-3.5 align-middle ${className}`}>
    {children}
  </td>
)

export const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  className = '',
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className={`px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 ${className}`}>
      <div className="flex items-center gap-2">
        <span>Showing <strong className="text-slate-200">{startItem}-{endItem}</strong> of <strong className="text-slate-200">{totalItems}</strong> items</span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          isDisabled={currentPage <= 1}
          onClick={() => onPageChange(1)}
          className="!p-1.5"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          isDisabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="!p-1.5"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-semibold text-slate-200">
          Page {currentPage} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          isDisabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="!p-1.5"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          isDisabled={currentPage >= totalPages}
          onClick={() => onPageChange(totalPages)}
          className="!p-1.5"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default Table
