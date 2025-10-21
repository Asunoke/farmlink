"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  priority = false,
  placeholder = "blur",
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`transition-all duration-300 ${
          isLoading ? 'blur-sm scale-110' : 'blur-0 scale-100'
        }`}
        onLoad={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-[#006633]/20 animate-pulse" />
      )}
    </motion.div>
  )
}
