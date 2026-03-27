'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button, Modal, ModalFooter, Input } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import {
  createNotification,
  createQueue,
  getBusinessesByOwner,
  getQueueEntries,
  getQueues,
  getServices,
  updateQueue,
  updateQueueEntry,
} from '@/lib/supabase/queries'
import {
  Users,
  Clock,
  Play,
  Pause,
  SkipForward,
  AlertCircle,
  RefreshCw,
  Settings,
  Phone,
  MessageSquare,
  UserCheck,
  Plus,
  Filter,
  Search,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function QueuesPage() {
  const { user, loading: userLoading } = useUser()

  const [queues, setQueues] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [services, setServices] = useState([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [busyQueueId, setBusyQueueId] = useState(null)
  const [entryActionId, setEntryActionId] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [isCreateQueueModalOpen, setIsCreateQueueModalOpen] = useState(false)
  const [creatingQueue, setCreatingQueue] = useState(false)
  const [queueForm, setQueueForm] = useState({
    businessId: '',
    serviceId: '',
    name: '',
    estimatedWaitTime: '15',
    maxCapacity: '50',
  })

  const [selectedQueue, setSelectedQueue] = useState(null)
  const [isEntriesModalOpen, setIsEntriesModalOpen] = useState(false)
  const [isQueueSettingsModalOpen, setIsQueueSettingsModalOpen] = useState(false)
  const [savingQueueSettings, setSavingQueueSettings] = useState(false)
  const [queueSettingsForm, setQueueSettingsForm] = useState({
    name: '',
    estimatedWaitTime: '15',
    maxCapacity: '50',
    status: 'active',
  })

  const getCustomerName = (entry) => {
    const customer = entry?.customer
    const notesText = String(entry?.notes || '')
    const nameMatch = notesText.match(/Name:\s*([^,]+)/i)
    return customer?.full_name || customer?.name || nameMatch?.[1]?.trim() || customer?.email || 'Unknown Customer'
  }

  const getCustomerPhone = (entry) => {
    const customer = entry?.customer
    const notesText = String(entry?.notes || '')
    const phoneMatch = notesText.match(/Phone:\s*([^,]+)/i)
    return customer?.phone || phoneMatch?.[1]?.trim() || ''
  }

  const getWaitTimeLabel = (entry, queueEstimate) => {
    const minutes = Number(entry?.estimated_wait_time || queueEstimate || 0)
    return `${minutes} min`
  }

  const normalizeQueues = (rawQueues, entriesByQueue) => {
    return (rawQueues || []).map((queue) => {
      const entries = entriesByQueue.get(queue.id) || []
      const serving = entries.find((entry) => entry.status === 'serving') || null
      const waiting = entries
        .filter((entry) => ['waiting', 'called'].includes(entry.status))
        .sort((a, b) => (a.position || 0) - (b.position || 0))
      const snoozedEntries = entries.filter((entry) => entry.status === 'snoozed')

      const next = waiting[0] || null

      return {
        id: queue.id,
        name: queue.name,
        category: queue.service?.category || 'General',
        serviceName: queue.service?.name || 'Service',
        status: queue.status,
        estimatedWaitTime: Number(queue.estimated_wait_time || 0),
        maxCapacity: Number(queue.max_capacity || 0),
        currentServing: serving
          ? {
              id: serving.id,
              number: `#${serving.position || 'N/A'}`,
              name: getCustomerName(serving),
              waitTime: getWaitTimeLabel(serving, queue.estimated_wait_time),
            }
          : null,
        nextInLine: next
          ? {
              id: next.id,
              number: `#${next.position || 'N/A'}`,
              name: getCustomerName(next),
              phone: getCustomerPhone(next),
              waitTime: getWaitTimeLabel(next, queue.estimated_wait_time),
            }
          : null,
        waitingEntries: waiting,
        snoozedEntries,
        totalWaiting: waiting.length,
        totalSnoozed: snoozedEntries.length,
        avgWaitTime: `${Number(queue.estimated_wait_time || 0)} min`,
        estimatedCompletion: queue.status === 'paused' ? 'Paused' : 'Active',
      }
    })
  }

  const notifyQueueUpdateSafe = async (entry, title, message, data = {}) => {
    if (!entry?.customer_id) return

    try {
      await createNotification({
        user_id: entry.customer_id,
        type: 'queue_update',
        title,
        message,
        data,
      })
    } catch (error) {
      console.warn('[Queues] Notification failed:', error)
    }
  }

  const loadQueues = async ({ silent = false } = {}) => {
    if (!user?.id) return

    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const ownerBusinesses = await getBusinessesByOwner(user.id)
      setBusinesses(ownerBusinesses || [])

      const businessIds = (ownerBusinesses || []).map((business) => business.id)
      if (!businessIds.length) {
        setQueues([])
        setServices([])
        return
      }

      const [queueRowsByBiz, serviceRowsByBiz] = await Promise.all([
        Promise.all(businessIds.map((businessId) => getQueues(businessId))),
        Promise.all(businessIds.map((businessId) => getServices(businessId, { includeInactive: true }))),
      ])

      const flatQueues = queueRowsByBiz.flat()
      setServices(serviceRowsByBiz.flat())

      const entryRows = await Promise.all(flatQueues.map((queue) => getQueueEntries(queue.id)))
      const entriesByQueue = new Map(flatQueues.map((queue, idx) => [queue.id, entryRows[idx] || []]))

      setQueues(normalizeQueues(flatQueues, entriesByQueue))
    } catch (error) {
      console.error('[Queues] Failed to load:', error)
      toast.error('Failed to load queues')
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
  }, [user?.id])

  const openCreateQueueModal = () => {
    if (!businesses.length) {
      toast.error('No business profile found for your account')
      return
    }

    const firstBusinessId = businesses[0].id
    const firstBusinessService = services.find((service) => service.business_id === firstBusinessId && service.is_active)

    setQueueForm({
      businessId: firstBusinessId,
      serviceId: firstBusinessService?.id || '',
      name: firstBusinessService ? `${firstBusinessService.name} Queue` : '',
      estimatedWaitTime: '15',
      maxCapacity: '50',
    })
    setIsCreateQueueModalOpen(true)
  }

  const activeServicesForSelectedBusiness = useMemo(() => {
    return services.filter((service) => service.business_id === queueForm.businessId && service.is_active)
  }, [services, queueForm.businessId])

  const handleCreateQueue = async (event) => {
    event.preventDefault()

    if (!queueForm.businessId) {
      toast.error('Please select a business')
      return
    }
    if (!queueForm.name.trim()) {
      toast.error('Queue name is required')
      return
    }

    try {
      setCreatingQueue(true)
      await createQueue({
        business_id: queueForm.businessId,
        service_id: queueForm.serviceId || null,
        name: queueForm.name.trim(),
        estimated_wait_time: Number(queueForm.estimatedWaitTime) || 0,
        max_capacity: Number(queueForm.maxCapacity) || null,
        status: 'active',
      })

      setIsCreateQueueModalOpen(false)
      toast.success('Queue created successfully')
      loadQueues({ silent: true })
    } catch (error) {
      console.error('[Queues] Failed to create queue:', error)
      toast.error(error?.message || 'Failed to create queue')
    } finally {
      setCreatingQueue(false)
    }
  }

  const handleQueueAction = async (queueId, action, queue) => {
    try {
      setBusyQueueId(queueId)

      if (action === 'pause') {
        await updateQueue(queueId, { status: 'paused' })
      } else if (action === 'resume') {
        await updateQueue(queueId, { status: 'active' })
      } else if (action === 'next') {
        // Complete current serving customer first if exists.
        if (queue?.currentServing?.id) {
          const completedEntry = await updateQueueEntry(queue.currentServing.id, {
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          await notifyQueueUpdateSafe(
            completedEntry,
            'Service Completed',
            `Your service in ${queue.name} has been completed. Thank you.`,
            { queueId: queue.id, queueName: queue.name, entryId: completedEntry.id, status: 'completed' }
          )
        }

        if (queue?.nextInLine?.id) {
          const nextServingEntry = await updateQueueEntry(queue.nextInLine.id, {
            status: 'serving',
            served_at: new Date().toISOString(),
          })
          await notifyQueueUpdateSafe(
            nextServingEntry,
            'Now Serving You',
            `It is now your turn in ${queue.name}. Please proceed to service desk.`,
            { queueId: queue.id, queueName: queue.name, entryId: nextServingEntry.id, status: 'serving' }
          )
        }
      }

      toast.success('Queue updated')
      await loadQueues({ silent: true })
    } catch (error) {
      console.error('[Queues] Failed to update queue:', error)
      toast.error('Failed to update queue')
    } finally {
      setBusyQueueId(null)
    }
  }

  const openQueueSettingsModal = (queue) => {
    setSelectedQueue(queue)
    setQueueSettingsForm({
      name: queue.name || '',
      estimatedWaitTime: String(queue.estimatedWaitTime || 0),
      maxCapacity: String(queue.maxCapacity || ''),
      status: queue.status || 'active',
    })
    setIsQueueSettingsModalOpen(true)
  }

  const handleSaveQueueSettings = async (event) => {
    event.preventDefault()
    if (!selectedQueue?.id) return

    if (!queueSettingsForm.name.trim()) {
      toast.error('Queue name is required')
      return
    }

    try {
      setSavingQueueSettings(true)
      const updated = await updateQueue(selectedQueue.id, {
        name: queueSettingsForm.name.trim(),
        estimated_wait_time: Number(queueSettingsForm.estimatedWaitTime) || 0,
        max_capacity: Number(queueSettingsForm.maxCapacity) || null,
        status: queueSettingsForm.status,
      })

      setQueues((prev) => prev.map((queue) => {
        if (queue.id !== selectedQueue.id) return queue
        return {
          ...queue,
          name: updated.name,
          estimatedWaitTime: Number(updated.estimated_wait_time || 0),
          avgWaitTime: `${Number(updated.estimated_wait_time || 0)} min`,
          maxCapacity: Number(updated.max_capacity || 0),
          status: updated.status,
          estimatedCompletion: updated.status === 'paused' ? 'Paused' : updated.status === 'closed' ? 'Closed' : 'Active',
        }
      }))

      setIsQueueSettingsModalOpen(false)
      toast.success('Queue settings updated')
      loadQueues({ silent: true })
    } catch (error) {
      console.error('[Queues] Failed to save queue settings:', error)
      toast.error(error?.message || 'Failed to save queue settings')
    } finally {
      setSavingQueueSettings(false)
    }
  }

  const handleToggleCloseQueue = async () => {
    if (!selectedQueue?.id) return

    try {
      setSavingQueueSettings(true)
      const targetStatus = queueSettingsForm.status === 'closed' ? 'active' : 'closed'
      await updateQueue(selectedQueue.id, { status: targetStatus })
      setQueueSettingsForm((prev) => ({ ...prev, status: targetStatus }))
      toast.success(targetStatus === 'closed' ? 'Queue closed' : 'Queue reopened')
      await loadQueues({ silent: true })
    } catch (error) {
      console.error('[Queues] Failed to toggle queue status:', error)
      toast.error(error?.message || 'Failed to update queue status')
    } finally {
      setSavingQueueSettings(false)
    }
  }

  const handleEntryAction = async (entryId, action) => {
    try {
      setEntryActionId(entryId)

      const activeQueue = queues.find((queue) => queue.id === selectedQueue?.id)
      const activeEntry = activeQueue
        ? [...(activeQueue.waitingEntries || []), ...(activeQueue.snoozedEntries || [])].find((entry) => entry.id === entryId)
        : null

      if (action === 'call') {
        const updated = await updateQueueEntry(entryId, { status: 'called', called_at: new Date().toISOString() })
        await notifyQueueUpdateSafe(
          updated,
          'Queue Call',
          `You have been called in ${activeQueue?.name || 'the queue'}. Please be ready.`,
          { queueId: activeQueue?.id, queueName: activeQueue?.name, entryId: updated.id, status: 'called' }
        )
      } else if (action === 'serve') {
        const updated = await updateQueueEntry(entryId, { status: 'serving', served_at: new Date().toISOString() })
        await notifyQueueUpdateSafe(
          updated,
          'Service Session Started',
          `Your service session has started in ${activeQueue?.name || 'the queue'}.`,
          { queueId: activeQueue?.id, queueName: activeQueue?.name, entryId: updated.id, status: 'serving' }
        )
      } else if (action === 'cancel') {
        const updated = await updateQueueEntry(entryId, { status: 'cancelled' })
        await notifyQueueUpdateSafe(
          updated,
          'Queue Entry Removed',
          `Your queue entry in ${activeQueue?.name || 'the queue'} has been removed.`,
          { queueId: activeQueue?.id, queueName: activeQueue?.name, entryId: updated.id, status: 'cancelled' }
        )
      }

      await loadQueues({ silent: true })

      if (selectedQueue) {
        const updated = queues.find((q) => q.id === selectedQueue.id)
        setSelectedQueue(updated || null)
      }

      toast.success('Entry updated')
    } catch (error) {
      console.error('[Queues] Failed to update entry:', error)
      toast.error('Failed to update entry')
    } finally {
      setEntryActionId(null)
    }
  }

  const filteredQueues = useMemo(() => {
    return queues.filter((queue) => {
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch = !q
        || String(queue.name || '').toLowerCase().includes(q)
        || String(queue.serviceName || '').toLowerCase().includes(q)
        || String(queue.category || '').toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'all' || queue.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [queues, searchTerm, statusFilter])

  const queueStats = useMemo(() => {
    const totalInQueue = queues.reduce((sum, q) => sum + q.totalWaiting, 0)
    const avgWaitNum = queues.length
      ? Math.round(queues.reduce((sum, q) => sum + Number(q.estimatedWaitTime || 0), 0) / queues.length)
      : 0
    const servingCount = queues.filter((q) => q.currentServing).length
    const highPriority = queues.filter((q) => Number(q.estimatedWaitTime || 0) > 30).length
    return { totalInQueue, avgWaitNum, servingCount, highPriority }
  }, [queues])

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading queues...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'paused': return 'text-yellow-600 bg-yellow-100'
      case 'closed': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (waitTime) => {
    const minutes = parseInt(waitTime, 10)
    if (minutes > 30) return 'border-l-red-500 bg-red-50'
    if (minutes > 15) return 'border-l-yellow-500 bg-yellow-50'
    return 'border-l-green-500 bg-green-50'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Queue Management</h1>
          <p className="text-secondary-600">Monitor queues, move customers forward, and manage real-time flow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => loadQueues({ silent: true })}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2" onClick={openCreateQueueModal}>
            <Plus className="h-4 w-4" />
            Create Queue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total in Queue</p>
                <p className="text-2xl font-bold">{queueStats.totalInQueue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold">{queueStats.avgWaitNum}min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Currently Serving</p>
                <p className="text-2xl font-bold">{queueStats.servingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">High Wait Queues</p>
                <p className="text-2xl font-bold">{queueStats.highPriority}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center flex-wrap">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search queue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <span className="text-sm text-secondary-600">{filteredQueues.length} queue(s)</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredQueues.map((queue) => (
          <Card key={queue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{queue.name}</CardTitle>
                  <p className="text-sm text-gray-600">{queue.serviceName} · {queue.category}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(queue.status)}`}>
                  {queue.status.charAt(0).toUpperCase() + queue.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {queue.currentServing ? (
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Currently Serving</p>
                      <p className="text-lg font-bold text-blue-700">{queue.currentServing.number} - {queue.currentServing.name}</p>
                      <p className="text-sm text-gray-600">Wait time: {queue.currentServing.waitTime}</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-l-gray-300">
                  <p className="text-sm font-medium text-gray-500">No one currently being served</p>
                </div>
              )}

              {queue.nextInLine && (
                <div className={`p-3 rounded-lg border-l-4 ${getPriorityColor(queue.nextInLine.waitTime)}`}>
                  <div className="flex justify-between items-center gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Next in Line</p>
                      <p className="font-semibold text-gray-900">{queue.nextInLine.number} - {queue.nextInLine.name}</p>
                      <p className="text-sm text-gray-600">Waiting: {queue.nextInLine.waitTime}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          if (!queue.nextInLine.phone) {
                            toast.error('No phone number available')
                            return
                          }
                          window.open(`tel:${queue.nextInLine.phone}`)
                        }}
                        title="Call customer"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => toast.success(`Message flow for ${queue.nextInLine.name} coming soon`)}
                        title="Send message"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Waiting</p>
                  <p className="font-semibold">{queue.totalWaiting} people</p>
                </div>
                <div>
                  <p className="text-gray-600">Step Away</p>
                  <p className="font-semibold">{queue.totalSnoozed || 0} people</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Wait</p>
                  <p className="font-semibold">{queue.avgWaitTime}</p>
                </div>
                <div>
                  <p className="text-gray-600">Capacity</p>
                  <p className="font-semibold">{queue.maxCapacity || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Queue Status</p>
                  <p className="font-semibold">{queue.estimatedCompletion}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t flex-wrap">
                {queue.status === 'active' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQueueAction(queue.id, 'pause', queue)}
                    className="flex items-center gap-1"
                    disabled={busyQueueId === queue.id}
                  >
                    <Pause className="h-3 w-3" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleQueueAction(queue.id, 'resume', queue)}
                    className="flex items-center gap-1"
                    disabled={busyQueueId === queue.id}
                  >
                    <Play className="h-3 w-3" />
                    Resume
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQueueAction(queue.id, 'next', queue)}
                  className="flex items-center gap-1"
                  disabled={!queue.nextInLine || busyQueueId === queue.id}
                >
                  <SkipForward className="h-3 w-3" />
                  Next
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedQueue(queue)
                    setIsEntriesModalOpen(true)
                  }}
                  className="flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  View All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openQueueSettingsModal(queue)}
                  className="flex items-center gap-1"
                >
                  <Settings className="h-3 w-3" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {!filteredQueues.length && (
          <Card className="lg:col-span-2">
            <CardContent className="p-8 text-center">
              <Users className="h-8 w-8 text-secondary-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-secondary-900">No queues found</h3>
              <p className="text-secondary-600 mt-1">Create a queue or adjust filters.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2" onClick={openCreateQueueModal}>
              <Plus className="h-5 w-5" />
              <span>Create New Queue</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2" onClick={() => toast.success('Use customer bookings page for appointment scheduling')}>
              <Clock className="h-5 w-5" />
              <span>Schedule Appointment</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2" onClick={() => toast.success('Notification center coming soon')}>
              <MessageSquare className="h-5 w-5" />
              <span>Send Notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isCreateQueueModalOpen}
        onClose={() => setIsCreateQueueModalOpen(false)}
        title="Create Queue"
        size="lg"
      >
        <form onSubmit={handleCreateQueue} className="space-y-4">
          {businesses.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Business</label>
              <select
                value={queueForm.businessId}
                onChange={(e) => {
                  const businessId = e.target.value
                  const firstService = services.find((service) => service.business_id === businessId && service.is_active)
                  setQueueForm((prev) => ({
                    ...prev,
                    businessId,
                    serviceId: firstService?.id || '',
                    name: firstService ? `${firstService.name} Queue` : prev.name,
                  }))
                }}
                className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>{business.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Service (Optional)</label>
            <select
              value={queueForm.serviceId}
              onChange={(e) => setQueueForm((prev) => ({ ...prev, serviceId: e.target.value }))}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">No linked service</option>
              {activeServicesForSelectedBusiness.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Queue Name"
            value={queueForm.name}
            onChange={(e) => setQueueForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. General Consultation Queue"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Estimated Wait Time (minutes)"
              type="number"
              min="0"
              value={queueForm.estimatedWaitTime}
              onChange={(e) => setQueueForm((prev) => ({ ...prev, estimatedWaitTime: e.target.value }))}
            />
            <Input
              label="Max Capacity"
              type="number"
              min="1"
              value={queueForm.maxCapacity}
              onChange={(e) => setQueueForm((prev) => ({ ...prev, maxCapacity: e.target.value }))}
            />
          </div>

          <ModalFooter className="px-0 pb-0 border-t-0">
            <Button type="button" variant="outline" onClick={() => setIsCreateQueueModalOpen(false)} disabled={creatingQueue}>
              Cancel
            </Button>
            <Button type="submit" disabled={creatingQueue}>
              {creatingQueue ? 'Creating...' : 'Create Queue'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal
        isOpen={isEntriesModalOpen}
        onClose={() => {
          setIsEntriesModalOpen(false)
          setSelectedQueue(null)
        }}
        title={selectedQueue ? `${selectedQueue.name} Entries` : 'Queue Entries'}
        size="xl"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {!selectedQueue?.waitingEntries?.length && !(selectedQueue?.snoozedEntries || []).length && (
            <p className="text-sm text-secondary-500">No waiting entries in this queue.</p>
          )}

          {(selectedQueue?.waitingEntries || []).map((entry) => (
            <div key={entry.id} className="p-3 border border-secondary-200 rounded-lg flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-secondary-900">#{entry.position || 'N/A'} · {getCustomerName(entry)}</p>
                <p className="text-sm text-secondary-600">Status: {entry.status}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEntryAction(entry.id, 'call')}
                  disabled={entryActionId === entry.id}
                >
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEntryAction(entry.id, 'serve')}
                  disabled={entryActionId === entry.id}
                >
                  Serve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEntryAction(entry.id, 'cancel')}
                  disabled={entryActionId === entry.id}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          {(selectedQueue?.snoozedEntries || []).map((entry) => (
            <div key={entry.id} className="p-3 border border-amber-200 bg-amber-50 rounded-lg flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-secondary-900">#{entry.position || 'N/A'} · {getCustomerName(entry)}</p>
                <p className="text-sm text-secondary-700">Status: Step Away</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEntryAction(entry.id, 'call')}
                  disabled={entryActionId === entry.id}
                >
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEntryAction(entry.id, 'cancel')}
                  disabled={entryActionId === entry.id}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={isQueueSettingsModalOpen}
        onClose={() => {
          setIsQueueSettingsModalOpen(false)
          setSelectedQueue(null)
        }}
        title={selectedQueue ? `${selectedQueue.name} Settings` : 'Queue Settings'}
        size="lg"
      >
        <form onSubmit={handleSaveQueueSettings} className="space-y-4">
          <Input
            label="Queue Name"
            value={queueSettingsForm.name}
            onChange={(e) => setQueueSettingsForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Estimated Wait Time (minutes)"
              type="number"
              min="0"
              value={queueSettingsForm.estimatedWaitTime}
              onChange={(e) => setQueueSettingsForm((prev) => ({ ...prev, estimatedWaitTime: e.target.value }))}
            />
            <Input
              label="Max Capacity"
              type="number"
              min="1"
              value={queueSettingsForm.maxCapacity}
              onChange={(e) => setQueueSettingsForm((prev) => ({ ...prev, maxCapacity: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Queue Status</label>
            <select
              value={queueSettingsForm.status}
              onChange={(e) => setQueueSettingsForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="p-3 rounded-lg bg-secondary-50 border border-secondary-200 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-secondary-900">Quick Status Toggle</p>
              <p className="text-xs text-secondary-600">Instantly close or reopen this queue.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleToggleCloseQueue}
              disabled={savingQueueSettings}
            >
              {queueSettingsForm.status === 'closed' ? 'Reopen Queue' : 'Close Queue'}
            </Button>
          </div>

          <ModalFooter className="px-0 pb-0 border-t-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsQueueSettingsModalOpen(false)}
              disabled={savingQueueSettings}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={savingQueueSettings}>
              {savingQueueSettings ? 'Saving...' : 'Save Queue Settings'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}
