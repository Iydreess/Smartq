'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Badge, Modal, ModalFooter } from '@/components/ui'
import { RefreshCw, Download, Eye, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getAllBusinesses,
  getBusinesses,
  getAllProfiles,
  getQueues,
  getBusinessAppointments,
} from '@/lib/supabase/queries'

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [contextData, setContextData] = useState({
    businesses: [],
    profiles: [],
    queues: [],
    appointments: [],
    rangeStart: new Date(),
  })

  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const reportTemplates = [
    { name: 'Revenue and Financial', description: 'Revenue, bookings, and service totals', type: 'financial', format: 'CSV' },
    { name: 'User Analytics', description: 'User counts and role breakdown', type: 'analytics', format: 'CSV' },
    { name: 'Queue Performance', description: 'Queue status and wait-time distribution', type: 'operations', format: 'CSV' },
    { name: 'Business Activity', description: 'Business growth and category coverage', type: 'business', format: 'CSV' },
    { name: 'Compliance and Audit', description: 'Inactive entities and audit flags', type: 'compliance', format: 'JSON' },
    { name: 'Technical Health', description: 'Operational health and queue pressure', type: 'technical', format: 'JSON' },
  ]

  const isPermissionError = (error) => {
    const code = error?.code || ''
    const message = (error?.message || '').toLowerCase()
    return code === '42501' || message.includes('permission denied') || message.includes('row-level security')
  }

  const getErrorMessage = (error) => {
    if (!error) return 'Unknown error'
    if (typeof error === 'string') return error
    return error.message || error.details || error.hint || 'Unknown error'
  }

  const getRangeStart = (range) => {
    const now = new Date()
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }
    const days = daysMap[range] || 30
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  }

  const asDate = (value) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString()
  }

  const toCsv = (rows) => {
    if (!rows?.length) return ''
    const headers = Object.keys(rows[0])
    return [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n')
  }

  const formatSize = (content) => {
    const bytes = new Blob([content]).size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const buildPayload = (template, data) => {
    const { businesses, profiles, queues, appointments, rangeStart } = data

    const rangeAppointments = appointments.filter((appointment) => {
      const dt = new Date(appointment.created_at || appointment.appointment_date)
      return !Number.isNaN(dt.getTime()) && dt >= rangeStart
    })

    const totalRevenue = rangeAppointments.reduce((sum, appointment) => {
      const price = Number(appointment?.service?.price || 0)
      return sum + (Number.isFinite(price) ? price : 0)
    }, 0)

    if (template.type === 'financial') {
      return {
        summary: {
          periodStart: rangeStart.toISOString(),
          bookings: rangeAppointments.length,
          estimatedRevenue: totalRevenue,
        },
        rows: rangeAppointments.map((appointment) => ({
          appointmentId: appointment.id,
          businessId: appointment.business_id,
          date: appointment.appointment_date,
          status: appointment.status,
          servicePrice: Number(appointment?.service?.price || 0),
        })),
      }
    }

    if (template.type === 'analytics') {
      const roleCounts = profiles.reduce((acc, profile) => {
        const role = profile.role || 'unknown'
        acc[role] = (acc[role] || 0) + 1
        return acc
      }, {})

      return {
        summary: {
          totalUsers: profiles.length,
          totalBusinesses: businesses.length,
          bookingsInRange: rangeAppointments.length,
        },
        rows: Object.keys(roleCounts).map((role) => ({ role, count: roleCounts[role] })),
      }
    }

    if (template.type === 'operations') {
      const statusCounts = queues.reduce((acc, queue) => {
        const status = queue.status || 'unknown'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {})

      return {
        summary: {
          totalQueues: queues.length,
          avgEstimatedWait: queues.length
            ? Math.round(queues.reduce((sum, queue) => sum + Number(queue.estimated_wait_time || 0), 0) / queues.length)
            : 0,
        },
        rows: Object.keys(statusCounts).map((status) => ({ status, queues: statusCounts[status] })),
      }
    }

    if (template.type === 'business') {
      const categoryCounts = businesses.reduce((acc, business) => {
        const category = business.category || 'Uncategorized'
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {})

      return {
        summary: {
          totalBusinesses: businesses.length,
          activeBusinesses: businesses.filter((business) => business.is_active).length,
        },
        rows: Object.keys(categoryCounts).map((category) => ({
          category,
          businesses: categoryCounts[category],
        })),
      }
    }

    if (template.type === 'compliance') {
      return {
        summary: {
          inactiveBusinesses: businesses.filter((business) => !business.is_active).length,
          closedQueues: queues.filter((queue) => queue.status === 'closed').length,
        },
        rows: {
          inactiveBusinessIds: businesses.filter((business) => !business.is_active).map((business) => business.id),
          closedQueueIds: queues.filter((queue) => queue.status === 'closed').map((queue) => queue.id),
        },
      }
    }

    return {
      summary: {
        totalUsers: profiles.length,
        totalBusinesses: businesses.length,
        totalQueues: queues.length,
        bookingsInRange: rangeAppointments.length,
      },
      rows: {
        queueStatusMix: queues.reduce((acc, queue) => {
          const status = queue.status || 'unknown'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {}),
        estimatedRevenue: totalRevenue,
      },
    }
  }

  const buildReportRecord = (template, data) => {
    const payload = buildPayload(template, data)
    const content = template.format === 'JSON'
      ? JSON.stringify(payload, null, 2)
      : toCsv(payload.rows || [])

    return {
      id: `${template.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: `${template.name} (${timeRange})`,
      type: template.type,
      generatedDate: new Date().toISOString(),
      generatedBy: 'System Admin',
      status: 'completed',
      format: template.format,
      fileSize: formatSize(content),
      payload,
      content,
    }
  }

  const loadReports = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      let businesses = []
      const allBiz = await getAllBusinesses()
        .then((data) => ({ ok: true, data }))
        .catch((error) => ({ ok: false, error }))

      if (allBiz.ok) {
        businesses = allBiz.data || []
      } else if (isPermissionError(allBiz.error)) {
        businesses = await getBusinesses()
        toast.error('Admin access to all businesses is not configured yet. Showing active businesses only.')
      } else {
        throw allBiz.error
      }

      const profiles = await getAllProfiles().catch(() => [])

      const [queueResults, appointmentResults] = await Promise.all([
        Promise.allSettled((businesses || []).map((business) => getQueues(business.id))),
        Promise.allSettled((businesses || []).map((business) => getBusinessAppointments(business.id))),
      ])

      const queues = queueResults
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => result.value || [])

      const appointments = appointmentResults
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => result.value || [])

      const nextContext = {
        businesses,
        profiles,
        queues,
        appointments,
        rangeStart: getRangeStart(timeRange),
      }
      setContextData(nextContext)

      const generatedReports = reportTemplates.map((template) => buildReportRecord(template, nextContext))
      setReports(generatedReports)
    } catch (error) {
      console.warn('[Admin Reports] Failed to load reports:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      })
      toast.error(getErrorMessage(error) || 'Failed to load reports')
      setReports([])
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadReports()
  }, [timeRange])

  const filteredReports = useMemo(() => {
    return reports.filter((report) => selectedReportType === 'all' || report.type === selectedReportType)
  }, [reports, selectedReportType])

  const stats = useMemo(() => {
    const total = reports.length
    const completed = reports.filter((report) => report.status === 'completed').length
    const csvCount = reports.filter((report) => report.format === 'CSV').length
    const sizeKb = reports.reduce((sum, report) => {
      const match = String(report.fileSize || '').match(/([\d.]+)\s*(B|KB|MB)/i)
      if (!match) return sum
      const value = Number(match[1])
      const unit = match[2].toUpperCase()
      if (unit === 'MB') return sum + value * 1024
      if (unit === 'KB') return sum + value
      return sum + (value / 1024)
    }, 0)

    return {
      total,
      completed,
      csvCount,
      storageText: sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb.toFixed(1)} KB`,
    }
  }, [reports])

  const getStatusVariant = (status) => {
    if (status === 'completed') return 'success'
    if (status === 'processing') return 'info'
    if (status === 'failed') return 'error'
    return 'warning'
  }

  const getTypeVariant = (type) => {
    if (type === 'financial') return 'info'
    if (type === 'analytics') return 'success'
    if (type === 'operations') return 'warning'
    if (type === 'compliance') return 'error'
    if (type === 'technical') return 'default'
    return 'info'
  }

  const handleDownload = (report) => {
    const extension = report.format.toLowerCase() === 'json' ? 'json' : 'csv'
    const mime = extension === 'json' ? 'application/json' : 'text/csv;charset=utf-8;'
    const blob = new Blob([report.content || ''], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', `${report.name.replace(/[^a-z0-9-_]/gi, '_').toLowerCase()}.${extension}`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Report downloaded')
  }

  const handleGenerateReport = (template) => {
    if (!contextData.businesses.length && !contextData.profiles.length) {
      toast.error('Live report context not loaded yet')
      return
    }
    const created = buildReportRecord(template, { ...contextData, rangeStart: getRangeStart(timeRange) })
    setReports((prev) => [created, ...prev])
    toast.success(`${template.name} generated`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports and Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Generate, review, and download live system reports</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => loadReports({ silent: true })}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template, index) => (
            <Card key={`${template.type}-${index}`} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-6 w-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{template.description}</p>
                  <Button className="mt-3 w-full text-sm" onClick={() => handleGenerateReport(template)}>
                    Generate Report
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

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
            <Button className="flex-1 md:flex-none" onClick={() => toast.success('Scheduling workflow coming soon')}>
              Schedule Report
            </Button>
            <Button
              className="flex-1 md:flex-none"
              onClick={() => {
                if (!filteredReports.length) {
                  toast.error('No reports to export')
                  return
                }
                filteredReports.forEach((report) => handleDownload(report))
              }}
            >
              Export All
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reports" value={stats.total} helper="Generated from live data" helperClass="text-blue-600" />
        <StatCard title="Completed" value={stats.completed} helper="Ready to download" helperClass="text-green-600" />
        <StatCard title="CSV Reports" value={stats.csvCount} helper="Spreadsheet-friendly" helperClass="text-indigo-600" />
        <StatCard title="Storage Used" value={stats.storageText} helper="Current visible set" helperClass="text-purple-600" />
      </div>

      <Card className="p-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 p-4 sm:p-6 pb-4">Recent Reports</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Generated Date</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Generated By</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">File Size</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Format</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4"><div className="text-xs sm:text-sm font-medium text-gray-900">{report.name}</div></td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <Badge variant={getTypeVariant(report.type)}><span className="text-xs capitalize">{report.type}</span></Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <Badge variant={getStatusVariant(report.status)}><span className="text-xs capitalize">{report.status}</span></Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">{asDate(report.generatedDate)}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">{report.generatedBy}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">{report.fileSize}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{report.format}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <div className="flex gap-2 items-center">
                      <button onClick={() => handleDownload(report)} className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReport(report)
                          setIsReportModalOpen(true)
                        }}
                        className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
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

      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Report Preview" size="lg">
        {selectedReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <DetailRow label="Name" value={selectedReport.name} />
              <DetailRow label="Type" value={selectedReport.type} />
              <DetailRow label="Format" value={selectedReport.format} />
              <DetailRow label="Generated" value={asDate(selectedReport.generatedDate)} />
            </div>
            <pre className="bg-gray-50 border rounded-lg p-3 text-xs overflow-auto max-h-[340px]">{JSON.stringify(selectedReport.payload, null, 2)}</pre>
            <ModalFooter className="px-0 pb-0 border-t-0">
              <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>Close</Button>
              <Button onClick={() => handleDownload(selectedReport)}>Download</Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  )
}

function StatCard({ title, value, helper, helperClass }) {
  return (
    <Card className="p-4">
      <div className="text-xs sm:text-sm font-medium text-gray-600">{title}</div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{value}</div>
      <div className={`text-xs sm:text-sm mt-1 ${helperClass}`}>{helper}</div>
    </Card>
  )
}

function DetailRow({ label, value }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <p className="mt-1 text-sm text-gray-900 break-words">{value}</p>
    </div>
  )
}
