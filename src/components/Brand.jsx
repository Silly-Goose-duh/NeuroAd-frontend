import React from 'react'
import { Link } from 'react-router-dom'

export function BrandMark({ small = false, light = false }) {
  return (
    <Link className={`brand-mark${small ? ' brand-mark--small' : ''}${light ? ' brand-mark--light' : ''}`} to="/" aria-label="neuro.ad home">
      <img src="/1-870.svg" data-node-id="1-870" alt="" />
      <span>neuro.ad</span>
    </Link>
  )
}

export function SiteHeader({ minimal = false }) {
  return (
    <header className={`site-header${minimal ? ' site-header--minimal' : ''}`}>
      <div className="site-header__inner page-width">
        <BrandMark />
        {!minimal && (
          <nav className="site-header__nav" aria-label="Main navigation">
            <Link className="button button--quiet" to="/signup?mode=login">Log in</Link>
            <Link className="button button--primary" to="/signup">Get started</Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner page-width">
        <BrandMark small />
        <span>Clarity · Strategic · Adaptable</span>
        <span>© 2025 neuro.ad</span>
      </div>
    </footer>
  )
}
