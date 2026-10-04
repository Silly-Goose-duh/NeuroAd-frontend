import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import anime from 'animejs'
import KineticText from './KineticText.jsx'
import FoxAtmosphere from './FoxAtmosphere.jsx'

const pieces = ['left-ear', 'right-ear', 'left-cheek', 'right-cheek', 'bridge', 'jaw', 'constellation']

function clamp(value, min = 0, max = 1) { return Math.min(max, Math.max(min, value)) }

export default function FoxStory() {
  const sceneRef = useRef(null)
  const pointerRef = useRef({ x: .5, y: .5, inside: false })
  const [assembled, setAssembled] = useState(false)

  function trackPointer(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerRef.current = { x: clamp((event.clientX - bounds.left) / bounds.width), y: clamp((event.clientY - bounds.top) / bounds.height), inside: true }
  }

  function clearPointer() { pointerRef.current = { ...pointerRef.current, inside: false } }

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fox = scene.querySelector('.fox-assembly')
    const action = scene.querySelector('.fox-story__action')
    const flash = scene.querySelector('.fox-aura-flash')
    let raf = 0
    let assembledNow = false
    let flashStarted = false
    let flashComplete = false
    let flashMotion
    let actionVisible = false
    let progressNow = 0

    function revealAction() {
      if (actionVisible) return
      actionVisible = true
      anime.remove(action)
      anime({ targets: action, opacity: [0, 1], translateY: [12, 0], duration: 480, easing: 'easeOutExpo' })
    }

    function beginFlash() {
      if (flashStarted) return
      flashStarted = true
      flashComplete = false
      anime.remove(flash)
      flashMotion = anime({
        targets: flash,
        opacity: [0, .96, 0],
        scale: [.82, 1.08, 1.28],
        duration: 1000,
        easing: 'easeInOutSine',
        complete: () => {
          flashComplete = true
          if (progressNow >= .98) revealAction()
        },
      })
    }

    if (reduced) {
      scene.classList.add('is-assembled')
      scene.querySelectorAll('.fox-story__copy > *, .fox-story__points p').forEach((node) => { node.style.opacity = '1'; node.style.transform = 'none' })
      action.style.opacity = '1'
      action.style.transform = 'none'
      setAssembled(true)
      return undefined
    }

    const timeline = anime.timeline({ autoplay: false, easing: 'easeOutExpo' })
    timeline
      .add({ targets: scene.querySelector('.fox-depth'), opacity: [.14, .82], scale: [.94, 1], duration: 380 }, 0)
      .add({ targets: scene.querySelector('.fox-piece--left-ear'), opacity: [.13, 1], translateX: [-58, 0], translateY: [-38, 0], rotate: [-11, 0], duration: 620 }, 50)
      .add({ targets: scene.querySelector('.fox-piece--right-ear'), opacity: [.13, 1], translateX: [58, 0], translateY: [-38, 0], rotate: [11, 0], duration: 620 }, 90)
      .add({ targets: scene.querySelectorAll('.fox-piece--left-cheek, .fox-piece--right-cheek'), opacity: [.1, 1], translateY: [48, 0], scale: [.84, 1], duration: 620, delay: anime.stagger(90) }, 390)
      .add({ targets: scene.querySelectorAll('.fox-piece--bridge, .fox-piece--jaw'), opacity: [.11, 1], scale: [.72, 1], translateY: [25, 0], duration: 520, delay: anime.stagger(120) }, 830)
      .add({ targets: scene.querySelector('.fox-piece--constellation'), opacity: [.12, 1], scale: [.3, 1], rotate: [-18, 0], duration: 620 }, 1250)
      .add({ targets: scene.querySelectorAll('.fox-story__copy > *'), opacity: [.24, 1], translateY: [24, 0], duration: 560, delay: anime.stagger(110), easing: 'easeOutCubic' }, 0)
      .add({ targets: scene.querySelectorAll('.fox-story__points p'), opacity: [0, 1], translateX: [-18, 0], duration: 430, delay: anime.stagger(115), easing: 'easeOutExpo' }, 1060)
      .add({ targets: fox, scale: [.98, 1], duration: 350 }, 1600)

    const setProgress = () => {
      raf = 0
      const sectionTop = scene.offsetTop
      const travel = Math.max(1, scene.offsetHeight - window.innerHeight)
      const progress = clamp((window.scrollY - sectionTop) / travel)
      progressNow = progress
      timeline.seek(progress * timeline.duration)

      const shouldAssemble = progress >= .86
      if (shouldAssemble !== assembledNow) {
        assembledNow = shouldAssemble
        scene.classList.toggle('is-assembled', shouldAssemble)
        setAssembled(shouldAssemble)
      }
      if (progress >= .86) beginFlash()
      if (progress < .70 && flashStarted) {
        if (flashMotion) flashMotion.pause()
        anime.remove(flash)
        anime.set(flash, { opacity: 0, scale: 1.28 })
        flashStarted = false
        flashComplete = false
      }
      if (progress >= .98 && flashComplete) revealAction()
      if (progress < .94 && actionVisible) {
        actionVisible = false
        anime.remove(action)
        anime.set(action, { opacity: 0, translateY: 12 })
      }
    }
    const schedule = () => { if (!raf) raf = window.requestAnimationFrame(setProgress) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) window.cancelAnimationFrame(raf)
      timeline.pause()
      if (flashMotion) flashMotion.pause()
      anime.remove(scene.querySelectorAll('.fox-piece, .fox-depth, .fox-aura-flash, .fox-story__copy > *, .fox-story__points p, .fox-story__action'))
    }
  }, [])

  return (
    <section className="fox-story" id="story" ref={sceneRef} aria-labelledby="fox-story-title">
      <div className="fox-story__pin page-width">
        <div className="fox-story__copy">
          <span className="eyebrow">Read the signal, not just the view</span>
          <KineticText as="h2" id="fox-story-title">There’s more<br />beneath the scroll.</KineticText>
          <p className="fox-story__lead">Attention is a moment. What people feel, remember, and do next is the signal.</p>
          <div className="fox-story__points">
            <p><span>01</span> See where attention takes hold.</p>
            <p><span>02</span> Understand what makes the idea stay.</p>
            <p><span>03</span> Make your next move before the spend.</p>
          </div>
        </div>

        <div className={`fox-assembly${assembled ? ' fox-assembly--assembled' : ''}`} role="img" aria-label="The neuro.ad fox assembles from its signal pieces" aria-describedby="fox-atmosphere-help" onPointerMove={trackPointer} onPointerLeave={clearPointer}>
          <img className="fox-depth" src="/1-912.svg" data-node-id="1-912" alt="" />
          {pieces.map((piece) => (
            <div className={`fox-piece fox-piece--${piece}`} key={piece}>
              <img src="/1-1029.svg" data-node-id="1-1029" alt="" />
            </div>
          ))}
          <FoxAtmosphere active={assembled} pointerRef={pointerRef} />
          <div className="fox-aura-flash" aria-hidden="true" />
          <div className="fox-eye-mist fox-eye-mist--left" aria-hidden="true" />
          <div className="fox-eye-mist fox-eye-mist--right" aria-hidden="true" />
          <div className="fox-signal-orbit" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <span id="fox-atmosphere-help" className="sr-only">Move your pointer or touch near the assembled fox to stir the warm particles and eye mist.</span>
        </div>

        <div className="fox-story__action">
          <Link className="button button--primary button--large" to="/demo">
            See what we can do <span aria-hidden="true">↗</span>
          </Link>
          <span className="fox-story__microcopy">A 15-second creative. A clearer read.</span>
        </div>
        <span className="fox-story__scroll-note" aria-hidden="true">SCROLL TO REVEAL <span>↓</span></span>
      </div>
    </section>
  )
}
