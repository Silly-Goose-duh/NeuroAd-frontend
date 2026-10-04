import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import KineticText from '../components/KineticText.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'

function AccountLayout({ children, subtitle = 'clever | strategic | adaptable' }) {
  return (
    <main className="auth-page">
      <aside className="auth-brand-panel">
        <div className="auth-brand-lockup"><img src="/1-1029.svg" data-node-id="1-1029" alt="" /><strong>neuro.ad</strong><span>{subtitle}</span></div>
      </aside>
      <section className="auth-form-panel">{children}</section>
    </main>
  )
}

function SocialOptions({ onNotice }) {
  return <><div className="auth-socials" aria-label="Sample sign-in options"><button type="button" onClick={() => onNotice('Google sign-in is not connected in this browser preview.')}>Google</button><button type="button" onClick={() => onNotice('GitHub sign-in is not connected in this browser preview.')}>GitHub</button><button type="button" onClick={() => onNotice('Facebook sign-in is not connected in this browser preview.')}>Facebook</button></div><div className="auth-divider"><span />or<span /></div></>
}

export function SignupPage() {
  const [search] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = search.get('mode') === 'login' || location.pathname === '/login'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (isLogin && password.length < 6) {
      setError('Enter the password used for this sample account.')
      return
    }
    let profile = {}
    try { profile = JSON.parse(localStorage.getItem('neuroad.profile') || '{}') } catch { /* use the entered sample identity */ }
    const next = { name: isLogin ? profile.name || email.split('@')[0] : name.trim(), email: email.trim() }
    localStorage.setItem('neuroad.profile', JSON.stringify(next))
    window.dispatchEvent(new Event('neuroad-profile-change'))
    navigate(isLogin ? '/dashboard' : '/survey')
  }

  return <AccountLayout><ScrollReveal className="auth-form-content" variant="zoom">
    <header className="auth-heading"><h1>{isLogin ? 'Log in' : 'Create your account'}</h1><p>{isLogin ? 'Log in to open your workspace.' : 'Sign up to open your workspace.'}</p></header>
    <SocialOptions onNotice={setNotice} />
    <form className="auth-form" onSubmit={submit}>
      {!isLogin && <label className="auth-field">Name<input type="text" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required /></label>}
      <label className="auth-field">Email<input type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      {isLogin && <label className="auth-field">Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required /></label>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="auth-notice" role="status">{notice}</p>}
      <button className="auth-continue" type="submit">{isLogin ? 'Continue with your email' : 'Continue with your email'}</button>
    </form>
    {!isLogin && <p className="auth-legal">By continuing your agree to the <button type="button" onClick={() => setNotice('Terms and Privacy are not published for this prototype.')}>Terms</button> and <button type="button" onClick={() => setNotice('Terms and Privacy are not published for this prototype.')}>Privacy</button>.</p>}
    <p className="auth-switch">{isLogin ? 'New to neuro.ad?' : 'Already a member?'} <Link to={isLogin ? '/signup' : '/login'}>{isLogin ? 'Sign up' : 'Log in'}</Link></p>
  </ScrollReveal></AccountLayout>
}

const initialSurvey = { industry: 'Beauty & personal care', objective: 'Brand awareness', platform: 'Instagram', monthlySpend: '₹50,000 – ₹2,00,000' }

export function SurveyPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(() => {
    try { return { ...initialSurvey, ...JSON.parse(localStorage.getItem('neuroad.survey') || '{}') } }
    catch { return initialSurvey }
  })
  const [notice, setNotice] = useState('')
  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }
  function submit(event) {
    event.preventDefault()
    localStorage.setItem('neuroad.survey', JSON.stringify(form))
    if (!localStorage.getItem('neuroad.profile')) localStorage.setItem('neuroad.profile', JSON.stringify({ name: 'Creative team', email: 'hello@demo.local' }))
    window.dispatchEvent(new Event('neuroad-profile-change'))
    navigate('/dashboard')
  }

  return <AccountLayout><ScrollReveal className="auth-form-content auth-form-content--survey" variant="zoom">
    <header className="auth-heading"><h1>Tell us about your work.</h1><p>A short survey to set up your sample workspace.</p></header>
    <div className="auth-survey-progress"><span /><span /></div>
    <form className="auth-form auth-form--survey" onSubmit={submit}>
      <label className="auth-field">Industry<select name="industry" value={form.industry} onChange={update}><option>Beauty &amp; personal care</option><option>Food &amp; beverage</option><option>Fashion &amp; lifestyle</option><option>Technology</option><option>Other</option></select></label>
      <label className="auth-field">Primary objective<select name="objective" value={form.objective} onChange={update}><option>Brand awareness</option><option>Engagement</option><option>Product consideration</option><option>Purchase</option></select></label>
      <label className="auth-field">Where do you run ads?<select name="platform" value={form.platform} onChange={update}><option>Instagram</option><option>YouTube</option><option>TikTok</option><option>Meta / Facebook</option><option>Other</option></select></label>
      <label className="auth-field">Typical monthly ad spend<select name="monthlySpend" value={form.monthlySpend} onChange={update}><option>Under ₹50,000</option><option>₹50,000 – ₹2,00,000</option><option>₹2,00,000 – ₹10,00,000</option><option>₹10,00,000+</option></select></label>
      <button className="auth-continue" type="submit">Continue to workspace <span aria-hidden="true">→</span></button>
      <p className="auth-legal">Responses are saved only in this browser for the prototype.</p>
    </form>
    {notice && <p role="status" className="auth-notice">{notice}</p>}
  </ScrollReveal></AccountLayout>
}
