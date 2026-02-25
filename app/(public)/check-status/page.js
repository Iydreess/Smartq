'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui'
import { getQueueEntryById, getQueueEntriesByPhone } from '@/lib/supabase/queries'
import toast from 'react-hot-toast'
import { Clock, Users, MapPin, Phone, Search, CheckCircle, AlertCircle, Hash } from 'lucide-react'

/**
 * Check Queue Status Page - Public page for checking queue status
 */
export default function CheckStatusPage() {
  const [searchType, setSearchType] = useState('id') // 'id' or 'phone'
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [queueEntry, setQueueEntry] = useState(null)
  const [queueEntries, setQueueEntries] = useState([])
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchValue.trim()) {
      toast.error('Please enter a search value')
      return
    }

    try {
      setLoading(true)
      setSearched(true)
      setQueueEntry(null)
      setQueueEntries([])

      if (searchType === 'id') {
        const entry = await getQueueEntryById(searchValue.trim())
        if (entry) {
          setQueueEntry(entry)
        } else {
          toast.error('Queue entry not found')
        }
      } else {
        const entries = await getQueueEntriesByPhone(searchValue.trim())
        if (entries && entries.length > 0) {
          setQueueEntries(entries)
        } else {
          toast.error('No active queue entries found for this phone number')
        }
      }
    } catch (error) {
      console.error('Error searching:', error)
      toast.error('Failed to search. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'waiting':
        return { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock, label: 'Waiting' }
      case 'called':
        return { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertCircle, label: 'Called' }
      case 'serving':
        return { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'Being Served' }
      default:
        return { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Clock, label: status }
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const renderQueueEntryCard = (entry) => {
    const statusInfo = getStatusInfo(entry.status)
    const StatusIcon = statusInfo.icon

    return (
      <Card key={entry.id} className="hover:shadow-medium transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">
                {entry.queue?.name || 'Queue'}
              </CardTitle>
              {entry.queue?.business && (
                <div className="flex items-start gap-2 text-sm text-secondary-600">
                  <MapPin className="h-4 w-4 mt-0.5 text-secondary-500" />
                  <div>
                    <p className="font-medium text-secondary-900">{entry.queue.business.name}</p>
                    {entry.queue.business.address && (
                      <p className="text-xs">{entry.queue.business.address}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusInfo.color}`}>
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{statusInfo.label}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-800">Position</span>
              </div>
              <p className="text-2xl font-bold text-primary-900">#{entry.position}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Joined At</span>
              </div>
              <p className="text-lg font-bold text-blue-900">{formatTime(entry.joined_at)}</p>
              <p className="text-xs text-blue-700">{formatDate(entry.joined_at)}</p>
            </div>

            {entry.estimated_wait_time && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Est. Wait</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{entry.estimated_wait_time}</p>
                <p className="text-xs text-green-700">minutes</p>
              </div>
            )}

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Entry ID</span>
              </div>
              <p className="text-xs font-mono text-purple-900 break-all">{entry.id.slice(0, 8)}...</p>
            </div>
          </div>

          {entry.notes && (
            <div className="bg-secondary-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-secondary-900 mb-1">Notes:</p>
              <p className="text-sm text-secondary-700">{entry.notes}</p>
            </div>
          )}

          {entry.status === 'called' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Your turn is coming up!</p>
                  <p className="text-sm text-yellow-800">
                    Please be ready. You will be served soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {entry.status === 'serving' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 mb-1">You are being served!</p>
                  <p className="text-sm text-green-800">
                    Please proceed to the service counter.
                  </p>
                </div>
              </div>
            </div>
          )}

          {entry.queue?.business?.phone && (
            <div className="flex items-center gap-2 text-sm text-secondary-600 pt-4 border-t">
              <Phone className="h-4 w-4" />
              <span>Contact: {entry.queue.business.phone}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Check Queue Status
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Enter your queue entry ID or phone number to check your current position and estimated wait time.
        </p>
      </div>

      {/* Search Form */}
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Search for Your Queue Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Type Selection */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setSearchType('id')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  searchType === 'id'
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                }`}
              >
                <Hash className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Entry ID</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchType('phone')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  searchType === 'phone'
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                }`}
              >
                <Phone className="h-5 w-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Phone Number</span>
              </button>
            </div>

            {/* Search Input */}
            <Input
              label={searchType === 'id' ? 'Queue Entry ID' : 'Phone Number'}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                searchType === 'id'
                  ? 'Enter your queue entry ID (e.g., 12345678-1234-...)'
                  : 'Enter your phone number (e.g., +1234567890)'
              }
              helperText={
                searchType === 'id'
                  ? 'Your entry ID was provided when you joined the queue'
                  : 'Enter the phone number you used to join the queue'
              }
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check Status
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {searched && !loading && (
        <div className="space-y-6">
          {queueEntry && renderQueueEntryCard(queueEntry)}
          
          {queueEntries.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-secondary-900">
                Your Queue Entries ({queueEntries.length})
              </h2>
              {queueEntries.map(renderQueueEntryCard)}
            </>
          )}

          {!queueEntry && queueEntries.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  No Results Found
                </h3>
                <p className="text-secondary-600 mb-4">
                  We couldn&apos;t find any active queue entries matching your search.
                </p>
                <div className="space-y-2 text-sm text-secondary-600">
                  <p>• Check that you entered the correct information</p>
                  <p>• Make sure you have an active queue entry</p>
                  <p>• Completed or cancelled entries won&apos;t appear here</p>
                </div>
                <div className="mt-6">
                  <Link href="/queue/join">
                    <Button>Join a Queue</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-secondary-900 text-center mb-8">
          Need Help?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="text-center pt-6">
              <Hash className="h-10 w-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-secondary-900 mb-2">
                Where&apos;s my Entry ID?
              </h3>
              <p className="text-sm text-secondary-600">
                Your entry ID is shown when you successfully join a queue. Check your confirmation message or email.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center pt-6">
              <Users className="h-10 w-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-secondary-900 mb-2">
                Have an Account?
              </h3>
              <p className="text-sm text-secondary-600 mb-3">
                Log in to view all your queue entries and bookings in one place.
              </p>
              <Link href="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center pt-6">
              <Clock className="h-10 w-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-secondary-900 mb-2">
                Join a Queue
              </h3>
              <p className="text-sm text-secondary-600 mb-3">
                Browse available queues and join one to get started.
              </p>
              <Link href="/queue/join">
                <Button variant="outline" size="sm">Browse Queues</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
