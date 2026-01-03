"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RedirectionOverlay() {
  const [countdown, setCountdown] = useState(10)
  const targetUrl = "https://www.farmlinkmali.com/"

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = targetUrl
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md"
      >
        <div className="mx-auto max-w-md p-6 text-center">
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <ExternalLink className="h-10 w-10 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Nous avons déménagé !</h1>
              <p className="text-muted-foreground text-lg">
                FarmLink est maintenant disponible sur une nouvelle adresse plus simple et plus professionnelle.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-lg">
              <p className="mb-4 font-medium text-xl text-primary">
                farmlinkmali.com
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Redirection automatique dans</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {countdown}
                </span>
                <span>secondes</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full gap-2 text-base font-semibold"
                onClick={() => window.location.href = targetUrl}
              >
                Y aller maintenant
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground">
                Si vous n'êtes pas redirigé, veuillez cliquer sur le bouton ci-dessus.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
