"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CombatLogProps {
  messages: string[]
}

export function CombatLog({ messages }: CombatLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <Card className="bg-[#0a0e14]/80 border-[#1e2a3a] relative h-full">
      <div className="absolute inset-0 border border-[#4cc9ff]/10"></div>
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-[#4cc9ff]">Combat Log</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e2a3a] scrollbar-track-transparent">
        <div className="space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-[#8bacc1] py-4">No combat activity yet.</div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="text-sm border-l-2 border-[#1e2a3a] pl-2 py-1">
                {message}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </CardContent>
    </Card>
  )
}
