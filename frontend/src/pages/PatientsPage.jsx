import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserPlus, Eye, Filter } from 'lucide-react'
import { usePatientsQuery } from '../hooks/queries/usePatientsQuery'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { SearchInput, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { TableContainer, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TablePagination } from '../components/ui/Table'
import { TableSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { PatientModalForm } from '../components/forms/PatientModalForm'
import { isTherapist } from '../utils/permissions'

export function PatientsPage() {
  const { user } = useAuth()
  const isTherapistRole = isTherapist(user)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: patients, isLoading, error, refetch } = usePatientsQuery({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    page_size: pageSize,
  })

  const patientList = Array.isArray(patients) ? patients : patients?.results || []
  const totalItems = patients?.count || patientList.length || 0
  const totalPages = Math.ceil(totalItems / pageSize) || 1

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            {isTherapistRole ? 'Patient Directory' : 'Patient Directory'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isTherapistRole
              ? 'Register new patients, search patient directory, and access clinical records'
              : 'Manage patient records, contact demographics, and therapist assignments'}
          </p>
        </div>

        <Button variant="primary" size="md" icon={UserPlus} onClick={() => setIsAddModalOpen(true)}>
          Register New Patient
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients by name, email, or phone..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600 font-semibold">Filter:</span>
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="!py-2 text-xs w-40"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </div>

      {/* Content Table */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Failed to Load Patients"
          description={error?.message || 'Could not fetch patient records from backend.'}
          actionLabel="Retry"
          onAction={refetch}
        />
      ) : patientList.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Patients Found"
          description="No patient records match your criteria."
          actionLabel="Register Patient"
          onAction={() => setIsAddModalOpen(true)}
          actionIcon={UserPlus}
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow hoverable={false}>
                <TableHead>Patient Name</TableHead>
                <TableHead>Contact Phone</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Assigned Therapist</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientList.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {patient.full_name || `${patient.first_name} ${patient.last_name}`}
                  </TableCell>
                  <TableCell className="text-slate-600">{patient.phone}</TableCell>
                  <TableCell className="capitalize text-slate-500">{patient.gender}</TableCell>
                  <TableCell className="text-slate-700">{patient.assigned_therapist_name || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={patient.status === 'active' ? 'success' : patient.status === 'pending' ? 'warning' : 'neutral'}
                      dot
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/patients/${patient.id}`}>
                        <Button variant="ghost" size="sm" icon={Eye}>View Record</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(1); }}
          />
        </TableContainer>
      )}

      {/* Patient Modal Form */}
      <PatientModalForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}

export default PatientsPage
