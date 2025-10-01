"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function LinkieChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Bonjour, je suis Linkie. Comment puis‑je aider ?" },
  ])
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  const quickReplies = [
    { label: "Voir mes négociations", reply: "Comment voir mes négociations ?" },
    { label: "Créer une offre", reply: "Comment créer une offre ?" },
    { label: "Créer une demande", reply: "Comment créer une demande ?" },
    { label: "Contacter le support", reply: "Comment contacter le support ?" },
  ]

  const ask = async () => {
    const text = input.trim()
    if (!text) return
    setMessages((m) => [...m, { role: "user", content: text }])
    setInput("")
    // Simple heuristic answer (placeholder). Plug your API later.
    const lower = text.toLowerCase()
    let answer = "Je note votre question. Je reviendrai avec plus d'aide bientôt."
    if (lower.includes("negociation") || lower.includes("négociation")) {
      answer = "Pour voir vos négociations: Marché > Mes négociations ou via Mes annonces."
    } else if (lower.includes("offre")) {
      answer = "Créez une offre depuis Marché > Créer une offre."
    } else if (lower.includes("demande")) {
      answer = "Créez une demande depuis Marché > Créer une demande."
    } else if (lower.includes("support") || lower.includes("contact")) {
      answer = "Contactez-nous via la page Contact ou par email support@farmlink.example"
    }
    setMessages((m) => [...m, { role: "assistant", content: answer }])
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-sm:right-2 max-sm:bottom-2">
      {open && (
        <Card className="w-80 max-sm:w-[86vw] mb-3 shadow-lg">
          <CardHeader className="py-3">
            <CardTitle className="text-base">Linkie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-56 max-sm:h-48 overflow-y-auto space-y-2 text-sm">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "assistant" ? "text-foreground" : "text-right"}>
                  <span
                    className={
                      m.role === "assistant"
                        ? "inline-block bg-muted px-3 py-2 rounded-lg"
                        : "inline-block bg-primary text-primary-foreground px-3 py-2 rounded-lg"
                    }
                  >
                    {m.content}
                  </span>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((q) => (
                <Button key={q.label} size="sm" variant="outline" className="text-xs"
                  onClick={() => { setInput(q.reply); setTimeout(ask, 0) }}>
                  {q.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea className="max-sm:text-sm" rows={2} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Posez une question…" />
              <Button onClick={ask}>Envoyer</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Button className="max-sm:text-sm" onClick={() => setOpen((v) => !v)} variant={open ? "secondary" : "default"}>
        {open ? "Fermer" : "Parler à Linkie"}
      </Button>
    </div>
  )
}


