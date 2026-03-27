'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Input, Badge } from '@/components/ui'
import { RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useUser } from '@/lib/supabase/hooks'
import {
  getAllBusinesses,
  getBusinesses,
  getAllProfiles,
  getQueues,
  getSystemSettings,
  upsertSystemSettings,
} from '@/lib/supabase/queries'

const DEFAULT_SETTINGS = {
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
  pushNotifications: true,
}

export default function AdminSettingsPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [usage, setUsage] = useState({ businesses: 0, queues: 0, users: 0 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'general', label: 'General', icon: 'GEN' },
    { id: 'security', label: 'Security', icon: 'SEC' },
    { id: 'notifications', label: 'Notifications', icon: 'NOT' },
    { id: 'limits', label: 'Limits and Quotas', icon: 'LIM' },
    { id: 'integrations', label: 'Integrations', icon: 'INT' },
    { id: 'backup', label: 'Backup and Recovery', icon: 'BKP' },
  ]

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

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const loadSettings = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const settingsResult = await getSystemSettings()
        .then((data) => ({ ok: true, data }))
        .catch((error) => ({ ok: false, error }))

      if (settingsResult.ok && settingsResult.data) {
        setSettings((prev) => ({ ...prev, ...settingsResult.data }))
      } else if (!settingsResult.ok) {
        if (settingsResult.error?.code === '42P01') {
          toast.error('System settings table is missing. Run supabase/fix-admin-system-settings-table.sql.')
        } else if (!isPermissionError(settingsResult.error)) {
          toast.error(getErrorMessage(settingsResult.error))
        }
      }

      const profiles = await getAllProfiles().catch(() => [])
      const allBusinessesResult = await getAllBusinesses()
        .then((data) => ({ ok: true, data }))
        .catch((error) => ({ ok: false, error }))

      let businesses = []
      if (allBusinessesResult.ok) {
        businesses = allBusinessesResult.data || []
      } else if (isPermissionError(allBusinessesResult.error)) {
        businesses = await getBusinesses()
        toast.error('Admin access to all businesses is not configured yet. Showing active businesses only.')
      } else {
        throw allBusinessesResult.error
      }

      const queueResults = await Promise.allSettled((businesses || []).map((business) => getQueues(business.id)))
      const queues = queueResults
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => result.value || [])

      setUsage({
        businesses: businesses.length,
        queues: queues.length,
        users: (profiles || []).length,
      })
    } catch (error) {
      console.warn('[Admin Settings] Failed to load:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      })
      toast.error(getErrorMessage(error) || 'Failed to load settings')
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      await upsertSystemSettings(settings, user?.id || null)
      toast.success('Settings saved successfully')
    } catch (error) {
      if (error?.code === '42P01') {
        toast.error('System settings table is missing. Run supabase/fix-admin-system-settings-table.sql.')
      } else {
        toast.error(getErrorMessage(error) || 'Failed to save settings')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
    toast.success('Settings reset to defaults locally. Save to persist.')
  }

  const envStatus = useMemo(() => (settings.maintenanceMode ? 'Maintenance' : 'Production'), [settings.maintenanceMode])

  const toggleField = (key, label, description) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={!!settings[key]}
          onChange={(e) => handleSettingChange(key, e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
      </label>
    </div>
  )

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
        <Input value={settings.siteName} onChange={(e) => handleSettingChange('siteName', e.target.value)} />
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
        <Input type="email" value={settings.supportEmail} onChange={(e) => handleSettingChange('supportEmail', e.target.value)} />
      </div>
      {toggleField('maintenanceMode', 'Maintenance Mode', 'Temporarily disable public access')}
      {toggleField('allowRegistration', 'Allow New Registrations', 'Enable new user signups')}
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {toggleField('requireEmailVerification', 'Email Verification Required', 'Require users to verify email')}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
        <Input
          type="number"
          min={5}
          max={240}
          value={settings.sessionTimeout}
          onChange={(e) => handleSettingChange('sessionTimeout', Number(e.target.value) || 0)}
        />
      </div>
      <Card className="bg-yellow-50 border-yellow-200">
        <div className="flex gap-3">
          <div className="text-2xl"></div>
          <div>
            <h3 className="font-semibold text-yellow-900">Security Recommendations</h3>
            <ul className="mt-2 text-sm text-yellow-800 space-y-1">
              <li> Enable MFA for all admin accounts</li>
              <li> Review role assignments weekly</li>
              <li> Keep session timeout under 60 minutes</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {toggleField('emailNotifications', 'Email Notifications', 'Send system notifications via email')}
      {toggleField('smsNotifications', 'SMS Notifications', 'Send alerts via SMS')}
      {toggleField('pushNotifications', 'Push Notifications', 'Browser push notifications')}
    </div>
  )

  const renderLimitsSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Businesses Per User</label>
        <Input
          type="number"
          min={1}
          value={settings.maxBusinessesPerUser}
          onChange={(e) => handleSettingChange('maxBusinessesPerUser', Number(e.target.value) || 0)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Queues Per Business</label>
        <Input
          type="number"
          min={1}
          value={settings.maxQueuesPerBusiness}
          onChange={(e) => handleSettingChange('maxQueuesPerBusiness', Number(e.target.value) || 0)}
        />
      </div>
      <Card className="bg-blue-50 border-blue-200 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Current Usage</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex justify-between">
            <span>Total Businesses:</span>
            <span className="font-semibold">{usage.businesses}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Queues:</span>
            <span className="font-semibold">{usage.queues}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Users:</span>
            <span className="font-semibold">{usage.users}</span>
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
            <div className="text-4xl mb-4"></div>
            <p className="text-gray-600">Integration settings coming soon</p>
          </div>
        )
      case 'backup':
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4"></div>
            <p className="text-gray-600">Backup and recovery controls coming soon</p>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading system settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Configure platform-wide behavior and limits</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => loadSettings({ silent: true })}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 text-sm transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <Card className="mb-6 p-4 sm:p-6">{renderTabContent()}</Card>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="outline" className="w-full sm:w-auto" onClick={handleResetDefaults}>Reset to Defaults</Button>
        <Button onClick={handleSaveSettings} disabled={saving} className="w-full sm:w-auto">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card className="p-4 sm:p-6 mt-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-gray-600">Environment:</span>
            <Badge variant={settings.maintenanceMode ? 'warning' : 'success'} className="ml-2">{envStatus}</Badge>
          </div>
          <div>
            <span className="text-gray-600">Support Email:</span>
            <span className="ml-2 font-semibold text-gray-900">{settings.supportEmail}</span>
          </div>
          <div>
            <span className="text-gray-600">Site Name:</span>
            <span className="ml-2 font-semibold text-gray-900">{settings.siteName}</span>
          </div>
          <div>
            <span className="text-gray-600">Session Timeout:</span>
            <span className="ml-2 font-semibold text-gray-900">{settings.sessionTimeout} min</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
