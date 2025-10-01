'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Package, Plus, Search, Filter, Edit, Trash2, Eye,
  Clock, Users, DollarSign, Star, Tag, Settings,
  Upload, Download, Copy, BarChart3, TrendingUp,
  Calendar, MapPin, Phone, Mail, CheckCircle,
  AlertCircle, XCircle, MoreHorizontal, Toggle
} from 'lucide-react'

/**
 * Services Management Dashboard
 * Comprehensive service catalog, pricing, availability, and category management
 */
export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'list', 'categories'
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const services = [
    {
      id: 1,
      name: 'Strategy Consulting',
      category: 'Business Consulting',
      description: 'Comprehensive business strategy development and planning sessions',
      price: 300,
      currency: 'USD',
      duration: 90,
      staff: ['James Wilson', 'Sarah Mitchell'],
      bookings: 45,
      revenue: 13500,
      rating: 4.9,
      status: 'active',
      availability: 'available',
      tags: ['Popular', 'Premium'],
      requirements: 'Business documents recommended',
      maxCapacity: 1,
      advanceBooking: 24, // hours
      cancelPolicy: '24 hours notice required',
      location: 'Conference Room A',
      equipment: ['Projector', 'Whiteboard'],
      createdDate: '2024-01-15',
      lastModified: '2024-09-25'
    },
    {
      id: 2,
      name: 'Cardiology Consultation',
      category: 'Healthcare',
      description: 'Expert cardiac evaluation and treatment planning',
      price: 220,
      currency: 'USD',
      duration: 60,
      staff: ['Dr. Emily Rodriguez', 'Dr. Michael Chen'],
      bookings: 120,
      revenue: 26400,
      rating: 5.0,
      status: 'active',
      availability: 'limited',
      tags: ['Medical', 'Specialist'],
      requirements: 'Previous medical records required',
      maxCapacity: 1,
      advanceBooking: 48,
      cancelPolicy: '48 hours notice required',
      location: 'Medical Suite 2',
      equipment: ['ECG Machine', 'Stethoscope', 'Blood Pressure Monitor'],
      createdDate: '2024-02-01',
      lastModified: '2024-09-30'
    },
    {
      id: 3,
      name: 'Personal Training Session',
      category: 'Sports & Fitness',
      description: 'One-on-one fitness training and workout planning',
      price: 80,
      currency: 'USD',
      duration: 60,
      staff: ['Alex Johnson', 'Lisa Martinez', 'Mike Thompson'],
      bookings: 200,
      revenue: 16000,
      rating: 4.8,
      status: 'active',
      availability: 'available',
      tags: ['Fitness', 'Popular', 'Beginner Friendly'],
      requirements: 'Comfortable workout attire',
      maxCapacity: 1,
      advanceBooking: 12,
      cancelPolicy: '12 hours notice required',
      location: 'Gym Floor',
      equipment: ['Weights', 'Cardio Equipment', 'Mats'],
      createdDate: '2024-03-10',
      lastModified: '2024-09-28'
    },
    {
      id: 4,
      name: 'Tax Preparation',
      category: 'Professional Services',
      description: 'Complete tax filing and preparation services',
      price: 150,
      currency: 'USD',
      duration: 90,
      staff: ['Robert Chang', 'Jennifer Lee'],
      bookings: 85,
      revenue: 12750,
      rating: 4.6,
      status: 'seasonal',
      availability: 'unavailable',
      tags: ['Seasonal', 'Documents Required'],
      requirements: 'Tax documents and ID required',
      maxCapacity: 1,
      advanceBooking: 72,
      cancelPolicy: '72 hours notice required',
      location: 'Office 301',
      equipment: ['Computer', 'Scanner', 'Printer'],
      createdDate: '2023-12-01',
      lastModified: '2024-08-15'
    },
    {
      id: 5,
      name: 'Group Yoga Class',
      category: 'Sports & Fitness',
      description: 'Relaxing group yoga session for all skill levels',
      price: 25,
      currency: 'USD',
      duration: 75,
      staff: ['Sarah Williams', 'Emma Davis'],
      bookings: 340,
      revenue: 8500,
      rating: 4.7,
      status: 'active',
      availability: 'available',
      tags: ['Group', 'Relaxation', 'All Levels'],
      requirements: 'Yoga mat (provided if needed)',
      maxCapacity: 15,
      advanceBooking: 6,
      cancelPolicy: '6 hours notice required',
      location: 'Studio B',
      equipment: ['Yoga Mats', 'Blocks', 'Straps'],
      createdDate: '2024-04-20',
      lastModified: '2024-09-22'
    },
    {
      id: 6,
      name: 'Legal Consultation',
      category: 'Professional Services',
      description: 'Professional legal advice and consultation',
      price: 250,
      currency: 'USD',
      duration: 60,
      staff: ['David Wilson', 'Rachel Brown'],
      bookings: 65,
      revenue: 16250,
      rating: 4.8,
      status: 'active',
      availability: 'limited',
      tags: ['Legal', 'Confidential', 'Expert'],
      requirements: 'Legal documents if applicable',
      maxCapacity: 1,
      advanceBooking: 48,
      cancelPolicy: '48 hours notice required',
      location: 'Law Office',
      equipment: ['Conference Table', 'Legal Library Access'],
      createdDate: '2024-01-30',
      lastModified: '2024-09-20'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'seasonal': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'discontinued': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200'
      case 'limited': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-200'
      case 'booked': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const categories = [...new Set(services.map(s => s.category))]
  
  const filteredServices = services.filter(service => {
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus
    return matchesCategory && matchesStatus
  })

  const serviceStats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    totalBookings: services.reduce((sum, s) => sum + s.bookings, 0),
    totalRevenue: services.reduce((sum, s) => sum + s.revenue, 0),
    avgRating: (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Services Management</h1>
          <p className="text-secondary-600">Manage your service catalog, pricing, and availability</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-2xl font-bold">${serviceStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{serviceStats.avgRating}</p>
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
                  placeholder="Search services..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
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
                <option value="seasonal">Seasonal</option>
                <option value="discontinued">Discontinued</option>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Service Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{service.category}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{service.description}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 ml-2">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>

                {/* Status and Availability */}
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(service.availability)}`}>
                    {service.availability}
                  </span>
                </div>

                {/* Pricing and Duration */}
                <div className="flex items-center justify-between bg-gray-50 rounded p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">${service.price}</p>
                    <p className="text-xs text-gray-600">Price</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{service.duration}m</p>
                    <p className="text-xs text-gray-600">Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">{service.maxCapacity}</p>
                    <p className="text-xs text-gray-600">Capacity</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="font-semibold">{service.rating}</span>
                    </div>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{service.bookings}</p>
                    <p className="text-xs text-gray-600">Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-green-600">${service.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Revenue</p>
                  </div>
                </div>

                {/* Staff and Location */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Staff: {service.staff.slice(0, 2).join(', ')}</span>
                    {service.staff.length > 2 && <span className="text-gray-400">+{service.staff.length - 2} more</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{service.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Book {service.advanceBooking}h in advance</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {service.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Copy className="h-3 w-3 mr-1" />
                    Clone
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Stats
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Service Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Add New Service</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Tag className="h-5 w-5" />
              <span>Bulk Pricing</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Settings</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Settings className="h-5 w-5" />
              <span>Service Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}