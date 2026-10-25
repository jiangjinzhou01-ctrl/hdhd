'use client'

import { type ReactNode, type RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

// A single rhythm for the whole story: reveal, follow the scroll, acknowledge a tap.
export const motionRhythm = {
  ease: [0.22, 1, 0.36, 1] as const,
  duration: 0.76,
  step: 0.09,
  distance: 24,
  interaction: 0.24,
}
const viewport = { once: true, amount: 0.15, margin: '0px 0px -32px 0px' } as const

export function storyTransition(reduced: boolean | null, delay = 0) {
  return { duration: reduced ? 0 : motionRhythm.duration, delay: reduced ? 0 : delay, ease: motionRhythm.ease }
}

export function pressMotion(reduced: boolean | null) {
  return {
    whileHover: reduced ? undefined : { y: -2 },
    whileTap: reduced ? undefined : { scale: 0.97 },
    transition: { duration: reduced ? 0 : motionRhythm.interaction, ease: motionRhythm.ease },
  }
}

type RevealProps = {
  children: ReactNode
  as?: 'div' | 'p' | 'h1' | 'h2' | 'aside'
  className?: string
  id?: string
  tabIndex?: number
  'aria-label'?: string
  distance?: number
  delay?: number
  entry?: 'scroll' | 'load'
}

export function Reveal({ children, as = 'div', className, id, tabIndex, 'aria-label': ariaLabel, distance = motionRhythm.distance, delay = 0, entry = 'scroll' }: RevealProps) {
  const reduced = useReducedMotion()
  const Component = motion[as]
  const visible = { y: 0, opacity: 1 }
  return <Component id={id} tabIndex={tabIndex} aria-label={ariaLabel} className={className} data-reveal={entry} initial={reduced ? false : { y: distance, opacity: 0 }} animate={reduced || entry === 'load' ? visible : undefined} whileInView={entry === 'scroll' ? visible : undefined} viewport={viewport} transition={storyTransition(reduced, delay)}>{children}</Component>
}

export function SceneTitle({ children, id, tabIndex, className }: { children: ReactNode; id: string; tabIndex?: number; className?: string }) {
  return <Reveal as="h2" id={id} tabIndex={tabIndex} className={className}>{children}</Reveal>
}

export function SceneDrift({ children, className, target, distance = 32, scale = 1 }: { children: ReactNode; className?: string; target: RefObject<HTMLElement | null>; distance?: number; scale?: number }) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })
  const position = useTransform(scrollYProgress, [0, 0.42, 1], [distance, 0, -distance * 0.45])
  const y = useSpring(position, { stiffness: 120, damping: 28, mass: 0.4 })
  return <motion.div className={className} data-scroll-drift style={{ y: reduced ? 0 : y }} initial={reduced ? false : { scale }} whileInView={{ scale: 1 }} viewport={viewport} transition={storyTransition(reduced)}>{children}</motion.div>
}
