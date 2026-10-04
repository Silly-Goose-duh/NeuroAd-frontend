import React, { useEffect, useRef } from 'react'
import anime from 'animejs'

function plainText(children) {
  return React.Children.toArray(children)
    .map((child) => (typeof child === 'string' ? child : ' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function splitWords(children) {
  return React.Children.toArray(children).flatMap((child, childIndex) => {
    if (typeof child !== 'string') return [child]
    return child.split(/(\s+)/).map((part, partIndex) => {
      if (!part) return null
      if (/^\s+$/.test(part)) return <React.Fragment key={`${childIndex}-space-${partIndex}`}>{part}</React.Fragment>
      return (
        <span className="kinetic-text__mask" key={`${childIndex}-word-${partIndex}`}>
          <span className="kinetic-text__word">{part}</span>
        </span>
      )
    })
  })
}

export default function KineticText({ as: Tag = 'span', children, className = '', delay = 0, ...props }) {
  const ref = useRef(null)
  const label = plainText(children)

  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const words = node.querySelectorAll('.kinetic-text__word')
    if (!words.length) return undefined

    anime.set(words, { opacity: 0, translateY: '115%', scale: 0.94, filter: 'blur(6px)' })
    const reveal = () => {
      anime({
        targets: words,
        opacity: [0, 1],
        translateY: ['115%', '0%'],
        scale: [0.94, 1],
        filter: ['blur(6px)', 'blur(0px)'],
        delay: anime.stagger(58, { start: delay }),
        duration: 790,
        easing: 'easeOutExpo',
      })
    }
    if (typeof IntersectionObserver === 'undefined') {
      anime.set(words, { opacity: 1, translateY: 0, scale: 1, filter: 'blur(0px)' })
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      reveal()
      observer.disconnect()
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' })
    observer.observe(node)
    return () => {
      observer.disconnect()
      anime.remove(words)
    }
  }, [delay])

  return (
    <Tag ref={ref} {...props} className={`kinetic-text ${className}`.trim()} aria-label={label}>
      <span aria-hidden="true">{splitWords(children)}</span>
    </Tag>
  )
}
