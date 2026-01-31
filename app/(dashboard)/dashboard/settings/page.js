'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Settings, User, Bell, Shield, Palette, Globe,
  Mail, Phone, MapPin, Clock, Calendar, CreditCard,
  Key, Database, Cloud, Download, Upload, Trash2,
  Eye, EyeOff, Save, RefreshCw, AlertCircle, Check,
  Building, Users, Zap, Lock, Smartphone, Monitor
} from 'lucide-react'

/**
 * Settings Dashboard
 * Comprehensive business profile, system configuration, and account management
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showApiKey, setShowApiKey] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    booking: true,
    reminder: true,
    marketing: false
  })

  const settingsTabs = [
    { id: 'profile', label: 'Business Profile', icon: Building },
    { id: 'users', label: 'Users & Permissions', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'data', label: 'Data & Backup', icon: Database }
  ]

  const businessProfile = {
    businessName: 'SmartQ Business Solutions',
    businessType: 'Multi-Service Provider',
    email: 'contact@smartqbusiness.com',
    phone: '+254 712 345 678',
    address: 'Westlands, Nairobi, Kenya',
    website: 'https://smartqbusiness.com',
    description: 'Comprehensive business services including consulting, healthcare, fitness, and professional services.',
    logo: null,
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    language: 'English',
    founded: '2023',
    licenseNumber: 'BUS123456789'
  }

  const userRoles = [
    { id: 1, name: 'Admin', email: 'admin@smartq.com', role: 'Administrator', status: 'Active', lastLogin: '2024-10-01' },
    { id: 2, name: 'James Wilson', email: 'james@smartq.com', role: 'Manager', status: 'Active', lastLogin: '2024-09-30' },
    { id: 3, name: 'Emily Rodriguez', email: 'emily@smartq.com', role: 'Staff', status: 'Active', lastLogin: '2024-09-29' },
    { id: 4, name: 'Alex Johnson', email: 'alex@smartq.com', role: 'Staff', status: 'Inactive', lastLogin: '2024-09-25' }
  ]

  const integrations = [
    { name: 'Google Calendar', status: 'Connected', description: 'Sync appointments with Google Calendar', icon: Calendar },
    { name: 'Stripe Payment', status: 'Connected', description: 'Process payments securely', icon: CreditCard },
    { name: 'Twilio SMS', status: 'Not Connected', description: 'Send SMS notifications', icon: Smartphone },
    { name: 'Mailchimp', status: 'Not Connected', description: 'Email marketing automation', icon: Mail },
    { name: 'Zoom', status: 'Connected', description: 'Virtual consultations', icon: Monitor },
    { name: 'Slack', status: 'Not Connected', description: 'Team communication', icon: Bell }
  ]

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                value={businessProfile.businessName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="Multi-Service Provider">Multi-Service Provider</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Fitness">Fitness & Wellness</option>
                <option value="Professional Services">Professional Services</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={businessProfile.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={businessProfile.phone}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
            <input
              type="text"
              value={businessProfile.address}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
            <textarea
              value={businessProfile.description}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                <option value="Africa/Lagos">West Africa Time (WAT)</option>
                <option value="Africa/Johannesburg">South Africa Time (SAST)</option>
                <option value="Africa/Cairo">Egypt Time (EET)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="KES">KSh - Kenyan Shilling</option>
                <option value="TZS">TZS - Tanzanian Shilling</option>
                <option value="UGX">UGX - Ugandan Shilling</option>
                <option value="ZAR">ZAR - South African Rand</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" defaultChecked={day !== 'Sunday'} />
                  <span className="w-20 font-medium">{day}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="time" defaultValue={day === 'Saturday' ? '08:00' : '08:00'} className="px-2 py-1 border border-gray-300 rounded" />
                  <span>to</span>
                  <input type="time" defaultValue={day === 'Saturday' ? '13:00' : '17:00'} className="px-2 py-1 border border-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderUsersTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Users & Permissions</CardTitle>
            <Button 
              className="flex items-center gap-2"
              onClick={() => alert('Invite user functionality coming soon!')}
            >
              <Users className="h-4 w-4" />
              Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">Name</th>
                  <th className="text-left p-3 font-medium text-gray-700">Email</th>
                  <th className="text-left p-3 font-medium text-gray-700">Role</th>
                  <th className="text-left p-3 font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 font-medium text-gray-700">Last Login</th>
                  <th className="text-center p-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userRoles.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{user.lastLogin}</td>
                    <td className="p-3 text-center">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => alert(`View details for ${user.name}`)}
                        title="View user"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => confirm(`Delete user ${user.name}?`) && alert('User deleted')}
                        title="Delete user"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Administrator</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Full system access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>User management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Financial reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>System configuration</span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Manager</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Queue management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Staff scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Customer management</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-500">Limited financial access</span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Staff</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>View appointments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Update queue status</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Customer interactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-500">No admin access</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Notification Channels</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>Email Notifications</span>
                </label>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <span>SMS Notifications</span>
                </label>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span>Push Notifications</span>
                </label>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  className="rounded"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Event Types</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>New Bookings</span>
                </label>
                <input
                  type="checkbox"
                  checked={notifications.booking}
                  onChange={(e) => setNotifications({...notifications, booking: e.target.checked})}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Appointment Reminders</span>
                </label>
                <input
                  type="checkbox"
                  checked={notifications.reminder}
                  onChange={(e) => setNotifications({...notifications, reminder: e.target.checked})}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>Marketing Updates</span>
                </label>
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderIntegrationsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Third-Party Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <integration.icon className="h-8 w-8 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  integration.status === 'Connected' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {integration.status}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => alert(`${integration.status === 'Connected' ? 'Configure' : 'Connect'} ${integration.name}`)}
                >
                  {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => alert('2FA setup functionality coming soon!')}
            >
              Enable 2FA
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Session Management</h4>
              <p className="text-sm text-gray-600">Manage active sessions and devices</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => alert('Session management functionality coming soon!')}
            >
              View Sessions
            </Button>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">API Access</h4>
            <p className="text-sm text-gray-600 mb-3">Generate API keys for external integrations</p>
            <div className="flex items-center gap-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value="sk_live_123abc456def789ghi"
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => confirm('Regenerate API key?') && alert('New API key generated')}
                title="Regenerate API key"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-600">Configure your business settings and preferences</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => alert('Export settings functionality coming soon!')}
          >
            <Download className="h-4 w-4" />
            Export Settings
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => alert('Settings saved successfully!')}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex overflow-x-auto">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Content */}
      <div className="min-h-96">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'integrations' && renderIntegrationsTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'billing' && (
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Billing settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        )}
        {activeTab === 'system' && (
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">System settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        )}
        {activeTab === 'data' && (
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Data management tools coming soon</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}