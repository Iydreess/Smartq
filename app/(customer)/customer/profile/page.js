'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  User, Mail, Phone, MapPin, Calendar, Settings,
  Edit, Save, X, Camera, Lock, Bell, Eye, EyeOff,
  CreditCard, Shield, Award, Star, Clock, Heart,
  FileText, Download, Upload, Trash2, AlertCircle
} from 'lucide-react'

/**
 * Customer Profile Page - Personal information management and account settings
 */
export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    birthDate: '1985-06-15',
    address: {
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States'
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
        marketing: false
      },
      language: 'en',
      timezone: 'America/Los_Angeles',
      accessibility: {
        largeText: false,
        highContrast: false,
        screenReader: false
      }
    },
    privacy: {
      profileVisible: true,
      shareData: false,
      trackingConsent: true
    }
  })

  const [bookingHistory] = useState([
    {
      id: 1,
      service: 'Strategy Consulting',
      date: '2025-09-28',
      time: '2:00 PM',
      staff: 'James Wilson',
      status: 'completed',
      rating: 5,
      cost: 300
    },
    {
      id: 2,
      service: 'Personal Training Session',
      date: '2025-09-25',
      time: '6:00 AM',
      staff: 'Alex Johnson',
      status: 'completed',
      rating: 4,
      cost: 80
    },
    {
      id: 3,
      service: 'Legal Consultation',
      date: '2025-09-20',
      time: '1:00 PM',
      staff: 'David Wilson',
      status: 'completed',
      rating: 5,
      cost: 250
    }
  ])

  const [loyaltyStats] = useState({
    totalPoints: 1250,
    currentTier: 'Gold',
    nextTier: 'Platinum',
    pointsToNext: 750,
    totalSpent: 2340,
    totalBookings: 12,
    favoriteService: 'Strategy Consulting'
  })

  const tabs = [
    { id: 'profile', name: 'Personal Info', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'history', name: 'Booking History', icon: Clock },
    { id: 'loyalty', name: 'Loyalty Program', icon: Award }
  ]

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset changes logic here
    setIsEditing(false)
  }

  const updateProfile = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateAddress = (field, value) => {
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
  }

  const updatePreferences = (category, field, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [field]: value
        }
      }
    }))
  }

  const updatePrivacy = (field, value) => {
    setProfile(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">My Profile</h1>
          <p className="text-secondary-600">Manage your account information and preferences</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Camera className="h-3 w-3 text-white" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-secondary-900">{profile.firstName} {profile.lastName}</h2>
              <p className="text-secondary-600">{profile.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-secondary-500">{profile.phone}</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  {loyaltyStats.currentTier} Member
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{loyaltyStats.totalPoints}</div>
              <div className="text-xs text-secondary-500">Loyalty Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Personal Information Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => updateProfile('firstName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => updateProfile('lastName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => updateProfile('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => updateProfile('birthDate', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={profile.address.street}
                    onChange={(e) => updateAddress('street', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">City</label>
                    <input
                      type="text"
                      value={profile.address.city}
                      onChange={(e) => updateAddress('city', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">State</label>
                    <input
                      type="text"
                      value={profile.address.state}
                      onChange={(e) => updateAddress('state', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={profile.address.zipCode}
                      onChange={(e) => updateAddress('zipCode', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Country</label>
                    <select
                      value={profile.address.country}
                      onChange={(e) => updateAddress('country', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary-900 capitalize">{key} Notifications</div>
                      <div className="text-sm text-secondary-500">
                        {key === 'email' && 'Receive booking confirmations and updates via email'}
                        {key === 'sms' && 'Get text message reminders and alerts'}
                        {key === 'push' && 'Browser and mobile push notifications'}
                        {key === 'marketing' && 'Promotional offers and service updates'}
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreferences('notifications', key, !value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Language</label>
                  <select
                    value={profile.preferences.language}
                    onChange={(e) => updatePreferences('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Timezone</label>
                  <select
                    value={profile.preferences.timezone}
                    onChange={(e) => updatePreferences('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-secondary-700 mb-3">Accessibility Options</h4>
                  <div className="space-y-3">
                    {Object.entries(profile.preferences.accessibility).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                        <button
                          onClick={() => updatePreferences('accessibility', key, !value)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            value ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-secondary-900">Privacy Controls</h3>
                  {Object.entries(profile.privacy).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-secondary-900">
                          {key === 'profileVisible' && 'Profile Visibility'}
                          {key === 'shareData' && 'Data Sharing'}
                          {key === 'trackingConsent' && 'Analytics Tracking'}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {key === 'profileVisible' && 'Allow other users to see your profile information'}
                          {key === 'shareData' && 'Share anonymized data for service improvements'}
                          {key === 'trackingConsent' && 'Allow analytics to improve your experience'}
                        </div>
                      </div>
                      <button
                        onClick={() => updatePrivacy(key, !value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-secondary-900">Security Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Enable Two-Factor Auth
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking History Tab */}
        {activeTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Booking History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingHistory.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-secondary-900">{booking.service}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-secondary-600">
                        <span>{booking.date} at {booking.time}</span>
                        <span>with {booking.staff}</span>
                        <span className="font-medium">${booking.cost}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {renderStars(booking.rating)}
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loyalty Program Tab */}
        {activeTab === 'loyalty' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Loyalty Program Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">{loyaltyStats.totalPoints}</div>
                    <div className="text-sm text-secondary-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">{loyaltyStats.currentTier}</div>
                    <div className="text-sm text-secondary-600">Current Tier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{loyaltyStats.pointsToNext}</div>
                    <div className="text-sm text-secondary-600">Points to {loyaltyStats.nextTier}</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress to {loyaltyStats.nextTier}</span>
                    <span className="text-sm text-secondary-600">
                      {loyaltyStats.totalPoints} / {loyaltyStats.totalPoints + loyaltyStats.pointsToNext}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(loyaltyStats.totalPoints / (loyaltyStats.totalPoints + loyaltyStats.pointsToNext)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Total Spent:</span>
                    <span className="font-medium">${loyaltyStats.totalSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Total Bookings:</span>
                    <span className="font-medium">{loyaltyStats.totalBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Favorite Service:</span>
                    <span className="font-medium">{loyaltyStats.favoriteService}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tier Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>Priority booking access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>10% discount on all services</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>Free cancellation within 24h</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>Dedicated customer support</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}