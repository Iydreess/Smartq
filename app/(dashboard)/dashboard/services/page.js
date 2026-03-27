'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal, ModalFooter } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import {
  createService,
  getBusinessesByOwner,
  getBusinessAppointments,
  getServices,
  updateService,
} from '@/lib/supabase/queries'
import {
  Package,
  Plus,
  Search,
  Edit,
  Copy,
  BarChart3,
  Calendar,
  CheckCircle,
  Download,
  DollarSign,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ServicesPage() {
  const { user, loading: userLoading } = useUser()

  const [businesses, setBusinesses] = useState([])
  const [services, setServices] = useState([])
  const [appointments, setAppointments] = useState([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [togglingServiceId, setTogglingServiceId] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  const [createForm, setCreateForm] = useState({
    businessId: '',
    name: '',
    category: '',
    description: '',
    duration: '30',
    price: '0',
    isActive: true,
  })

  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    description: '',
    duration: '30',
    price: '0',
    isActive: true,
  })

  const loadData = async ({ silent = false } = {}) => {
    if (!user?.id) return

    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const ownerBusinesses = await getBusinessesByOwner(user.id)
      setBusinesses(ownerBusinesses || [])
      const businessIds = (ownerBusinesses || []).map((b) => b.id)

      if (!businessIds.length) {
        setServices([])
        setAppointments([])
        return
      }

      const [serviceRows, appointmentRows] = await Promise.all([
        Promise.all(businessIds.map((businessId) => getServices(businessId, { includeInactive: true }))),
        Promise.all(businessIds.map((businessId) => getBusinessAppointments(businessId))),
      ])

      setServices(serviceRows.flat())
      setAppointments(appointmentRows.flat())
    } catch (error) {
      console.error('[Services] Failed to load data:', error)
      toast.error('Failed to load services')
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  const serviceMetrics = useMemo(() => {
    const map = new Map()

    for (const service of services) {
      map.set(service.id, {
        bookings: 0,
        completed: 0,
        revenue: 0,
        upcoming: 0,
      })
    }

    const todayIso = new Date().toISOString().split('T')[0]

    for (const appointment of appointments) {
      const serviceId = appointment?.service_id
      if (!serviceId || !map.has(serviceId)) continue

      const row = map.get(serviceId)
      row.bookings += 1

      if (appointment.status === 'completed') {
        row.completed += 1
        row.revenue += Number(appointment?.service?.price || 0)
      }

      if (appointment.appointment_date >= todayIso && ['pending', 'confirmed', 'in-progress'].includes(appointment.status)) {
        row.upcoming += 1
      }
    }

    return map
  }, [services, appointments])

  const normalizedServices = useMemo(() => {
    return services.map((service) => {
      const metrics = serviceMetrics.get(service.id) || { bookings: 0, completed: 0, revenue: 0, upcoming: 0 }
      return {
        ...service,
        status: service.is_active ? 'active' : 'inactive',
        bookings: metrics.bookings,
        completed: metrics.completed,
        revenue: metrics.revenue,
        upcoming: metrics.upcoming,
      }
    })
  }, [services, serviceMetrics])

  const filteredServices = useMemo(() => {
    return normalizedServices.filter((service) => {
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch = !q
        || String(service.name || '').toLowerCase().includes(q)
        || String(service.description || '').toLowerCase().includes(q)
        || String(service.category || '').toLowerCase().includes(q)
      const matchesCategory = filterCategory === 'all' || service.category === filterCategory
      const matchesStatus = filterStatus === 'all' || service.status === filterStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [normalizedServices, searchTerm, filterCategory, filterStatus])

  const categories = useMemo(() => {
    return [...new Set(normalizedServices.map((s) => s.category).filter(Boolean))]
  }, [normalizedServices])

  const serviceStats = useMemo(() => {
    const total = normalizedServices.length
    const active = normalizedServices.filter((s) => s.status === 'active').length
    const totalBookings = normalizedServices.reduce((sum, s) => sum + s.bookings, 0)
    const totalRevenue = normalizedServices.reduce((sum, s) => sum + Number(s.revenue || 0), 0)
    return { total, active, totalBookings, totalRevenue }
  }, [normalizedServices])

  const openCreateModal = () => {
    if (!businesses.length) {
      toast.error('No business profile found for your account')
      return
    }

    setCreateForm({
      businessId: businesses[0]?.id || '',
      name: '',
      category: '',
      description: '',
      duration: '30',
      price: '0',
      isActive: true,
    })
    setIsCreateModalOpen(true)
  }

  const handleCreateService = async (event) => {
    event.preventDefault()

    const name = createForm.name.trim()
    if (!createForm.businessId) {
      toast.error('Please select a business')
      return
    }
    if (!name) {
      toast.error('Service name is required')
      return
    }

    try {
      setSaving(true)
      const created = await createService({
        business_id: createForm.businessId,
        name,
        category: createForm.category.trim() || null,
        description: createForm.description.trim() || null,
        duration: Number(createForm.duration) || 0,
        price: Number(createForm.price) || 0,
        is_active: Boolean(createForm.isActive),
      })

      setServices((prev) => [created, ...prev])
      setIsCreateModalOpen(false)
      toast.success('Service created')
      loadData({ silent: true })
    } catch (error) {
      console.error('[Services] Failed to create service:', error)
      toast.error(error?.message || 'Failed to create service')
    } finally {
      setSaving(false)
    }
  }

  const openEditModal = (service) => {
    setSelectedService(service)
    setEditForm({
      name: service.name || '',
      category: service.category || '',
      description: service.description || '',
      duration: String(service.duration || 0),
      price: String(service.price || 0),
      isActive: Boolean(service.is_active),
    })
    setIsEditModalOpen(true)
  }

  const handleEditService = async (event) => {
    event.preventDefault()
    if (!selectedService?.id) return

    const name = editForm.name.trim()
    if (!name) {
      toast.error('Service name is required')
      return
    }

    try {
      setSaving(true)
      const updated = await updateService(selectedService.id, {
        name,
        category: editForm.category.trim() || null,
        description: editForm.description.trim() || null,
        duration: Number(editForm.duration) || 0,
        price: Number(editForm.price) || 0,
        is_active: Boolean(editForm.isActive),
      })

      setServices((prev) => prev.map((service) => (service.id === selectedService.id ? updated : service)))
      setIsEditModalOpen(false)
      setSelectedService(null)
      toast.success('Service updated')
      loadData({ silent: true })
    } catch (error) {
      console.error('[Services] Failed to update service:', error)
      toast.error(error?.message || 'Failed to update service')
    } finally {
      setSaving(false)
    }
  }

  const handleCloneService = async (service) => {
    try {
      const cloneName = `${service.name} (Copy)`
      const cloned = await createService({
        business_id: service.business_id,
        name: cloneName,
        category: service.category || null,
        description: service.description || null,
        duration: Number(service.duration) || 0,
        price: Number(service.price) || 0,
        is_active: Boolean(service.is_active),
      })
      setServices((prev) => [cloned, ...prev])
      toast.success('Service cloned')
      loadData({ silent: true })
    } catch (error) {
      console.error('[Services] Failed to clone service:', error)
      toast.error(error?.message || 'Failed to clone service')
    }
  }

  const handleToggleService = async (service) => {
    try {
      setTogglingServiceId(service.id)
      const updated = await updateService(service.id, { is_active: !service.is_active })
      setServices((prev) => prev.map((row) => (row.id === service.id ? updated : row)))
      toast.success(updated.is_active ? 'Service activated' : 'Service deactivated')
      loadData({ silent: true })
    } catch (error) {
      console.error('[Services] Failed to toggle service:', error)
      toast.error(error?.message || 'Failed to update service status')
    } finally {
      setTogglingServiceId(null)
    }
  }

  const openStatsModal = (service) => {
    setSelectedService(service)
    setIsStatsModalOpen(true)
  }

  const handleExportServices = () => {
    const rows = filteredServices.map((service) => ({
      name: service.name || '',
      category: service.category || '',
      status: service.status,
      duration: Number(service.duration || 0),
      price: Number(service.price || 0),
      bookings: service.bookings,
      completed: service.completed,
      upcoming: service.upcoming,
      revenue: Number(service.revenue || 0),
    }))

    if (!rows.length) {
      toast.error('No services to export')
      return
    }

    const headers = Object.keys(rows[0])
    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => {
        const value = String(row[header] ?? '').replace(/"/g, '""')
        return `"${value}"`
      }).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.setAttribute('download', `services-export-${Date.now()}.csv`)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    toast.success('Services exported')
  }

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Services Management</h1>
          <p className="text-secondary-600">Manage your service catalog, pricing, and availability</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportServices}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{serviceStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-2xl font-bold">{serviceStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{serviceStats.totalBookings}</p>
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
                <p className="text-2xl font-bold">KSh {serviceStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center flex-wrap">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
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

            <div className="flex gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                Grid
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                List
              </Button>
              <Button variant="outline" size="sm" onClick={() => loadData({ silent: true })}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
        {filteredServices.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <Package className="h-8 w-8 text-secondary-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-secondary-900">No services found</h3>
              <p className="text-secondary-600 mt-1">Adjust filters or add a new service.</p>
            </CardContent>
          </Card>
        )}

        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.category || 'Uncategorized'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${service.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {service.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{service.description || 'No description provided.'}</p>

                <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded p-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-green-600">KSh {Number(service.price || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Price</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600">{Number(service.duration || 0)}m</p>
                    <p className="text-xs text-gray-600">Duration</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{service.bookings}</p>
                    <p className="text-xs text-gray-600">Bookings</p>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Upcoming: {service.upcoming}</span>
                  </div>
                  <div>Completed: {service.completed}</div>
                  <div className="text-green-700">Revenue: KSh {Number(service.revenue || 0).toLocaleString()}</div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditModal(service)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleCloneService(service)}>
                    <Copy className="h-3 w-3 mr-1" />
                    Clone
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openStatsModal(service)}>
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Stats
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleToggleService(service)}
                  disabled={togglingServiceId === service.id}
                >
                  {service.is_active ? <ToggleRight className="h-4 w-4 mr-2" /> : <ToggleLeft className="h-4 w-4 mr-2" />}
                  {togglingServiceId === service.id
                    ? 'Updating...'
                    : service.is_active
                      ? 'Deactivate Service'
                      : 'Activate Service'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add Service" size="lg">
        <form onSubmit={handleCreateService} className="space-y-4">
          {businesses.length > 1 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700">Business</label>
              <select
                value={createForm.businessId}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, businessId: e.target.value }))}
                className="flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>{business.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={createForm.name} onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <Input label="Category" value={createForm.category} onChange={(e) => setCreateForm((prev) => ({ ...prev, category: e.target.value }))} />
          </div>

          <Input
            label="Description"
            value={createForm.description}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Duration (minutes)" type="number" min="0" value={createForm.duration} onChange={(e) => setCreateForm((prev) => ({ ...prev, duration: e.target.value }))} />
            <Input label="Price (KSh)" type="number" min="0" step="0.01" value={createForm.price} onChange={(e) => setCreateForm((prev) => ({ ...prev, price: e.target.value }))} />
          </div>

          <label className="flex items-center gap-2 text-sm text-secondary-700">
            <input
              type="checkbox"
              checked={createForm.isActive}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            Set as active service
          </label>

          <ModalFooter className="px-0 pb-0 border-t-0">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Service'}</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Service" size="lg">
        <form onSubmit={handleEditService} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={editForm.name} onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <Input label="Category" value={editForm.category} onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))} />
          </div>

          <Input label="Description" value={editForm.description} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Duration (minutes)" type="number" min="0" value={editForm.duration} onChange={(e) => setEditForm((prev) => ({ ...prev, duration: e.target.value }))} />
            <Input label="Price (KSh)" type="number" min="0" step="0.01" value={editForm.price} onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))} />
          </div>

          <label className="flex items-center gap-2 text-sm text-secondary-700">
            <input
              type="checkbox"
              checked={editForm.isActive}
              onChange={(e) => setEditForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            Service is active
          </label>

          <ModalFooter className="px-0 pb-0 border-t-0">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => {
          setIsStatsModalOpen(false)
          setSelectedService(null)
        }}
        title={selectedService ? `${selectedService.name} Stats` : 'Service Stats'}
        size="md"
      >
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Total Bookings</span><span className="font-semibold">{selectedService?.bookings || 0}</span></div>
          <div className="flex justify-between"><span>Completed</span><span className="font-semibold">{selectedService?.completed || 0}</span></div>
          <div className="flex justify-between"><span>Upcoming</span><span className="font-semibold">{selectedService?.upcoming || 0}</span></div>
          <div className="flex justify-between"><span>Revenue</span><span className="font-semibold text-green-700">KSh {Number(selectedService?.revenue || 0).toLocaleString()}</span></div>
        </div>
      </Modal>
    </div>
  )
}
