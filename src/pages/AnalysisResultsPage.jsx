import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import anime from 'animejs'
import AppShell, { WorkspaceButton, WorkspaceHeading } from '../components/AppShell.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { resultFixtures } from '../data/appFixtures.js'

function ScoreBreakdown({ scores, overall }) {
  const ref = useRef(null)
  useEffect(() => {
    const bars = ref.current?.querySelectorAll('.analysis-score__fill')
    if (!bars?.length) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bars.forEach((bar) => { bar.style.transform = 'scaleX(1)' })
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      anime({ targets: bars, scaleX: [0, 1], delay: anime.stagger(76, { start: 120 }), duration: 950, easing: 'easeOutExpo' })
      observer.disconnect()
    }, { threshold: .18 })
    observer.observe(ref.current)
    return () => { observer.disconnect(); anime.remove(bars) }
  }, [scores])

  return (
    <section className="analysis-score" ref={ref} aria-label="Sample score breakdown">
      <div className="analysis-score__heading"><h2>Score breakdown</h2><span>Out of 100</span></div>
      <div className="analysis-score__overall"><span>Attention <small>Overall sample score</small></span><strong>{overall}</strong></div>
      {scores.map(([label, value]) => <div className="analysis-score__row" key={label}><div><span>{label}</span><strong>{value}</strong></div><i className="analysis-score__track"><b className="analysis-score__fill" style={{ width: `${value}%` }} /></i></div>)}
      <p className="analysis-score__note">Fixture scores estimate a sample response. They are not live campaign results.</p>
    </section>
  )
}

function MediaPlaceholder({ type, fixture, selected, onPlay }) {
  const [playing, setPlaying] = useState(false)
  const waveform = [28, 49, 38, 68, 82, 55, 40, 75, 96, 66, 44, 31, 63, 86, 57, 37, 52, 77, 46, 32]
  return (
    <div className={`analysis-media analysis-media--${type}`}>
      <span className="analysis-media__label">{type === 'audio' ? 'SAMPLE AUDIO' : 'VIDEO PLACEHOLDER'}</span>
      {type === 'audio' ? <>
        <span className="analysis-media__icon" aria-hidden="true">♫</span><strong>Monsoon Drop</strong><small>Voiceover + music · 24 seconds</small>
        <div className="analysis-media__wave" aria-label="Illustrative audio waveform">{waveform.map((height, index) => <i key={index} style={{ '--wave-height': `${height}%`, '--wave-delay': `${index * 14}ms` }} />)}</div>
        <button className="media-play" type="button" onClick={() => { setPlaying((value) => !value); onPlay() }} aria-label={playing ? 'Pause sample audio' : 'Play sample audio'}>{playing ? 'Ⅱ' : '▶'}</button>
      </> : <>
        {type === 'video' && <img className="analysis-media__poster" src="/demo-short.jpg" alt="" aria-hidden="true" />}
        <button className="media-play media-play--large" type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pause video placeholder' : 'Play video placeholder'}>{playing ? 'Ⅱ' : '▶'}</button>
        <strong>Monsoon Drop</strong><small>{type === 'video' ? 'Illustrative vertical Shorts creative' : 'Sample campaign video'}</small>
      </>}
      <div className="analysis-media__time"><span>{playing ? selected : '0:00'}</span><span>{fixture.duration}</span></div>
      <i className={`analysis-media__progress${playing ? ' is-playing' : ''}`} />
      <span className="analysis-media__sample">SAMPLE</span>
    </div>
  )
}

function SignalTimeline({ fixture, selected, setSelected }) {
  return (
    <div className="analysis-timeline-card">
      <div className="analysis-card-heading"><div><h2>Attention map</h2><p>Higher attention</p></div><span>{fixture.view}</span></div>
      <div className={`analysis-bars${fixture.format === 'Audio' ? ' analysis-bars--audio' : ''}`} role="img" aria-label={`${fixture.format} sample attention map`}>
        {fixture.bars.map((height, index) => <i key={index} className={index > fixture.bars.length * .8 ? 'is-quiet' : ''} style={{ '--attention-height': `${height}%`, '--stagger': `${index * 22}ms` }} />)}
      </div>
      <div className="analysis-bars__axis"><span>0:00</span><span>{fixture.beats?.[0]?.[0] || 'Hook'}</span><span>{fixture.beats?.[1]?.[0] || 'Benefit'}</span><span>{fixture.duration}</span></div>
      <p className="analysis-timeline-note">{fixture.note}</p>
      {fixture.beats && <div className="analysis-beats" aria-label="Select a moment in the sample timeline">{fixture.beats.map(([time, label]) => <button key={time} className={selected === time ? 'is-current' : ''} type="button" onClick={() => setSelected(time)}><span>{time}</span><strong>{label}</strong></button>)}</div>}
    </div>
  )
}

function ImageMap({ fixture }) {
  return (
    <div className="analysis-image-card">
      <div className="analysis-image-card__media"><img src="/12-620.webp" data-node-id="12-620" alt="Monsoon Drop rainwear campaign sample creative" /><span className="attention-marker attention-marker--product">01</span><span className="attention-marker attention-marker--headline">02</span><span className="attention-marker attention-marker--cta">03</span><span className="image-sample-label">SAMPLE CREATIVE</span></div>
      <div className="analysis-image-card__meta"><span>Attention overlay</span><span>{fixture.duration}</span></div>
      <div className="analysis-image-regions"><div className="analysis-card-heading"><div><h2>Attention by region</h2><p>Share of attention</p></div><span>Low <i /> High</span></div>{fixture.regions.map(([name, value, note], index) => <div className="region-row" key={name}><span className="region-row__rank">0{index + 1}</span><div className="region-row__info"><div><strong>{name}</strong><small>{note}</small></div><b>{value}%</b><i className="region-row__track"><em style={{ width: `${value}%` }} /></i></div></div>)}</div>
      <p className="analysis-image-summary">Product leads. Headline follows. CTA gets less attention.</p>
    </div>
  )
}

function TextMap({ fixture }) {
  return (
    <div className="analysis-text-card">
      <div className="text-sample"><span className="text-sample__label">SAMPLE COPY</span><strong>Rain in the forecast? <em>Good.</em></strong><p>Meet Monsoon Drop. Lightweight layers that keep you dry, wherever the day takes you.</p><button type="button" onClick={() => document.querySelector('.text-sample__copy')?.focus()}>Discover more →</button></div>
      <div className="text-attention"><div className="analysis-card-heading"><div><h2>Attention by passage</h2><p>Higher attention · Reading order →</p></div><span>{fixture.duration}</span></div><div className="text-attention__bars">{[91, 96, 85, 73, 69, 65, 48, 38].map((height, index) => <i key={index} className={index > 4 ? 'is-quiet' : ''} style={{ '--attention-height': `${height}%`, '--stagger': `${index * 45}ms` }} />)}</div><div className="text-attention__axis"><span>01 Hook</span><span>02 Benefit</span><span>03 CTA</span></div><p>{fixture.note}</p><div className="text-sample__copy" tabIndex="-1" aria-label="Sample ad copy">Instagram caption · 3 sections</div></div>
      <div className="text-map__order">{fixture.copy.map((part, index) => <span key={part.label}>{String(index + 1).padStart(2, '0')} &nbsp; {part.label}</span>)}</div>
    </div>
  )
}

function RecommendationPanels({ fixture }) {
  return <div className="analysis-findings-grid">
    <ScrollReveal className="analysis-findings-card" variant="zoom"><div className="analysis-findings-card__heading"><span>✓</span><h2>What works</h2></div>{fixture.strengths.map((text) => <p key={text}>{text}</p>)}</ScrollReveal>
    <ScrollReveal className="analysis-findings-card analysis-findings-card--improve" variant="tilt" delay={100}><div className="analysis-findings-card__heading"><h2>To improve</h2><span>PRIORITIZED EDITS</span></div>{fixture.improvements.map((item, index) => <div className="analysis-edit-row" key={item.title}><b>{String(index + 1).padStart(2, '0')}</b><div><strong>{item.title}</strong><p>{item.note}</p></div><small>{item.tag}</small></div>)}</ScrollReveal>
  </div>
}

function downloadReport(fixture) {
  const lines = [`neuro.ad sample report — ${fixture.campaign}`, `Format: ${fixture.format}`, `Sample score: ${fixture.score}/100`, '', 'Scores', ...fixture.scores.map(([name, value]) => `${name}: ${value}/100`), '', 'What works', ...fixture.strengths.map((item) => `• ${item}`), '', 'To improve', ...fixture.improvements.map((item, index) => `${index + 1}. ${item.title}: ${item.note}`), '', 'Sample fixture output. Not a live analysis.']
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `neuro-ad-${fixture.format.toLowerCase()}-sample-report.txt`
  link.click()
  URL.revokeObjectURL(url)
}

export default function AnalysisResultsPage() {
  const { format: routeFormat } = useParams()
  const format = resultFixtures[routeFormat] ? routeFormat : 'video'
  const fixture = resultFixtures[format]
  const [selected, setSelected] = useState(fixture.selected || fixture.beats?.[0]?.[0] || '')
  const [playing, setPlaying] = useState(false)
  useEffect(() => { setSelected(fixture.selected || fixture.beats?.[0]?.[0] || '') }, [fixture])

  return (
    <AppShell active="creative">
      <div className={`workspace-page analysis-results-page analysis-results-page--${format}`}>
        <WorkspaceHeading title="Analysis results" description={`${fixture.campaign} · ${fixture.context} · ${fixture.format}`} backTo="/dashboard" backLabel="Back to dashboard" actions={<><WorkspaceButton to="/creative-analysis"><span aria-hidden="true">↥</span> New analysis</WorkspaceButton><WorkspaceButton secondary onClick={() => downloadReport(fixture)}><span aria-hidden="true">↓</span> Download full report</WorkspaceButton></>} />
        <div className="analysis-result-kicker"><span className="fixture-badge">SAMPLE RESULT</span><span className="format-badge">{fixture.format}</span><span>NMFM · Illustrative fixture</span></div>

        <section className={`analysis-overview analysis-overview--${format}`} aria-label={`${fixture.format} sample analysis`}>
          <ScrollReveal className="analysis-visual-panel" variant="zoom">
            <div className="analysis-card-heading"><div><h2>{fixture.title}</h2><p>{fixture.format === 'Image' ? 'Attention overlay' : fixture.format === 'Text' ? 'SAMPLE COPY' : fixture.format === 'Audio' ? 'SAMPLE AUDIO · Voiceover + music' : 'SAMPLE CREATIVE'}</p></div><span>{fixture.view}</span></div>
            {format === 'image' ? <ImageMap fixture={fixture} /> : format === 'text' ? <TextMap fixture={fixture} /> : <div className="analysis-media-chart"><MediaPlaceholder type={format} fixture={fixture} selected={selected} onPlay={() => setPlaying((value) => !value)} /><SignalTimeline fixture={fixture} selected={selected} setSelected={setSelected} />{playing && <span className="media-playing-status" aria-live="polite">Sample playback · {selected || '0:05'}</span>}</div>}
          </ScrollReveal>
          <ScrollReveal className="analysis-score-panel" variant="tilt" delay={100}><ScoreBreakdown scores={fixture.scores.slice(1)} overall={fixture.score} /></ScrollReveal>
        </section>

        {format === 'image' && <p className="analysis-insight-line">Product 52% &nbsp;·&nbsp; Headline 34% &nbsp;·&nbsp; CTA 14% <span>Strongest focal point: Product</span></p>}
        {format === 'text' && <p className="analysis-insight-line">Higher attention · Reading order <span>Hook leads. Benefit holds. The closing action loses clarity.</span></p>}
        {(format === 'video' || format === 'audio') && <p className="analysis-insight-line">{fixture.note} <span>Selected moment: {selected || fixture.selected}</span></p>}

        <RecommendationPanels fixture={fixture} />
        <p className="analysis-local-note"><span className="status-dot status-dot--green" />Sample output only · no real campaign or account data was processed.</p>
      </div>
    </AppShell>
  )
}
