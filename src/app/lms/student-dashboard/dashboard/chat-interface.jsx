"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { motion } from "framer-motion"
import { AlertTriangle, Loader2, Send } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

export function ChatInterface() {
    const scrollAreaRef = useRef(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: "/api/chat",
        onFinish: () => {
            if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
            }
            setErrorMessage(null)
        },
        onError: (error) => {
            console.error("Chat error:", error)
            setErrorMessage(error.message || "An unexpected error occurred. Please try again.")
        },
    })

    return (
        <Card className="flex flex-col h-full shadow-xl gradient-border">
            <CardHeader className="flex flex-row items-center space-x-2">
                <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TutorPlan-Logo-192x192-AKWmxp00VWI8w9gjmB292zwExnQlQj.png"
                    alt="TutorsPlan Logo"
                    width={24}
                    height={24}
                />
                <CardTitle className="gradient-text">ScholarPASS Copilot</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                    {errorMessage && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                <p>{errorMessage}</p>
                            </AlertDescription>
                        </Alert>
                    )}

                    {messages.length === 0 && !errorMessage && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="gradient-bg p-4 rounded-full">
                                <Image
                                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TutorPlan-Logo-192x192-AKWmxp00VWI8w9gjmB292zwExnQlQj.png"
                                    alt="TutorsPlan Logo"
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold">Welcome to ScholarPASS Copilot!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Ask me anything about education, study techniques, or general knowledge.
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
                            className={cn("mb-4 flex", message.role === "user" ? "justify-end" : "justify-start")}
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
                            {message.role === "user" && (
                                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center ml-2 order-1">
                                    <Image
                                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Faisal%20Alam-7tSgo2BuEzOYaNNzFMW7nWU1kwzQF3.png"
                                        alt="User"
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "rounded-lg px-3 py-2 max-w-[80%]",
                                    message.role === "user" ? "bg-primary text-primary-foreground order-0" : "bg-muted",
                                )}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center">
                                <Loader2 size={14} className="animate-spin text-white" />
                            </div>
                            <div className="text-sm text-muted-foreground">Thinking...</div>
                        </motion.div>
                    )}
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 pt-2">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question..."
                        className="gradient-border"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="gradient-bg hover:opacity-90"
                        disabled={isLoading || !input.trim()}
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
