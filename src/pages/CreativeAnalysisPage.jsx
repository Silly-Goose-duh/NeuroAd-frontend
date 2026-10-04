import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import anime from 'animejs'
import AppShell, { WorkspaceButton, WorkspaceHeading } from '../components/AppShell.jsx'

function detectFormat(file) {
  if (file.type.startsWith('audio/')) return 'audio'
  if (file.type.startsWith('video/')) return 'video'
  return 'image'
}

export default function CreativeAnalysisPage() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const urlRef = useRef(null)
  const progressRef = useRef(null)
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState('')
  const [copy, setCopy] = useState('')
  const [objective, setObjective] = useState('Brand awareness')
  const [platform, setPlatform] = useState('Instagram')
  const [audience, setAudience] = useState('Artists, Art lovers')
  const [location, setLocation] = useState('India')
  const [dragging, setDragging] = useState(false)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [notice, setNotice] = useState('')

  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current) }, [])
  useEffect(() => {
    if (!running || !progressRef.current) return undefined
    const bar = progressRef.current
    const update = { value: 0 }
    const motion = anime({ targets: update, value: 100, duration: 2200, easing: 'easeInOutCubic', update: () => setProgress(Math.round(update.value)) })
    const finish = window.setTimeout(() => navigate(`/results/${file ? detectFormat(file) : 'text'}`), 2350)
    return () => { motion.pause(); window.clearTimeout(finish); anime.remove(bar) }
  }, [running, file, navigate])

  function selectFile(nextFile) {
    if (!nextFile) return
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = URL.createObjectURL(nextFile)
    setFile(nextFile)
    setFileUrl(urlRef.current)
    setNotice('')
  }

  function onDrop(event) {
    event.preventDefault()
    setDragging(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  function submit(event) {
    event.preventDefault()
    if (!file && !copy.trim()) {
      setNotice('Upload a creative or add your ad copy to start the sample analysis.')
      return
    }
    setProgress(0)
    setRunning(true)
  }

  const formatLabel = file ? file.type.startsWith('audio/') ? 'Audio' : file.type.startsWith('video/') ? 'Video' : 'Image' : 'Text'

  return (
    <AppShell active="creative">
      <div className="workspace-page creative-analysis-page">
        <WorkspaceHeading title="Creative analysis" description="Add your creative and campaign context to set up an analysis." backTo="/dashboard" backLabel="Go back to home screen" actions={<WorkspaceButton to="/campaign-history" secondary>Campaign history</WorkspaceButton>} />
        <form className={`creative-form${running ? ' is-running' : ''}`} onSubmit={submit}>
          <div className="creative-form__columns">
            <section className="creative-form__creative" aria-labelledby="creative-upload-title">
              <div className="form-section-heading"><div><h2 id="creative-upload-title">Add your creative</h2><p>Upload a video or image, or paste your text ad below.</p></div><span><b>Required</b> · file or text</span></div>
              <div className={`creative-dropzone${dragging ? ' is-dragging' : ''}${file ? ' has-file' : ''}`} onDrop={onDrop} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}>
                <input ref={inputRef} className="sr-only" type="file" accept="video/mp4,video/quicktime,image/png,image/jpeg,audio/mpeg,audio/wav,audio/mp4" onChange={(event) => selectFile(event.target.files?.[0])} aria-label="Choose a video, image, or audio creative" />
                {file ? <div className="dropzone-file">
                  {file.type.startsWith('image/') && <img className="dropzone-file__preview" src={fileUrl} alt="Selected creative preview" />}
                  {file.type.startsWith('video/') && <video className="dropzone-file__preview" src={fileUrl} muted playsInline />}
                  {file.type.startsWith('audio/') && <span className="dropzone-file__audio" aria-hidden="true">♫</span>}
                  <div className="dropzone-file__meta"><strong>{file.name}</strong><small>{formatLabel} · {(file.size / (1024 * 1024)).toFixed(2)} MB</small></div>
                  <button className="dropzone-remove" type="button" onClick={() => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); urlRef.current = null; setFile(null); setFileUrl('') }} aria-label="Remove selected creative">×</button>
                </div> : <>
                  <span className="dropzone-upload-icon" aria-hidden="true">↑</span><strong>Drag and drop your creative</strong><small>MP4, MOV, PNG, JPG, MP3</small><button type="button" className="workspace-button workspace-button--secondary" onClick={() => inputRef.current?.click()}>Browse files</button>
                </>}
              </div>
              <div className="dropzone-or"><span />or use a text ad<span /></div>
              <label className="workspace-field workspace-field--copy"><span>Ad copy <small>Alternative to uploading a file</small></span><textarea rows="5" value={copy} onChange={(event) => { setCopy(event.target.value); setNotice('') }} placeholder="Paste the headline, body copy and call to action of your ad…" /></label>
            </section>

            <section className="creative-form__context" aria-labelledby="campaign-context-title">
              <div className="form-section-heading"><div><h2 id="campaign-context-title">Campaign context</h2><p>Give your creative the right context.</p></div><span><b>Required</b></span></div>
              <label className="workspace-field"><span>Objective</span><select value={objective} onChange={(event) => setObjective(event.target.value)}><option>Brand awareness</option><option>Engagement</option><option>Product consideration</option><option>Purchase</option><option>Traffic</option></select></label>
              <label className="workspace-field"><span>Platform</span><select value={platform} onChange={(event) => setPlatform(event.target.value)}><option>Instagram</option><option>YouTube</option><option>Facebook</option><option>TikTok</option><option>Other</option></select></label>
              <label className="workspace-field"><span>Audience / interests</span><input value={audience} onChange={(event) => setAudience(event.target.value)} /></label>
              <label className="workspace-field"><span>Location</span><input value={location} onChange={(event) => setLocation(event.target.value)} /></label>
              <p className="workspace-field-note">These are sample campaign details. Edit them to match your creative.</p>
            </section>
          </div>

          {notice && <p className="workspace-form-notice" role="alert">{notice}</p>}
          <div className="creative-form__footer">
            <div><strong>{running ? 'Analyzing your creative…' : file || copy.trim() ? `${formatLabel} ready for a sample analysis` : 'No creative added'}</strong><small>{running ? `Reading sample attention, memory and intent signals · ${progress}%` : file || copy.trim() ? 'A local fixture will stand in for live NMFM output.' : 'Nothing is uploaded in this build. Upload to start analysis.'}</small>
              {running && <div className="creative-progress"><i ref={progressRef} style={{ width: `${progress}%` }} /></div>}
            </div>
            <WorkspaceButton type="submit" disabled={running || (!file && !copy.trim())}>{running ? 'Reading signals…' : 'Run NMFM test'} <span aria-hidden="true">↗</span></WorkspaceButton>
          </div>
          <p className="creative-local-note">Sample build · Files stay in this tab; no live model or campaign account is connected.</p>
        </form>
      </div>
    </AppShell>
  )
}
