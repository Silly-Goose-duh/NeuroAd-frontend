import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import anime from 'animejs'
import { demoResult } from '../data/demoFixtures.js'
import '../styles/landing2.css'

const sampleSignals = demoResult.metrics.slice(0, 3)
const steps = [
  { number: '01', eyebrow: 'NOTICE', title: 'Find the moment that earns a pause.', copy: 'Look at the opening, the visual hierarchy, and the first reason to care.' },
  { number: '02', eyebrow: 'UNDERSTAND', title: 'See where the message gets fuzzy.', copy: 'Trace the promise, the product cue, and the moment attention may start to drift.' },
  { number: '03', eyebrow: 'IMPROVE', title: 'Leave with one useful next move.', copy: 'Turn a read of the creative into a practical edit to consider before launch.' },
]

function LandingTwoHeader() {
  return (
    <header className="l2-nav">
      <div className="l2-wrap l2-nav__inner">
        <Link className="l2-brand" to="/landing2" aria-label="neuro.ad alternate landing page">
          <img src="/1-870.svg" alt="" />
          <span>neuro.ad</span>
          <i>PRE-LAUNCH INTELLIGENCE</i>
        </Link>
        <nav className="l2-nav__links" aria-label="Page navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#sample-read">Sample read</a>
          <Link className="l2-nav__login" to="/signup?mode=login">Log in</Link>
          <a className="button button--primary l2-nav__cta" href="#early-access">Join early access <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  )
}

function LocalWaitlist({ email, setEmail, joined, saveState, onSubmit }) {
  if (joined) {
    return (
      <div className="l2-waitlist-success" role="status">
        <span aria-hidden="true">✓</span>
        <div><strong>{saveState === 'stored' ? 'Saved on this device.' : 'This browser could not save it.'}</strong><p>{saveState === 'stored' ? 'This prototype doesn’t send email or create a real waitlist entry.' : 'No address was saved or sent; the preview could not access browser storage.'}</p></div>
      </div>
    )
  }

  return (
    <form className="l2-waitlist-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="landing2-email">Work email</label>
      <input id="landing2-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <button className="button button--primary" type="submit">Join early access <span aria-hidden="true">→</span></button>
      <small>Prototype preview · the address stays in this browser only.</small>
    </form>
  )
}

function LandingTwoFooter() {
  return (
    <footer className="l2-footer">
      <div className="l2-wrap l2-footer__inner">
        <Link className="l2-brand l2-brand--footer" to="/landing2" aria-label="neuro.ad alternate landing page">
          <img src="/1-870.svg" alt="" />
          <span>neuro.ad</span>
        </Link>
        <p>Creative signals, before the spend.</p>
        <nav aria-label="Footer navigation"><Link to="/">Original landing</Link><Link to="/demo">Sample analysis</Link><Link to="/dashboard">Workspace preview</Link></nav>
        <small>© {new Date().getFullYear()} neuro.ad · Local prototype</small>
      </div>
    </footer>
  )
}

export default function LandingTwoPage() {
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const stageRef = useRef(null)
  const beatPanelRef = useRef(null)
  const [activeBeat, setActiveBeat] = useState(0)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [saveState, setSaveState] = useState('stored')
  const activeSampleBeat = demoResult.timeline[activeBeat]

  useEffect(() => {
    const root = pageRef.current
    const hero = heroRef.current
    if (!root || !hero) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const heroItems = [...hero.querySelectorAll('[data-l2-enter]')]
    const heroArt = hero.querySelector('.l2-hero__art')
    const revealItems = [...root.querySelectorAll('[data-l2-reveal]')]
    const staticReveal = () => {
      heroItems.forEach((node) => { node.style.opacity = '1'; node.style.transform = 'none' })
      if (heroArt) { heroArt.style.opacity = '1'; heroArt.style.transform = 'none' }
      revealItems.forEach((node) => { node.style.opacity = '1'; node.style.transform = 'none' })
      root.querySelectorAll('.l2-signal-meter__fill').forEach((node) => { node.style.width = `${node.dataset.value}%` })
      root.querySelectorAll('.l2-wave__bar').forEach((node) => { node.style.transform = 'scaleY(1)' })
    }

    if (reduced || typeof IntersectionObserver === 'undefined') {
      staticReveal()
      return undefined
    }

    anime.set(heroItems, { opacity: 0, translateY: 24 })
    anime.set(heroArt, { opacity: 0, scale: .94, translateY: 18 })
    const entrance = anime.timeline({ easing: 'easeOutExpo' })
      .add({ targets: heroItems, opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(82), duration: 720 }, 0)
      .add({ targets: heroArt, opacity: [0, 1], scale: [.94, 1], translateY: [18, 0], duration: 960 }, 110)

    revealItems.forEach((node) => anime.set(node, { opacity: 0, translateY: 24 }))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const node = entry.target
        anime({ targets: node, opacity: [0, 1], translateY: [24, 0], delay: Number(node.dataset.delay || 0), duration: 780, easing: 'easeOutExpo' })
        const fills = node.querySelectorAll('.l2-signal-meter__fill')
        if (fills.length) anime({ targets: fills, width: (element) => `${element.dataset.value}%`, delay: anime.stagger(105, { start: 180 }), duration: 1100, easing: 'easeOutExpo' })
        const bars = node.querySelectorAll('.l2-wave__bar')
        if (bars.length) anime({ targets: bars, scaleY: [0, 1], delay: anime.stagger(24), duration: 620, easing: 'easeOutCubic' })
        observer.unobserve(node)
      })
    }, { threshold: .16, rootMargin: '0px 0px -7% 0px' })
    revealItems.forEach((node) => observer.observe(node))

    const stage = stageRef.current
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let orbitMotion
    if (finePointer && stage) {
      const onPointerMove = (event) => {
        const bounds = stage.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - .5
        const y = (event.clientY - bounds.top) / bounds.height - .5
        anime.remove(stage.querySelector('.l2-hero__fox'))
        anime({ targets: stage.querySelector('.l2-hero__fox'), translateX: x * 11, translateY: y * 9, rotateY: x * 2.8, rotateX: -y * 2.2, duration: 420, easing: 'easeOutQuad' })
      }
      const onPointerLeave = () => {
        anime.remove(stage.querySelector('.l2-hero__fox'))
        anime({ targets: stage.querySelector('.l2-hero__fox'), translateX: 0, translateY: 0, rotateX: 0, rotateY: 0, duration: 650, easing: 'easeOutElastic(1,.55)' })
      }
      stage.addEventListener('pointermove', onPointerMove)
      stage.addEventListener('pointerleave', onPointerLeave)
      stage._l2PointerCleanup = () => {
        stage.removeEventListener('pointermove', onPointerMove)
        stage.removeEventListener('pointerleave', onPointerLeave)
      }
    }

    const orbit = hero.querySelector('.l2-orbit--outer')
    if (orbit) orbitMotion = anime({ targets: orbit, rotate: 360, duration: 44000, easing: 'linear', loop: true })
    return () => {
      entrance.pause()
      observer.disconnect()
      if (orbitMotion) orbitMotion.pause()
      if (stage?._l2PointerCleanup) {
        stage._l2PointerCleanup()
        delete stage._l2PointerCleanup
      }
      anime.remove([...heroItems, ...revealItems, heroArt, stage?.querySelector('.l2-hero__fox'), orbit])
    }
  }, [])

  useEffect(() => {
    const panel = beatPanelRef.current
    if (!panel) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.style.opacity = '1'
      panel.style.transform = 'none'
      return undefined
    }
    anime.remove(panel)
    anime({ targets: panel, opacity: [0, 1], translateY: [10, 0], duration: 430, easing: 'easeOutExpo' })
    return () => anime.remove(panel)
  }, [activeBeat])

  function handleBeatKeyDown(event, index) {
    let next = null
    if (event.key === 'ArrowRight') next = (index + 1) % demoResult.timeline.length
    if (event.key === 'ArrowLeft') next = (index - 1 + demoResult.timeline.length) % demoResult.timeline.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = demoResult.timeline.length - 1
    if (next === null) return
    event.preventDefault()
    setActiveBeat(next)
    document.getElementById(`l2-beat-tab-${next}`)?.focus()
  }

  function handleWaitlist(event) {
    event.preventDefault()
    const address = email.trim().toLowerCase()
    if (!address) return
    let result = 'unavailable'
    try {
      const saved = JSON.parse(localStorage.getItem('neuroad.waitlist') || '[]')
      const entries = Array.isArray(saved) ? saved : []
      if (!entries.includes(address)) localStorage.setItem('neuroad.waitlist', JSON.stringify([...entries, address]))
      result = 'stored'
    } catch { /* Storage is optional; do not make preview submission fail. */ }
    setSaveState(result)
    setJoined(true)
  }

  return (
    <div className="landing2-page" ref={pageRef}>
      <LandingTwoHeader />
      <main>
        <section className="l2-hero" id="top" ref={heroRef} aria-labelledby="l2-hero-title">
          <img className="l2-hero__tunnel" src="/1-810.svg" alt="" aria-hidden="true" />
          <div className="l2-hero__glow" aria-hidden="true" />
          <div className="l2-wrap l2-hero__grid">
            <div className="l2-hero__copy">
              <p className="l2-kicker" data-l2-enter><i /> Creative signals, before the spend</p>
              <p className="l2-audience" data-l2-enter>For brand, growth & creative teams</p>
              <h1 id="l2-hero-title" data-l2-enter>Make the creative clearer.<br /><span>Make the spend count.</span></h1>
              <p className="l2-hero__description" data-l2-enter>Read the hook, the message, and the moment to improve—while your campaign is still a draft.</p>
              <div className="l2-hero__actions" data-l2-enter>
                <Link className="button button--primary button--large" to="/demo">Explore a sample read <span aria-hidden="true">↗</span></Link>
                <a className="l2-text-link" href="#how-it-works">How it works <span aria-hidden="true">↓</span></a>
              </div>
              <div className="l2-hero__assurance" data-l2-enter><span className="l2-assurance-dot" /> Early-access prototype <b>·</b> sample scores are illustrative</div>
            </div>

            <div className="l2-hero__art" ref={stageRef} aria-label="A sample neuro.ad creative signal read">
              <div className="l2-hero__halo" aria-hidden="true" />
              <div className="l2-orbit l2-orbit--outer" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="l2-orbit l2-orbit--inner" aria-hidden="true"><i /><i /><i /></div>
              <img className="l2-hero__fox" src="/1-1029.svg" alt="" aria-hidden="true" />
              <span className="l2-orbit-label l2-orbit-label--top">01 / SIGNAL</span>
              <span className="l2-orbit-label l2-orbit-label--side">BEFORE MEDIA SPEND</span>
              <article className="l2-hero-readout">
                <div className="l2-hero-readout__head"><div><span>ILLUSTRATIVE SAMPLE</span><strong>Luma Skin · short-form</strong></div><span className="l2-readout-live"><i /> PREVIEW</span></div>
                <div className="l2-hero-readout__body">
                  <div className="l2-hero-readout__score"><span>ATTENTION POTENTIAL</span><strong>{demoResult.metrics[0].value}<small>/100</small></strong><i><b /></i></div>
                  <div className="l2-hero-readout__insight"><span>WHAT TO NOTICE</span><p>{demoResult.verdict}</p></div>
                </div>
                <div className="l2-hero-readout__foot"><span>VIDEO · 00:15</span><span>FIXTURE DATA · NOT A LIVE TEST</span></div>
              </article>
              <span className="l2-art-spark l2-art-spark--one" aria-hidden="true" /><span className="l2-art-spark l2-art-spark--two" aria-hidden="true" />
            </div>
          </div>
          <a className="l2-scroll-cue" href="#how-it-works"><span />SCROLL FOR THE READ</a>
        </section>

        <section className="l2-signal-band" aria-label="Supported creative formats">
          <div className="l2-wrap l2-signal-band__inner"><span>ONE PLACE TO READ THE IDEA</span><strong>VIDEO</strong><i /> <strong>IMAGE</strong><i /> <strong>COPY</strong><span className="l2-signal-band__tail">The decision comes before the media bill.</span></div>
        </section>

        <section className="l2-section l2-method" id="how-it-works" aria-labelledby="l2-method-title">
          <div className="l2-wrap">
            <div className="l2-section-heading" data-l2-reveal>
              <div><p className="l2-kicker">THE USEFUL PART</p><h2 id="l2-method-title">Less “I think.”<br /><span>More “try this next.”</span></h2></div>
              <p>Not another report to decode. A guided look at the creative choices that shape the first impression—and one clear place to start improving.</p>
            </div>
            <div className="l2-method-grid">
              {steps.map((step, index) => (
                <article className="l2-method-card" data-l2-reveal data-delay={index * 100} key={step.number}>
                  <div className="l2-method-card__top"><span>{step.number}</span><i aria-hidden="true">{index === 0 ? '↗' : index === 1 ? '⌁' : '→'}</i></div>
                  <p className="l2-method-card__eyebrow">{step.eyebrow}</p>
                  <h3>{step.title}</h3><p>{step.copy}</p>
                  <div className="l2-method-card__line" aria-hidden="true"><b /></div>
                </article>
              ))}
            </div>
            <div className="l2-method-foot" data-l2-reveal><span>THE POINT</span><p>Find a stronger next move <b>before</b> a weaker guess gets a budget.</p></div>
          </div>
        </section>

        <section className="l2-section l2-sample" id="sample-read" aria-labelledby="l2-sample-title">
          <div className="l2-wrap">
            <div className="l2-section-heading l2-section-heading--sample" data-l2-reveal>
              <div><p className="l2-kicker"><i /> INSIDE A SAMPLE READ</p><h2 id="l2-sample-title">A creative is a story<br /><span>in a handful of moments.</span></h2></div>
              <p>Tap a moment to see how a sample read turns a timecode into a question worth asking.</p>
            </div>
            <div className="l2-sample-grid" data-l2-reveal data-l2-chart>
              <figure className="l2-sample-creative">
                <div className="l2-sample-creative__frame"><img src="/demo-short.jpg" alt="Illustrative vertical skincare ad creative used in the sample analysis" /><span className="l2-sample-creative__tag">SAMPLE CREATIVE</span><span className="l2-sample-creative__play" aria-hidden="true">▶</span><span className="l2-sample-creative__time">00:15</span></div>
                <figcaption><span>LUMA SKINCARE</span><strong>Dew, in motion</strong><small>Example short-form creative · fixture-backed read</small></figcaption>
              </figure>
              <div className="l2-sample-analysis">
                <div className="l2-sample-analysis__top"><div><span>SIMULATED · NOT LIVE SCORING</span><strong>What happens after the hook?</strong></div><span className="l2-sample-analysis__score">{demoResult.overall}<small>/100</small></span></div>
                <div className="l2-signal-meters" aria-label="Illustrative sample metrics">
                  {sampleSignals.map((metric) => <div className="l2-signal-meter" key={metric.label}><div><span>{metric.label}</span><strong>{metric.value}{metric.suffix}</strong></div><i><b className="l2-signal-meter__fill" data-value={metric.value} style={{ '--value': `${metric.value}%` }} /></i></div>)}
                </div>
                <div className="l2-wave" role="img" aria-label="Illustrative attention curve across a 15-second creative">{demoResult.attention.map((height, index) => <i className="l2-wave__bar" key={index} style={{ height: `${height}%` }} />)}</div>
                <div className="l2-wave__axis"><span>HOOK</span><span>BENEFIT</span><span>BRAND CUE</span><span>CTA</span></div>
                <div className="l2-beat-label"><span>EXPLORE A MOMENT</span><span>{activeBeat + 1} / {demoResult.timeline.length}</span></div>
                <div className="l2-beat-tabs" role="tablist" aria-label="Sample creative moments">
                  {demoResult.timeline.map((beat, index) => <button type="button" role="tab" id={`l2-beat-tab-${index}`} tabIndex={activeBeat === index ? 0 : -1} aria-selected={activeBeat === index} aria-controls="l2-beat-panel" key={beat.time} onClick={() => setActiveBeat(index)} onKeyDown={(event) => handleBeatKeyDown(event, index)}><span>{beat.time}</span><small>{beat.title}</small></button>)}
                </div>
                <div className="l2-beat-panel" id="l2-beat-panel" role="tabpanel" aria-labelledby={`l2-beat-tab-${activeBeat}`} aria-live="polite" ref={beatPanelRef}>
                  <span className={`l2-beat-panel__marker l2-beat-panel__marker--${activeSampleBeat.level}`} />
                  <div><span>{activeSampleBeat.time} · SAMPLE SIGNAL</span><strong>{activeSampleBeat.title}</strong><p>{activeSampleBeat.note}</p></div>
                </div>
                <p className="l2-sample-disclaimer"><i /> Fixed fixture data · no audience was measured and no campaign was scored.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="l2-section l2-about" id="why-neuro" aria-labelledby="l2-about-title">
          <div className="l2-wrap l2-about__grid">
            <div className="l2-about__lead" data-l2-reveal>
              <p className="l2-kicker">THE IDEA BEHIND NEURO.AD</p>
              <h2 id="l2-about-title">The click is late.<br /><span>The creative is early.</span></h2>
              <p>neuro.ad is a pre-launch creative intelligence concept for brand, growth, and agency teams: a clearer way to examine the hook, message, and next move while the work is still changeable.</p>
              <Link className="l2-text-link" to="/demo">See the sample analysis <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="l2-about__facts" data-l2-reveal>
              <article><span>01 / WHO IT’S FOR</span><h3>People who put campaigns into the world.</h3><p>Brand, growth, and creative teams looking for a stronger pre-launch point of view.</p></article>
              <article><span>02 / WHAT IT’S DESIGNED TO DO</span><h3>Make the next creative decision clearer.</h3><p>Surface where attention may rise or soften, where the message needs focus, and what to consider changing.</p></article>
              <article className="l2-prototype-card"><span>03 / PROTOTYPE TRANSPARENCY</span><h3>Sample signals—not scientific proof.</h3><p>The current preview uses fixed values. It demonstrates the product experience; it does not measure audiences or predict a guaranteed outcome.</p></article>
            </div>
          </div>
        </section>

        <section className="l2-section l2-faq" aria-labelledby="l2-faq-title">
          <div className="l2-wrap l2-faq__grid">
            <div data-l2-reveal><p className="l2-kicker">NO MYSTERY METRICS</p><h2 id="l2-faq-title">Good questions.<br /><span>Clear answers.</span></h2><p className="l2-faq__intro">A prototype should say plainly what it does—and what it doesn’t.</p></div>
            <div className="l2-faq-list" data-l2-reveal>
              <details><summary>Are these results from real viewers?<i aria-hidden="true">+</i></summary><p>No. Scores, charts, and recommendations on this preview are fixture-driven examples. They are not based on a real audience, ad account, or campaign outcome.</p></details>
              <details><summary>Can I try my own creative?<i aria-hidden="true">+</i></summary><p>The demo lets you choose a local image or video to preview in your browser. The analysis remains simulated; the file is not sent to a scoring service.</p></details>
              <details><summary>What happens when I join early access?<i aria-hidden="true">+</i></summary><p>This preview form only saves the entered address in this browser. It does not notify a company or enroll you in a real waitlist yet.</p></details>
            </div>
          </div>
        </section>

        <section className="l2-early-access" id="early-access" aria-labelledby="l2-early-title">
          <div className="l2-wrap l2-early-access__inner" data-l2-reveal>
            <div><p className="l2-kicker"><i /> BEFORE THE NEXT BRIEF</p><h2 id="l2-early-title">Give the idea<br /><span>a clearer first read.</span></h2><p>Explore the sample now. When early access is live, this is where the real invitation will be.</p></div>
            <div className="l2-early-access__form"><LocalWaitlist email={email} setEmail={setEmail} joined={joined} saveState={saveState} onSubmit={handleWaitlist} /><Link to="/demo">Or go straight to the sample analysis <span aria-hidden="true">↗</span></Link></div>
          </div>
          <div className="l2-early-access__aura" aria-hidden="true" />
        </section>
      </main>
      <LandingTwoFooter />
    </div>
  )
}
