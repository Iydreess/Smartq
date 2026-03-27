'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Modal } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import { createNotification, getBusinessesByOwner, getBusinessAppointments } from '@/lib/supabase/queries'
import { 
  User, Mail, Phone, Calendar,
  Star, MessageSquare,
  Search, Download, UserPlus, Send,
  Eye, Heart, TrendingUp, RefreshCw,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Customers Management Dashboard
 * Comprehensive customer database and communication tools for businesses
 */
export default function CustomersPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [campaignSending, setCampaignSending] = useState(false)

  const getCustomerDetails = (appointment) => {
    const customer = appointment?.customer
    const notesText = String(appointment?.notes || '')
    const nameMatch = notesText.match(/Name:\s*([^,]+)/i)
    const emailMatch = notesText.match(/Email:\s*([^,]+)/i)
    const phoneMatch = notesText.match(/Phone:\s*([^,]+)/i)

    return {
      id: customer?.id || appointment?.customer_id || emailMatch?.[1]?.trim() || appointment.id,
      name: customer?.full_name || nameMatch?.[1]?.trim() || customer?.email || 'Unknown Customer',
      email: customer?.email || emailMatch?.[1]?.trim() || 'N/A',
      phone: customer?.phone || phoneMatch?.[1]?.trim() || 'N/A',
      createdAt: customer?.created_at || appointment?.created_at,
    }
  }

  const loadCustomers = async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const businesses = await getBusinessesByOwner(user.id)
      const rows = await Promise.all((businesses || []).map((business) => getBusinessAppointments(business.id)))
      const appointments = rows.flat()

      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const customerMap = new Map()

      for (const appointment of appointments) {
        const c = getCustomerDetails(appointment)
        const key = c.id
        const existing = customerMap.get(key) || {
          id: key,
          name: c.name,
          email: c.email,
          phone: c.phone,
          joinDate: c.createdAt,
          lastVisit: appointment.appointment_date,
          totalBookings: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          upcomingAppointments: 0,
          services: new Set(),
          serviceFrequency: {},
          appointments: [],
          status: 'active',
          tags: new Set(),
        }

        existing.totalBookings += 1
        existing.totalSpent += Number(appointment?.service?.price || 0)
        existing.loyaltyPoints += Math.max(10, Math.round(Number(appointment?.service?.price || 0) / 100))
        if (appointment?.service?.name) {
          existing.services.add(appointment.service.name)
          existing.serviceFrequency[appointment.service.name] = (existing.serviceFrequency[appointment.service.name] || 0) + 1
        }
        if (appointment.appointment_date && (!existing.lastVisit || appointment.appointment_date > existing.lastVisit)) {
          existing.lastVisit = appointment.appointment_date
        }

        existing.appointments.push({
          id: appointment.id,
          date: appointment.appointment_date,
          status: appointment.status,
          service: appointment?.service?.name || 'Service',
          price: Number(appointment?.service?.price || 0),
          startTime: appointment?.start_time,
          notes: appointment?.customer_notes || appointment?.notes || '',
        })

        const appointmentDate = appointment.appointment_date ? new Date(appointment.appointment_date) : null
        if (appointmentDate && appointmentDate >= todayStart && ['pending', 'confirmed', 'in-progress'].includes(appointment.status)) {
          existing.upcomingAppointments += 1
        }

        if (existing.totalSpent >= 100000) existing.tags.add('VIP')
        if (existing.totalBookings >= 5) existing.tags.add('Regular')

        customerMap.set(key, existing)
      }

      const normalized = Array.from(customerMap.values()).map((item) => {
        const services = Array.from(item.services)
        const topService = Object.entries(item.serviceFrequency)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || services[0] || null

        const lastVisitDate = item.lastVisit ? new Date(item.lastVisit) : null
        const sixtyDaysAgo = new Date()
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

        const computedStatus = !lastVisitDate || lastVisitDate < sixtyDaysAgo ? 'inactive' : 'active'

        return {
          ...item,
          status: computedStatus,
          topService,
          services: services.slice(0, 3),
          appointments: item.appointments
            .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
            .slice(0, 5),
          tags: Array.from(item.tags),
        }
      })

      setCustomers(normalized)
    } catch (error) {
      console.error('[Customers] Failed to load:', error)
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [user?.id])

  const handleOpenProfile = (customer) => {
    setSelectedCustomer(customer)
    setProfileModalOpen(true)
  }

  const handleSendCampaign = async () => {
    const recipients = filteredCustomers.filter((customer) => customer.id)
    if (!recipients.length) {
      toast.error('No customers to notify in the current filter')
      return
    }

    try {
      setCampaignSending(true)
      const results = await Promise.allSettled(
        recipients.map((customer) =>
          createNotification({
            user_id: customer.id,
            type: 'promotional',
            title: 'Special Offer For You',
            message: 'Thanks for being with us. Check your profile for our latest customer offer.',
            data: { source: 'business_customers_campaign' },
          })
        )
      )

      const delivered = results.filter((r) => r.status === 'fulfilled').length
      const failed = results.length - delivered

      if (delivered > 0) {
        toast.success(`Campaign sent to ${delivered} customer(s)`)
      }
      if (failed > 0) {
        toast(`Failed for ${failed} customer(s)`) 
      }
    } catch (error) {
      console.error('[Customers] Campaign failed:', error)
      toast.error(error?.message || 'Failed to send campaign')
    } finally {
      setCampaignSending(false)
    }
  }

  const handleExportCustomers = () => {
    if (!filteredCustomers.length) {
      toast.error('No customers to export')
      return
    }

    const headers = ['Name', 'Email', 'Phone', 'Status', 'Total Bookings', 'Total Spent', 'Loyalty Points', 'Upcoming Appointments', 'Top Service', 'Last Visit']
    const rows = filteredCustomers.map((customer) => [
      customer.name,
      customer.email,
      customer.phone,
      customer.status,
      customer.totalBookings,
      customer.totalSpent,
      customer.loyaltyPoints,
      customer.upcomingAppointments,
      customer.topService || '',
      customer.lastVisit || '',
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Customer export downloaded')
  }

  const handleBookForCustomer = (customer) => {
    const serviceName = customer.topService || customer.services?.[0]
    const params = new URLSearchParams()
    if (serviceName) params.set('serviceName', serviceName)
    router.push(`/booking?${params.toString()}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesFilter = filterType === 'all' || customer.status === filterType
    return matchesSearch && matchesFilter
  })

  const customerStats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    new: customers.filter(c => {
      const joinDate = c.joinDate ? new Date(c.joinDate) : new Date(0)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return joinDate >= thirtyDaysAgo
    }).length,
    totalRevenue: customers.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0)
  }), [customers])

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Customers</h1>
          <p className="text-secondary-600">Manage your customer database and relationships</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={loadCustomers}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleSendCampaign}
            disabled={campaignSending}
          >
            <Send className="h-4 w-4" />
            {campaignSending ? 'Sending...' : 'Send Campaign'}
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard/appointments')}
          >
            <UserPlus className="h-4 w-4" />
            View Appointments
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportCustomers}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{customerStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold">{customerStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">New This Month</p>
                <p className="text-2xl font-bold">{customerStats.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold text-lg">$</span>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">KSh {customerStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Customers</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Customer Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenProfile(customer)}
                    title="View customer details"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{customer.phone}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-600">Bookings</p>
                    <p className="font-semibold">{customer.totalBookings}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-600">Total Spent</p>
                    <p className="font-semibold text-green-600">KSh {Number(customer.totalSpent || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-600">Loyalty Points</p>
                    <p className="font-semibold text-purple-600">{customer.loyaltyPoints}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-600">Upcoming</p>
                    <p className="font-semibold">{customer.upcomingAppointments}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {customer.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {!customer.tags.length && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Standard</span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleOpenProfile(customer)}
                  >
                    <User className="h-3 w-3 mr-1" />
                    Profile
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(`mailto:${customer.email}`)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleBookForCustomer(customer)}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Book
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCustomers.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-6 text-sm text-secondary-500">
              No customers found. Customers appear here after real bookings are made.
            </CardContent>
          </Card>
        )}
      </div>

      <Modal
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false)
          setSelectedCustomer(null)
        }}
        title={selectedCustomer ? `${selectedCustomer.name} Profile` : 'Customer Profile'}
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-600">Email</p>
                <p className="font-medium text-secondary-900 break-all">{selectedCustomer.email}</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-600">Phone</p>
                <p className="font-medium text-secondary-900">{selectedCustomer.phone}</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-600">Top Service</p>
                <p className="font-medium text-secondary-900">{selectedCustomer.topService || 'N/A'}</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-600">Last Visit</p>
                <p className="font-medium text-secondary-900">{selectedCustomer.lastVisit || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Appointments
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(selectedCustomer.appointments || []).map((appointment) => (
                  <div key={appointment.id} className="p-3 border border-secondary-200 rounded-lg">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-secondary-900">{appointment.service}</p>
                        <p className="text-sm text-secondary-600">{appointment.date || 'Date TBD'} · {appointment.startTime || 'Time TBD'}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(appointment.status || 'active')}`}>
                        {appointment.status || 'unknown'}
                      </span>
                    </div>
                  </div>
                ))}
                {!(selectedCustomer.appointments || []).length && (
                  <p className="text-sm text-secondary-500">No appointment history available.</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => window.open(`mailto:${selectedCustomer.email}`)}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" onClick={() => window.open(`tel:${selectedCustomer.phone}`)}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button onClick={() => handleBookForCustomer(selectedCustomer)}>
                <Calendar className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}