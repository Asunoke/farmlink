"use client"

import { motion } from "framer-motion"
import { Leaf, Cloud, TrendingUp } from "lucide-react"

export function LoadingSpinner() {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#006633] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  )
}

export function FeatureLoadingCard() {
  return (
    <motion.div
      className="bg-white rounded-lg p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4 mb-4">
        <motion.div
          className="w-12 h-12 bg-gradient-to-r from-[#006633] to-[#D4AF37] rounded-lg flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Leaf className="h-6 w-6 text-white" />
        </motion.div>
        <div className="flex-1">
          <motion.div
            className="h-4 bg-gray-200 rounded mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-3 bg-gray-100 rounded w-2/3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>
      </div>
      <motion.div
        className="space-y-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      >
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-3/5" />
      </motion.div>
    </motion.div>
  )
}

export function StatsCounter({ 
  end, 
  duration = 2, 
  prefix = "", 
  suffix = "" 
}: { 
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {prefix}
        <motion.span
          initial={0}
          whileInView={end}
          viewport={{ once: true }}
          transition={{ duration, ease: "easeOut" }}
        >
          {({ value }) => Math.round(value)}
        </motion.span>
        {suffix}
      </motion.span>
    </motion.div>
  )
}

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 bg-[#D4AF37]/20 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-6 h-6 bg-[#006633]/20 rounded-full"
        animate={{
          y: [0, 15, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-3 h-3 bg-[#C1440E]/20 rounded-full"
        animate={{
          y: [0, -10, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </div>
  )
}
