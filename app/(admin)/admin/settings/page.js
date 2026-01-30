'use client'

import { useState } from 'react'
import { Card, Button, Input, Badge } from '@/components/ui'

/**
 * AdminSettingsPage Component - System configuration and settings
 * 
 * @returns {JSX.Element} AdminSettingsPage component
 */
export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    siteName: 'SmartQ',
    siteDescription: 'Intelligent Queue Management System',
    supportEmail: 'support@smartq.com',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxBusinessesPerUser: 5,
    maxQueuesPerBusiness: 20,
    sessionTimeout: 30,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings)
    // Implement save logic
    alert('Settings saved successfully!')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'limits', label: 'Limits & Quotas', icon: '📊' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'backup', label: 'Backup & Recovery', icon: '💾' }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
        <Input
          value={settings.siteName}
          onChange={(e) => handleSettingChange('siteName', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
        <Input
          type="email"
          value={settings.supportEmail}
          onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium text-gray-900">Maintenance Mode</div>
          <div className="text-sm text-gray-600">Temporarily disable public access</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium text-gray-900">Allow New Registrations</div>
          <div className="text-sm text-gray-600">Enable new user signups</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.allowRegistration}
            onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium text-gray-900">Email Verification Required</div>
          <div className="text-sm text-gray-600">Require users to verify email</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.requireEmailVerification}
            onChange={(e) => handleSettingChange('requireEmailVerification', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
        <Input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
        />
      </div>
      <Card className="bg-yellow-50 border-yellow-200">
        <div className="flex gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-yellow-900">Security Recommendations</h3>
            <ul className="mt-2 text-sm text-yellow-800 space-y-1">
              <li>• Enable two-factor authentication for admin accounts</li>
              <li>• Regularly review user access permissions</li>
              <li>• Monitor suspicious login attempts</li>
              <li>• Keep session timeout under 60 minutes</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium text-gray-900">Email Notifications</div>
          <div className="text-sm text-gray-600">Send system notifications via email</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium text-gray-900">SMS Notifications</div>
          <div className="text-sm text-gray-600">Send alerts via SMS</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium text-gray-900">Push Notifications</div>
          <div className="text-sm text-gray-600">Browser push notifications</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  )

  const renderLimitsSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Businesses Per User
        </label>
        <Input
          type="number"
          value={settings.maxBusinessesPerUser}
          onChange={(e) => handleSettingChange('maxBusinessesPerUser', parseInt(e.target.value))}
        />
        <p className="text-sm text-gray-500 mt-1">Maximum number of businesses a single user can own</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Queues Per Business
        </label>
        <Input
          type="number"
          value={settings.maxQueuesPerBusiness}
          onChange={(e) => handleSettingChange('maxQueuesPerBusiness', parseInt(e.target.value))}
        />
        <p className="text-sm text-gray-500 mt-1">Maximum number of queues per business</p>
      </div>
      <Card className="bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Current Usage</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex justify-between">
            <span>Total Businesses:</span>
            <span className="font-semibold">127 / Unlimited</span>
          </div>
          <div className="flex justify-between">
            <span>Total Queues:</span>
            <span className="font-semibold">234 / Unlimited</span>
          </div>
          <div className="flex justify-between">
            <span>Total Users:</span>
            <span className="font-semibold">3,847 / Unlimited</span>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'limits':
        return renderLimitsSettings()
      case 'integrations':
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔌</div>
            <p className="text-gray-600">Integration settings coming soon</p>
          </div>
        )
      case 'backup':
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💾</div>
            <p className="text-gray-600">Backup & recovery settings coming soon</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Configure system-wide settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className="mb-6">
        {renderTabContent()}
      </Card>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="outline" className="w-full sm:w-auto">Reset to Defaults</Button>
        <Button onClick={handleSaveSettings} className="w-full sm:w-auto">Save Changes</Button>
      </div>

      {/* System Info */}
      <Card className="p-4 sm:p-6 mt-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-gray-600">Version:</span>
            <span className="ml-2 font-semibold text-gray-900">1.0.0</span>
          </div>
          <div>
            <span className="text-gray-600">Environment:</span>
            <Badge color="green">Production</Badge>
          </div>
          <div>
            <span className="text-gray-600">Database:</span>
            <span className="ml-2 font-semibold text-gray-900">PostgreSQL 15.2</span>
          </div>
          <div>
            <span className="text-gray-600">Cache:</span>
            <span className="ml-2 font-semibold text-gray-900">Redis 7.0</span>
          </div>
          <div>
            <span className="text-gray-600">Uptime:</span>
            <span className="ml-2 font-semibold text-gray-900">45 days, 12 hours</span>
          </div>
          <div>
            <span className="text-gray-600">Last Backup:</span>
            <span className="ml-2 font-semibold text-gray-900">2 hours ago</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
