'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Users, User, Calendar, Clock, Star, Badge,
  Phone, Mail, MapPin, Edit, Trash2, Plus,
  Search, Filter, Download, UserPlus, Settings,
  Award, TrendingUp, CheckCircle, AlertCircle,
  BarChart3, DollarSign, Target, Activity
} from 'lucide-react'

/**
 * Staff Management Dashboard
 * Comprehensive staff scheduling, performance tracking, and management for businesses
 */
export default function StaffPage() {
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'list', 'schedule'
  const [filterDepartment, setFilterDepartment] = useState('all')

  const staff = [
    {
      id: 1,
      name: 'James Wilson',
      email: 'james.wilson@smartq.com',
      phone: '+1 (555) 101-0001',
      role: 'Senior Consultant',
      department: 'Business Consulting',
      employeeId: 'EMP001',
      joinDate: '2023-01-15',
      status: 'active',
      availability: 'available',
      rating: 4.9,
      totalClients: 45,
      appointmentsToday: 6,
      weeklyHours: 40,
      overtimeHours: 5,
      totalRevenue: '$15,600',
      skills: ['Strategy Planning', 'Business Analysis', 'Financial Consulting'],
      certifications: ['MBA', 'PMP Certified'],
      schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 3:00 PM'
      },
      performance: {
        clientSatisfaction: 4.9,
        appointmentCompletion: 98,
        revenue: 15600,
        newClients: 12
      }
    },
    {
      id: 2,
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@smartq.com',
      phone: '+1 (555) 202-0002',
      role: 'Cardiologist',
      department: 'Healthcare',
      employeeId: 'EMP002',
      joinDate: '2023-03-10',
      status: 'active',
      availability: 'busy',
      rating: 5.0,
      totalClients: 120,
      appointmentsToday: 8,
      weeklyHours: 45,
      overtimeHours: 8,
      totalRevenue: '$28,400',
      skills: ['Cardiology', 'Emergency Medicine', 'Patient Care'],
      certifications: ['MD', 'Board Certified Cardiologist', 'ACLS'],
      schedule: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 4:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 4:00 PM'
      },
      performance: {
        clientSatisfaction: 5.0,
        appointmentCompletion: 99,
        revenue: 28400,
        newClients: 25
      }
    },
    {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex.johnson@smartq.com',
      phone: '+1 (555) 303-0003',
      role: 'Personal Trainer',
      department: 'Sports & Fitness',
      employeeId: 'EMP003',
      joinDate: '2023-06-01',
      status: 'active',
      availability: 'available',
      rating: 4.8,
      totalClients: 65,
      appointmentsToday: 10,
      weeklyHours: 38,
      overtimeHours: 2,
      totalRevenue: '$8,800',
      skills: ['Strength Training', 'Cardio', 'Nutrition Planning'],
      certifications: ['NASM-CPT', 'Nutrition Specialist'],
      schedule: {
        monday: '6:00 AM - 2:00 PM',
        tuesday: '6:00 AM - 2:00 PM',
        wednesday: '2:00 PM - 10:00 PM',
        thursday: '6:00 AM - 2:00 PM',
        friday: '2:00 PM - 10:00 PM',
        saturday: '8:00 AM - 4:00 PM'
      },
      performance: {
        clientSatisfaction: 4.8,
        appointmentCompletion: 96,
        revenue: 8800,
        newClients: 18
      }
    },
    {
      id: 4,
      name: 'Robert Chang',
      email: 'robert.chang@smartq.com',
      phone: '+1 (555) 404-0004',
      role: 'Tax Accountant',
      department: 'Professional Services',
      employeeId: 'EMP004',
      joinDate: '2022-09-15',
      status: 'active',
      availability: 'off-duty',
      rating: 4.6,
      totalClients: 35,
      appointmentsToday: 0,
      weeklyHours: 32,
      overtimeHours: 0,
      totalRevenue: '$5,250',
      skills: ['Tax Preparation', 'Financial Planning', 'Audit Support'],
      certifications: ['CPA', 'EA'],
      schedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: 'Off',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 1:00 PM'
      },
      performance: {
        clientSatisfaction: 4.6,
        appointmentCompletion: 94,
        revenue: 5250,
        newClients: 8
      }
    }
  ]

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200'
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'off-duty': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'on-break': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredStaff = staff.filter(member => 
    filterDepartment === 'all' || member.department === filterDepartment
  )

  const staffStats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    available: staff.filter(s => s.availability === 'available').length,
    totalRevenue: staff.reduce((sum, s) => sum + s.performance.revenue, 0)
  }

  const departments = [...new Set(staff.map(s => s.department))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Staff Management</h1>
          <p className="text-secondary-600">Manage your team, schedules, and performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Staff Stats */}
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
                <p className="text-2xl font-bold">${staffStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select 
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button 
                variant={viewMode === 'schedule' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('schedule')}
              >
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStaff.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Staff Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
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

                {/* Contact & Performance */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Badge className="h-3 w-3" />
                      <span>{member.employeeId}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{member.rating}</span>
                      <span className="text-sm text-gray-600">rating</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Clients:</span>
                      <span className="font-semibold ml-1">{member.totalClients}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-semibold ml-1 text-green-600">{member.totalRevenue}</span>
                    </div>
                  </div>
                </div>

                {/* Today Stats */}
                <div className="grid grid-cols-3 gap-3 py-3 border-t border-b">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{member.appointmentsToday}</p>
                    <p className="text-xs text-gray-600">Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{member.weeklyHours}h</p>
                    <p className="text-xs text-gray-600">This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">{member.overtimeHours}h</p>
                    <p className="text-xs text-gray-600">Overtime</p>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Performance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span>Add New Staff</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Manage Schedules</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Award className="h-5 w-5" />
              <span>Performance Review</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Settings className="h-5 w-5" />
              <span>Staff Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}