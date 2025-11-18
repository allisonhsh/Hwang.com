'use client'

import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"

export default function ScrollReveal({
  children,
  delay = 0,
  y = 20,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
}) {
  const controls = useAnimation()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay, ease: "easeOut" },
      })
    }
  }, [inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={controls}
    >
      {children}
    </motion.div>
  )
}
