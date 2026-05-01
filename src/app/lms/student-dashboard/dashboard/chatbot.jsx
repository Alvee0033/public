"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { toast } from "sonner";

export function Chatbot() {
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Local state for messages and input
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I am your learning buddy." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);

  // Get student_id from localStorage on mount
  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setStudentId(user.id || user.student_id || user.userId);
      }
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
    }
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => setInput(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmed = (input || "").trim();
    if (!trimmed) return;

    if (!studentId) {
      toast.error("Student ID not found. Please log in again.");
      return;
    }

    // Append user's message to chat
    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare the request body with all messages
      const requestBody = {
        student_id: studentId,
        messages: [
          { role: "assistant", content: "Hey! I am your learning buddy." },
          { role: "user", content: trimmed },
        ],
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Append AI response to messages
      if (data.ai_message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.ai_message },
        ]);
      } else {
        throw new Error("No AI message in response");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again.");
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full p-4 gradient-bg hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={24} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="w-96 h-[600px] flex flex-col shadow-xl gradient-border">
              <CardHeader className="flex flex-row items-center space-x-2">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TutorPlan-Logo-192x192-AKWmxp00VWI8w9gjmB292zwExnQlQj.png"
                  alt="TutorsPlan Logo"
                  width={24}
                  height={24}
                />
                <CardTitle className="flex-1 gradient-text">
                  ScholarPASS Copilot
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={24} />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full pr-4 chat-scroll-area">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="gradient-bg p-4 rounded-full">
                        <MessageCircle size={24} className="text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">
                          Welcome to ScholarPASS Copilot!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Ask me anything about your studies, lessons, or
                          learning strategies.
                        </p>
                      </div>
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "mb-4 flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center mr-2">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TutorPlan-Logo-192x192-AKWmxp00VWI8w9gjmB292zwExnQlQj.png"
                            alt="AI"
                            width={16}
                            height={16}
                          />
                        </div>
                      )}
                      <div
                        className={cn(
                          "rounded-lg px-4 py-2 max-w-[270px]",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    language={match[1]}
                                    PreTag="div"
                                    style={oneDark}
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <span ref={messagesEndRef} />
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center">
                        <Loader2
                          size={14}
                          className="animate-spin text-white"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Thinking...
                      </div>
                    </motion.div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 pt-2">
                <form onSubmit={onSubmit} className="flex w-full gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask ScholarPASS Copilot..."
                    className="gradient-border"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="gradient-bg hover:opacity-90"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
