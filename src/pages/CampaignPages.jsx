import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell, { WorkspaceButton, WorkspaceHeading } from '../components/AppShell.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { historyCampaigns } from '../data/appFixtures.js'

const historyTabs = ['All formats', 'Video', 'Image']

function HistoryFilters({ format, setFormat, query, setQuery }) {
  const totals = { 'All formats': 4, Video: 3, Image: 1 }
  return <div className="history-toolbar"><div className="workspace-filters" role="tablist" aria-label="Filter previous analyses">{historyTabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={format === tab} className={format === tab ? 'is-selected' : ''} onClick={() => setFormat(tab)}>{tab}<span>{totals[tab]}</span></button>)}</div><label className="workspace-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search creatives..." value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search previous creatives" /></label></div>
}

export function CampaignHistoryPage() {
  const [format, setFormat] = useState('All formats')
  const [query, setQuery] = useState('')
  const rows = useMemo(() => historyCampaigns.filter((item) => (format === 'All formats' || item.format === format) && `${item.name} ${item.platform}`.toLowerCase().includes(query.toLowerCase())), [format, query])
  return (
    <AppShell active="history">
      <div className="workspace-page history-page">
        <WorkspaceHeading title="Campaign history" description="Find previous creative analyses and revisit their results." backLabel={null} actions={<WorkspaceButton to="/creative-analysis"><span aria-hidden="true">↥</span> New analysis</WorkspaceButton>} />
        <section className="history-card" aria-labelledby="previous-analyses-title">
          <div className="history-card__heading"><div><h2 id="previous-analyses-title">Previous analyses <span>{historyCampaigns.length} creatives</span></h2><p>Sample history. NMFM has not scored a real file.</p></div></div>
          <HistoryFilters format={format} setFormat={setFormat} query={query} setQuery={setQuery} />
          <div className="workspace-table-wrap"><table className="workspace-table workspace-table--history"><thead><tr><th>CREATIVE</th><th>FORMAT</th><th>ATTENTION SCORE / 100</th><th>STATUS</th><th>RESULTS</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id}>
            <td><span className="table-creative"><span className={`creative-thumb creative-thumb--${item.format.toLowerCase()}`} aria-hidden="true">{item.format === 'Video' ? '▣' : '▧'}</span><span><strong>{item.name}</strong><small>{item.platform}</small></span></span></td>
            <td><span>{item.format}</span><small className="table-subline">{item.detail}</small></td>
            <td><span className="table-score"><b>{item.score}</b><i><span style={{ width: `${item.score}%` }} /></i></span></td>
            <td><span className="sample-status">Sample</span></td>
            <td><Link className="workspace-text-link history-view-link" to={`/results/${item.resultType}`}>View analysis <span aria-hidden="true">↗</span></Link></td>
          </tr>)}</tbody></table>{rows.length === 0 && <div className="workspace-empty">No creatives match this search.</div>}</div>
          <div className="history-card__foot">Showing {rows.length} of {historyCampaigns.length} sample creatives</div>
        </section>
      </div>
    </AppShell>
  )
}

const trendCampaigns = [
  { name: 'Launch Still', format: 'Image · 1080 × 1080', score: 69 },
  { name: 'Festive Reel', format: 'Video · 30 sec', score: 74 },
  { name: 'Founder Cut', format: 'Video · 24 sec', score: 77 },
  { name: 'Monsoon Drop', format: 'Video · 15 sec', score: 82 },
]

export function TrendAnalysisPage() {
  const [period, setPeriod] = useState('4 of 7 projects')
  return (
    <AppShell active="trends">
      <div className="workspace-page trends-page">
        <WorkspaceHeading title="Trend analysis and prediction" description="Compare creative attention scores and see when predictions are available." backLabel={null} actions={<><WorkspaceButton to="/campaign-history" secondary>View campaign history <span aria-hidden="true">↗</span></WorkspaceButton><WorkspaceButton to="/creative-analysis"><span aria-hidden="true">↥</span> New analysis</WorkspaceButton></>} />
        <div className="trend-controls"><label className="project-select"><span className="sr-only">Projects shown</span><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>4 of 7 projects</option><option>3 of 7 projects</option><option>2 of 7 projects</option></select></label><span className="fixture-badge">SAMPLE</span></div>
        <ScrollReveal className="trend-card" variant="zoom">
          <div className="trend-card__heading"><div><h2>Attention by campaign</h2><p>4 sample campaigns · not a time series</p></div><span className="chart-mode-chip">Sample</span></div>
          <div className="trend-axis trend-axis--campaign"><span>CAMPAIGN</span><div><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div><span>ATTENTION SCORE / 100</span></div>
          <div className="trend-rows">{trendCampaigns.map((item, index) => <div className="trend-row" key={item.name}><div className="trend-row__name"><strong>{item.name}</strong><small>{item.format}</small></div><div className="trend-row__track"><i style={{ width: `${item.score}%`, '--trend-delay': `${index * 90}ms` }} /></div><b>{item.score}</b></div>)}</div>
          <p className="trend-card__foot">Higher scores indicate stronger estimated creative attention.</p>
        </ScrollReveal>
        <ScrollReveal className="trend-card trend-card--delta" variant="tilt" delay={100}>
          <div className="trend-card__heading"><div><h2>Which ads score above or below average?</h2><p>These 4 ads average 75.5 out of 100. Left = below average; right = above average. Values are score points, not percentages.</p></div><span className="average-chip">Average: 75.5</span></div>
          <div className="delta-axis-label">DIFFERENCE FROM AVERAGE (SCORE POINTS)</div>
          <div className="delta-chart"><div className="delta-axis"><span>-10</span><span>-5</span><span>0</span><span>+5</span><span>+10</span></div>{trendCampaigns.map((item, index) => {
            const delta = Number((item.score - 75.5).toFixed(1))
            const width = `${Math.abs(delta) * 5.2}%`
            return <div className="delta-row" key={item.name}><span className="delta-row__name">{item.name}</span><div className="delta-row__plot"><i className={delta < 0 ? 'is-negative' : 'is-positive'} style={{ width, left: delta < 0 ? `calc(50% - ${width})` : '50%', '--trend-delay': `${index * 95}ms` }} /></div><b>{delta > 0 ? '+' : '−'}{Math.abs(delta).toFixed(1)}</b></div>
          })}</div>
          <p className="trend-card__foot">Launch Still is 6.5 points below average. Review its detailed analysis for improvement opportunities.</p>
        </ScrollReveal>
        <p className="workspace-demo-note">All points, averages and rankings on this page are fixture data for demonstration.</p>
      </div>
    </AppShell>
  )
}

const platforms = [
  { id: 'instagram', name: 'Instagram', glyph: '◎' },
  { id: 'facebook', name: 'Facebook', glyph: 'f' },
  { id: 'youtube', name: 'YouTube', glyph: '▶' },
]

function readConnections() {
  try { return { instagram: true, facebook: false, youtube: false, ...JSON.parse(localStorage.getItem('neuroad.socials') || '{}') } }
  catch { return { instagram: true, facebook: false, youtube: false } }
}

export function ConnectSocialsPage() {
  const [connected, setConnected] = useState(readConnections)
  const total = Object.values(connected).filter(Boolean).length
  function toggle(id) {
    setConnected((current) => {
      const next = { ...current, [id]: !current[id] }
      localStorage.setItem('neuroad.socials', JSON.stringify(next))
      return next
    })
  }
  return (
    <AppShell active="socials">
      <div className="workspace-page socials-page">
        <WorkspaceHeading title="Connect socials" description="Try a sample connection for your creative workflow." backLabel={null} actions={<span className="optional-chip">Optional setup</span>} />
        <p className="socials-disclaimer">Sample connections are saved on this device only and are optional for NMFM tests.</p>
        <div className="socials-card">
          <div className="socials-card__heading"><div><h2>Social platforms <span>3 available</span></h2><p>Connect an example account to personalize your sample workflow.</p></div><span>{total} of 3 sample connections enabled</span></div>
          <div className="social-platform-grid">{platforms.map((platform, index) => <ScrollReveal as="article" className="social-platform" key={platform.id} variant={index === 1 ? 'zoom' : 'tilt'} delay={index * 70}>
            <div className="social-platform__top"><span className={`social-platform__glyph social-platform__glyph--${platform.id}`} aria-hidden="true">{platform.glyph}</span><span className={`social-platform__status${connected[platform.id] ? ' is-connected' : ''}`}><i />{connected[platform.id] ? 'Account connected' : 'Not connected'}</span></div>
            <h3>{platform.name}</h3><p>{connected[platform.id] ? 'Sample account · local only' : 'Connect a sample account to your workspace.'}</p>
            <button className={`workspace-button${connected[platform.id] ? ' workspace-button--secondary' : ''}`} type="button" onClick={() => toggle(platform.id)}>{connected[platform.id] ? 'Disconnect' : `Connect ${platform.name}`}</button>
          </ScrollReveal>)}</div>
          <p className="socials-card__foot">Prototype only. No social platform has been contacted and no account credentials are requested.</p>
        </div>
      </div>
    </AppShell>
  )
}
