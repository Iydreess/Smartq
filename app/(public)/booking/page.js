import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui'

/**
 * Appointment Booking Page - Public page for customers to book appointments
 */
export default function BookingPage() {
  const availableServices = [
    {
      id: 1,
      name: 'General Consultation',
      duration: 30,
      price: 50,
      description: 'General consultation and basic health check',
      nextAvailable: '2025-09-26T09:00:00Z',
    },
    {
      id: 2,
      name: 'Specialist Consultation',
      duration: 60,
      price: 100,
      description: 'Detailed consultation with our specialist',
      nextAvailable: '2025-09-26T14:00:00Z',
    },
    {
      id: 3,
      name: 'Follow-up Appointment',
      duration: 20,
      price: 30,
      description: 'Follow-up appointment for existing patients',
      nextAvailable: '2025-09-26T11:00:00Z',
    },
  ]

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ]

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Book an Appointment
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Schedule your appointment online and skip the wait. Choose your preferred 
          service, date, and time slot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select a Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableServices.map((service) => (
                  <div 
                    key={service.id} 
                    className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900 mb-1">
                          {service.name}
                        </h3>
                        <p className="text-secondary-600 text-sm mb-2">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-secondary-500">
                          <span>Duration: {service.duration} min</span>
                          <span>Price: ${service.price}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-secondary-500 mb-1">Next available:</p>
                        <p className="text-sm font-medium text-secondary-900">
                          Tomorrow 9:00 AM
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar and Time Selection */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Available Times
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time, index) => (
                      <button
                        key={index}
                        className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                          index % 3 === 0 
                            ? 'bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100'
                            : 'bg-white border-secondary-200 text-secondary-700 hover:bg-secondary-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="+1 (555) 123-4567"
                  helperText="We'll send appointment reminders via SMS"
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                />
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any specific concerns or requests..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-xs text-secondary-600">
                    I agree to the terms and conditions and privacy policy
                  </label>
                </div>

                <Button className="w-full">
                  Book Appointment
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Service:</span>
                  <span className="font-medium">General Consultation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Date:</span>
                  <span className="font-medium">Tomorrow</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Time:</span>
                  <span className="font-medium">9:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Duration:</span>
                  <span className="font-medium">30 minutes</span>
                </div>
                <div className="border-t border-secondary-200 pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">$50</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-secondary-900 text-center mb-8">
          Why Book Online?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Save Time</h3>
            <p className="text-secondary-600">
              Book instantly without calling or waiting on hold
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5a6 6 0 1012 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Get Reminders</h3>
            <p className="text-secondary-600">
              Automatic SMS and email reminders before your appointment
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Easy Rescheduling</h3>
            <p className="text-secondary-600">
              Reschedule or cancel appointments online anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}