"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSPConnect } from "./sp-connect-context";
import { MessageCircleIcon, SendIcon, XIcon } from "lucide-react";

export function SPConnectWidget() {
  const { isOpen, openWidget, closeWidget } = useSPConnect();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Ask for any program by subject, degree, institute, or country. I will search live and return matching programs.",
      programs: [],
    },
  ]);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleClose = () => {
    closeWidget();
  };

  const runProgramSearch = async (queryText) => {
    const query = String(queryText || "").trim();
    if (!query) return;

    setLoading(true);
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: query, programs: [] }]);

    try {
      const res = await fetch("/api/chat-program-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          history: messages.slice(-10).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      const ranked = Array.isArray(payload?.programs) ? payload.programs : [];
      const answer = String(payload?.answer || "").trim();

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text:
            answer ||
            (ranked.length
              ? `Found ${ranked.length} real programs for "${query}".`
              : `No strong matches found for "${query}". Try adding degree/subject/country.`),
          programs: ranked,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Program service is temporarily unavailable. Please retry in a moment.",
          programs: [],
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={openWidget}
          title="Ask AI"
          aria-label="Open chatbot"
          className="hidden md:flex fixed bottom-6 right-6 z-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-white"
        >
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 shadow-[0_12px_30px_rgba(79,70,229,.45)] transition-transform duration-200 hover:scale-105">
            <MessageCircleIcon className="h-7 w-7 text-white" strokeWidth={2.1} />
          </span>
        </button>
      )}

      {isOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={handleClose} aria-hidden="true" />

          <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[430px] md:max-w-[calc(100vw-2rem)] md:h-[72vh] z-50 animate-in slide-in-from-bottom-8 md:slide-in-from-right-10 fade-in-50 duration-300">
            <Card className="h-full flex flex-col shadow-2xl border border-slate-200/80 bg-white/95 backdrop-blur rounded-none md:rounded-2xl overflow-hidden">
              <CardHeader className="flex-shrink-0 border-b border-slate-200 p-0">
                <div className="relative flex items-start justify-between gap-3 px-4 py-3 bg-white/90">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600">
                      <MessageCircleIcon className="h-6 w-6 text-white" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-[1rem] font-bold tracking-tight m-0 leading-tight text-slate-900">
                        Ask AI
                      </CardTitle>
                      <p className="text-[11px] leading-snug text-slate-500">
                        Floating program assistant
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="h-9 w-9 flex-shrink-0 rounded-full text-slate-500 hover:text-slate-900"
                    aria-label="Close"
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-3">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] rounded-2xl px-3 py-2 ${msg.role === "user" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-800"}`}>
                        <p className="text-sm">{msg.text}</p>
                        {Array.isArray(msg.programs) && msg.programs.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {msg.programs.map((p) => (
                              <Link
                                key={p.id}
                                href={`/courses/program/${p.id}`}
                                className="block rounded-xl border border-slate-200 bg-white p-2 hover:border-indigo-300 hover:shadow-sm transition"
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={p.logo || "/images/logo/scholarpass-logo.png"}
                                    alt={p.institute}
                                    className="h-9 w-9 rounded-md object-contain bg-white border border-slate-200 p-1"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "/images/logo/scholarpass-logo.png";
                                    }}
                                  />
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">{p.title}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{p.institute}</div>
                                    {p.department ? (
                                      <div className="text-[10px] text-slate-400 truncate">{p.department}</div>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-600">
                                  <span>{p.level}</span>
                                  <span>{p.tuition}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                  {loading ? <div className="text-xs text-slate-500">Searching programs...</div> : null}
                </div>

                <form
                  className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    runProgramSearch(input);
                  }}
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type subject, degree, university, or country..."
                    className="h-10"
                  />
                  <Button type="submit" disabled={loading || !String(input).trim()} className="h-10 px-3 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
