import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import anime from 'animejs'
import { SiteFooter, SiteHeader } from '../components/Brand.jsx'
import KineticText from '../components/KineticText.jsx'
import FoxStory from '../components/FoxStory.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { journeyBefore, journeyWith, signalScores } from '../data/demoFixtures.js'

function ComparisonColumn({ title, rows, accent = false }) {
  return (
    <div className={`comparison-column${accent ? ' comparison-column--accent' : ''}`}>
      <h3>{title}</h3>
      <div className="comparison-column__rows">
        {rows.map(([step, description], index) => (
          <ScrollReveal className="comparison-row" as="div" key={step} delay={index * 58} variant="left">
            <span className="comparison-row__number">0{index + 1}</span>
            <strong>{step}</strong>
            <span>{description}</span>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  function submit(event) {
    event.preventDefault()
    if (!email.trim()) return
    const saved = JSON.parse(localStorage.getItem('neuroad.waitlist') || '[]')
    if (!saved.includes(email.trim())) localStorage.setItem('neuroad.waitlist', JSON.stringify([...saved, email.trim()]))
    setJoined(true)
  }

  return joined ? (
    <div className="waitlist-success" role="status">
      <span className="waitlist-success__check">✓</span>
      <div><strong>You’re on the early-access list.</strong><span>Your demo spot is saved on this device.</span></div>
    </div>
  ) : (
    <form className="waitlist-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="waitlist-email">Email address</label>
      <input id="waitlist-email" type="email" autoComplete="email" placeholder="Your work email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <button className="button button--primary" type="submit">Join the waitlist <span aria-hidden="true">→</span></button>
      <small>Prototype preview · details stay in this browser.</small>
    </form>
  )
}

function AttentionMap() {
  const heights = [35, 41, 44, 40, 37, 51, 65, 83, 98, 104, 90, 74, 57, 46, 39, 34, 31, 29, 32, 41, 54, 71, 84, 93, 88, 80, 68, 60, 52, 44]
  return (
    <ScrollReveal className="attention-map" variant="tilt">
      <div className="attention-map__head"><span>Attention map</span><span>FIRST 15 SECONDS</span></div>
      <div className="attention-map__bars" aria-label="Illustrative attention map">
        {heights.map((height, index) => <i key={index} style={{ '--bar-height': `${height}%`, '--bar-delay': `${index * 25}ms` }} />)}
      </div>
      <div className="attention-map__axis"><span>0:00</span><span>0:07</span><span>0:15</span></div>
    </ScrollReveal>
  )
}

export default function HomePage() {
  const signalsRef = useRef(null)
  const heroRef = useRef(null)
  const heroArtRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const art = heroArtRef.current
    if (!hero || !art || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const tunnel = hero.querySelector('.hero__tunnel')
    let entranceComplete = false
    const entrance = anime.timeline({ easing: 'easeOutExpo' })
      .add({ targets: hero.querySelector('.hero__eyebrow'), opacity: [0, 1], translateY: [18, 0], duration: 650 }, 0)
      .add({ targets: art, opacity: [0, 1], scale: [0.9, 1], rotateY: [-6, 0], duration: 1120 }, 90)
      .add({ targets: hero.querySelector('.hero__description'), opacity: [0, 1], translateY: [20, 0], duration: 720 }, 330)
      .add({ targets: hero.querySelectorAll('.hero__actions .button'), opacity: [0, 1], translateY: [18, 0], scale: [0.96, 1], delay: anime.stagger(85), duration: 620 }, 490)
      .add({ targets: hero.querySelector('.hero__demo-link'), opacity: [0, 1], translateY: [14, 0], duration: 620 }, 560)
    entrance.finished.then(() => { entranceComplete = true })

    const onPointerMove = (event) => {
      if (!entranceComplete) return
      const bounds = hero.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      anime.remove(art)
      anime({ targets: art, translateX: x * 17, translateY: y * 12, rotateY: x * 2.5, rotateX: -y * 2.2, duration: 460, easing: 'easeOutQuad' })
      if (tunnel) anime({ targets: tunnel, translateX: -x * 8, translateY: -y * 6, duration: 650, easing: 'easeOutQuad' })
    }
    const onPointerLeave = () => {
      anime.remove(art)
      anime({ targets: art, translateX: 0, translateY: 0, rotateX: 0, rotateY: 0, scale: 1, duration: 650, easing: 'easeOutElastic(1,.5)' })
      if (tunnel) anime({ targets: tunnel, translateX: 0, translateY: 0, duration: 750, easing: 'easeOutQuad' })
    }
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (finePointer) {
      hero.addEventListener('pointermove', onPointerMove)
      hero.addEventListener('pointerleave', onPointerLeave)
    }
    return () => {
      entrance.pause()
      anime.remove(art)
      if (tunnel) anime.remove(tunnel)
      if (finePointer) {
        hero.removeEventListener('pointermove', onPointerMove)
        hero.removeEventListener('pointerleave', onPointerLeave)
      }
    }
  }, [])

  function revealSignals() {
    const bars = document.querySelectorAll('.signal-row__fill')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bars.forEach((bar) => { bar.style.width = `${bar.dataset.value}%` })
      return
    }
    anime({ targets: bars, width: (element) => `${element.dataset.value}%`, delay: anime.stagger(90), duration: 1050, easing: 'easeOutExpo' })
  }

  useEffect(() => {
    const section = signalsRef.current
    if (!section) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      revealSignals()
      observer.disconnect()
    }, { threshold: 0.25 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section className="hero" ref={heroRef} aria-labelledby="hero-title">
        <img className="hero__tunnel" src="/1-810.svg" data-node-id="1-810" alt="" />
        <div className="hero__ambient" aria-hidden="true"><i /><i /><i /></div>
        <SiteHeader />
        <div className="hero__inner page-width">
          <div className="hero__copy">
            <p className="eyebrow hero__eyebrow">Clarity · Strategic · Adaptable</p>
            <KineticText as="h1" id="hero-title">Know how the<br className="desktop-break" /> campaign lands<br className="desktop-break" /> before you spend.</KineticText>
            <p className="hero__description">Understand how your ad lands, from attention to engagement, in one simple view.</p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/signup">Get started</Link>
              <Link className="button button--quiet" to="/signup?mode=login">Log in</Link>
            </div>
          </div>
          <div className="hero__art" ref={heroArtRef}>
            <div className="hero-fox" aria-label="neuro.ad fox mark">
              <img className="hero-fox__depth" src="/1-912.svg" data-node-id="1-912" alt="" />
              <img className="hero-fox__face" src="/1-1029.svg" data-node-id="1-1029" alt="neuro.ad geometric fox mark" />
              <span className="hero-fox__glint" aria-hidden="true" />
            </div>
            <Link className="hero__demo-link" to="/demo">See what we can do <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <a className="hero__scroll" href="#story"><span className="hero__scroll-line" />Scroll to explore</a>
      </section>

      <FoxStory />

      <section className="comparison-section section-pad" aria-labelledby="comparison-title">
        <ScrollReveal className="section-inner" variant="cascade">
          <div className="section-progress"><span /></div>
          <div className="section-heading section-heading--center">
            <KineticText as="h2" id="comparison-title">Your ad is live. But do you know how it’s performing?</KineticText>
            <p>Views and clicks tell you what happened.<br />neuro.ad looks deeper to show how people respond to your ad.</p>
          </div>
          <div className="comparison-grid">
            <ComparisonColumn title="Before neuro.ad" rows={journeyBefore} />
            <ComparisonColumn title="With neuro.ad" rows={journeyWith} accent />
          </div>
        </ScrollReveal>
      </section>

      <section className="signals-section section-pad" ref={signalsRef} aria-labelledby="signals-title" onMouseEnter={revealSignals} onFocus={revealSignals}>
        <ScrollReveal className="section-inner" variant="zoom">
          <div className="section-progress"><span /></div>
          <div className="section-heading section-heading--center">
            <KineticText as="h2" id="signals-title">Six signals, then one read.</KineticText>
          </div>
          <div className="signals-list" role="list">
            {signalScores.map((signal, index) => (
              <div className="signal-row" role="listitem" key={signal.label} style={{ '--row-index': index }}>
                <span className="signal-row__label">{signal.label}</span>
                <div className="signal-row__track"><i className="signal-row__fill" data-value={signal.value} /></div>
                <span className="signal-row__value">{signal.value}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="insights-section section-pad" aria-labelledby="insights-title">
        <ScrollReveal className="insights-panel" variant="zoom">
          <div className="section-progress section-progress--accent"><span /></div>
          <p className="eyebrow">Creative / Strategic / Adaptable</p>
          <KineticText as="h2" id="insights-title">Know what’s working.<br />Know what to change</KineticText>
          <div className="campaign-cards">
            <ScrollReveal as="article" className="campaign-card campaign-card--amber" variant="tilt">
              <span>Instagram / Brand awareness</span>
              <div><h3>Monsoon Drop</h3><strong>82</strong></div>
            </ScrollReveal>
            <ScrollReveal as="article" className="campaign-card campaign-card--copper" variant="tilt" delay={90}>
              <span>YouTube / Purchase</span>
              <div><h3>Festive Reel</h3><strong>74</strong></div>
            </ScrollReveal>
            <AttentionMap />
          </div>
          <div className="insights-lower">
            <div className="mini-scores">
              {signalScores.map((signal, index) => <ScrollReveal as="div" className="mini-score" key={signal.label} delay={index * 48} variant="left"><span>{signal.label}</span><span>{signal.value}</span><i><b style={{ width: `${signal.value}%` }} /></i></ScrollReveal>)}
            </div>
            <ScrollReveal className="sample-read" variant="zoom">
              <span className="sample-read__tag">WHAT WORKS</span>
              <p>The opening hook creates curiosity and gives viewers a reason to keep watching.</p>
              <Link to="/demo">Explore a sample read <span aria-hidden="true">→</span></Link>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </section>

      <section className="waitlist-section section-pad" id="waitlist" aria-labelledby="waitlist-title">
        <ScrollReveal className="waitlist-inner" variant="left">
          <div className="waitlist-copy">
            <p className="eyebrow">Clarity · Strategic · Adaptable</p>
            <KineticText as="h2" id="waitlist-title">Find out before you<br />commit the budget.</KineticText>
          </div>
          <div className="waitlist-content">
            <p>Create an account, answer a short survey, and run your first creative through neuro.ad.</p>
            <WaitlistForm />
            <Link className="waitlist-signup" to="/signup">Or sign up to explore the survey and dashboard <span aria-hidden="true">↗</span></Link>
          </div>
        </ScrollReveal>
      </section>
      <SiteFooter />
    </>
  )
}
