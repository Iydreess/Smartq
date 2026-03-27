'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import { getBusinessesByOwner, updateBusiness } from '@/lib/supabase/queries'
import {
  Settings,
  Bell,
  Shield,
  Building,
  Save,
  RefreshCw,
  Download,
  Clock,
  Database,
  CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const defaultHours = DAYS.reduce((acc, day) => {
  acc[day] = {
    enabled: day !== 'sunday',
    open: '08:00',
    close: day === 'saturday' ? '14:00' : '17:00',
  }
  return acc
}, {})

const defaultForm = {
  name: '',
  category: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  description: '',
  timezone: 'Africa/Nairobi',
  currency: 'KES',
  language: 'English',
  notifications: {
    email: true,
    sms: false,
    push: true,
    booking: true,
    reminder: true,
    marketing: false,
  },
  hours: defaultHours,
}

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [businesses, setBusinesses] = useState([])
  const [selectedBusinessId, setSelectedBusinessId] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Business Profile', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Backup', icon: Database },
  ]

  const selectedBusiness = useMemo(
    () => businesses.find((business) => business.id === selectedBusinessId) || null,
    [businesses, selectedBusinessId]
  )

  const hydrateFormFromBusiness = (business) => {
    const settings = business?.settings || {}
    const operatingHours = business?.operating_hours || {}

    setForm({
      name: business?.name || '',
      category: business?.category || '',
      email: business?.email || '',
      phone: business?.phone || '',
      address: business?.address || '',
      website: business?.website || '',
      description: business?.description || '',
      timezone: settings.timezone || 'Africa/Nairobi',
      currency: settings.currency || 'KES',
      language: settings.language || 'English',
      notifications: {
        email: settings?.notifications?.email ?? true,
        sms: settings?.notifications?.sms ?? false,
        push: settings?.notifications?.push ?? true,
        booking: settings?.notifications?.booking ?? true,
        reminder: settings?.notifications?.reminder ?? true,
        marketing: settings?.notifications?.marketing ?? false,
      },
      hours: DAYS.reduce((acc, day) => {
        const existing = operatingHours[day]
        acc[day] = {
          enabled: existing?.enabled ?? (day !== 'sunday'),
          open: existing?.open || '08:00',
          close: existing?.close || (day === 'saturday' ? '14:00' : '17:00'),
        }
        return acc
      }, {}),
    })
  }

  const loadSettings = async ({ silent = false } = {}) => {
    if (!user?.id) return

    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const rows = await getBusinessesByOwner(user.id)
      setBusinesses(rows || [])

      if (!rows?.length) {
        setSelectedBusinessId('')
        setForm(defaultForm)
        return
      }

      const targetId = selectedBusinessId && rows.some((b) => b.id === selectedBusinessId)
        ? selectedBusinessId
        : rows[0].id

      setSelectedBusinessId(targetId)
      const targetBusiness = rows.find((b) => b.id === targetId)
      hydrateFormFromBusiness(targetBusiness)
    } catch (error) {
      console.error('[Settings] Failed to load settings:', error)
      toast.error('Failed to load settings')
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
  }, [user?.id])

  useEffect(() => {
    if (selectedBusiness) {
      hydrateFormFromBusiness(selectedBusiness)
    }
  }, [selectedBusinessId])

  const handleSave = async () => {
    if (!selectedBusinessId) {
      toast.error('No business selected')
      return
    }

    if (!form.name.trim()) {
      toast.error('Business name is required')
      return
    }

    try {
      setSaving(true)
      const updated = await updateBusiness(selectedBusinessId, {
        name: form.name.trim(),
        category: form.category.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        website: form.website.trim() || null,
        description: form.description.trim() || null,
        operating_hours: form.hours,
        settings: {
          ...(selectedBusiness?.settings || {}),
          timezone: form.timezone,
          currency: form.currency,
          language: form.language,
          notifications: form.notifications,
        },
      })

      setBusinesses((prev) => prev.map((b) => (b.id === selectedBusinessId ? updated : b)))
      toast.success('Settings saved successfully')
      loadSettings({ silent: true })
    } catch (error) {
      console.error('[Settings] Failed to save settings:', error)
      toast.error(error?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleExportSettings = () => {
    if (!selectedBusiness) {
      toast.error('No business selected')
      return
    }

    const payload = {
      businessId: selectedBusiness.id,
      exportedAt: new Date().toISOString(),
      profile: {
        name: form.name,
        category: form.category,
        email: form.email,
        phone: form.phone,
        address: form.address,
        website: form.website,
        description: form.description,
      },
      preferences: {
        timezone: form.timezone,
        currency: form.currency,
        language: form.language,
        notifications: form.notifications,
      },
      businessHours: form.hours,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.setAttribute('download', `settings-${selectedBusiness.id}.json`)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    toast.success('Settings exported')
  }

  const resetTabChanges = () => {
    if (!selectedBusiness) return
    hydrateFormFromBusiness(selectedBusiness)
    toast.success('Changes reset')
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Business Name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} required />
            <Field label="Category" value={form.category} onChange={(v) => setForm((p) => ({ ...p, category: v }))} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
          </div>
          <Field label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} />
          <Field label="Website" value={form.website} onChange={(v) => setForm((p) => ({ ...p, website: v }))} />

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Timezone"
              value={form.timezone}
              onChange={(v) => setForm((p) => ({ ...p, timezone: v }))}
              options={[
                { value: 'Africa/Nairobi', label: 'East Africa Time (EAT)' },
                { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
                { value: 'Africa/Johannesburg', label: 'South Africa Time (SAST)' },
              ]}
            />
            <SelectField
              label="Currency"
              value={form.currency}
              onChange={(v) => setForm((p) => ({ ...p, currency: v }))}
              options={[
                { value: 'KES', label: 'KES - Kenyan Shilling' },
                { value: 'TZS', label: 'TZS - Tanzanian Shilling' },
                { value: 'UGX', label: 'UGX - Ugandan Shilling' },
                { value: 'ZAR', label: 'ZAR - South African Rand' },
              ]}
            />
            <SelectField
              label="Language"
              value={form.language}
              onChange={(v) => setForm((p) => ({ ...p, language: v }))}
              options={[
                { value: 'English', label: 'English' },
                { value: 'French', label: 'French' },
                { value: 'Spanish', label: 'Spanish' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div key={day} className="grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-3 p-3 rounded-lg border border-secondary-200">
                <label className="flex items-center gap-2 text-sm font-medium capitalize">
                  <input
                    type="checkbox"
                    checked={Boolean(form.hours[day]?.enabled)}
                    onChange={(e) => setForm((prev) => ({
                      ...prev,
                      hours: {
                        ...prev.hours,
                        [day]: { ...prev.hours[day], enabled: e.target.checked },
                      },
                    }))}
                    className="rounded border-secondary-300"
                  />
                  {day}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={form.hours[day]?.open || '08:00'}
                    onChange={(e) => setForm((prev) => ({
                      ...prev,
                      hours: {
                        ...prev.hours,
                        [day]: { ...prev.hours[day], open: e.target.value },
                      },
                    }))}
                    disabled={!form.hours[day]?.enabled}
                    className="px-3 py-2 border border-secondary-200 rounded-lg disabled:bg-secondary-50"
                  />
                  <span className="text-secondary-600">to</span>
                  <input
                    type="time"
                    value={form.hours[day]?.close || '17:00'}
                    onChange={(e) => setForm((prev) => ({
                      ...prev,
                      hours: {
                        ...prev.hours,
                        [day]: { ...prev.hours[day], close: e.target.value },
                      },
                    }))}
                    disabled={!form.hours[day]?.enabled}
                    className="px-3 py-2 border border-secondary-200 rounded-lg disabled:bg-secondary-50"
                  />
                </div>
              </div>
            ))}
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
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SwitchCard label="Email Alerts" value={form.notifications.email} onChange={(value) => setForm((p) => ({ ...p, notifications: { ...p.notifications, email: value } }))} />
        <SwitchCard label="SMS Alerts" value={form.notifications.sms} onChange={(value) => setForm((p) => ({ ...p, notifications: { ...p.notifications, sms: value } }))} />
        <SwitchCard label="Push Notifications" value={form.notifications.push} onChange={(value) => setForm((p) => ({ ...p, notifications: { ...p.notifications, push: value } }))} />
        <SwitchCard label="New Booking Alerts" value={form.notifications.booking} onChange={(value) => setForm((p) => ({ ...p, notifications: { ...p.notifications, booking: value } }))} />
        <SwitchCard label="Reminder Alerts" value={form.notifications.reminder} onChange={(value) => setForm((p) => ({ ...p, notifications: { ...p.notifications, reminder: value } }))} />
        <SwitchCard label="Marketing Updates" value={form.notifications.marketing} onChange={(value) => setForm((p) => ({ ...p, notifications: { ...p.notifications, marketing: value } }))} />
      </CardContent>
    </Card>
  )

  const renderSecurityTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Security Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow title="Two-Factor Authentication" subtitle="Protect admin sign-in" action="Coming soon" />
        <InfoRow title="Session Controls" subtitle="View and revoke active sessions" action="Coming soon" />
        <InfoRow title="API Keys" subtitle="Manage keys for external integrations" action="Coming soon" />
      </CardContent>
    </Card>
  )

  const renderDataTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Data & Backup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
          <div>
            <p className="font-medium text-secondary-900">Export Current Settings</p>
            <p className="text-sm text-secondary-600">Download JSON snapshot for migration and backup.</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportSettings}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
          <div>
            <p className="font-medium text-secondary-900">Restore Last Saved</p>
            <p className="text-sm text-secondary-600">Discard unsaved edits and reload from database.</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={resetTabChanges}>
            <RefreshCw className="h-4 w-4" />
            Restore
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-600">Configure business preferences, hours, and operations</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            className="px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {(businesses || []).map((business) => (
              <option key={business.id} value={business.id}>{business.name}</option>
            ))}
          </select>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportSettings}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => loadSettings({ silent: true })}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-700 bg-primary-50'
                    : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="min-h-[420px]">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'data' && renderDataTab()}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-secondary-600">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Changes are saved to your selected business profile in Supabase.
          </div>
          <Button variant="outline" onClick={resetTabChanges}>Reset Unsaved Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-secondary-700 mb-2">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-secondary-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

function SwitchCard({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between border border-secondary-200 rounded-lg px-4 py-3">
      <span className="text-secondary-800 font-medium">{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-secondary-300"
      />
    </div>
  )
}

function InfoRow({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
      <div>
        <p className="font-medium text-secondary-900">{title}</p>
        <p className="text-sm text-secondary-600">{subtitle}</p>
      </div>
      <span className="text-sm px-3 py-1 bg-secondary-100 rounded-full text-secondary-700">{action}</span>
    </div>
  )
}
