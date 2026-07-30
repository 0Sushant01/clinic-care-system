import React, { useState } from 'react'
import { Users, UserPlus, Filter, Eye, Edit, Power, KeyRound, ArrowUpDown } from 'lucide-react'
import { useUsersQuery, useToggleUserMutation } from '../hooks/queries/useUsersQuery'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { SearchInput, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { TableContainer, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TablePagination } from '../components/ui/Table'
import { TableSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmModal } from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'

import StaffForm from '../components/forms/StaffForm'
import ResetPasswordModalForm from '../components/forms/ResetPasswordModalForm'
import StaffDetailModal from '../components/forms/StaffDetailModal'

export function StaffManagementPage() {
  const { user: currentUser } = useAuth()
  const toast = useToast()
  const isAdmin = currentUser?.role === 'admin'

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [ordering, setOrdering] = useState('-created_at')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Modal States
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false)
  const [staffFormMode, setStaffFormMode] = useState('create')
  const [staffFormPresetRole, setStaffFormPresetRole] = useState('therapist')
  const [selectedStaff, setSelectedStaff] = useState(null)

  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false)

  // API Queries & Mutations
  const { data: users, isLoading, error, refetch } = useUsersQuery({
    search: search || undefined,
    role: roleFilter || undefined,
    is_active: statusFilter === '' ? undefined : statusFilter === 'active',
    ordering: ordering || undefined,
    page,
    page_size: pageSize,
  })

  const toggleMutation = useToggleUserMutation()

  const staffList = Array.isArray(users) ? users : users?.results || []
  const totalItems = users?.count || staffList.length || 0
  const totalPages = Math.ceil(totalItems / pageSize) || 1

  // Modal Handlers
  const handleOpenAddTherapist = () => {
    setStaffFormMode('create')
    setStaffFormPresetRole('therapist')
    setSelectedStaff(null)
    setIsStaffFormOpen(true)
  }

  const handleOpenAddReceptionist = () => {
    setStaffFormMode('create')
    setStaffFormPresetRole('receptionist')
    setSelectedStaff(null)
    setIsStaffFormOpen(true)
  }

  const handleOpenEdit = (staff) => {
    setStaffFormMode('edit')
    setSelectedStaff(staff)
    setIsStaffFormOpen(true)
  }

  const handleOpenView = (staff) => {
    setSelectedStaff(staff)
    setIsDetailOpen(true)
  }

  const handleOpenResetPassword = (staff) => {
    setSelectedStaff(staff)
    setIsResetPasswordOpen(true)
  }

  const handleOpenToggleActive = (staff) => {
    setSelectedStaff(staff)
    setIsToggleConfirmOpen(true)
  }

  const handleConfirmToggleActive = () => {
    if (!selectedStaff?.id) return
    const newActiveState = !selectedStaff.is_active

    toggleMutation.mutate(
      { id: selectedStaff.id, isActive: newActiveState },
      {
        onSuccess: () => {
          toast.success(
            `Staff ${newActiveState ? 'Activated' : 'Deactivated'}`,
            `${selectedStaff.full_name || selectedStaff.email} account has been ${newActiveState ? 'activated' : 'deactivated'}.`
          )
          setIsToggleConfirmOpen(false)
        },
        onError: (err) => {
          toast.error('Action Failed', err.message || 'Could not toggle staff status.')
        },
      }
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Staff Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage therapists, receptionists and administrators.</p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="md" icon={UserPlus} onClick={handleOpenAddReceptionist}>
              + Add Receptionist
            </Button>
            <Button variant="primary" size="md" icon={UserPlus} onClick={handleOpenAddTherapist}>
              + Add Therapist
            </Button>
          </div>
        )}
      </div>

      {/* Filters & Search Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search staff by name, email, or phone..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600 font-semibold">Role:</span>
            <Select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="!py-2 text-xs w-36"
            >
              <option value="">All Roles</option>
              <option value="therapist">Therapist</option>
              <option value="receptionist">Receptionist</option>
              <option value="admin">Administrator</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Status:</span>
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="!py-2 text-xs w-32"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <Select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="!py-2 text-xs w-40"
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="-last_login">Recently Active</option>
              <option value="first_name">Name (A-Z)</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Failed to Load Staff Directory"
          description={error?.message || 'Could not retrieve staff accounts from backend.'}
          actionLabel="Retry"
          onAction={refetch}
        />
      ) : staffList.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Staff Accounts Found"
          description="There are no staff accounts matching your search or filter criteria."
          actionLabel={isAdmin ? "+ Add Therapist" : undefined}
          onAction={isAdmin ? handleOpenAddTherapist : undefined}
          actionIcon={UserPlus}
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow hoverable={false}>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((staff) => {
                const isSelf = staff.id === currentUser?.id
                const formattedLastLogin = staff.last_login
                  ? new Date(staff.last_login).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Never'

                return (
                  <TableRow key={staff.id}>
                    {/* Avatar & Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                          {staff.first_name ? staff.first_name[0] : 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {staff.full_name || `${staff.first_name} ${staff.last_name}`}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Badge
                        variant={
                          staff.role === 'admin'
                            ? 'primary'
                            : staff.role === 'therapist'
                            ? 'secondary'
                            : 'neutral'
                        }
                      >
                        {staff.role}
                      </Badge>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-slate-600 text-xs font-medium">{staff.email}</TableCell>

                    {/* Phone */}
                    <TableCell className="text-slate-500 text-xs">{staff.phone || 'N/A'}</TableCell>

                    {/* Specialization */}
                    <TableCell className="text-slate-700 text-xs">{staff.specialization || 'N/A'}</TableCell>

                    {/* Patients Count */}
                    <TableCell className="text-slate-900 text-xs font-semibold">
                      {staff.role === 'therapist' ? staff.patients_count ?? 0 : 'N/A'}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant={staff.is_active ? 'success' : 'neutral'} dot>
                        {staff.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>

                    {/* Last Login */}
                    <TableCell className="text-slate-500 text-xs font-mono">{formattedLastLogin}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleOpenView(staff)}
                          title="View Profile"
                        />

                        {isAdmin && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit}
                              onClick={() => handleOpenEdit(staff)}
                              title="Edit Staff"
                            />

                            <Button
                              variant="ghost"
                              size="sm"
                              icon={KeyRound}
                              onClick={() => handleOpenResetPassword(staff)}
                              title="Reset Password"
                            />

                            {!isSelf && (
                              <Button
                                variant={staff.is_active ? 'ghost' : 'secondary'}
                                size="sm"
                                icon={Power}
                                onClick={() => handleOpenToggleActive(staff)}
                                title={staff.is_active ? 'Deactivate User' : 'Activate User'}
                              >
                                {staff.is_active ? 'Deactivate' : 'Activate'}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
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

      {/* Staff Form Modal (Create & Edit) */}
      <StaffForm
        isOpen={isStaffFormOpen}
        onClose={() => setIsStaffFormOpen(false)}
        mode={staffFormMode}
        initialData={selectedStaff}
        presetRole={staffFormPresetRole}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModalForm
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        user={selectedStaff}
      />

      {/* Staff Detail Modal */}
      <StaffDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        userId={selectedStaff?.id}
      />

      {/* Deactivate / Activate Confirmation Modal */}
      <ConfirmModal
        isOpen={isToggleConfirmOpen}
        onClose={() => setIsToggleConfirmOpen(false)}
        onConfirm={handleConfirmToggleActive}
        title={selectedStaff?.is_active ? 'Deactivate Staff User?' : 'Activate Staff User?'}
        message={
          selectedStaff?.is_active
            ? `Are you sure you want to deactivate ${selectedStaff?.full_name || selectedStaff?.email}? They will no longer be able to log in, but all historical appointments and session notes will remain intact.`
            : `Reactivate staff access for ${selectedStaff?.full_name || selectedStaff?.email}?`
        }
        confirmText={selectedStaff?.is_active ? 'Deactivate User' : 'Activate User'}
        variant={selectedStaff?.is_active ? 'danger' : 'primary'}
        isLoading={toggleMutation.isPending}
      />
    </div>
  )
}

export default StaffManagementPage
