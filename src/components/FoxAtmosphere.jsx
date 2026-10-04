import React, { useEffect, useRef } from 'react'
import anime from 'animejs'

const palette = ['245,160,0', '245,166,35', '190,82,5', '255,253,225']

function seededParticles(count) {
  let seed = 71421
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  return Array.from({ length: count }, (_, index) => {
    const angle = random() * Math.PI * 2
    const radius = 0.26 + random() * 0.27
    return {
      x: Math.min(.96, Math.max(.04, .5 + Math.cos(angle) * radius)),
      y: Math.min(.96, Math.max(.04, .5 + Math.sin(angle) * radius)),
      phase: random() * Math.PI * 2,
      speed: .38 + random() * .95,
      drift: 4 + random() * 22,
      radius: index % 11 === 0 ? 1.7 + random() * 1.3 : .55 + random() * 1.25,
      alpha: .13 + random() * .36,
      color: palette[Math.floor(random() * palette.length)],
      spark: index % 9 === 0,
    }
  })
}

export default function FoxAtmosphere({ active, pointerRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !host || !ctx || !active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const particles = seededParticles(window.matchMedia('(max-width: 760px)').matches ? 42 : 74)
    const clock = { phase: 0 }
    let width = 1
    let height = 1
    let dpr = 1

    function resize() {
      const rect = host.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      render(clock.phase)
    }

    function render(phase = 0) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      const pointer = pointerRef.current
      const px = pointer.inside ? pointer.x * width : width * .5
      const py = pointer.inside ? pointer.y * height : height * .58

      ;[.292, .708].forEach((eyeX, index) => {
        const eyeY = .647
        const eyePx = eyeX * width
        const eyePy = eyeY * height
        const distance = Math.hypot(px - eyePx, py - eyePy)
        const influence = pointer.inside ? Math.max(0, 1 - distance / (width * .34)) : 0
        const pulse = .5 + Math.sin(phase * 2.3 + index * 1.7) * .5
        const fogStrength = .14 + influence * .52 + pulse * .07
        const offsetX = pointer.inside ? (px - eyePx) * influence * .13 : Math.sin(phase * .55 + index) * 3
        const offsetY = pointer.inside ? (py - eyePy) * influence * .11 : Math.cos(phase * .7 + index) * 2
        const radius = width * (.14 + influence * .07)
        const mist = host.querySelector(index === 0 ? '.fox-eye-mist--left' : '.fox-eye-mist--right')
        if (mist) {
          anime.set(mist, {
            translateX: offsetX,
            translateY: offsetY + Math.sin(phase * .8 + index) * 2,
            scale: .82 + pulse * .09 + influence * .38,
            opacity: .36 + pulse * .09 + influence * .34,
            filter: `blur(${13 - influence * 4}px)`,
          })
        }

        const glow = ctx.createRadialGradient(eyePx + offsetX, eyePy + offsetY, 0, eyePx + offsetX, eyePy + offsetY, radius)
        glow.addColorStop(0, `rgba(245,160,0,${fogStrength * .46})`)
        glow.addColorStop(.38, `rgba(190,82,5,${fogStrength * .24})`)
        glow.addColorStop(1, 'rgba(190,82,5,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.ellipse(eyePx + offsetX, eyePy + offsetY, radius * 1.12, radius * .62, Math.sin(phase + index) * .08, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(eyePx - radius * .66, eyePy + radius * .08)
        ctx.bezierCurveTo(eyePx - radius * .28, eyePy - radius * (.28 + pulse * .12), eyePx + radius * .22, eyePy + radius * (.29 + influence * .16), eyePx + radius * .78, eyePy - radius * .06)
        ctx.strokeStyle = `rgba(245,166,35,${.035 + pulse * .035 + influence * .105})`
        ctx.lineWidth = 1.2 + influence * 1.6
        ctx.stroke()
      })

      particles.forEach((particle) => {
        const driftX = Math.sin(phase * particle.speed + particle.phase) * particle.drift
        const driftY = Math.cos(phase * particle.speed * .77 + particle.phase) * particle.drift * .74
        let x = particle.x * width + driftX
        let y = particle.y * height + driftY
        if (pointer.inside) {
          const dx = x - px
          const dy = y - py
          const distance = Math.max(12, Math.hypot(dx, dy))
          const force = Math.max(0, 1 - distance / 145)
          x += dx / distance * force * 19
          y += dy / distance * force * 19
        }
        const twinkle = .58 + .42 * Math.sin(phase * (particle.spark ? 2.2 : 1.2) + particle.phase)
        const alpha = particle.alpha * twinkle
        ctx.fillStyle = `rgba(${particle.color},${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, particle.radius * (particle.spark ? .72 + twinkle * .52 : 1), 0, Math.PI * 2)
        ctx.fill()
        if (particle.spark && twinkle > .89) {
          ctx.strokeStyle = `rgba(245,166,35,${alpha * .46})`
          ctx.lineWidth = .55
          ctx.beginPath()
          ctx.moveTo(x - 3, y)
          ctx.lineTo(x + 3, y)
          ctx.moveTo(x, y - 3)
          ctx.lineTo(x, y + 3)
          ctx.stroke()
        }
      })
    }

    const observer = new ResizeObserver(resize)
    observer.observe(host)
    resize()
    let motion
    if (!reduced) {
      motion = anime({ targets: clock, phase: [0, Math.PI * 2], duration: 26000, easing: 'linear', loop: true, update: () => render(clock.phase) })
    } else {
      render(0)
    }

    return () => {
      observer.disconnect()
      if (motion) motion.pause()
      anime.remove(host.querySelectorAll('.fox-eye-mist'))
      ctx.clearRect(0, 0, width, height)
      host.querySelectorAll('.fox-eye-mist').forEach((mist) => {
        mist.style.removeProperty('opacity')
        mist.style.removeProperty('transform')
        mist.style.removeProperty('filter')
      })
    }
  }, [active, pointerRef])

  return <canvas ref={canvasRef} className="fox-particle-canvas" aria-hidden="true" />
}
