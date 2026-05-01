"use client"

import { useState } from "react"
import { Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AIAgentChat } from "./ai-agent-chat"

export function FloatingAIButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          {/* Pulsing indicator */}
          <div className="absolute -top-1 -right-1">
            <Badge className="bg-green-500 text-white text-xs px-1 py-0 animate-pulse">
              <Zap className="w-3 h-3" />
            </Badge>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
              ScholarPASS AI Assistant
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </div>
      </div>

      <AIAgentChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}
