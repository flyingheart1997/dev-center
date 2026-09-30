"use client"

import * as React from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue, Variants } from "motion/react"

// Production-grade Framer Motion variants
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      delay: custom * 0.08,
    },
  }),
}

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

interface FadeInWhenVisibleProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  duration?: number
  viewportAmount?: number
  once?: boolean
}

export function FadeInWhenVisible({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 36,
  duration = 0.6,
  viewportAmount = 0.12,
  once = false,
}: FadeInWhenVisibleProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 }
      case "down":
        return { y: -distance, x: 0 }
      case "left":
        return { x: distance, y: 0 }
      case "right":
        return { x: -distance, y: 0 }
      case "none":
        return { x: 0, y: 0 }
    }
  }

  const initialPos = getInitialPosition()

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)", ...initialPos }}
      whileInView={{ opacity: 1, filter: "blur(0px)", x: 0, y: 0 }}
      viewport={{ once, amount: viewportAmount, margin: "-30px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function BlurFadeIn({
  children,
  className = "",
  delay = 0,
  distance = 28,
  duration = 0.6,
  once = false,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  distance?: number
  duration?: number
  once?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", y: distance }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerGroupProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  viewportAmount?: number
  once?: boolean
}

export function StaggerGroup({
  children,
  className,
  staggerDelay = 0.08,
  viewportAmount = 0.12,
  once = false,
}: StaggerGroupProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: viewportAmount, margin: "-30px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div variants={fadeInUpVariants} className={className}>
      {children}
    </motion.div>
  )
}

export function TextShimmer({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.span
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 200%",
      }}
      className={`bg-linear-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent inline-block ${className}`}
    >
      {children}
    </motion.span>
  )
}

export function ScrollParallaxItem({
  children,
  className = "",
  speed = 30,
}: {
  children: React.ReactNode
  className?: string
  speed?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed])
  const smoothY = useSpring(y, { stiffness: 80, damping: 25 })

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smoothY }}>{children}</motion.div>
    </div>
  )
}

export function PerspectiveScrollFrame({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.5, 1])

  const smoothRotateX = useSpring(rotateX, { stiffness: 90, damping: 22 })
  const smoothScale = useSpring(scale, { stiffness: 90, damping: 22 })

  return (
    <div ref={ref} className="perspective-1000">
      <motion.div
        style={{
          rotateX: smoothRotateX,
          scale: smoothScale,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(168, 85, 247, 0.15)",
}: {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    mouseX.set(-500)
    mouseY.set(-500)
  }

  const backgroundStyle = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 60%)`
  )

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group rounded-xl ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-xl overflow-hidden"
        style={{
          background: backgroundStyle,
        }}
      />
      {children}
    </div>
  )
}

export function TiltCard({
  children,
  className = "",
  tiltAmount = 6,
}: {
  children: React.ReactNode
  className?: string
  tiltAmount?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltAmount, -tiltAmount])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltAmount, tiltAmount])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FloatElement({
  children,
  className = "",
  distance = 6,
  duration = 4,
}: {
  children: React.ReactNode
  className?: string
  distance?: number
  duration?: number
}) {
  return (
    <motion.div
      animate={{ y: [-distance, distance, -distance] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCounter({ value }: { value: string }) {
  const match = value.match(/\d[\d,.]*/)
  const rawNum = match ? parseFloat(match[0].replace(/,/g, "")) : null
  const prefix = value.split(/\d[\d,.]*/)[0] || ""
  const suffix = value.split(/\d[\d,.]*/)[1] || ""

  const [displayValue, setDisplayValue] = React.useState(0)

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      onViewportEnter={() => {
        if (rawNum === null) return
        const duration = 1200
        const startTime = performance.now()

        const update = (now: number) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          const current = Number((easeProgress * rawNum).toFixed(value.includes(".") ? 1 : 0))
          setDisplayValue(current)
          if (progress < 1) {
            requestAnimationFrame(update)
          }
        }
        requestAnimationFrame(update)
      }}
    >
      {rawNum !== null ? `${prefix}${displayValue.toLocaleString()}${suffix}` : value}
    </motion.span>
  )
}

export function GlowingOrbParticles({ count = 14 }: { count?: number }) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: (i * 7.5 + 3) % 95,
      y: (i * 13 + 5) % 90,
      size: (i % 3) + 2.5,
      duration: (i % 4) + 4,
      delay: (i % 3) * 0.8,
    }))
  }, [count])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.15, y: 0 }}
          animate={{
            opacity: [0.15, 0.65, 0.15],
            y: [-12, 12, -12],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          className="absolute rounded-full bg-primary/40 blur-[1px]"
        />
      ))}
    </div>
  )
}

export function ParallaxGlow({ className = "", offset = 80 }: { className?: string; offset?: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.15, 0.85])
  const smoothY = useSpring(y, { stiffness: 70, damping: 20 })

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        style={{ y: smoothY, scale }}
        className={`absolute rounded-full blur-3xl opacity-35 dark:opacity-25 ${className}`}
      />
    </div>
  )
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-purple-500 to-blue-500 origin-left z-50 pointer-events-none"
    />
  )
}
