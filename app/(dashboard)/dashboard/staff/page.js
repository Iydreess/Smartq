'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal, ModalFooter } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import {
  createStaff,
  getBusinessesByOwner,
  getBusinessAppointments,
  getStaff,
  updateStaff,
} from '@/lib/supabase/queries'
import {
  Users, User, Calendar, Badge,
  Phone, Mail,
  Search, Download, UserPlus, Settings,
  Award, CheckCircle,
  BarChart3, Activity, RefreshCw, DollarSign, UserX
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function StaffPage() {
  const { user, loading: userLoading } = useUser()
  const [staff, setStaff] = useState([])
  const [ownedBusinesses, setOwnedBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false)
  const [savingStaff, setSavingStaff] = useState(false)
  const [selectedStaffId, setSelectedStaffId] = useState(null)
  const [deactivatingStaffId, setDeactivatingStaffId] = useState(null)

  const [staffForm, setStaffForm] = useState({
    businessId: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    specialization: '',
    isActive: true,
  })

  const [editStaffForm, setEditStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    specialization: '',
    isActive: true,
  })

  const enrichStaffMembers = (rawStaff, appointments) => {
    const todayIso = new Date().toISOString().split('T')[0]
    const weekStart = new Date(todayIso)
    const weekEnd = new Date(todayIso)
    weekEnd.setDate(weekEnd.getDate() + 7)

    return (rawStaff || []).map((member) => {
      const memberAppointments = (appointments || []).filter((apt) => apt.staff_id === member.id)
      const todayAppointments = memberAppointments.filter((apt) => apt.appointment_date === todayIso)
      const upcomingWeek = memberAppointments.filter((apt) => {
        if (!apt.appointment_date) return false
        const date = new Date(apt.appointment_date)
        return date >= weekStart && date <= weekEnd && ['pending', 'confirmed', 'in-progress'].includes(apt.status)
      })
      const completed = memberAppointments.filter((apt) => apt.status === 'completed')
      const revenue = completed.reduce((sum, apt) => sum + Number(apt?.service?.price || 0), 0)

      return {
        ...member,
        department: member.specialization || member.role || 'General',
        status: member.is_active ? 'active' : 'inactive',
        availability: !member.is_active
          ? 'off-duty'
          : todayAppointments.some((apt) => ['in-progress', 'confirmed'].includes(apt.status))
            ? 'busy'
            : 'available',
        appointmentsToday: todayAppointments.length,
        upcomingCount: upcomingWeek.length,
        completedCount: completed.length,
        totalRevenue: revenue,
      }
    })
  }

  const loadStaff = async ({ silent = false } = {}) => {
    if (!user?.id) return

    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const businesses = await getBusinessesByOwner(user.id)
      setOwnedBusinesses(businesses || [])

      const businessIds = (businesses || []).map((business) => business.id)
      if (!businessIds.length) {
        setStaff([])
        return
      }

      const [staffRows, appointmentRows] = await Promise.all([
        Promise.all(businessIds.map((businessId) => getStaff(businessId, { includeInactive: true }))),
        Promise.all(businessIds.map((businessId) => getBusinessAppointments(businessId))),
      ])

      setStaff(enrichStaffMembers(staffRows.flat(), appointmentRows.flat()))
    } catch (error) {
      console.error('[Staff] Failed to load:', error)
      toast.error('Failed to load staff')
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadStaff()
  }, [user?.id])

  const openAddStaffModal = () => {
    if (!ownedBusinesses.length) {
      toast.error('No business profile found for your account')
      return
    }

    setStaffForm({
      businessId: ownedBusinesses[0]?.id || '',
      name: '',
      email: '',
      phone: '',
      role: '',
      specialization: '',
      isActive: true,
    })

    setIsAddStaffModalOpen(true)
  }

  const handleCreateStaff = async (event) => {
    event.preventDefault()

    const name = staffForm.name.trim()
    if (!staffForm.businessId) {
      toast.error('Please select a business')
      return
    }
    if (!name) {
      toast.error('Staff name is required')
      return
    }

    try {
      setSavingStaff(true)
      const createdStaff = await createStaff({
        business_id: staffForm.businessId,
        name,
        email: staffForm.email.trim() || null,
        phone: staffForm.phone.trim() || null,
        role: staffForm.role.trim() || null,
        specialization: staffForm.specialization.trim() || null,
        is_active: Boolean(staffForm.isActive),
      })

      const optimistic = enrichStaffMembers([createdStaff], [])[0]
      setStaff((prev) => [optimistic, ...prev])
      setIsAddStaffModalOpen(false)
      toast.success('Staff member added successfully')

      // Background refresh avoids blocking screen with full-page loader after save.
      loadStaff({ silent: true })
    } catch (error) {
      console.error('[Staff] Failed to create staff:', error)
      toast.error(error?.message || 'Failed to create staff member')
    } finally {
      setSavingStaff(false)
    }
  }

  const openEditStaffModal = (member) => {
    setSelectedStaffId(member.id)
    setEditStaffForm({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || '',
      specialization: member.specialization || '',
      isActive: Boolean(member.is_active),
    })
    setIsEditStaffModalOpen(true)
  }

  const handleEditStaff = async (event) => {
    event.preventDefault()
    if (!selectedStaffId) return

    const name = editStaffForm.name.trim()
    if (!name) {
      toast.error('Staff name is required')
      return
    }

    try {
      setSavingStaff(true)
      const updatedStaff = await updateStaff(selectedStaffId, {
        name,
        email: editStaffForm.email.trim() || null,
        phone: editStaffForm.phone.trim() || null,
        role: editStaffForm.role.trim() || null,
        specialization: editStaffForm.specialization.trim() || null,
        is_active: Boolean(editStaffForm.isActive),
      })

      setStaff((prev) => prev.map((member) => {
        if (member.id !== selectedStaffId) return member
        const merged = {
          ...member,
          ...updatedStaff,
          department: updatedStaff.specialization || updatedStaff.role || 'General',
          status: updatedStaff.is_active ? 'active' : 'inactive',
          availability: updatedStaff.is_active ? member.availability : 'off-duty',
        }
        return merged
      }))

      setIsEditStaffModalOpen(false)
      setSelectedStaffId(null)
      toast.success('Staff member updated')
      loadStaff({ silent: true })
    } catch (error) {
      console.error('[Staff] Failed to update staff:', error)
      toast.error(error?.message || 'Failed to update staff member')
    } finally {
      setSavingStaff(false)
    }
  }

  const handleDeactivateStaff = async (member) => {
    if (!member?.id) return

    try {
      setDeactivatingStaffId(member.id)
      await updateStaff(member.id, { is_active: false })
      setStaff((prev) => prev.map((row) => {
        if (row.id !== member.id) return row
        return {
          ...row,
          is_active: false,
          status: 'inactive',
          availability: 'off-duty',
        }
      }))
      toast.success(`${member.name} has been deactivated`)
      loadStaff({ silent: true })
    } catch (error) {
      console.error('[Staff] Failed to deactivate staff:', error)
      toast.error(error?.message || 'Failed to deactivate staff member')
    } finally {
      setDeactivatingStaffId(null)
    }
  }

  const handleReactivateStaff = async (member) => {
    if (!member?.id) return

    try {
      setDeactivatingStaffId(member.id)
      await updateStaff(member.id, { is_active: true })
      setStaff((prev) => prev.map((row) => {
        if (row.id !== member.id) return row
        return {
          ...row,
          is_active: true,
          status: 'active',
          availability: 'available',
        }
      }))
      toast.success(`${member.name} has been reactivated`)
      loadStaff({ silent: true })
    } catch (error) {
      console.error('[Staff] Failed to reactivate staff:', error)
      toast.error(error?.message || 'Failed to reactivate staff member')
    } finally {
      setDeactivatingStaffId(null)
    }
  }

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200'
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'off-duty': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const inDepartment = filterDepartment === 'all' || member.department === filterDepartment
      const inStatus = filterStatus === 'all' || member.status === filterStatus
      const q = searchTerm.trim().toLowerCase()
      const inSearch = !q ||
        String(member.name || '').toLowerCase().includes(q) ||
        String(member.email || '').toLowerCase().includes(q) ||
        String(member.phone || '').toLowerCase().includes(q) ||
        String(member.role || '').toLowerCase().includes(q)
      return inDepartment && inStatus && inSearch
    })
  }, [staff, filterDepartment, filterStatus, searchTerm])

  const staffStats = {
    total: staff.length,
    active: staff.filter((s) => s.status === 'active').length,
    available: staff.filter((s) => s.availability === 'available').length,
    totalRevenue: staff.reduce((sum, s) => sum + Number(s.totalRevenue || 0), 0),
  }

  const departments = [...new Set(staff.map((s) => s.department))]

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading staff...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Staff Management</h1>
          <p className="text-secondary-600">Manage your team, schedules, and performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => toast.success('Export feature queued')}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => toast.success('Schedule management is coming soon')}>
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button className="flex items-center gap-2" onClick={openAddStaffModal}>
            <UserPlus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staffStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold">{staffStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Available Now</p>
                <p className="text-2xl font-bold">{staffStats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">KSh {staffStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => loadStaff({ silent: true })}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStaff.length === 0 && (
          <Card className="lg:col-span-2">
            <CardContent className="p-8 text-center">
              <Users className="h-8 w-8 text-secondary-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-secondary-900">No staff found</h3>
              <p className="text-secondary-600 mt-1">Add staff records to your business to see them here.</p>
            </CardContent>
          </Card>
        )}

        {filteredStaff.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-gray-600">{member.role || 'Staff Member'}</p>
                      <p className="text-sm text-gray-500">{member.department}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                    <br />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(member.availability)}`}>
                      {member.availability}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{member.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Badge className="h-3 w-3" />
                      <span>{member.id?.slice(0, 8) || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold ml-1">{member.completedCount}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Upcoming:</span>
                      <span className="font-semibold ml-1">{member.upcomingCount}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-semibold ml-1 text-green-600">KSh {Number(member.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 py-3 border-t border-b">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{member.appointmentsToday}</p>
                    <p className="text-xs text-gray-600">Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{member.upcomingCount}</p>
                    <p className="text-xs text-gray-600">Upcoming</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">{member.completedCount}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Specialization</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {member.specialization || member.role || 'General'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditStaffModal(member)}>
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {member.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDeactivateStaff(member)}
                      disabled={deactivatingStaffId === member.id}
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      {deactivatingStaffId === member.id ? 'Deactivating...' : 'Deactivate'}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleReactivateStaff(member)}
                      disabled={deactivatingStaffId === member.id}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {deactivatingStaffId === member.id ? 'Reactivating...' : 'Reactivate'}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success(`Performance insights for ${member.name} coming soon`)}>
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Performance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2" onClick={openAddStaffModal}>
              <UserPlus className="h-5 w-5" />
              <span>Add New Staff</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2" onClick={() => toast.success('Schedule manager coming soon')}>
              <Calendar className="h-5 w-5" />
              <span>Manage Schedules</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2" onClick={() => toast.success('Performance review coming soon')}>
              <Award className="h-5 w-5" />
              <span>Performance Review</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2" onClick={() => toast.success('Staff settings coming soon')}>
              <Settings className="h-5 w-5" />
              <span>Staff Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        title="Add Staff Member"
        size="lg"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          {ownedBusinesses.length > 1 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700">Business</label>
              <select
                value={staffForm.businessId}
                onChange={(e) => setStaffForm((prev) => ({ ...prev, businessId: e.target.value }))}
                className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {ownedBusinesses.map((business) => (
                  <option key={business.id} value={business.id}>{business.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={staffForm.name}
              onChange={(e) => setStaffForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Jane Doe"
              required
            />
            <Input
              label="Role"
              value={staffForm.role}
              onChange={(e) => setStaffForm((prev) => ({ ...prev, role: e.target.value }))}
              placeholder="e.g. Stylist, Consultant"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={staffForm.email}
              onChange={(e) => setStaffForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="staff@example.com"
            />
            <Input
              label="Phone"
              value={staffForm.phone}
              onChange={(e) => setStaffForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+254 700 000 000"
            />
          </div>

          <Input
            label="Specialization"
            value={staffForm.specialization}
            onChange={(e) => setStaffForm((prev) => ({ ...prev, specialization: e.target.value }))}
            placeholder="e.g. Hair Styling, Cardiology"
          />

          <label className="flex items-center gap-2 text-sm text-secondary-700">
            <input
              type="checkbox"
              checked={staffForm.isActive}
              onChange={(e) => setStaffForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            Set as active staff member
          </label>

          <ModalFooter className="px-0 pb-0 border-t-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddStaffModalOpen(false)}
              disabled={savingStaff}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={savingStaff}>
              {savingStaff ? 'Saving...' : 'Create Staff'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal
        isOpen={isEditStaffModalOpen}
        onClose={() => {
          setIsEditStaffModalOpen(false)
          setSelectedStaffId(null)
        }}
        title="Edit Staff Member"
        size="lg"
      >
        <form onSubmit={handleEditStaff} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={editStaffForm.name}
              onChange={(e) => setEditStaffForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Jane Doe"
              required
            />
            <Input
              label="Role"
              value={editStaffForm.role}
              onChange={(e) => setEditStaffForm((prev) => ({ ...prev, role: e.target.value }))}
              placeholder="e.g. Stylist, Consultant"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={editStaffForm.email}
              onChange={(e) => setEditStaffForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="staff@example.com"
            />
            <Input
              label="Phone"
              value={editStaffForm.phone}
              onChange={(e) => setEditStaffForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+254 700 000 000"
            />
          </div>

          <Input
            label="Specialization"
            value={editStaffForm.specialization}
            onChange={(e) => setEditStaffForm((prev) => ({ ...prev, specialization: e.target.value }))}
            placeholder="e.g. Hair Styling, Cardiology"
          />

          <label className="flex items-center gap-2 text-sm text-secondary-700">
            <input
              type="checkbox"
              checked={editStaffForm.isActive}
              onChange={(e) => setEditStaffForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            Staff member is active
          </label>

          <ModalFooter className="px-0 pb-0 border-t-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditStaffModalOpen(false)
                setSelectedStaffId(null)
              }}
              disabled={savingStaff}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={savingStaff}>
              {savingStaff ? 'Saving...' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}
