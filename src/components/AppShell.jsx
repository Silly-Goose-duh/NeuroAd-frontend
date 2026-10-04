import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BrandMark } from './Brand.jsx'
import KineticText from './KineticText.jsx'

const navGroups = [
  { label: 'WORKSPACE', items: [
    { key: 'overview', title: 'Overview', to: '/dashboard', icon: 'overview' },
    { key: 'creative', title: 'Creative analyses', to: '/creative-analysis', icon: 'creative' },
    { key: 'history', title: 'Campaign history', to: '/campaign-history', icon: 'history' },
    { key: 'trends', title: 'Trend analysis', to: '/trend-analysis', icon: 'trend' },
    { key: 'socials', title: 'Connect socials', to: '/connect-socials', icon: 'socials' },
  ] },
  { label: 'MANAGE', items: [
    { key: 'profile', title: 'Profile', to: '/profile', icon: 'profile' },
    { key: 'settings', title: 'Settings', to: '/settings', icon: 'settings' },
  ] },
]
const mobileItems = navGroups.flatMap((group) => group.items)

const iconPaths = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  creative: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m10 9 5 3-5 3z" /></>,
  history: <><path d="M3 12a9 9 0 1 0 2.7-6.4L3 8" /><path d="M3 3v5h5M12 7v5l4 2" /></>,
  trend: <><path d="M3 17 9 11l4 3 7-8" /><path d="M15 6h5v5" /></>,
  socials: <><circle cx="7" cy="12" r="3" /><circle cx="17" cy="6" r="3" /><circle cx="17" cy="18" r="3" /><path d="m9.5 10.5 5-3m-5 6 5 3" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V4a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z" /></>,
}

function AppIcon({ name }) {
  return <svg className="workspace-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

function getProfile() {
  try { return { name: 'Hamichi', email: 'abc@gmail.com', ...JSON.parse(localStorage.getItem('neuroad.profile') || '{}') } }
  catch { return { name: 'Hamichi', email: 'abc@gmail.com' } }
}

export function useWorkspaceProfile() {
  const [profile, setProfile] = useState(getProfile)

  useEffect(() => {
    const refresh = () => setProfile(getProfile())
    window.addEventListener('storage', refresh)
    window.addEventListener('neuroad-profile-change', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('neuroad-profile-change', refresh)
    }
  }, [])

  return profile
}

export function AppShell({ active, children }) {
  const profile = useWorkspaceProfile()
  const [workspace, setWorkspace] = useState('Hamichi’s workspace')
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const switcherRef = useRef(null)
  const initials = profile.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'HA'

  useEffect(() => {
    if (!workspaceOpen) return undefined
    const dismiss = (event) => { if (!switcherRef.current?.contains(event.target)) setWorkspaceOpen(false) }
    const closeOnEscape = (event) => { if (event.key === 'Escape') setWorkspaceOpen(false) }
    window.addEventListener('pointerdown', dismiss)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', dismiss)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [workspaceOpen])

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <BrandMark small />
        <div className="workspace-switcher-wrap" ref={switcherRef}>
          <button className="workspace-switcher" type="button" aria-label={`Switch workspace, currently ${workspace}`} aria-haspopup="menu" aria-expanded={workspaceOpen} onClick={() => setWorkspaceOpen((open) => !open)}>
            <span className="workspace-switcher__initial">{workspace === 'Creative Lab' ? 'CL' : initials.slice(0, 1)}</span><strong>{workspace}</strong><span className="workspace-switcher__chevron">⌄</span>
          </button>
          {workspaceOpen && <div className="workspace-switcher__menu" role="menu" aria-label="Choose a sample workspace">{['Hamichi’s workspace', 'Creative Lab'].map((name) => <button key={name} type="button" role="menuitemradio" aria-checked={workspace === name} onClick={() => { setWorkspace(name); setWorkspaceOpen(false) }}><span>{name}</span><small>{workspace === name ? 'Current workspace' : 'Sample workspace'}</small></button>)}</div>}
        </div>
        {navGroups.map((group) => (
          <div className="workspace-nav-group" key={group.label}>
            <span className="workspace-nav-group__label">{group.label}</span>
            <nav className="workspace-nav" aria-label={group.label === 'MANAGE' ? 'Account management' : 'Workspace pages'}>
              {group.items.map((item) => <NavLink key={item.key} to={item.to} end className={({ isActive }) => `workspace-nav__link${(active === item.key || isActive && !active) ? ' is-active' : ''}`}><AppIcon name={item.icon} /><span>{item.title}</span></NavLink>)}
            </nav>
          </div>
        ))}
        <nav className="workspace-nav-mobile" aria-label="Workspace navigation">
          {mobileItems.map((item) => <NavLink key={item.key} to={item.to} end className={({ isActive }) => `workspace-nav__link${(active === item.key || isActive && !active) ? ' is-active' : ''}`}><AppIcon name={item.icon} /><span>{item.title}</span></NavLink>)}
        </nav>
        <div className="workspace-sidebar__spacer" />
        <div className="workspace-sidebar__user">
          <span className="workspace-user__avatar">{initials}</span><span className="workspace-user__identity"><strong>{profile.name || 'Hamichi'}</strong><small>Workspace admin</small></span><Link to="/login" className="workspace-user__logout" aria-label="Log out">↪</Link>
        </div>
      </aside>
      <main className="workspace-main">{children}</main>
    </div>
  )
}

export function WorkspaceHeading({ title, description, kicker, actions, backTo = '/dashboard', backLabel = 'Back to dashboard' }) {
  return (
    <>
      {backLabel && <Link className="workspace-back" to={backTo}><span aria-hidden="true">←</span> {backLabel}</Link>}
      <header className="workspace-page-heading">
        <div className="workspace-page-heading__copy">
          {kicker && <p className="workspace-eyebrow">{kicker}</p>}
          <KineticText as="h1">{title}</KineticText>
          {description && <p className="workspace-page-heading__description">{description}</p>}
        </div>
        {actions && <div className="workspace-page-heading__actions">{actions}</div>}
      </header>
    </>
  )
}

export function WorkspaceButton({ children, to, onClick, secondary = false, disabled = false, type = 'button', className = '' }) {
  const classes = `workspace-button${secondary ? ' workspace-button--secondary' : ''}${className ? ` ${className}` : ''}`
  return to ? <Link className={classes} to={to}>{children}</Link> : <button className={classes} type={type} onClick={onClick} disabled={disabled}>{children}</button>
}

export default AppShell
