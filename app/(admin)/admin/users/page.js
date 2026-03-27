'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Input, Badge, Modal, ModalFooter } from '@/components/ui'
import { RefreshCw, Download, Eye, UserCog, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllProfiles, getAllBusinesses, updateProfile, deleteProfile, deleteProfiles } from '@/lib/supabase/queries'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [updatingRole, setUpdatingRole] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [deleteDialog, setDeleteDialog] = useState({ open: false, mode: 'single', userId: null })
  const [deleting, setDeleting] = useState(false)

  const asDate = (value) => {
    if (!value) return 'N/A'
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return 'N/A'
    return d.toLocaleDateString()
  }

  const isPermissionError = (error) => {
    const code = error?.code || ''
    const message = (error?.message || '').toLowerCase()
    return code === '42501' || message.includes('permission denied') || message.includes('row-level security')
  }

  const getErrorMessage = (error) => {
    if (!error) return 'Unknown error'
    if (typeof error === 'string') return error
    return error.message || error.details || error.hint || 'Unknown error'
  }

  const loadUsers = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const [profilesResult, businessesResult] = await Promise.allSettled([
        getAllProfiles(),
        getAllBusinesses(),
      ])

      if (profilesResult.status === 'rejected') {
        const profileError = profilesResult.reason
        if (isPermissionError(profileError)) {
          throw new Error('Access denied while loading profiles. Ensure your DB role is admin and run supabase/fix-admin-profiles-rls.sql.')
        }
        throw profileError
      }

      if (businessesResult.status === 'rejected') {
        const businessesError = businessesResult.reason
        console.warn('[Admin Users] Businesses count unavailable:', {
          code: businessesError?.code,
          message: businessesError?.message,
          details: businessesError?.details,
        })
      }

      const profiles = profilesResult.value || []
      const businesses = businessesResult.status === 'fulfilled' ? businessesResult.value : []

      const businessCountByOwner = (businesses || []).reduce((acc, business) => {
        const ownerId = business.owner_id
        if (!ownerId) return acc
        acc[ownerId] = (acc[ownerId] || 0) + 1
        return acc
      }, {})

      const normalized = (profiles || []).map((profile) => ({
        id: profile.id,
        name: profile.full_name || profile.email?.split('@')[0] || 'User',
        email: profile.email || 'N/A',
        phone: profile.phone || 'N/A',
        role: profile.role || 'customer',
        businesses: businessCountByOwner[profile.id] || 0,
        joinedDate: profile.created_at,
        raw: profile,
      }))

      setUsers(normalized)
      setSelectedIds((prev) => prev.filter((id) => normalized.some((user) => user.id === id)))
    } catch (error) {
      console.error('[Admin Users] Failed to load users:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      })
      toast.error(getErrorMessage(error) || 'Failed to load users')
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch = !q
        || user.name.toLowerCase().includes(q)
        || user.email.toLowerCase().includes(q)
      const matchesRole = selectedRole === 'all' || user.role === selectedRole
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, selectedRole])

  const stats = useMemo(() => {
    const total = users.length
    const admins = users.filter((user) => user.role === 'admin').length
    const businessOwners = users.filter((user) => user.role === 'business').length

    const currentMonth = new Date()
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const newThisMonth = users.filter((user) => user.joinedDate && new Date(user.joinedDate) >= monthStart).length

    return { total, admins, businessOwners, newThisMonth }
  }, [users])

  const getRoleBadgeVariant = (role) => {
    if (role === 'admin') return 'error'
    if (role === 'business') return 'info'
    if (role === 'customer') return 'success'
    return 'default'
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleUpdateRole = async (userId, role) => {
    try {
      setUpdatingRole(true)
      const updated = await updateProfile(userId, { role })

      setUsers((prev) => prev.map((user) => {
        if (user.id !== userId) return user
        return {
          ...user,
          role: updated.role,
          raw: updated,
        }
      }))

      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => prev ? { ...prev, role } : prev)
      }

      toast.success('User role updated')
    } catch (error) {
      console.error('[Admin Users] Failed to update role:', error)
      toast.error(error?.message || 'Failed to update role')
    } finally {
      setUpdatingRole(false)
    }
  }

  const handleExportCsv = () => {
    if (!filteredUsers.length) {
      toast.error('No users to export')
      return
    }

    const rows = filteredUsers.map((user) => ({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      businesses: user.businesses,
      joinedDate: user.joinedDate || '',
    }))

    const headers = Object.keys(rows[0])
    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.setAttribute('download', `admin-users-${Date.now()}.csv`)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    toast.success('Users exported')
  }

  const toggleSelect = (userId) => {
    setSelectedIds((prev) => {
      if (prev.includes(userId)) return prev.filter((id) => id !== userId)
      return [...prev, userId]
    })
  }

  const toggleSelectAllFiltered = () => {
    const allFilteredIds = filteredUsers.map((user) => user.id)
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.includes(id))

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allFilteredIds])])
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      setDeleting(true)
      const result = await deleteProfile(userId)

      setUsers((prev) => prev.filter((user) => user.id !== userId))
      setSelectedIds((prev) => prev.filter((id) => id !== userId))

      if ((result?.deletedCount || 0) > 0) {
        toast.success('User deleted successfully')
      } else {
        toast.success('User was already removed')
      }
    } catch (error) {
      console.error('[Admin Users] Failed to delete user:', error)
      toast.error(error?.message || 'Failed to delete user')
    } finally {
      setDeleting(false)
      setDeleteDialog({ open: false, mode: 'single', userId: null })
    }
  }

  const handleDeleteSelected = async () => {
    const idsToDelete = [...selectedIds]
    if (!idsToDelete.length) {
      toast.error('No users selected')
      return
    }

    try {
      setDeleting(true)
      const result = await deleteProfiles(idsToDelete)
      const deletedIdSet = new Set(result?.deletedIds || [])

      setUsers((prev) => prev.filter((user) => !idsToDelete.includes(user.id)))
      setSelectedIds([])

      if ((result?.deletedCount || 0) === idsToDelete.length) {
        toast.success(`Deleted ${result.deletedCount} user(s)`)
      } else {
        const missingCount = idsToDelete.length - (result?.deletedCount || 0)
        toast.success(`Deleted ${result?.deletedCount || 0} user(s), ${missingCount} already removed`)
      }

      if (selectedUser && idsToDelete.includes(selectedUser.id)) {
        setShowModal(false)
        setSelectedUser(null)
      }

      if (deletedIdSet.size === 0 && idsToDelete.length > 0) {
        toast.success('Selected users were already removed')
      }
    } catch (error) {
      console.error('[Admin Users] Failed to delete selected users:', error)
      toast.error(error?.message || 'Failed to delete selected users')
    } finally {
      setDeleting(false)
      setDeleteDialog({ open: false, mode: 'single', userId: null })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="pb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage system users and permissions with live data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => loadUsers({ silent: true })}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2" onClick={handleExportCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="business">Business</option>
              <option value="customer">Customer</option>
            </select>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={!selectedIds.length || deleting}
              onClick={() => setDeleteDialog({ open: true, mode: 'bulk', userId: null })}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedIds.length})
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.total} helper="Live profiles count" helperClass="text-blue-600" />
        <StatCard title="Admins" value={stats.admins} helper="Role: admin" helperClass="text-red-600" />
        <StatCard title="Business Accounts" value={stats.businessOwners} helper="Role: business" helperClass="text-indigo-600" />
        <StatCard title="New This Month" value={stats.newThisMonth} helper="Based on profile creation" helperClass="text-purple-600" />
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={filteredUsers.length > 0 && filteredUsers.every((user) => selectedIds.includes(user.id))}
                    onChange={toggleSelectAllFiltered}
                    aria-label="Select all filtered users"
                  />
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Businesses</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      aria-label={`Select ${user.email}`}
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                          {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[180px]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      <span className="text-xs capitalize">{user.role}</span>
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                    {user.phone}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                    {user.businesses}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                    {asDate(user.joinedDate)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="View user"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateRole(user.id, user.role === 'admin' ? 'business' : 'admin')}
                        className="p-1.5 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded transition-colors"
                        title="Toggle admin role"
                        disabled={updatingRole}
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({ open: true, mode: 'single', userId: user.id })}
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                        title="Delete user"
                        disabled={deleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="User Details" size="md">
        {selectedUser && (
          <div className="space-y-4">
            <DetailRow label="Name" value={selectedUser.name} />
            <DetailRow label="Email" value={selectedUser.email} />
            <DetailRow label="Phone" value={selectedUser.phone} />
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <div className="mt-2">
                <select
                  value={selectedUser.role}
                  onChange={(e) => {
                    const role = e.target.value
                    setSelectedUser((prev) => prev ? { ...prev, role } : prev)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">admin</option>
                  <option value="business">business</option>
                  <option value="customer">customer</option>
                </select>
              </div>
            </div>
            <DetailRow label="Businesses" value={String(selectedUser.businesses)} />
            <DetailRow label="Joined" value={asDate(selectedUser.joinedDate)} />

            <ModalFooter className="px-0 pb-0 border-t-0">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button
                type="button"
                disabled={updatingRole}
                onClick={() => handleUpdateRole(selectedUser.id, selectedUser.role)}
              >
                {updatingRole ? 'Saving...' : 'Save Role'}
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={deleteDialog.open}
        onClose={() => !deleting && setDeleteDialog({ open: false, mode: 'single', userId: null })}
        title={deleteDialog.mode === 'bulk' ? `Delete ${selectedIds.length} user(s)` : 'Delete user'}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            This permanently removes selected user profile records and related app data.
          </p>
          <p className="text-sm text-red-600 font-medium">This action cannot be undone.</p>

          <ModalFooter className="px-0 pb-0 border-t-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, mode: 'single', userId: null })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (deleteDialog.mode === 'bulk') {
                  handleDeleteSelected()
                } else if (deleteDialog.userId) {
                  handleDeleteUser(deleteDialog.userId)
                }
              }}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  )
}

function StatCard({ title, value, helper, helperClass }) {
  return (
    <Card className="p-4">
      <div className="text-xs sm:text-sm font-medium text-gray-600">{title}</div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{value}</div>
      <div className={`text-xs sm:text-sm mt-1 ${helperClass}`}>{helper}</div>
    </Card>
  )
}

function DetailRow({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="mt-1 text-sm text-gray-900">{value}</p>
    </div>
  )
}
