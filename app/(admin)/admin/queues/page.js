'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Input, Badge, Modal, ModalFooter } from '@/components/ui'
import { RefreshCw, Download, Eye, Pause, Play, XCircle, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getAllBusinesses,
  getBusinesses,
  getQueues,
  getQueueEntries,
  updateQueue,
} from '@/lib/supabase/queries'

/**
 * AdminQueuesPage Component - Monitor all system queues
 * 
 * @returns {JSX.Element} AdminQueuesPage component
 */
export default function AdminQueuesPage() {
  const [queues, setQueues] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [busyQueueId, setBusyQueueId] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBusiness, setSelectedBusiness] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const [isEntriesModalOpen, setIsEntriesModalOpen] = useState(false)
  const [selectedQueue, setSelectedQueue] = useState(null)
  const [selectedQueueEntries, setSelectedQueueEntries] = useState([])
  const [entriesLoading, setEntriesLoading] = useState(false)

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

  const asDateTime = (value) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleString()
  }

  const getCustomerName = (entry) => {
    const customer = entry?.customer
    const notesText = String(entry?.notes || '')
    const nameMatch = notesText.match(/Name:\s*([^,]+)/i)
    return customer?.full_name || customer?.name || nameMatch?.[1]?.trim() || customer?.email || 'Unknown Customer'
  }

  const normalizeQueues = (rawQueues, businessMap, entriesMap) => {
    return (rawQueues || []).map((queue) => {
      const business = businessMap[queue.business_id] || null
      const entries = entriesMap[queue.id] || []
      const waiting = entries.filter((entry) => entry.status === 'waiting').length
      const called = entries.filter((entry) => entry.status === 'called').length
      const serving = entries.filter((entry) => entry.status === 'serving').length

      return {
        id: queue.id,
        name: queue.name || 'Untitled Queue',
        businessId: queue.business_id,
        businessName: business?.name || 'Unknown Business',
        industry: business?.category || 'Uncategorized',
        status: queue.status || 'active',
        waiting,
        called,
        serving,
        inQueue: waiting + called + serving,
        maxCapacity: Number(queue.max_capacity || 0),
        estimatedWaitMinutes: Number(queue.estimated_wait_time || 0),
        utilization: Number(queue.max_capacity || 0) > 0
          ? Math.round(((waiting + called + serving) / Number(queue.max_capacity)) * 100)
          : 0,
        lastUpdated: queue.updated_at || queue.created_at,
        raw: queue,
      }
    })
  }

  const loadQueues = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const allBusinessesResult = await getAllBusinesses()
        .then((data) => ({ ok: true, data }))
        .catch((error) => ({ ok: false, error }))

      let businessRows = []
      if (allBusinessesResult.ok) {
        businessRows = allBusinessesResult.data || []
      } else if (isPermissionError(allBusinessesResult.error)) {
        businessRows = await getBusinesses()
        toast.error('Admin access to all businesses is not configured yet. Showing active businesses only.')
      } else {
        throw allBusinessesResult.error
      }

      const businessMap = (businessRows || []).reduce((acc, business) => {
        acc[business.id] = business
        return acc
      }, {})

      const queueRowsByBusiness = await Promise.allSettled(
        (businessRows || []).map((business) => getQueues(business.id))
      )

      const queueRows = queueRowsByBusiness
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => result.value || [])

      const entriesByQueueResults = await Promise.allSettled(
        queueRows.map((queue) => getQueueEntries(queue.id))
      )

      const entriesMap = queueRows.reduce((acc, queue, index) => {
        const result = entriesByQueueResults[index]
        acc[queue.id] = result?.status === 'fulfilled' ? (result.value || []) : []
        return acc
      }, {})

      setBusinesses(businessRows || [])
      setQueues(normalizeQueues(queueRows, businessMap, entriesMap))
    } catch (error) {
      console.warn('[Admin Queues] Failed to load queues:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      })
      toast.error(getErrorMessage(error) || 'Failed to load queues')
      setQueues([])
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadQueues()
  }, [])

  const filteredQueues = useMemo(() => {
    return queues.filter((queue) => {
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch = !q
        || queue.name.toLowerCase().includes(q)
        || queue.businessName.toLowerCase().includes(q)
      const matchesBusiness = selectedBusiness === 'all' || queue.businessId === selectedBusiness
      const matchesStatus = selectedStatus === 'all' || queue.status === selectedStatus
      return matchesSearch && matchesBusiness && matchesStatus
    })
  }, [queues, searchTerm, selectedBusiness, selectedStatus])

  const stats = useMemo(() => {
    const total = queues.length
    const active = queues.filter((queue) => queue.status === 'active').length
    const paused = queues.filter((queue) => queue.status === 'paused').length
    const closed = queues.filter((queue) => queue.status === 'closed').length
    const totalWaiting = queues.reduce((sum, queue) => sum + queue.waiting, 0)
    const avgWait = total ? Math.round(queues.reduce((sum, queue) => sum + queue.estimatedWaitMinutes, 0) / total) : 0

    return { total, active, paused, closed, totalWaiting, avgWait }
  }, [queues])

  const getStatusVariant = (status) => {
    if (status === 'active') return 'success'
    if (status === 'paused') return 'warning'
    if (status === 'closed') return 'default'
    return 'info'
  }

  const handleQueueStatus = async (queue, nextStatus) => {
    try {
      setBusyQueueId(queue.id)
      const updated = await updateQueue(queue.id, { status: nextStatus })

      setQueues((prev) => prev.map((item) => {
        if (item.id !== queue.id) return item
        return {
          ...item,
          status: updated.status || nextStatus,
          lastUpdated: updated.updated_at || item.lastUpdated,
          raw: { ...item.raw, ...updated },
        }
      }))

      toast.success(`Queue marked ${nextStatus}`)
    } catch (error) {
      console.warn('[Admin Queues] Failed to update queue status:', error)
      toast.error(getErrorMessage(error) || 'Failed to update queue status')
    } finally {
      setBusyQueueId('')
    }
  }

  const handleOpenEntries = async (queue) => {
    try {
      setSelectedQueue(queue)
      setIsEntriesModalOpen(true)
      setEntriesLoading(true)

      const entries = await getQueueEntries(queue.id)
      setSelectedQueueEntries(entries || [])
    } catch (error) {
      console.warn('[Admin Queues] Failed to load queue entries:', error)
      toast.error(getErrorMessage(error) || 'Failed to load queue entries')
      setSelectedQueueEntries([])
    } finally {
      setEntriesLoading(false)
    }
  }

  const handleExportCsv = () => {
    if (!filteredQueues.length) {
      toast.error('No queues to export')
      return
    }

    const rows = filteredQueues.map((queue) => ({
      id: queue.id,
      queueName: queue.name,
      business: queue.businessName,
      industry: queue.industry,
      status: queue.status,
      waiting: queue.waiting,
      called: queue.called,
      serving: queue.serving,
      totalInQueue: queue.inQueue,
      maxCapacity: queue.maxCapacity,
      estimatedWaitMinutes: queue.estimatedWaitMinutes,
      utilizationPercent: queue.utilization,
      lastUpdated: queue.lastUpdated || '',
    }))

    const headers = Object.keys(rows[0])
    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.setAttribute('download', `admin-queues-${Date.now()}.csv`)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    toast.success('Queues exported')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading queues...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Queue Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Monitor and manage all system queues with live data</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search queues by name or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Businesses</option>
              {(businesses || []).map((business) => (
                <option key={business.id} value={business.id}>{business.name}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2" onClick={() => loadQueues({ silent: true })}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="w-full sm:w-auto flex items-center justify-center gap-2" onClick={handleExportCsv}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Queues" value={stats.total} helper="Across all businesses" helperClass="text-blue-600" />
        <StatCard title="Active" value={stats.active} helper={`${stats.paused} paused / ${stats.closed} closed`} helperClass="text-green-600" />
        <StatCard title="Total Waiting" value={stats.totalWaiting} helper="Customers currently waiting" helperClass="text-orange-600" />
        <StatCard title="Avg Wait" value={`${stats.avgWait} min`} helper="Queue estimated wait" helperClass="text-indigo-600" />
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queue</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Business</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">In Queue</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Avg Wait</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Updated</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQueues.map((queue) => (
                <tr key={queue.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{queue.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{queue.industry}</div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {queue.businessName}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(queue.status)}>
                      <span className="text-xs capitalize">{queue.status}</span>
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${queue.waiting > 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {queue.waiting}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {queue.inQueue}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    {queue.estimatedWaitMinutes} min
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {asDateTime(queue.lastUpdated)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleOpenEntries(queue)}
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="View queue entries"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {queue.status === 'active' && (
                        <button
                          onClick={() => handleQueueStatus(queue, 'paused')}
                          className="p-1.5 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded transition-colors"
                          title="Pause queue"
                          disabled={busyQueueId === queue.id}
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {queue.status === 'paused' && (
                        <button
                          onClick={() => handleQueueStatus(queue, 'active')}
                          className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                          title="Resume queue"
                          disabled={busyQueueId === queue.id}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {queue.status !== 'closed' && (
                        <button
                          onClick={() => handleQueueStatus(queue, 'closed')}
                          className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                          title="Close queue"
                          disabled={busyQueueId === queue.id}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      {queue.status === 'closed' && (
                        <button
                          onClick={() => handleQueueStatus(queue, 'active')}
                          className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded transition-colors"
                          title="Reopen queue"
                          disabled={busyQueueId === queue.id}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQueues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No queues found</p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isEntriesModalOpen}
        onClose={() => setIsEntriesModalOpen(false)}
        title={selectedQueue ? `Queue Entries: ${selectedQueue.name}` : 'Queue Entries'}
        size="lg"
      >
        <div className="space-y-4">
          {entriesLoading ? (
            <div className="py-8 text-center text-gray-500">Loading queue entries...</div>
          ) : selectedQueueEntries.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No active queue entries</div>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              {selectedQueueEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-gray-900">#{entry.position || 'N/A'} {getCustomerName(entry)}</div>
                    <div className="text-sm text-gray-600">Joined: {asDateTime(entry.joined_at)}</div>
                  </div>
                  <Badge variant={entry.status === 'serving' ? 'info' : entry.status === 'called' ? 'warning' : 'default'}>
                    <span className="text-xs capitalize">{entry.status}</span>
                  </Badge>
                </div>
              ))}
            </div>
          )}

          <ModalFooter className="px-0 pb-0 border-t-0">
            <Button type="button" variant="outline" onClick={() => setIsEntriesModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </div>
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
