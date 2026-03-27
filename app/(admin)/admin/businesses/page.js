'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Input, Badge, Modal, ModalFooter } from '@/components/ui'
import { RefreshCw, Download, Eye, Pencil, Ban, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getAllBusinesses,
  getBusinesses,
  getAllProfiles,
  getQueues,
  getBusinessAppointments,
  updateBusiness,
} from '@/lib/supabase/queries'

/**
 * AdminBusinessesPage Component - Manage all businesses
 * 
 * @returns {JSX.Element} AdminBusinessesPage component
 */
export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState('')
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    description: '',
  })

  const asDate = (value) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString()
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

  const loadBusinesses = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const [businessesResult, profilesResult] = await Promise.allSettled([
        getAllBusinesses(),
        getAllProfiles(),
      ])

      let businessesData = []
      if (businessesResult.status === 'fulfilled') {
        businessesData = businessesResult.value || []
      } else {
        const businessesError = businessesResult.reason
        if (isPermissionError(businessesError)) {
          const fallback = await getBusinesses()
          businessesData = fallback || []
          toast.error('Admin access to all businesses is not configured yet. Showing active businesses only.')
        } else {
          throw businessesError
        }
      }

      const profilesData = profilesResult.status === 'fulfilled' ? profilesResult.value : []

      const ownerMap = (profilesData || []).reduce((acc, profile) => {
        acc[profile.id] = profile
        return acc
      }, {})

      const statsResults = await Promise.allSettled(
        businessesData.map(async (business) => {
          const [queuesResult, bookingsResult] = await Promise.allSettled([
            getQueues(business.id),
            getBusinessAppointments(business.id),
          ])

          const queues = queuesResult.status === 'fulfilled' ? (queuesResult.value || []) : []
          const bookings = bookingsResult.status === 'fulfilled' ? (bookingsResult.value || []) : []
          const uniqueCustomers = new Set(
            bookings.map((booking) => booking.customer_id).filter(Boolean)
          ).size

          return {
            businessId: business.id,
            queueCount: queues.length,
            bookingCount: bookings.length,
            customerCount: uniqueCustomers,
          }
        })
      )

      const businessStatsMap = statsResults.reduce((acc, result) => {
        if (result.status === 'fulfilled') {
          acc[result.value.businessId] = result.value
        }
        return acc
      }, {})

      const normalized = businessesData.map((business) => {
        const owner = ownerMap[business.owner_id] || null
        const stats = businessStatsMap[business.id] || {
          queueCount: 0,
          bookingCount: 0,
          customerCount: 0,
        }

        return {
          id: business.id,
          name: business.name || 'Untitled Business',
          ownerName: owner?.full_name || owner?.email || 'Unknown owner',
          ownerEmail: owner?.email || 'N/A',
          category: business.category || 'Uncategorized',
          status: business.is_active ? 'active' : 'inactive',
          isActive: !!business.is_active,
          queueCount: stats.queueCount,
          bookingCount: stats.bookingCount,
          customerCount: stats.customerCount,
          joinedDate: business.created_at,
          phone: business.phone || 'N/A',
          email: business.email || 'N/A',
          address: business.address || 'N/A',
          website: business.website || '',
          description: business.description || '',
          raw: business,
        }
      })

      setBusinesses(normalized)
    } catch (error) {
      console.warn('[Admin Businesses] Failed to load businesses:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      })
      toast.error(getErrorMessage(error) || 'Failed to load businesses')
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadBusinesses()
  }, [])

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch = !q
        || business.name.toLowerCase().includes(q)
        || business.ownerName.toLowerCase().includes(q)
        || business.ownerEmail.toLowerCase().includes(q)
      const matchesIndustry = selectedIndustry === 'all' || business.category === selectedIndustry
      const matchesStatus = selectedStatus === 'all' || business.status === selectedStatus
      return matchesSearch && matchesIndustry && matchesStatus
    })
  }, [businesses, searchTerm, selectedIndustry, selectedStatus])

  const availableIndustries = useMemo(() => {
    return [...new Set(businesses.map((business) => business.category).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  }, [businesses])

  const stats = useMemo(() => {
    const total = businesses.length
    const active = businesses.filter((business) => business.isActive).length
    const inactive = total - active
    const totalQueues = businesses.reduce((sum, business) => sum + business.queueCount, 0)
    const totalBookings = businesses.reduce((sum, business) => sum + business.bookingCount, 0)

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const newThisMonth = businesses.filter((business) => {
      if (!business.joinedDate) return false
      const created = new Date(business.joinedDate)
      return !Number.isNaN(created.getTime()) && created >= monthStart
    }).length

    return { total, active, inactive, totalQueues, totalBookings, newThisMonth }
  }, [businesses])

  const getStatusVariant = (status) => {
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'default'
    return 'warning'
  }

  const handleViewBusiness = (business) => {
    setSelectedBusiness(business)
    setShowViewModal(true)
  }

  const handleOpenEdit = (business) => {
    setSelectedBusiness(business)
    setEditForm({
      name: business.raw.name || '',
      category: business.raw.category || '',
      phone: business.raw.phone || '',
      email: business.raw.email || '',
      address: business.raw.address || '',
      website: business.raw.website || '',
      description: business.raw.description || '',
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedBusiness) return

    const name = editForm.name.trim()
    if (!name) {
      toast.error('Business name is required')
      return
    }

    try {
      setSaving(true)

      const updates = {
        name,
        category: editForm.category.trim() || null,
        phone: editForm.phone.trim() || null,
        email: editForm.email.trim() || null,
        address: editForm.address.trim() || null,
        website: editForm.website.trim() || null,
        description: editForm.description.trim() || null,
      }

      const updated = await updateBusiness(selectedBusiness.id, updates)

      setBusinesses((prev) => prev.map((item) => {
        if (item.id !== selectedBusiness.id) return item
        const mergedRaw = { ...item.raw, ...updated }
        return {
          ...item,
          name: mergedRaw.name || item.name,
          category: mergedRaw.category || 'Uncategorized',
          phone: mergedRaw.phone || 'N/A',
          email: mergedRaw.email || 'N/A',
          address: mergedRaw.address || 'N/A',
          website: mergedRaw.website || '',
          description: mergedRaw.description || '',
          raw: mergedRaw,
        }
      }))

      setShowEditModal(false)
      toast.success('Business updated')
    } catch (error) {
      console.error('[Admin Businesses] Failed to update business:', error)
      toast.error(getErrorMessage(error) || 'Failed to update business')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (business) => {
    try {
      setTogglingId(business.id)
      const updated = await updateBusiness(business.id, { is_active: !business.isActive })

      setBusinesses((prev) => prev.map((item) => {
        if (item.id !== business.id) return item
        const isActive = !!updated.is_active
        return {
          ...item,
          isActive,
          status: isActive ? 'active' : 'inactive',
          raw: { ...item.raw, ...updated },
        }
      }))

      toast.success(updated.is_active ? 'Business activated' : 'Business deactivated')
    } catch (error) {
      console.error('[Admin Businesses] Failed to toggle business status:', error)
      toast.error(getErrorMessage(error) || 'Failed to update business status')
    } finally {
      setTogglingId('')
    }
  }

  const handleExportCsv = () => {
    if (!filteredBusinesses.length) {
      toast.error('No businesses to export')
      return
    }

    const rows = filteredBusinesses.map((business) => ({
      id: business.id,
      name: business.name,
      ownerName: business.ownerName,
      ownerEmail: business.ownerEmail,
      category: business.category,
      status: business.status,
      phone: business.phone,
      email: business.email,
      queues: business.queueCount,
      bookings: business.bookingCount,
      uniqueCustomers: business.customerCount,
      joinedDate: business.joinedDate || '',
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
    anchor.setAttribute('download', `admin-businesses-${Date.now()}.csv`)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    toast.success('Businesses exported')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading businesses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage all registered businesses with live data</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2" onClick={() => loadBusinesses({ silent: true })}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search businesses by name, owner, or owner email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Industries</option>
              {availableIndustries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button className="w-full sm:w-auto flex items-center justify-center gap-2" onClick={handleExportCsv}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Businesses" value={stats.total} helper="Live businesses count" helperClass="text-blue-600" />
        <StatCard title="Active" value={stats.active} helper={`${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}% active`} helperClass="text-green-600" />
        <StatCard title="Total Queues" value={stats.totalQueues} helper="Across all businesses" helperClass="text-indigo-600" />
        <StatCard title="Total Bookings" value={stats.totalBookings} helper={`${stats.newThisMonth} new this month`} helperClass="text-purple-600" />
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Industry</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Queues</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Bookings</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBusinesses.map((business) => (
                <tr key={business.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{business.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{business.ownerName}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {business.category}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(business.status)}>
                      <span className="text-xs capitalize">{business.status}</span>
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {business.queueCount}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {business.bookingCount}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {asDate(business.joinedDate)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleViewBusiness(business)}
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(business)}
                        className="p-1.5 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded transition-colors"
                        title="Edit business"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(business)}
                        className={`p-1.5 rounded transition-colors ${
                          business.isActive
                            ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        }`}
                        title={business.isActive ? 'Deactivate business' : 'Activate business'}
                        disabled={togglingId === business.id}
                      >
                        {business.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No businesses found</p>
          </div>
        )}
      </Card>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Business Details" size="md">
        {selectedBusiness && (
          <div className="space-y-4">
            <DetailRow label="Business Name" value={selectedBusiness.name} />
            <DetailRow label="Owner" value={selectedBusiness.ownerName} />
            <DetailRow label="Owner Email" value={selectedBusiness.ownerEmail} />
            <DetailRow label="Industry" value={selectedBusiness.category} />
            <DetailRow label="Phone" value={selectedBusiness.phone} />
            <DetailRow label="Email" value={selectedBusiness.email} />
            <DetailRow label="Address" value={selectedBusiness.address} />
            <DetailRow label="Website" value={selectedBusiness.website || 'N/A'} />
            <DetailRow label="Description" value={selectedBusiness.description || 'N/A'} />
            <DetailRow label="Status" value={selectedBusiness.status} />
            <DetailRow label="Queues" value={String(selectedBusiness.queueCount)} />
            <DetailRow label="Bookings" value={String(selectedBusiness.bookingCount)} />
            <DetailRow label="Unique Customers" value={String(selectedBusiness.customerCount)} />
            <DetailRow label="Joined" value={asDate(selectedBusiness.joinedDate)} />

            <ModalFooter className="px-0 pb-0 border-t-0">
              <Button type="button" variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Business" size="md">
        {selectedBusiness && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <Input value={editForm.name} onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <Input value={editForm.category} onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <Input value={editForm.phone} onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input value={editForm.email} onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <Input value={editForm.address} onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <Input value={editForm.website} onChange={(e) => setEditForm((prev) => ({ ...prev, website: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[90px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <ModalFooter className="px-0 pb-0 border-t-0">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveEdit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </ModalFooter>
          </div>
        )}
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
      <p className="mt-1 text-sm text-gray-900 break-words">{value}</p>
    </div>
  )
}
