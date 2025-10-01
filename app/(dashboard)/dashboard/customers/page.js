'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  User, Mail, Phone, MapPin, Calendar, Clock, 
  Star, MessageSquare, Edit, Trash2, Plus, 
  Search, Filter, Download, UserPlus, Send,
  Eye, History, Heart, Gift, Award, TrendingUp
} from 'lucide-react'

/**
 * Customers Management Dashboard
 * Comprehensive customer database and communication tools for businesses
 */
export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, Boston, MA 02101',
      joinDate: '2024-03-15',
      lastVisit: '2024-09-28',
      totalBookings: 15,
      totalSpent: '$1,250',
      preferredServices: ['Strategy Consulting', 'Business Planning'],
      staffPreference: 'James Wilson',
      loyaltyPoints: 125,
      rating: 4.8,
      status: 'active',
      notes: 'Prefers morning appointments. Regular client for business consulting.',
      tags: ['VIP', 'Regular'],
      upcomingAppointments: 2,
      category: 'Business'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'mchen@email.com',
      phone: '+1 (555) 987-6543', 
      address: '456 Oak Ave, Cambridge, MA 02139',
      joinDate: '2024-01-10',
      lastVisit: '2024-09-25',
      totalBookings: 8,
      totalSpent: '$1,760',
      preferredServices: ['Cardiology Consultation', 'Health Checkup'],
      staffPreference: 'Dr. Emily Rodriguez',
      loyaltyPoints: 88,
      rating: 5.0,
      status: 'active',
      notes: 'Has hypertension history. Needs regular monitoring.',
      tags: ['Health Priority'],
      upcomingAppointments: 1,
      category: 'Healthcare'
    },
    {
      id: 3,
      name: 'Lisa Martinez',
      email: 'lisa.martinez@email.com',
      phone: '+1 (555) 456-7890',
      address: '789 Pine St, Somerville, MA 02143',
      joinDate: '2024-06-20',
      lastVisit: '2024-09-30',
      totalBookings: 22,
      totalSpent: '$1,760',
      preferredServices: ['Personal Training', 'Yoga Classes'],
      staffPreference: 'Alex Johnson',
      loyaltyPoints: 220,
      rating: 4.9,
      status: 'active',
      notes: 'Fitness enthusiast. Prefers evening sessions.',
      tags: ['Fitness Lover', 'Regular'],
      upcomingAppointments: 3,
      category: 'Fitness'
    },
    {
      id: 4,
      name: 'Robert Davis',
      email: 'rdavis@email.com',
      phone: '+1 (555) 321-0987',
      address: '321 Elm St, Arlington, MA 02474',
      joinDate: '2023-11-05',
      lastVisit: '2024-08-15',
      totalBookings: 3,
      totalSpent: '$450',
      preferredServices: ['Tax Preparation'],
      staffPreference: 'Robert Chang',
      loyaltyPoints: 30,
      rating: 4.2,
      status: 'inactive',
      notes: 'Seasonal client - usually books during tax season.',
      tags: ['Seasonal'],
      upcomingAppointments: 0,
      category: 'Professional'
    }
  ]

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

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    new: customers.filter(c => {
      const joinDate = new Date(c.joinDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return joinDate >= thirtyDaysAgo
    }).length,
    totalRevenue: customers.reduce((sum, c) => sum + parseInt(c.totalSpent.replace('$', '').replace(',', '')), 0)
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
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Campaign
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Customer
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
                <p className="text-2xl font-bold">${customerStats.totalRevenue.toLocaleString()}</p>
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
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{customer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
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
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{customer.address}</span>
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
                    <p className="font-semibold text-green-600">{customer.totalSpent}</p>
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
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Book
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span>Add New Customer</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Send className="h-5 w-5" />
              <span>Send Newsletter</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Gift className="h-5 w-5" />
              <span>Loyalty Rewards</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}