'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Calendar, Clock, User, MapPin, Phone, Mail, 
  Edit, Trash2, CheckCircle, XCircle, AlertCircle,
  Filter, Search, Plus, RefreshCw, Download,
  ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react'

/**
 * Appointments Management Dashboard  
 * Comprehensive appointment scheduling and management for businesses
 */
export default function AppointmentsPage() {
  const [currentView, setCurrentView] = useState('list') // 'list', 'calendar', 'timeline'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState('all')

  const appointments = [
    {
      id: 1,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '+254 712 345 678',
      service: 'Strategy Consulting',
      staff: 'James Wilson',
      date: '2025-10-01',
      time: '9:00 AM',
      duration: '90 min',
      status: 'confirmed',
      price: 'KSh 40,000',
      notes: 'First-time consultation about business expansion',
      category: 'Business Consulting'
    },
    {
      id: 2,
      customerName: 'Michael Chen',
      customerEmail: 'mchen@email.com', 
      customerPhone: '+254 723 456 789',
      service: 'Cardiology Consultation',
      staff: 'Dr. Emily Rodriguez',
      date: '2025-10-01',
      time: '10:30 AM',
      duration: '60 min',
      status: 'confirmed',
      price: 'KSh 29,400',
      notes: 'Follow-up appointment for hypertension',
      category: 'Healthcare'
    },
    {
      id: 3,
      customerName: 'Lisa Martinez',
      customerEmail: 'lisa.martinez@email.com',
      customerPhone: '+254 734 567 890',
      service: 'Personal Training',
      staff: 'Alex Johnson',
      date: '2025-10-01',
      time: '2:00 PM',
      duration: '60 min', 
      status: 'pending',
      price: 'KSh 10,700',
      notes: 'Strength training focus session',
      category: 'Sports & Fitness'
    },
    {
      id: 4,
      customerName: 'Robert Davis',
      customerEmail: 'rdavis@email.com',
      customerPhone: '+254 745 678 901',
      service: 'Tax Preparation',
      staff: 'Robert Chang',
      date: '2025-10-01',
      time: '3:30 PM',
      duration: '90 min',
      status: 'cancelled',
      price: 'KSh 20,000',
      notes: 'Annual tax filing - cancelled due to missing documents',
      category: 'Professional Services'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const filteredAppointments = appointments.filter(apt => 
    filterStatus === 'all' || apt.status === filterStatus
  )

  const todayStats = {
    total: appointments.filter(apt => apt.date === '2025-10-01').length,
    confirmed: appointments.filter(apt => apt.date === '2025-10-01' && apt.status === 'confirmed').length,
    pending: appointments.filter(apt => apt.date === '2025-10-01' && apt.status === 'pending').length,
    revenue: appointments
      .filter(apt => apt.date === '2025-10-01' && apt.status === 'confirmed')
      .reduce((sum, apt) => sum + parseInt(apt.price.replace('$', '')), 0)
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
            onClick={() => alert('Export appointments functionality coming soon!')}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => alert('New appointment form coming soon!')}
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <span className="text-green-600 font-bold text-lg">$</span>
              <div>
                <p className="text-sm text-gray-600">Today Revenue</p>
                <p className="text-2xl font-bold">${todayStats.revenue}</p>
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
              </select>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={currentView === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setCurrentView('list')}
              >
                List
              </Button>
              <Button 
                variant={currentView === 'calendar' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setCurrentView('calendar')}
              >
                Calendar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
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
                      <p className="text-sm text-gray-600">Duration: {appointment.duration}</p>
                      <p className="text-sm font-medium text-green-600">{appointment.price}</p>
                    </div>

                    {/* Status & Actions */}
                    <div className="space-y-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => alert(`Edit appointment for ${appointment.customerName}`)}
                          title="Edit appointment"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => alert(`Calling ${appointment.customerName}...`)}
                          title="Call customer"
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => alert('More options coming soon!')}
                          title="More options"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                {appointment.notes && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                    <strong>Notes:</strong> {appointment.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={() => alert('Schedule appointment functionality coming soon!')}
            >
              <Plus className="h-5 w-5" />
              <span>Schedule Appointment</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={() => alert('Calendar view coming soon!')}
            >
              <Calendar className="h-5 w-5" />
              <span>View Calendar</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={() => alert('Batch reschedule functionality coming soon!')}
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reschedule Batch</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={() => alert('Export report functionality coming soon!')}
            >
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}