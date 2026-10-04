import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import anime from 'animejs'
import { SiteFooter, SiteHeader } from '../components/Brand.jsx'
import KineticText from '../components/KineticText.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { demoResult, signalScores } from '../data/demoFixtures.js'

function StageRail({ stage }) {
  const steps = [
    ['uploading', 'Upload creative'],
    ['analyzing', 'Analyze signals'],
    ['results', 'Read the result'],
  ]
  const activeIndex = steps.findIndex(([key]) => key === stage)
  return (
    <div className="stage-rail" aria-label="Analysis steps">
      {steps.map(([key, label], index) => (
        <div className={`stage-rail__step${index < activeIndex ? ' is-complete' : ''}${index === activeIndex ? ' is-current' : ''}`} key={key}>
          <span>{index < activeIndex ? '✓' : `0${index + 1}`}</span><strong>{label}</strong>
        </div>
      ))}
    </div>
  )
}

function ShortPreview({ creative, uploading, progress }) {
  return (
    <div className="short-preview" aria-label="Simulated vertical short-form creative preview">
      {creative.kind === 'video' ? (
        <video className="short-preview__media" src={creative.url} muted playsInline autoPlay loop />
      ) : (
        <img className="short-preview__media" src={creative.url} alt="Sample skincare short-form video creative" />
      )}
      <div className="short-preview__shade" />
      <div className="short-preview__topline"><span className="short-preview__play">▶</span><span>SHORTS</span><span className="short-preview__more">⋮</span></div>
      <div className="short-preview__product"><span>LUMA SKINCARE</span><strong>Dew, in motion</strong><small>Hydration that moves with you.</small></div>
      <div className="short-preview__controls" aria-hidden="true">
        <span><i>♥</i><small>24.8K</small></span><span><i>◌</i><small>1.2K</small></span><span><i>↗</i><small>Share</small></span><span><i>▣</i><small>Use sound</small></span>
      </div>
      <div className="short-preview__caption"><strong>@lumaskin</strong><span>One drop. A little more glow. #LumaDew</span></div>
      {uploading && <div className="short-preview__upload"><span>Uploading creative</span><div><i style={{ width: `${progress}%` }} /></div><small>{progress}%</small></div>}
      <span className="short-preview__demo-tag">SAMPLE CREATIVE</span>
    </div>
  )
}

function AttentionChart() {
  return (
    <div className="attention-map attention-map--result">
      <div className="attention-map__head"><span>Attention curve</span><span>0:00 — 0:15</span></div>
      <div className="attention-map__bars" aria-label="Illustrative attention curve">
        {demoResult.attention.map((height, index) => <i key={index} style={{ '--bar-height': `${height}%`, '--bar-delay': `${index * 22}ms` }} />)}
      </div>
      <div className="attention-map__axis"><span>Hook</span><span>Benefit</span><span>Brand cue</span><span>CTA</span></div>
    </div>
  )
}

function ScoreBreakdown() {
  useEffect(() => {
    const fills = document.querySelectorAll('.score-row__fill')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fills.forEach((fill) => { fill.style.width = `${fill.dataset.score}%` })
      return undefined
    }
    anime({ targets: fills, width: (element) => `${element.dataset.score}%`, delay: anime.stagger(100, { start: 280 }), duration: 1200, easing: 'easeOutExpo' })
  }, [])

  return (
    <div className="score-breakdown">
      <div className="score-breakdown__heading"><h3>Score breakdown</h3><span>Out of 100</span></div>
      {signalScores.map((signal) => (
        <div className="score-row" key={signal.label}>
          <div><span>{signal.label}</span><strong>{signal.value}</strong></div>
          <i className="score-row__track"><b className="score-row__fill" data-score={signal.value} /></i>
        </div>
      ))}
    </div>
  )
}

function ResultPanel({ creative, onReanalyze, runToken }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const cards = document.querySelectorAll('.result-metric')
    anime({ targets: cards, opacity: [0, 1], translateY: [18, 0], delay: anime.stagger(90), duration: 720, easing: 'easeOutExpo' })
    const values = document.querySelectorAll('.result-metric__value[data-count]')
    values.forEach((node) => {
      const target = Number(node.dataset.count)
      const suffix = node.dataset.suffix || ''
      const decimals = node.dataset.decimals === '1' ? 1 : 0
      const initial = decimals ? 0 : 0
      anime({ targets: { value: initial }, value: target, duration: 1100, delay: 180, easing: 'easeOutExpo', round: decimals ? 10 : 1, update(animation) {
        const value = animation.animations[0].currentValue
        node.textContent = `${decimals ? Number(value).toFixed(1) : Math.round(value)}${suffix}`
      } })
    })
  }, [runToken])

  return (
    <>
      <section className="result-hero" aria-labelledby="result-title">
        <div className="result-hero__creative">
          <ShortPreview creative={creative} uploading={false} progress={100} />
        </div>
        <div className="result-hero__summary">
          <div className="result-summary__top"><span className="eyebrow">SIMULATED ANALYSIS · FIXTURE DATA</span><span className="result-summary__score-label">NEURO SCORE</span></div>
          <div className="result-summary__score"><strong>{demoResult.overall}</strong><span>/100</span><i>STRONG POTENTIAL</i></div>
          <KineticText as="h1" id="result-title">{demoResult.name}</KineticText>
          <p className="result-summary__verdict">{demoResult.verdict}</p>
          <div className="result-summary__meta"><span>{demoResult.platform}</span><span>·</span><span>{demoResult.objective}</span><span>·</span><span>{demoResult.length}</span></div>
          <div className="result-metrics">
            {demoResult.metrics.map((metric) => (
              <article className="result-metric" key={metric.label}>
                <span>{metric.label}</span><strong className="result-metric__value" data-count={metric.value} data-suffix={metric.suffix}>{metric.value}{metric.suffix}</strong>
                <small><i aria-hidden="true">↗</i> Demo signal</small>
              </article>
            ))}
          </div>
          <div className="result-summary__disclaimer"><span className="pulse-dot" /> Demonstration values · no live campaign data</div>
          <button className="button button--quiet result-summary__again" onClick={onReanalyze} type="button">Run analysis again <span aria-hidden="true">↻</span></button>
        </div>
      </section>

      <section className="result-details section-pad" aria-labelledby="details-title">
        <div className="result-details__head">
          <div><p className="eyebrow">A clearer read</p><KineticText as="h2" id="details-title">What happens after the hook?</KineticText></div>
          <span className="fixture-pill">FIXTURE-DRIVEN SAMPLE</span>
        </div>
        <div className="result-details__grid">
          <ScrollReveal className="detail-card attention-card" variant="tilt"><AttentionChart /></ScrollReveal>
          <ScrollReveal className="detail-card score-card" delay={120} variant="zoom"><ScoreBreakdown /></ScrollReveal>
        </div>
        <div className="result-details__timeline">
          {demoResult.timeline.map((moment, index) => (
            <ScrollReveal className={`moment-card moment-card--${moment.level}`} key={moment.time} delay={index * 80} variant={index % 2 === 0 ? 'left' : 'right'}>
              <span>{moment.time}</span><div><strong>{moment.title}</strong><p>{moment.note}</p></div><i aria-hidden="true" />
            </ScrollReveal>
          ))}
        </div>
        <div className="findings-grid">
          <ScrollReveal className="detail-card findings-card" variant="zoom">
            <div className="detail-card__heading"><span className="signal-icon">✦</span><h3>What works</h3></div>
            {demoResult.strengths.map((finding) => <p className="finding-line" key={finding}>{finding}</p>)}
          </ScrollReveal>
          <ScrollReveal className="detail-card edit-card" delay={120} variant="tilt">
            <div className="detail-card__heading"><h3>To improve</h3><span>PRIORITIZED EDITS</span></div>
            {demoResult.improvements.map((edit, index) => (
              <div className="suggestion-row" key={edit.title}>
                <span className="suggestion-row__rank">0{index + 1}</span>
                <div><strong>{edit.title}</strong><p>{edit.note}</p></div>
                <span className="suggestion-row__focus">{edit.focus}</span>
              </div>
            ))}
          </ScrollReveal>
        </div>
        <ScrollReveal className="result-next" variant="zoom"><p className="eyebrow">Know before the next spend</p><KineticText as="h2">That’s one creative.<br />Imagine seeing the whole story.</KineticText><Link className="button button--primary" to="/#waitlist">Join the waitlist <span aria-hidden="true">→</span></Link></ScrollReveal>
      </section>
    </>
  )
}

export default function DemoPage() {
  const [stage, setStage] = useState('uploading')
  const [progress, setProgress] = useState(0)
  const [runToken, setRunToken] = useState(0)
  const [creative, setCreative] = useState({ url: '/demo-short.jpg', kind: 'image', name: 'luma-short.jpg' })
  const fileInput = useRef(null)
  const objectUrl = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(100)
      setStage('results')
      return undefined
    }
    setStage('uploading')
    setProgress(0)
    const startedAt = Date.now()
    const progressTimer = window.setInterval(() => {
      const next = Math.min(100, Math.round(((Date.now() - startedAt) / 760) * 100))
      setProgress(next)
      if (next >= 100) window.clearInterval(progressTimer)
    }, 32)
    const analyzingTimer = window.setTimeout(() => setStage('analyzing'), 780)
    const resultTimer = window.setTimeout(() => setStage('results'), 3550)
    return () => {
      window.clearInterval(progressTimer)
      window.clearTimeout(analyzingTimer)
      window.clearTimeout(resultTimer)
    }
  }, [runToken])

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
  }, [])

  function runAgain() {
    setRunToken((token) => token + 1)
  }

  function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    objectUrl.current = URL.createObjectURL(file)
    setCreative({ url: objectUrl.current, kind: file.type.startsWith('video/') ? 'video' : 'image', name: file.name })
    setRunToken((token) => token + 1)
  }

  const analyzing = stage === 'analyzing'
  const uploading = stage === 'uploading'

  return (
    <>
      <SiteHeader />
      <main className="demo-page page-width">
        <div className="demo-page__heading">
          <Link className="back-link" to="/">← <span>Go back to home screen</span></Link>
          <div className="demo-page__title"><div><KineticText as="h1">Creative analysis</KineticText><p>Add a creative and see how it could land before you spend.</p></div><span className="fixture-pill"><i /> SAMPLE RUN · FIXTURE VALUES</span></div>
          <StageRail stage={stage} />
        </div>

        {(uploading || analyzing) ? (
          <section className="analysis-stage" aria-live="polite">
            <div className="analysis-stage__creative"><ShortPreview creative={creative} uploading={uploading} progress={progress} /></div>
            <div className="analysis-stage__status">
              <p className="eyebrow">{uploading ? 'STEP 01 · UPLOAD' : 'STEP 02 · ANALYSIS'}</p>
              <KineticText key={stage} as="h2">{uploading ? 'Your creative is on its way.' : 'Reading the response.'}</KineticText>
              <p className="analysis-stage__sub">{uploading ? `Preparing ${creative.name} for a sample run.` : 'Mapping attention, emotional response, memory, and intent.'}</p>
              {uploading ? (
                <div className="upload-progress"><div><i style={{ width: `${progress}%` }} /></div><span>{progress}%</span></div>
              ) : (
                <div className="analysis-checklist">
                  {['Finding the opening hook', 'Mapping the attention curve', 'Reading memory & intent'].map((item, index) => <div className={`analysis-checklist__item${progress > 100 ? ' is-done' : ''}`} key={item}><span className="analysis-checklist__icon">{index < 2 ? '✓' : <i />}</span><span>{item}</span><small>{index === 0 ? 'Complete' : index === 1 ? 'In progress' : 'Next'}</small></div>)}
                </div>
              )}
              <div className="analysis-stage__foot"><span className="pulse-dot" /> {analyzing ? 'Your sample read is coming together' : 'No campaign data leaves this prototype'}</div>
              <button className="text-button" type="button" onClick={() => setStage('results')}>Skip to sample results <span aria-hidden="true">→</span></button>
            </div>
            <input ref={fileInput} className="sr-only" type="file" accept="image/*,video/mp4,video/quicktime" onChange={handleFile} aria-label="Upload a creative" />
            <button className="analysis-stage__change" type="button" onClick={() => fileInput.current?.click()}>Choose another creative</button>
          </section>
        ) : (
          <ResultPanel key={runToken} creative={creative} runToken={runToken} onReanalyze={runAgain} />
        )}
      </main>
      <SiteFooter />
    </>
  )
}
