import React, { useEffect, useRef } from 'react'
import anime from 'animejs'

export default function AnimatedCount({ value, pad = 0, delay = 0 }) {
  const ref = useRef(null)
  const finalValue = Number(value)
  const format = (number) => String(Math.round(number)).padStart(pad, '0')

  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const counter = { value: 0 }
    node.textContent = format(0)
    const animation = anime({
      targets: counter,
      value: finalValue,
      round: 1,
      delay,
      duration: 1450,
      easing: 'easeOutExpo',
      update: () => { node.textContent = format(counter.value) },
    })
    return () => {
      animation.pause()
      anime.remove(counter)
    }
  }, [delay, finalValue, pad])

  return <span ref={ref} aria-label={format(finalValue)}>{format(finalValue)}</span>
}
