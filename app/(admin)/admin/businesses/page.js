'use client'

import { useState } from 'react'
import { Card, Button, Input, Badge } from '@/components/ui'
import Link from 'next/link'

/**
 * AdminBusinessesPage Component - Manage all businesses
 * 
 * @returns {JSX.Element} AdminBusinessesPage component
 */
export default function AdminBusinessesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Mock business data
  const businesses = [
    {
      id: 1,
      name: 'Downtown Dental Clinic',
      owner: 'Dr. Sarah Williams',
      industry: 'Healthcare',
      status: 'active',
      plan: 'Professional',
      queues: 12,
      customers: 543,
      revenue: '$2,450',
      joinedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Beauty Bliss Salon',
      owner: 'Jane Smith',
      industry: 'Beauty & Wellness',
      status: 'active',
      plan: 'Business',
      queues: 8,
      customers: 892,
      revenue: '$4,120',
      joinedDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Fitness First Gym',
      owner: 'Mike Johnson',
      industry: 'Sports & Fitness',
      status: 'trial',
      plan: 'Starter',
      queues: 5,
      customers: 234,
      revenue: '$980',
      joinedDate: '2024-03-10'
    },
    {
      id: 4,
      name: 'Legal Solutions LLC',
      owner: 'Robert Brown',
      industry: 'Professional Services',
      status: 'suspended',
      plan: 'Professional',
      queues: 3,
      customers: 156,
      revenue: '$0',
      joinedDate: '2024-01-05'
    }
  ]

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          business.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustry === 'all' || business.industry === selectedIndustry
    const matchesStatus = selectedStatus === 'all' || business.status === selectedStatus
    return matchesSearch && matchesIndustry && matchesStatus
  })

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'green',
      trial: 'blue',
      suspended: 'red',
      inactive: 'gray'
    }
    return colors[status] || 'gray'
  }

  const getPlanBadgeColor = (plan) => {
    const colors = {
      Starter: 'gray',
      Professional: 'blue',
      Business: 'purple',
      Enterprise: 'orange'
    }
    return colors[plan] || 'gray'
  }

  return (
    <div className="space-y-6">
      <div className="pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage all registered businesses</p>
        </div>
        <Button className="w-full sm:w-auto">Add Business</Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search businesses by name or owner..."
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
              <option value="Healthcare">Healthcare</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Education">Education</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button className="w-full sm:w-auto">Export CSV</Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Total Businesses</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">127</div>
          <div className="text-xs sm:text-sm text-green-600 mt-1">↑ 12% from last month</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Active Businesses</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">98</div>
          <div className="text-xs sm:text-sm text-green-600 mt-1">77% active rate</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">$52,340</div>
          <div className="text-xs sm:text-sm text-purple-600 mt-1">This month</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">On Trial</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">15</div>
          <div className="text-xs sm:text-sm text-blue-600 mt-1">Potential customers</div>
        </Card>
      </div>

      {/* Businesses Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBusinesses.map((business) => (
                <tr key={business.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{business.name}</div>
                      <div className="text-sm text-gray-500">{business.owner}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {business.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={getPlanBadgeColor(business.plan)}>
                      {business.plan}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={getStatusBadgeColor(business.status)}>
                      {business.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {business.queues}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {business.customers.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {business.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2 items-center">
                      <Link 
                        href={`/admin/businesses/${business.id}`} 
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button 
                        className="p-1.5 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                        title="Suspend"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
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
    </div>
  )
}
