'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import { getBusinessesByOwner, getBusinessAppointments, getStaff, updateAppointment, cancelAppointment, createNotification } from '@/lib/supabase/queries'
import { 
  Calendar, Clock, User, Phone, Mail,
  CheckCircle, XCircle, AlertCircle,
  Search, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Appointments Management Dashboard  
 * Comprehensive appointment scheduling and management for businesses
 */
export default function AppointmentsPage() {
  const { user, loading: userLoading } = useUser()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [staffByBusiness, setStaffByBusiness] = useState({})
  const [draftStatusById, setDraftStatusById] = useState({})
  const [draftStaffById, setDraftStaffById] = useState({})
  const [savingAppointmentId, setSavingAppointmentId] = useState(null)

  const getCustomerDetails = (appointment) => {
    const customer = appointment?.customer
    const notesText = String(appointment?.notes || '')
    const nameMatch = notesText.match(/Name:\s*([^,]+)/i)
    const emailMatch = notesText.match(/Email:\s*([^,]+)/i)
    const phoneMatch = notesText.match(/Phone:\s*([^,]+)/i)

    return {
      name: customer?.full_name || customer?.name || nameMatch?.[1]?.trim() || customer?.email || 'Unknown Customer',
      email: customer?.email || emailMatch?.[1]?.trim() || 'N/A',
      phone: customer?.phone || phoneMatch?.[1]?.trim() || 'N/A',
    }
  }

  const formatTime = (timeValue) => {
    if (!timeValue) return 'TBD'
    const [hourStr, minuteStr] = String(timeValue).split(':')
    const hour = Number(hourStr)
    const minute = Number(minuteStr)
    if (Number.isNaN(hour) || Number.isNaN(minute)) return String(timeValue)
    const period = hour >= 12 ? 'PM' : 'AM'
    const normalizedHour = hour % 12 || 12
    return `${normalizedHour}:${String(minute).padStart(2, '0')} ${period}`
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Date TBD'
    return new Date(dateValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const normalizeAppointments = (rawAppointments) => {
    return (rawAppointments || []).map((appointment) => {
      const customer = getCustomerDetails(appointment)
      const price = Number(appointment?.service?.price || 0)
      const duration = Number(appointment?.service?.duration || 0)
      return {
        ...appointment,
        staffId: appointment?.staff_id || appointment?.staff?.id || '',
        servicePriceValue: price,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        service: appointment?.service?.name || 'Service',
        category: appointment?.service?.category || 'General',
        staff: appointment?.staff?.name || 'Unassigned',
        date: formatDate(appointment?.appointment_date),
        time: formatTime(appointment?.start_time),
        duration: duration ? `${duration} min` : 'TBD',
        price: `KSh ${price.toLocaleString()}`,
      }
    })
  }

  const loadAppointments = async ({ silent = false } = {}) => {
    if (!user?.id) return
    try {
      if (!silent) setLoading(true)
      const businesses = await getBusinessesByOwner(user.id)
      const businessIds = (businesses || []).map((business) => business.id)

      const [appointmentRows, staffRows] = await Promise.all([
        Promise.all(businessIds.map((businessId) => getBusinessAppointments(businessId))),
        Promise.all(businessIds.map((businessId) => getStaff(businessId, { includeInactive: false }))),
      ])

      const staffMap = businessIds.reduce((acc, businessId, index) => {
        acc[businessId] = staffRows[index] || []
        return acc
      }, {})

      const normalized = normalizeAppointments(appointmentRows.flat())

      setStaffByBusiness(staffMap)
      setAppointments(normalized)
      setDraftStatusById(
        normalized.reduce((acc, item) => {
          acc[item.id] = item.status
          return acc
        }, {})
      )
      setDraftStaffById(
        normalized.reduce((acc, item) => {
          acc[item.id] = item.staffId || ''
          return acc
        }, {})
      )
    } catch (error) {
      console.error('[Appointments] Failed to load:', error)
      toast.error('Failed to load appointments')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [user?.id])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'in-progress': return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in-progress': return 'In Session'
      default: return status?.charAt(0).toUpperCase() + status?.slice(1)
    }
  }

  const getErrorMessage = (error, fallbackMessage) => {
    if (!error) return fallbackMessage
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    return fallbackMessage
  }

  const notifyCustomerStatusChange = async (appointment, nextStatus) => {
    if (!appointment?.customer_id) return

    const serviceName = appointment?.service || 'your appointment'
    const staffName = (draftStaffById[appointment.id] && (staffByBusiness[appointment.business_id] || []).find((item) => item.id === draftStaffById[appointment.id])?.name)
      || appointment?.staff
      || 'our team'
    const dateText = appointment?.date || 'scheduled date'
    const timeText = appointment?.time || 'scheduled time'
    const statusLabel = getStatusLabel(nextStatus)

    let message = `${serviceName} is now ${statusLabel}.`

    if (nextStatus === 'confirmed') {
      message = `${serviceName} has been confirmed with ${staffName} for ${dateText} at ${timeText}.`
    }

    if (nextStatus === 'in-progress') {
      message = `${serviceName} is now in session with ${staffName}. Please be ready.`
    }

    if (nextStatus === 'completed') {
      message = `${serviceName} has been marked as completed. Thank you for visiting.`
    }

    if (nextStatus === 'cancelled') {
      message = `${serviceName} has been cancelled. Please contact support or rebook.`
    }

    await createNotification({
      user_id: appointment.customer_id,
      type: `appointment_${nextStatus.replace('-', '_')}`,
      title: `Appointment ${statusLabel}`,
      message,
      data: {
        appointmentId: appointment.id,
        status: nextStatus,
        service: serviceName,
        date: dateText,
        time: timeText,
        staff: staffName,
      },
    })
  }

  const notifyCustomerStatusChangeSafe = async (appointment, nextStatus) => {
    try {
      await notifyCustomerStatusChange(appointment, nextStatus)
      return true
    } catch (error) {
      console.warn('[Appointments] Customer notification failed:', error)
      return false
    }
  }

  const handleSaveAppointment = async (appointment) => {
    const selectedStatus = draftStatusById[appointment.id] || appointment.status
    const selectedStaff = draftStaffById[appointment.id] || ''
    const normalizedSelectedStaff = selectedStaff || null
    const currentStaff = appointment.staffId || null

    const hasStatusChange = selectedStatus !== appointment.status
    const hasStaffChange = normalizedSelectedStaff !== currentStaff

    if (!hasStatusChange && !hasStaffChange) {
      toast('No changes to save')
      return
    }

    try {
      setSavingAppointmentId(appointment.id)

      if (selectedStatus === 'cancelled') {
        await cancelAppointment(appointment.id, 'Cancelled by business staff')
      } else {
        const updates = {
          status: selectedStatus,
          staff_id: normalizedSelectedStaff,
        }
        await updateAppointment(appointment.id, updates)
      }

      let notificationDelivered = true
      if (hasStatusChange) {
        notificationDelivered = await notifyCustomerStatusChangeSafe(appointment, selectedStatus)
      }

      toast.success('Appointment updated')
      if (hasStatusChange && !notificationDelivered) {
        toast('Appointment updated, but customer notification was not delivered.')
      }
      await loadAppointments({ silent: true })
    } catch (error) {
      console.error('[Appointments] Update failed:', error)
      toast.error(getErrorMessage(error, 'Failed to update appointment'))
    } finally {
      setSavingAppointmentId(null)
    }
  }

  const handleQuickStatusUpdate = async (appointment, nextStatus) => {
    try {
      setSavingAppointmentId(appointment.id)

      const selectedStaff = draftStaffById[appointment.id] || appointment.staffId || ''
      const normalizedSelectedStaff = selectedStaff || null

      if (nextStatus === 'cancelled') {
        await cancelAppointment(appointment.id, 'Cancelled by business staff')
      } else {
        await updateAppointment(appointment.id, {
          status: nextStatus,
          staff_id: normalizedSelectedStaff,
        })
      }

      const notificationDelivered = await notifyCustomerStatusChangeSafe(appointment, nextStatus)

      setDraftStatusById((prev) => ({ ...prev, [appointment.id]: nextStatus }))
      toast.success(`Appointment marked as ${getStatusLabel(nextStatus)}`)
      if (!notificationDelivered) {
        toast('Status updated, but customer notification was not delivered.')
      }
      await loadAppointments({ silent: true })
    } catch (error) {
      console.error('[Appointments] Quick update failed:', error)
      toast.error(getErrorMessage(error, 'Failed to update appointment'))
    } finally {
      setSavingAppointmentId(null)
    }
  }

  const getQuickActions = (status) => {
    switch (status) {
      case 'pending':
        return [
          { key: 'confirmed', label: 'Confirm' },
          { key: 'cancelled', label: 'Cancel' },
        ]
      case 'confirmed':
        return [
          { key: 'in-progress', label: 'Start Session' },
          { key: 'completed', label: 'Complete' },
          { key: 'cancelled', label: 'Cancel' },
        ]
      case 'in-progress':
        return [
          { key: 'completed', label: 'Complete' },
          { key: 'cancelled', label: 'Cancel' },
        ]
      default:
        return []
    }
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch = !q ||
        apt.customerName.toLowerCase().includes(q) ||
        apt.customerEmail.toLowerCase().includes(q) ||
        apt.customerPhone.toLowerCase().includes(q) ||
        apt.service.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [appointments, filterStatus, searchTerm])

  const todayIso = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter((apt) => apt.appointment_date === todayIso)

  const todayStats = {
    total: todayAppointments.length,
    confirmed: todayAppointments.filter((apt) => apt.status === 'confirmed').length,
    pending: todayAppointments.filter((apt) => apt.status === 'pending').length,
    inSession: todayAppointments.filter((apt) => apt.status === 'in-progress').length,
    revenue: todayAppointments
      .filter((apt) => ['confirmed', 'completed'].includes(apt.status))
      .reduce((sum, apt) => sum + Number(apt.servicePriceValue || 0), 0),
  }

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Appointments</h1>
          <p className="text-secondary-600">Manage all your business appointments and scheduling</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={loadAppointments}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Today</p>
                <p className="text-2xl font-bold">{todayStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{todayStats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{todayStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">In Session</p>
                <p className="text-2xl font-bold">{todayStats.inSession}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold text-lg">KSh</span>
              <div>
                <p className="text-sm text-gray-600">Today Revenue</p>
                <p className="text-2xl font-bold">{todayStats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Session</option>
              </select>
            </div>
            <span className="text-sm text-secondary-600">{filteredAppointments.length} result(s)</span>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Customer Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">{appointment.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{appointment.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{appointment.customerEmail}</span>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{appointment.service}</p>
                      <p className="text-sm text-gray-600">{appointment.category}</p>
                      <p className="text-sm text-gray-600">Staff: {appointment.staff}</p>
                    </div>

                    {/* Time & Duration */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">Date: {appointment.date}</p>
                      <p className="text-sm text-gray-600">Duration: {appointment.duration}</p>
                      <p className="text-sm font-medium text-green-600">{appointment.price}</p>
                    </div>

                    {/* Status & Actions */}
                    <div className="space-y-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {getStatusLabel(appointment.status)}
                      </span>
                      <select
                        value={draftStatusById[appointment.id] || appointment.status}
                        onChange={(e) => setDraftStatusById((prev) => ({ ...prev, [appointment.id]: e.target.value }))}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Session</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <select
                        value={draftStaffById[appointment.id] || ''}
                        onChange={(e) => setDraftStaffById((prev) => ({ ...prev, [appointment.id]: e.target.value }))}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="">Unassigned</option>
                        {(staffByBusiness[appointment.business_id] || []).map((staffMember) => (
                          <option key={staffMember.id} value={staffMember.id}>{staffMember.name}</option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        className="w-full"
                        loading={savingAppointmentId === appointment.id}
                        onClick={() => handleSaveAppointment(appointment)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(`tel:${appointment.customerPhone}`)}
                        title="Call customer"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                {appointment.notes && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                    <strong>Notes:</strong> {appointment.notes}
                  </div>
                )}

                {getQuickActions(appointment.status).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {getQuickActions(appointment.status).map((action) => (
                      <Button
                        key={action.key}
                        size="sm"
                        variant={action.key === 'cancelled' ? 'outline' : 'secondary'}
                        disabled={savingAppointmentId === appointment.id}
                        loading={savingAppointmentId === appointment.id}
                        onClick={() => handleQuickStatusUpdate(appointment, action.key)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredAppointments.length === 0 && (
              <p className="text-sm text-secondary-500">No appointments found for the selected filters.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}