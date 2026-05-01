"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

const LazyChatbot = dynamic(
  () => import("../chatbot").then((mod) => mod.Chatbot),
  { ssr: false }
);

export default function DeferredChatbotLauncher() {
  const [isEnabled, setIsEnabled] = useState(false);

  if (isEnabled) {
    return <LazyChatbot />;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        type="button"
        onClick={() => setIsEnabled(true)}
        className="rounded-full p-4 gradient-bg hover:opacity-90 transition-opacity"
        aria-label="Open ScholarPASS Copilot"
      >
        <MessageCircle size={24} />
      </Button>
    </div>
  );
}
