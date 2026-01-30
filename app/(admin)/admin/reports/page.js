'use client'

import { useState } from 'react'
import { Card, Button, Badge } from '@/components/ui'

/**
 * AdminReportsPage Component - Generate and view system reports
 * 
 * @returns {JSX.Element} AdminReportsPage component
 */
export default function AdminReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState('all')

  // Mock reports data
  const reports = [
    {
      id: 1,
      name: 'Monthly Revenue Report',
      type: 'financial',
      generatedDate: '2026-01-30',
      generatedBy: 'System Admin',
      status: 'completed',
      fileSize: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 2,
      name: 'User Activity Report',
      type: 'analytics',
      generatedDate: '2026-01-29',
      generatedBy: 'John Doe',
      status: 'completed',
      fileSize: '1.8 MB',
      format: 'Excel'
    },
    {
      id: 3,
      name: 'Queue Performance Report',
      type: 'operations',
      generatedDate: '2026-01-28',
      generatedBy: 'System Admin',
      status: 'completed',
      fileSize: '3.1 MB',
      format: 'PDF'
    },
    {
      id: 4,
      name: 'Business Compliance Report',
      type: 'compliance',
      generatedDate: '2026-01-30',
      generatedBy: 'Sarah Williams',
      status: 'processing',
      fileSize: '-',
      format: 'PDF'
    },
    {
      id: 5,
      name: 'System Health Report',
      type: 'technical',
      generatedDate: '2026-01-27',
      generatedBy: 'System',
      status: 'completed',
      fileSize: '892 KB',
      format: 'JSON'
    }
  ]

  const reportTemplates = [
    {
      name: 'Revenue & Financial',
      description: 'Detailed revenue, subscriptions, and payment analytics',
      icon: '💰',
      type: 'financial'
    },
    {
      name: 'User Analytics',
      description: 'User growth, engagement, and retention metrics',
      icon: '👥',
      type: 'analytics'
    },
    {
      name: 'Queue Performance',
      description: 'Queue efficiency, wait times, and throughput',
      icon: '📊',
      type: 'operations'
    },
    {
      name: 'Business Activity',
      description: 'Business registrations, activity, and usage patterns',
      icon: '🏢',
      type: 'business'
    },
    {
      name: 'Compliance & Audit',
      description: 'Security, compliance, and audit trail reports',
      icon: '🔒',
      type: 'compliance'
    },
    {
      name: 'Technical Health',
      description: 'System performance, uptime, and error tracking',
      icon: '⚙️',
      type: 'technical'
    }
  ]

  const filteredReports = reports.filter(report => 
    selectedReportType === 'all' || report.type === selectedReportType
  )

  const getStatusBadgeColor = (status) => {
    const colors = {
      completed: 'green',
      processing: 'blue',
      failed: 'red',
      scheduled: 'orange'
    }
    return colors[status] || 'gray'
  }

  const getTypeBadgeColor = (type) => {
    const colors = {
      financial: 'purple',
      analytics: 'blue',
      operations: 'green',
      compliance: 'orange',
      technical: 'gray',
      business: 'indigo'
    }
    return colors[type] || 'gray'
  }

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Generate, manage, and download system reports</p>
      </div>

      {/* Report Templates */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <Card key={template.name} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-3xl sm:text-4xl">{template.icon}</div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{template.description}</p>
                  <Button className="mt-3 w-full text-sm">Generate Report</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Report Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Report Types</option>
              <option value="financial">Financial</option>
              <option value="analytics">Analytics</option>
              <option value="operations">Operations</option>
              <option value="compliance">Compliance</option>
              <option value="technical">Technical</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button className="flex-1 md:flex-none">Schedule Report</Button>
            <Button className="flex-1 md:flex-none">Export All</Button>
          </div>
        </div>
      </Card>

      {/* Reports Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Total Reports</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">247</div>
          <div className="text-xs sm:text-sm text-blue-600 mt-1">All time</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">This Month</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">34</div>
          <div className="text-xs sm:text-sm text-green-600 mt-1">↑ 12% increase</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Scheduled</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">8</div>
          <div className="text-xs sm:text-sm text-orange-600 mt-1">Auto-generate</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Storage Used</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">15.7 GB</div>
          <div className="text-xs sm:text-sm text-purple-600 mt-1">Of 100 GB</div>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="p-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 p-4 sm:p-6 pb-4">Recent Reports</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Generated Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Generated By
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  File Size
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Format
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{report.name}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <Badge color={getTypeBadgeColor(report.type)}>
                      <span className="text-xs">{report.type}</span>
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <Badge color={getStatusBadgeColor(report.status)}>
                      <span className="text-xs">{report.status}</span>
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                    {new Date(report.generatedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                    {report.generatedBy}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                    {report.fileSize}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                    {report.format}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <div className="flex gap-2 items-center">
                      {report.status === 'completed' && (
                        <>
                          <button 
                            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                            title="Download"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button 
                            className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </>
                      )}
                      <button 
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reports found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
