import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AnimatedCount from '../components/AnimatedCount.jsx'
import AppShell, { useWorkspaceProfile, WorkspaceButton, WorkspaceHeading } from '../components/AppShell.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import { sampleCampaigns } from '../data/appFixtures.js'

const formats = ['All formats', 'Video', 'Image', 'Text']

function FilterBar({ selected, setSelected, counts }) {
  return <div className="workspace-filters" role="tablist" aria-label="Filter recent analyses by format">{formats.map((format) => <button key={format} role="tab" aria-selected={selected === format} className={selected === format ? 'is-selected' : ''} type="button" onClick={() => setSelected(format)}>{format}<span>{counts[format] ?? 0}</span></button>)}</div>
}

export default function DashboardPage() {
  const profile = useWorkspaceProfile()
  const [format, setFormat] = useState('All formats')
  const [search, setSearch] = useState('')
  const visible = useMemo(() => sampleCampaigns.filter((campaign) => (format === 'All formats' || campaign.format === format) && `${campaign.name} ${campaign.platform} ${campaign.format}`.toLowerCase().includes(search.toLowerCase())), [format, search])
  const counts = useMemo(() => Object.fromEntries(formats.map((name) => [name, name === 'All formats' ? sampleCampaigns.length : sampleCampaigns.filter((campaign) => campaign.format === name).length])), [])

  return (
    <AppShell active="overview">
      <div className="workspace-page workspace-overview">
        <WorkspaceHeading title="Your creative, clearer." description={`Welcome back, ${profile.name?.trim() || 'Hamichi'}. Find what holds attention — and what needs work.`} backLabel={null} actions={<WorkspaceButton to="/creative-analysis"><span aria-hidden="true">↥</span> New analysis</WorkspaceButton>} />
        <p className="workspace-formats-note">Upload a video, image or text ad</p>

        <section className="overview-stats" aria-label="Workspace overview">
          <ScrollReveal className="overview-stat" variant="zoom"><div className="overview-stat__top"><span>Creative analyses</span><span className="tiny-info" title="Illustrative fixture data">i</span></div><strong className="overview-stat__value"><AnimatedCount value={5} /></strong><p><span className="status-dot status-dot--green" />4 ready · 1 processing</p><small>Across video, image and text ads</small></ScrollReveal>
          <ScrollReveal className="overview-stat" variant="zoom" delay={90}><div className="overview-stat__top"><span>Average attention score</span><span className="tiny-info" title="Illustrative fixture data">i</span></div><strong className="overview-stat__value">75.5 <small>/ 100</small></strong><p>Mean of 4 completed sample analyses</p></ScrollReveal>
          <ScrollReveal className="overview-stat" variant="zoom" delay={180}><div className="overview-stat__top"><span>Attention drops to review</span><span className="tiny-info" title="Illustrative fixture data">i</span></div><strong className="overview-stat__value"><AnimatedCount value={6} /></strong><p>Across 3 creatives</p><small>Start with the largest predicted drop below</small></ScrollReveal>
        </section>

        <section className="overview-history" aria-labelledby="recent-heading">
          <div className="overview-history__heading"><div><h2 id="recent-heading">Recent analyses <span>({sampleCampaigns.length} creatives)</span></h2></div><Link to="/campaign-history" className="workspace-text-link">View all history <span aria-hidden="true">↗</span></Link></div>
          <div className="overview-history__toolbar"><FilterBar selected={format} setSelected={setFormat} counts={counts} /><label className="workspace-search"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search creatives..." aria-label="Search creatives" /></label></div>
          <div className="workspace-table-wrap">
            <table className="workspace-table workspace-table--overview">
              <thead><tr><th>CREATIVE</th><th>FORMAT</th><th>ATTENTION / 100</th><th>STATUS</th><th>NEXT STEP</th><th>UPDATED</th><th aria-label="Open analysis" /></tr></thead>
              <tbody>{visible.map((item) => <tr key={item.id}>
                <td><Link className="table-creative" to={`/results/${item.resultType}`}><span className={`creative-thumb creative-thumb--${item.format.toLowerCase()}`} aria-hidden="true">{item.format === 'Video' ? '▣' : item.format === 'Image' ? '▧' : 'T'}</span><span><strong>{item.name}</strong><small>{item.platform}</small></span></Link></td>
                <td><span>{item.format}</span><small className="table-subline">{item.detail}</small></td>
                <td>{item.score === null ? <span className="table-empty-score">—</span> : <span className="table-score"><b>{item.score}</b><i><span style={{ width: `${item.score}%` }} /></i></span>}</td>
                <td><span className={`table-status${item.status === 'Processing' ? ' table-status--processing' : ''}`}><i />{item.status}</span></td>
                <td><span className="table-next-step">{item.nextStep}</span></td>
                <td><span className="table-date">{item.date}</span></td>
                <td><Link className="table-open" to={`/results/${item.resultType}`} aria-label={`View ${item.name} analysis`}>↗</Link></td>
              </tr>)}</tbody>
            </table>
            {!visible.length && <div className="workspace-empty">No creatives match this filter.</div>}
          </div>
          <div className="overview-history__foot">Showing {visible.length} of {sampleCampaigns.length} sample creatives <span>Sample data. NMFM has not scored real files.</span></div>
        </section>
      </div>
    </AppShell>
  )
}
