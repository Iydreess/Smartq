'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Modal, LoadingSpinner } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import { getAllActiveQueues, joinQueue } from '@/lib/supabase/queries'
import toast from 'react-hot-toast'
import { Users, Clock, MapPin, CheckCircle } from 'lucide-react'

/**
 * Queue Join Page - Public page for customers to join a queue
 */
export default function QueueJoinPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [queues, setQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQueue, setSelectedQueue] = useState(null)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joining, setJoining] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [customerName, setCustomerName] = useState('')

  // Fetch active queues
  useEffect(() => {
    fetchQueues()
  }, [])

  async function fetchQueues() {
    try {
      setLoading(true)
      const data = await getAllActiveQueues()
      setQueues(data || [])
    } catch (error) {
      console.error('Error fetching queues:', error)
      toast.error('Failed to load available queues')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClick = (queue) => {
    setSelectedQueue(queue)
    setShowJoinModal(true)
  }

  const handleJoinQueue = async () => {
    if (!user) {
      toast.error('Please log in to join a queue')
      router.push('/login?redirect=/queue/join')
      return
    }

    if (!selectedQueue) return

    try {
      setJoining(true)
      const entry = await joinQueue(selectedQueue.id, user.id)
      
      toast.success('Successfully joined the queue!', {
        duration: 4000,
        icon: '🎉',
      })
      
      setShowJoinModal(false)
      
      // Redirect to customer queue page
      setTimeout(() => {
        router.push('/customer/queue')
      }, 1500)
    } catch (error) {
      console.error('Error joining queue:', error)
      toast.error(error.message || 'Failed to join queue. Please try again.')
    } finally {
      setJoining(false)
    }
  }

  const getQueueColor = (index) => {
    const colors = [
      'bg-primary-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
    ]
    return colors[index % colors.length]
  }

  if (loading || userLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Join a Queue
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Select a service queue below and we&apos;ll notify you when it&apos;s your turn. 
          No more waiting in line!
        </p>
      </div>

      {/* Available Queues */}
      {queues.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              No Active Queues
            </h3>
            <p className="text-secondary-600 mb-4">
              There are currently no active queues available. Please check back later.
            </p>
            <Button onClick={fetchQueues}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {queues.map((queue, index) => (
            <Card key={queue.id} className="hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getQueueColor(index)}`} />
                  <CardTitle className="text-lg">{queue.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 mb-4">
                  {queue.description || 'No description available'}
                </p>
                
                {queue.business && (
                  <div className="mb-4 pb-4 border-b">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-secondary-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-secondary-900">{queue.business.name}</p>
                        {queue.business.address && (
                          <p className="text-secondary-600 text-xs">{queue.business.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      People in Queue:
                    </span>
                    <span className="font-medium text-secondary-900">{queue.peopleInQueue}</span>
                  </div>
                  {queue.estimated_wait_time && (
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Estimated Wait:
                      </span>
                      <span className="font-medium text-secondary-900">{queue.estimated_wait_time} min</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleJoinClick(queue)}
                >
                  Join This Queue
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Join with Phone Number */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Quick Join with Phone Number</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-secondary-600">
              Don&apos;t have an account? Provide your phone number to receive queue updates via SMS.
            </p>
            <Input
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              helperText="We'll send you updates via SMS"
            />
            <Input
              label="Your Name (Optional)"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
            />
            <Button 
              className="w-full"
              variant="outline"
              onClick={() => toast.info('SMS notifications feature coming soon!')}
            >
              Get Queue Updates
            </Button>
            <div className="text-center">
              <p className="text-sm text-secondary-600">
                Or{' '}
                <button
                  onClick={() => router.push('/signup')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  create an account
                </button>
                {' '}for the full experience
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* How it Works */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-secondary-900 text-center mb-8">
          How it Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Choose Your Queue</h3>
            <p className="text-secondary-600">
              Select the service queue that matches your needs
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Get Your Number</h3>
            <p className="text-secondary-600">
              Receive your queue number and estimated wait time
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Get Notified</h3>
            <p className="text-secondary-600">
              We&apos;ll notify you when it&apos;s your turn - no waiting around!
            </p>
          </div>
        </div>
      </div>

      {/* Join Queue Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Join Queue"
        size="md"
      >
        {selectedQueue && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {selectedQueue.name}
              </h3>
              <p className="text-secondary-600">
                {selectedQueue.description || 'No description available'}
              </p>
            </div>

            {selectedQueue.business && (
              <div className="bg-secondary-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-secondary-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary-900">{selectedQueue.business.name}</p>
                    {selectedQueue.business.address && (
                      <p className="text-secondary-600 text-sm mt-1">{selectedQueue.business.address}</p>
                    )}
                    {selectedQueue.business.phone && (
                      <p className="text-secondary-600 text-sm mt-1">{selectedQueue.business.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">In Queue</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{selectedQueue.peopleInQueue}</p>
              </div>

              {selectedQueue.estimated_wait_time && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Est. Wait</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{selectedQueue.estimated_wait_time} min</p>
                </div>
              )}
            </div>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You need to be logged in to join a queue. You&apos;ll be redirected to the login page.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowJoinModal(false)}
                className="flex-1"
                disabled={joining}
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinQueue}
                className="flex-1"
                disabled={joining}
              >
                {joining ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Joining...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Join
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}