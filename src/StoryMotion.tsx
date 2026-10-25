'use client'

import { type ReactNode, type RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.25, margin: '0px 0px -24px 0px' } as const

export function Reveal({ children, className, distance = 28, delay = 0 }: { children: ReactNode; className?: string; distance?: number; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { y: distance }} whileInView={{ y: 0 }} viewport={viewport} transition={{ duration: reduced ? 0 : 0.85, delay: reduced ? 0 : delay, ease }}>{children}</motion.div>
}

export function SceneTitle({ children, id, tabIndex, className }: { children: ReactNode; id: string; tabIndex?: number; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.h2 id={id} tabIndex={tabIndex} className={className} initial={reduced ? false : { y: 42, opacity: 0.7 }} whileInView={{ y: 0, opacity: 1 }} viewport={viewport} transition={{ duration: reduced ? 0 : 0.9, ease }}>{children}</motion.h2>
}

export function SceneDrift({ children, className, target, distance = 46, scale = 1 }: { children: ReactNode; className?: string; target: RefObject<HTMLElement | null>; distance?: number; scale?: number }) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 0.42, 1], [distance, 0, -distance * 0.45])
  return <motion.div className={className} style={{ y: reduced ? 0 : y }} initial={reduced ? false : { scale }} whileInView={{ scale: 1 }} viewport={viewport} transition={{ duration: reduced ? 0 : 0.95, ease }}>{children}</motion.div>
}
