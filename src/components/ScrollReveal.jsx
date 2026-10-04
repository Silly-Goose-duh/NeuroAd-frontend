import React, { useEffect, useRef } from 'react'
import anime from 'animejs'

const entrances = {
  rise: { translateY: 34, scale: 0.985 },
  zoom: { translateY: 20, scale: 0.84, rotateX: -5 },
  left: { translateX: -42, translateY: 12, scale: 0.98 },
  right: { translateX: 42, translateY: 12, scale: 0.98 },
  tilt: { translateY: 28, scale: 0.93, rotateX: -8, rotateY: 3 },
}

export default function ScrollReveal({ children, className = '', delay = 0, as: Tag = 'div', variant = 'rise', ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cascadeChildren = variant === 'cascade' ? [...node.children] : []
    let visible = false

    if (reduced || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      node.style.opacity = '1'
      node.style.transform = 'none'
      cascadeChildren.forEach((child) => {
        child.style.opacity = '1'
        child.style.transform = 'none'
      })
      return undefined
    }

    if (variant === 'cascade') {
      node.style.opacity = '1'
      node.style.transform = 'none'
      anime.set(cascadeChildren, { opacity: 0, translateY: 22, scale: 0.985 })
    } else {
      anime.set(node, { opacity: 0, ...(entrances[variant] || entrances.rise) })
    }

    const reveal = () => {
      visible = true
      node.classList.add('is-visible')
      if (variant === 'cascade') {
        anime({
          targets: cascadeChildren,
          opacity: [0, 1],
          translateY: [22, 0],
          scale: [0.985, 1],
          delay: anime.stagger(118, { start: delay }),
          duration: 860,
          easing: 'easeOutExpo',
        })
        return
      }
      const from = entrances[variant] || entrances.rise
      anime({
        targets: node,
        opacity: [0, 1],
        ...Object.fromEntries(Object.entries(from).map(([key, value]) => [key, [value, key === 'scale' ? 1 : 0]])),
        duration: variant === 'zoom' || variant === 'tilt' ? 980 : 880,
        delay,
        easing: variant === 'zoom' ? 'easeOutBack(1.12)' : 'easeOutExpo',
      })
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      reveal()
      observer.disconnect()
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })
    observer.observe(node)

    const canTilt = variant === 'tilt' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const onPointerMove = (event) => {
      if (!visible) return
      const bounds = node.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5
      const y = (event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5
      anime.remove(node)
      anime({ targets: node, rotateX: -y * 4.2, rotateY: x * 4.2, translateY: -4, duration: 190, easing: 'easeOutQuad' })
    }
    const onPointerLeave = () => {
      if (!visible) return
      anime.remove(node)
      anime({ targets: node, rotateX: 0, rotateY: 0, translateX: 0, translateY: 0, scale: 1, duration: 520, easing: 'easeOutElastic(1,.5)' })
    }
    if (canTilt) {
      node.addEventListener('pointermove', onPointerMove)
      node.addEventListener('pointerleave', onPointerLeave)
    }

    return () => {
      observer.disconnect()
      if (canTilt) {
        node.removeEventListener('pointermove', onPointerMove)
        node.removeEventListener('pointerleave', onPointerLeave)
      }
      anime.remove(node)
      anime.remove(cascadeChildren)
    }
  }, [delay, variant])

  return <Tag ref={ref} className={`scroll-reveal ${className}`.trim()} data-reveal-variant={variant} {...props}>{children}</Tag>
}
