import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell, { WorkspaceButton, WorkspaceHeading } from '../components/AppShell.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'

function loadJson(key, fallback) {
  try { return { ...fallback, ...JSON.parse(localStorage.getItem(key) || '{}') } }
  catch { return fallback }
}

const defaultBrand = { organization: 'Hamichi', product: 'Illustration works', description: 'Hamichi desp is here', country: 'India', audience: 'Artists, Art lovers' }

export function ProfilePage() {
  const profile = useMemo(() => loadJson('neuroad.profile', { name: 'Hamichi', email: 'abc@gmail.com' }), [])
  const initialBrand = useMemo(() => loadJson('neuroad.brand', defaultBrand), [])
  const [name, setName] = useState(profile.name || 'Hamichi')
  const [brand, setBrand] = useState(initialBrand)
  const [saved, setSaved] = useState(false)
  function update(event) { setBrand((current) => ({ ...current, [event.target.name]: event.target.value })); setSaved(false) }
  function save(event) {
    event.preventDefault()
    localStorage.setItem('neuroad.profile', JSON.stringify({ ...profile, name: name.trim() || 'Hamichi' }))
    localStorage.setItem('neuroad.brand', JSON.stringify(brand))
    window.dispatchEvent(new Event('neuroad-profile-change'))
    setSaved(true)
  }
  function reset() {
    setName(profile.name || 'Hamichi')
    setBrand(initialBrand)
    setSaved(false)
  }
  return (
    <AppShell active="profile">
      <div className="workspace-page profile-page">
        <WorkspaceHeading title="Profile" description="Manage your account identity and the brand context behind your creatives." backLabel={null} />
        <form className="profile-form" onSubmit={save}>
          <ScrollReveal className="profile-section" variant="zoom">
            <div className="profile-section__intro"><h2>Account details</h2><p>Your personal account identity, separate from your organization.</p></div>
            <div className="profile-section__fields profile-section__fields--two">
              <label className="workspace-field"><span>Display name</span><input name="name" value={name} onChange={(event) => { setName(event.target.value); setSaved(false) }} placeholder="Enter your display name" /><small>How you’d like to be shown in your workspace.</small></label>
              <label className="workspace-field"><span>Account email <i>· Read only</i></span><input value={profile.email || 'abc@gmail.com'} readOnly aria-readonly="true" /><small>The email used to sign in to your account.</small></label>
            </div>
          </ScrollReveal>
          <ScrollReveal className="profile-section" variant="tilt" delay={90}>
            <div className="profile-section__intro"><h2>Organization &amp; brand</h2><p>Give neuro.ad context about what you offer and who your creatives are for.</p></div>
            <div className="profile-section__fields">
              <label className="workspace-field"><span>Organization</span><input name="organization" value={brand.organization} onChange={update} /></label>
              <label className="workspace-field"><span>Product / Service</span><input name="product" value={brand.product} onChange={update} /></label>
              <label className="workspace-field profile-description-field"><span>Business description</span><textarea name="description" rows="3" value={brand.description} onChange={update} /></label>
              <label className="workspace-field"><span>Country</span><select name="country" value={brand.country} onChange={update}><option>India</option><option>United States</option><option>United Kingdom</option><option>Australia</option><option>Other</option></select></label>
              <label className="workspace-field"><span>Target audience</span><input name="audience" value={brand.audience} onChange={update} /></label>
            </div>
          </ScrollReveal>
          <div className="profile-save-row"><span>{saved ? 'Profile changes saved in this browser.' : 'Changes are applied when you save.'}</span><div><WorkspaceButton secondary onClick={reset}>Cancel</WorkspaceButton><WorkspaceButton type="submit">Save changes</WorkspaceButton></div></div>
        </form>
      </div>
    </AppShell>
  )
}

function ToggleRow({ title, description, checked, onChange }) {
  return <label className="settings-toggle-row"><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>
}

function ConfirmDialog({ title, children, cancel, confirm, confirmLabel, danger = false }) {
  return <div className="settings-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) cancel() }}><section className="settings-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">{title}</h2><p>{children}</p><div><button className="workspace-button workspace-button--secondary" type="button" onClick={cancel}>Cancel</button><button className={`workspace-button${danger ? ' workspace-button--danger' : ''}`} type="button" onClick={confirm}>{confirmLabel}</button></div></section></div>
}

export function SettingsPage() {
  const navigate = useNavigate()
  const initial = useMemo(() => loadJson('neuroad.settings', { timeZone: 'Kolkata (UTC+05:30)', analysisAlerts: true, emailNotifications: false }), [])
  const [settings, setSettings] = useState(initial)
  const [dialog, setDialog] = useState('')
  const [notice, setNotice] = useState('')
  function update(name, value) { setSettings((current) => ({ ...current, [name]: value })); setNotice('') }
  function save() { localStorage.setItem('neuroad.settings', JSON.stringify(settings)); setNotice('Preferences for this browser have been saved.') }
  function cancel() { setSettings(initial); setNotice('') }
  function clearSamples() {
    ;['neuroad.socials', 'neuroad.brand', 'neuroad.survey', 'neuroad.lastCreative', 'neuroad.settings'].forEach((key) => localStorage.removeItem(key))
    setDialog('')
    setSettings({ timeZone: 'Kolkata (UTC+05:30)', analysisAlerts: true, emailNotifications: false })
    setNotice('Sample preferences and connections have been cleared from this browser.')
  }
  function deleteAccount() {
    ;['neuroad.profile', 'neuroad.brand', 'neuroad.survey', 'neuroad.socials', 'neuroad.settings'].forEach((key) => localStorage.removeItem(key))
    setDialog('')
    navigate('/login')
  }
  return (
    <AppShell active="settings">
      <div className="workspace-page settings-page">
        <WorkspaceHeading title="Settings" description="Manage your workspace preferences, account security, and data controls." backLabel={null} />
        <div className="settings-groups">
          <ScrollReveal className="settings-group" variant="zoom"><div className="settings-group__heading"><span className="settings-group__icon">⌖</span><div><h2>Time zone</h2><p>Used for dates and analysis timestamps.</p></div></div><label className="settings-select-row"><span><strong>Time zone</strong><small>Choose the time zone used across your workspace.</small></span><select value={settings.timeZone} onChange={(event) => update('timeZone', event.target.value)}><option>Kolkata (UTC+05:30)</option><option>London (UTC+00:00)</option><option>New York (UTC−05:00)</option><option>Los Angeles (UTC−08:00)</option></select></label></ScrollReveal>
          <ScrollReveal className="settings-group" variant="zoom" delay={70}><div className="settings-group__heading"><span className="settings-group__icon">♧</span><div><h2>Notifications</h2><p>Choose what deserves your attention.</p></div></div><ToggleRow title="Analysis alerts" description="Show an in-app alert when an analysis finishes." checked={settings.analysisAlerts} onChange={(value) => update('analysisAlerts', value)} /><ToggleRow title="Email notifications" description="Send analysis updates to your account email." checked={settings.emailNotifications} onChange={(value) => update('emailNotifications', value)} /></ScrollReveal>
          <ScrollReveal className="settings-group" variant="tilt" delay={120}><div className="settings-group__heading"><span className="settings-group__icon">◇</span><div><h2>Account security</h2><p>Manage your password and account access.</p></div></div><div className="settings-action-row"><span><strong>Password</strong><small>Update your password to keep your account secure.</small></span><button className="workspace-button workspace-button--secondary" type="button" onClick={() => setNotice('Password changes are not connected in this browser prototype.')}>Change password</button></div></ScrollReveal>
          <ScrollReveal className="settings-group settings-group--danger" variant="tilt" delay={180}><div className="settings-action-row"><span><strong>Delete account</strong><small>Permanently delete your account and associated data. This action cannot be undone.<br />Confirmation is required before your account is deleted.</small></span><button className="workspace-button workspace-button--secondary" type="button" onClick={() => setDialog('delete')}>Delete account</button></div></ScrollReveal>
          <ScrollReveal className="settings-group settings-group--danger" variant="tilt" delay={220}><div className="settings-action-row"><span><strong>Clear sample data</strong><small>Remove only sample/example content from this browser. Your account and associated data remain unchanged.<br />Confirmation is required before sample content is removed.</small></span><button className="workspace-button workspace-button--secondary" type="button" onClick={() => setDialog('clear')}>Clear sample data</button></div></ScrollReveal>
        </div>
        <div className="settings-save-row"><span aria-live="polite">{notice || 'Preferences for this browser.'}</span><div><WorkspaceButton secondary onClick={cancel}>Cancel</WorkspaceButton><WorkspaceButton onClick={save}>Save changes</WorkspaceButton></div></div>
        {dialog === 'delete' && <ConfirmDialog title="Delete this sample account?" cancel={() => setDialog('')} confirm={deleteAccount} confirmLabel="Delete account" danger>This action removes the prototype account and its saved profile details from this browser. The static example analyses are not affected.</ConfirmDialog>}
        {dialog === 'clear' && <ConfirmDialog title="Clear sample data?" cancel={() => setDialog('')} confirm={clearSamples} confirmLabel="Clear sample data">Only browser-saved sample preferences, survey answers and connection states will be removed. Your account profile remains unchanged.</ConfirmDialog>}
      </div>
    </AppShell>
  )
}
