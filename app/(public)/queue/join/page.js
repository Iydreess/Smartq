import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui'

/**
 * Queue Join Page - Public page for customers to join a queue
 */
export default function QueueJoinPage() {
  const availableQueues = [
    {
      id: 1,
      name: 'General Service',
      description: 'General inquiries and basic services',
      currentNumber: 1042,
      peopleInQueue: 8,
      estimatedWait: 25,
      color: 'bg-primary-500',
    },
    {
      id: 2,
      name: 'Premium Support',
      description: 'Priority support for premium customers',
      currentNumber: 2018,
      peopleInQueue: 3,
      estimatedWait: 12,
      color: 'bg-warning-500',
    },
    {
      id: 3,
      name: 'Technical Support',
      description: 'Technical issues and troubleshooting',
      currentNumber: 3007,
      peopleInQueue: 12,
      estimatedWait: 35,
      color: 'bg-success-500',
    },
  ]

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {availableQueues.map((queue) => (
          <Card key={queue.id} className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${queue.color}`} />
                <CardTitle className="text-lg">{queue.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600 mb-4">{queue.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Current Number:</span>
                  <span className="font-medium text-secondary-900">#{queue.currentNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">People in Queue:</span>
                  <span className="font-medium text-secondary-900">{queue.peopleInQueue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Estimated Wait:</span>
                  <span className="font-medium text-secondary-900">{queue.estimatedWait} min</span>
                </div>
              </div>
              
              <Button className="w-full">
                Join This Queue
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Join with Phone Number */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join with Your Phone Number</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              helperText="We'll send you updates via SMS"
            />
            <Input
              label="Your Name (Optional)"
              type="text"
              placeholder="Enter your name"
            />
            <Button className="w-full">
              Get Queue Updates
            </Button>
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
    </div>
  )
}