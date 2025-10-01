'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Calendar,
  DollarSign, Star, Clock, MapPin, Filter, Download,
  RefreshCw, Eye, ArrowUp, ArrowDown, Activity,
  Target, Award, Zap, Heart, Phone, MessageSquare
} from 'lucide-react'

/**
 * Analytics Dashboard
 * Comprehensive business insights, reports, performance metrics, and data visualization
 */
export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d') // '7d', '30d', '90d', '1y'
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Sample analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 58750,
      revenueChange: 12.5,
      totalBookings: 342,
      bookingsChange: 8.3,
      totalCustomers: 156,
      customersChange: 15.7,
      avgRating: 4.7,
      ratingChange: 2.1
    },
    revenueByService: [
      { name: 'Cardiology Consultation', revenue: 26400, bookings: 120, percentage: 45 },
      { name: 'Personal Training', revenue: 16000, bookings: 200, percentage: 27 },
      { name: 'Legal Consultation', revenue: 16250, bookings: 65, percentage: 28 },
      { name: 'Strategy Consulting', revenue: 13500, bookings: 45, percentage: 23 },
      { name: 'Group Yoga', revenue: 8500, bookings: 340, percentage: 14 },
      { name: 'Tax Preparation', revenue: 12750, bookings: 85, percentage: 22 }
    ],
    staffPerformance: [
      { name: 'Dr. Emily Rodriguez', revenue: 28400, bookings: 120, rating: 5.0, efficiency: 99 },
      { name: 'James Wilson', revenue: 15600, bookings: 45, rating: 4.9, efficiency: 98 },
      { name: 'David Wilson', revenue: 16250, bookings: 65, rating: 4.8, efficiency: 96 },
      { name: 'Alex Johnson', revenue: 8800, bookings: 110, rating: 4.8, efficiency: 94 },
      { name: 'Robert Chang', revenue: 5250, bookings: 35, rating: 4.6, efficiency: 92 }
    ],
    customerMetrics: {
      newCustomers: 23,
      returningCustomers: 89,
      customerRetention: 78.5,
      avgLifetimeValue: 445,
      topCustomers: [
        { name: 'Sarah Johnson', spent: 1250, visits: 15, lastVisit: '2024-09-28' },
        { name: 'Michael Chen', spent: 1760, visits: 8, lastVisit: '2024-09-25' },
        { name: 'Lisa Martinez', spent: 1760, visits: 22, lastVisit: '2024-09-30' }
      ]
    },
    timeAnalysis: {
      peakHours: ['9:00 AM', '2:00 PM', '4:00 PM'],
      peakDays: ['Tuesday', 'Wednesday', 'Thursday'],
      avgWaitTime: 12, // minutes
      avgSessionTime: 68, // minutes
      utilizationRate: 82 // percentage
    },
    categories: [
      { name: 'Healthcare', revenue: 28400, bookings: 120, growth: 15.2 },
      { name: 'Professional Services', revenue: 22000, bookings: 95, growth: 8.7 },
      { name: 'Sports & Fitness', revenue: 18800, bookings: 450, growth: 22.1 },
      { name: 'Business Consulting', revenue: 15600, bookings: 45, growth: 12.5 }
    ]
  }

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getChangeIcon = (change) => {
    return change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics Dashboard</h1>
          <p className="text-secondary-600">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${analyticsData.overview.totalRevenue.toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(analyticsData.overview.revenueChange)}`}>
                  {getChangeIcon(analyticsData.overview.revenueChange)}
                  <span>{Math.abs(analyticsData.overview.revenueChange)}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalBookings}</p>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(analyticsData.overview.bookingsChange)}`}>
                  {getChangeIcon(analyticsData.overview.bookingsChange)}
                  <span>{Math.abs(analyticsData.overview.bookingsChange)}%</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalCustomers}</p>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(analyticsData.overview.customersChange)}`}>
                  {getChangeIcon(analyticsData.overview.customersChange)}
                  <span>{Math.abs(analyticsData.overview.customersChange)}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{analyticsData.overview.avgRating}</p>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(analyticsData.overview.ratingChange)}`}>
                  {getChangeIcon(analyticsData.overview.ratingChange)}
                  <span>{Math.abs(analyticsData.overview.ratingChange)}%</span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.revenueByService.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${service.revenue.toLocaleString()}</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${service.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${category.revenue.toLocaleString()}</p>
                    <div className={`flex items-center gap-1 text-sm ${getChangeColor(category.growth)}`}>
                      <TrendingUp className="h-3 w-3" />
                      <span>{category.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium text-gray-700">Staff Member</th>
                  <th className="text-right p-2 font-medium text-gray-700">Revenue</th>
                  <th className="text-right p-2 font-medium text-gray-700">Bookings</th>
                  <th className="text-right p-2 font-medium text-gray-700">Rating</th>
                  <th className="text-right p-2 font-medium text-gray-700">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.staffPerformance.map((staff, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{staff.name}</td>
                    <td className="text-right p-2 font-semibold text-green-600">
                      ${staff.revenue.toLocaleString()}
                    </td>
                    <td className="text-right p-2">{staff.bookings}</td>
                    <td className="text-right p-2">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{staff.rating}</span>
                      </div>
                    </td>
                    <td className="text-right p-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {staff.efficiency}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights & Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600">New Customers</p>
                  <p className="text-xl font-bold text-blue-800">{analyticsData.customerMetrics.newCustomers}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600">Returning</p>
                  <p className="text-xl font-bold text-green-800">{analyticsData.customerMetrics.returningCustomers}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-600">Retention Rate</p>
                  <p className="text-xl font-bold text-purple-800">{analyticsData.customerMetrics.customerRetention}%</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-600">Avg LTV</p>
                  <p className="text-xl font-bold text-orange-800">${analyticsData.customerMetrics.avgLifetimeValue}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Top Customers</h4>
                <div className="space-y-2">
                  {analyticsData.customerMetrics.topCustomers.map((customer, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-600">{customer.visits} visits</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${customer.spent}</p>
                        <p className="text-xs text-gray-600">{customer.lastVisit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Peak Performance</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Peak Hours</p>
                    <div className="mt-1">
                      {analyticsData.timeAnalysis.peakHours.map((hour, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {hour}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Peak Days</p>
                    <div className="mt-1">
                      {analyticsData.timeAnalysis.peakDays.map((day, index) => (
                        <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Avg Wait Time</span>
                  </div>
                  <span className="font-bold">{analyticsData.timeAnalysis.avgWaitTime} min</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Avg Session</span>
                  </div>
                  <span className="font-bold">{analyticsData.timeAnalysis.avgSessionTime} min</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Utilization</span>
                  </div>
                  <span className="font-bold">{analyticsData.timeAnalysis.utilizationRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Analytics Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>Custom Reports</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Forecasting</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Award className="h-5 w-5" />
              <span>Benchmarks</span>
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