'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Bell, Mail, MessageSquare, Calendar, AlertTriangle,
  Check, X, Eye, Archive, Star, Clock, User,
  Filter, Search, MoreVertical, Trash2, MarkAsUnread,
  CheckCircle, AlertCircle, Info, Zap, Heart,
  Settings, Download, Share2, BookOpen, CreditCard
} from 'lucide-react'

/**
 * Customer Notifications Page - Message center for all notifications
 */
export default function CustomerNotifications() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedNotifications, setSelectedNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [notifications] = useState([
    {
      id: 1,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Your Strategy Consulting appointment with James Wilson has been confirmed for October 2nd at 2:00 PM.',
      timestamp: '2025-10-01T14:30:00Z',
      isRead: false,
      priority: 'high',
      category: 'booking',
      actionButtons: [
        { label: 'View Details', action: 'view', variant: 'primary' },
        { label: 'Add to Calendar', action: 'calendar', variant: 'outline' }
      ],
      metadata: {
        bookingId: 'BK-2025-001',
        service: 'Strategy Consulting',
        staff: 'James Wilson',
        datetime: '2025-10-02T14:00:00Z',
        location: 'Conference Room A'
      }
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Upcoming Appointment Reminder',
      message: 'Your Personal Training Session with Alex Johnson is scheduled for tomorrow at 6:00 AM. Don\'t forget your workout gear!',
      timestamp: '2025-10-01T12:00:00Z',
      isRead: true,
      priority: 'medium',
      category: 'reminder',
      actionButtons: [
        { label: 'Reschedule', action: 'reschedule', variant: 'outline' },
        { label: 'Cancel', action: 'cancel', variant: 'ghost' }
      ],
      metadata: {
        bookingId: 'BK-2025-002',
        service: 'Personal Training Session',
        staff: 'Alex Johnson',
        datetime: '2025-10-02T06:00:00Z',
        location: 'Gym Floor'
      }
    },
    {
      id: 3,
      type: 'payment_received',
      title: 'Payment Processed',
      message: 'Your payment of $300.00 for Strategy Consulting has been successfully processed. Receipt #RCP-2025-001.',
      timestamp: '2025-09-30T16:45:00Z',
      isRead: true,
      priority: 'low',
      category: 'payment',
      actionButtons: [
        { label: 'Download Receipt', action: 'download', variant: 'outline' },
        { label: 'View Transaction', action: 'view', variant: 'ghost' }
      ],
      metadata: {
        amount: 300.00,
        receiptId: 'RCP-2025-001',
        paymentMethod: 'Credit Card ending in 4567',
        service: 'Strategy Consulting'
      }
    },
    {
      id: 4,
      type: 'loyalty_points',
      title: 'Loyalty Points Earned',
      message: 'Congratulations! You\'ve earned 150 loyalty points from your recent booking. You\'re now 600 points away from Platinum status!',
      timestamp: '2025-09-30T15:20:00Z',
      isRead: false,
      priority: 'medium',
      category: 'loyalty',
      actionButtons: [
        { label: 'View Rewards', action: 'rewards', variant: 'primary' },
        { label: 'Redeem Points', action: 'redeem', variant: 'outline' }
      ],
      metadata: {
        pointsEarned: 150,
        totalPoints: 1250,
        nextTier: 'Platinum',
        pointsToNext: 600
      }
    },
    {
      id: 5,
      type: 'system_update',
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance will occur on October 5th from 2:00 AM to 4:00 AM. The booking system will be temporarily unavailable.',
      timestamp: '2025-09-29T10:00:00Z',
      isRead: true,
      priority: 'medium',
      category: 'system',
      actionButtons: [
        { label: 'Learn More', action: 'info', variant: 'outline' }
      ],
      metadata: {
        maintenanceStart: '2025-10-05T02:00:00Z',
        maintenanceEnd: '2025-10-05T04:00:00Z',
        affectedServices: ['Online Booking', 'Mobile App']
      }
    },
    {
      id: 6,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: 'Your Legal Consultation appointment scheduled for October 1st has been cancelled due to staff unavailability. Full refund has been processed.',
      timestamp: '2025-09-28T11:30:00Z',
      isRead: false,
      priority: 'high',
      category: 'booking',
      actionButtons: [
        { label: 'Rebook Service', action: 'rebook', variant: 'primary' },
        { label: 'View Refund', action: 'refund', variant: 'outline' }
      ],
      metadata: {
        originalBookingId: 'BK-2025-003',
        service: 'Legal Consultation',
        staff: 'David Wilson',
        refundAmount: 250.00,
        refundStatus: 'processed'
      }
    },
    {
      id: 7,
      type: 'promotional',
      title: 'Special Offer: 20% Off Wellness Services',
      message: 'Exclusive offer for Gold members! Get 20% off all wellness and fitness services this month. Use code WELLNESS20 at checkout.',
      timestamp: '2025-09-27T09:00:00Z',
      isRead: true,
      priority: 'low',
      category: 'promotional',
      actionButtons: [
        { label: 'Browse Services', action: 'browse', variant: 'primary' },
        { label: 'Copy Code', action: 'copy', variant: 'outline' }
      ],
      metadata: {
        promoCode: 'WELLNESS20',
        discount: 20,
        expiryDate: '2025-10-31T23:59:59Z',
        applicableServices: ['Personal Training', 'Yoga Classes', 'Wellness Coaching']
      }
    },
    {
      id: 8,
      type: 'review_request',
      title: 'How was your experience?',
      message: 'We\'d love to hear about your recent Strategy Consulting session with James Wilson. Your feedback helps us improve our services.',
      timestamp: '2025-09-26T14:00:00Z',
      isRead: false,
      priority: 'low',
      category: 'feedback',
      actionButtons: [
        { label: 'Leave Review', action: 'review', variant: 'primary' },
        { label: 'Maybe Later', action: 'later', variant: 'ghost' }
      ],
      metadata: {
        bookingId: 'BK-2025-004',
        service: 'Strategy Consulting',
        staff: 'James Wilson',
        sessionDate: '2025-09-25T14:00:00Z'
      }
    }
  ])

  const filters = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: notifications.filter(n => !n.isRead).length },
    { id: 'booking', name: 'Bookings', count: notifications.filter(n => n.category === 'booking').length },
    { id: 'reminder', name: 'Reminders', count: notifications.filter(n => n.category === 'reminder').length },
    { id: 'payment', name: 'Payments', count: notifications.filter(n => n.category === 'payment').length },
    { id: 'loyalty', name: 'Rewards', count: notifications.filter(n => n.category === 'loyalty').length },
    { id: 'promotional', name: 'Offers', count: notifications.filter(n => n.category === 'promotional').length }
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
      case 'booking_cancelled':
        return <Calendar className="h-5 w-5 text-blue-600" />
      case 'reminder':
        return <Clock className="h-5 w-5 text-orange-600" />
      case 'payment_received':
        return <CreditCard className="h-5 w-5 text-green-600" />
      case 'loyalty_points':
        return <Star className="h-5 w-5 text-yellow-600" />
      case 'system_update':
        return <AlertCircle className="h-5 w-5 text-blue-600" />
      case 'promotional':
        return <Zap className="h-5 w-5 text-purple-600" />
      case 'review_request':
        return <Heart className="h-5 w-5 text-pink-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500'
      case 'medium': return 'border-l-4 border-yellow-500'
      case 'low': return 'border-l-4 border-green-500'
      default: return 'border-l-4 border-gray-300'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !notification.isRead) ||
                         notification.category === selectedFilter
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const toggleSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const selectAll = () => {
    const allIds = filteredNotifications.map(n => n.id)
    setSelectedNotifications(allIds)
  }

  const clearSelection = () => {
    setSelectedNotifications([])
  }

  const markAsRead = (notificationIds) => {
    // Implementation for marking notifications as read
    console.log('Mark as read:', notificationIds)
  }

  const archiveNotifications = (notificationIds) => {
    // Implementation for archiving notifications
    console.log('Archive:', notificationIds)
  }

  const deleteNotifications = (notificationIds) => {
    // Implementation for deleting notifications
    console.log('Delete:', notificationIds)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-secondary-600">Stay updated with your bookings and account activity</p>
        </div>
        <div className="flex gap-3">
          <Link href="/customer/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button onClick={() => markAsRead(notifications.filter(n => !n.isRead).map(n => n.id))} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            {selectedNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-600">{selectedNotifications.length} selected</span>
                <Button variant="outline" size="sm" onClick={() => markAsRead(selectedNotifications)}>
                  <Check className="h-3 w-3 mr-1" />
                  Mark Read
                </Button>
                <Button variant="outline" size="sm" onClick={() => archiveNotifications(selectedNotifications)}>
                  <Archive className="h-3 w-3 mr-1" />
                  Archive
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteNotifications(selectedNotifications)}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === filter.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-700 border border-secondary-300 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {filter.name} ({filter.count})
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {filteredNotifications.length > 0 && (
        <div className="flex items-center justify-between text-sm text-secondary-600">
          <div className="flex items-center gap-4">
            <button 
              onClick={selectAll}
              className="hover:text-primary-600 transition-colors"
            >
              Select All ({filteredNotifications.length})
            </button>
            {selectedNotifications.length === filteredNotifications.length && (
              <button 
                onClick={clearSelection}
                className="hover:text-primary-600 transition-colors"
              >
                Clear Selection
              </button>
            )}
          </div>
          <div className="text-secondary-500">
            {filteredNotifications.length} notifications
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500 mb-4">
                {selectedFilter === 'all' 
                  ? "You're all caught up! Check back later for new updates." 
                  : `No ${selectedFilter} notifications at the moment.`}
              </p>
              {selectedFilter !== 'all' && (
                <Button onClick={() => setSelectedFilter('all')}>
                  View All Notifications
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`transition-all hover:shadow-md ${
              !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
            } ${getPriorityColor(notification.priority)}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleSelection(notification.id)}
                    className={`mt-1 w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                      selectedNotifications.includes(notification.id)
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}
                  >
                    {selectedNotifications.includes(notification.id) && (
                      <Check className="h-2 w-2 text-white" />
                    )}
                  </button>

                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className={`font-medium ${!notification.isRead ? 'text-secondary-900' : 'text-secondary-700'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-secondary-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-secondary-500 whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    {notification.metadata && (
                      <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-secondary-600">
                        {notification.type === 'booking_confirmed' && (
                          <div className="grid grid-cols-2 gap-2">
                            <span>Booking ID: {notification.metadata.bookingId}</span>
                            <span>Location: {notification.metadata.location}</span>
                          </div>
                        )}
                        {notification.type === 'payment_received' && (
                          <div>Amount: ${notification.metadata.amount} • {notification.metadata.paymentMethod}</div>
                        )}
                        {notification.type === 'loyalty_points' && (
                          <div>+{notification.metadata.pointsEarned} points • Total: {notification.metadata.totalPoints}</div>
                        )}
                        {notification.type === 'promotional' && (
                          <div>Code: {notification.metadata.promoCode} • Expires: {new Date(notification.metadata.expiryDate).toLocaleDateString()}</div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {notification.actionButtons && (
                      <div className="flex flex-wrap gap-2">
                        {notification.actionButtons.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => console.log(`Action: ${action.action}`, notification)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => markAsRead([notification.id])}
                      className="p-1 hover:bg-gray-100 rounded"
                      title={notification.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {notification.isRead ? (
                        <MarkAsUnread className="h-3 w-3 text-gray-500" />
                      ) : (
                        <Check className="h-3 w-3 text-gray-500" />
                      )}
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      title="More options"
                    >
                      <MoreVertical className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="w-full">
            Load More Notifications
          </Button>
        </div>
      )}
    </div>
  )
}