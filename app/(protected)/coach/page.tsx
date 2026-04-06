"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, Bot, User, Loader2, Sparkles, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"

const SUGGESTIONS = [
  "Crie um treino de 30 minutos para fazer em casa",
  "Quais alimentos são bons para ganhar massa muscular?",
  "Como posso melhorar minha resistência cardiovascular?",
  "Sugira um plano alimentar para perder peso",
]

const messageVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
}

export default function CoachPage() {
  const [input, setInput] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, reload } = useChat({
    transport: new DefaultChatTransport({ api: "/api/coach" }),
    onError: (error) => {
      console.error("Coach IA error:", error)
      const errStr = error?.message || String(error)

      if (errStr.includes("429") || errStr.toLowerCase().includes("rate")) {
        setErrorMsg("Muitas requisições simultâneas. Aguarde alguns segundos e tente novamente.")
      } else if (errStr.includes("503") || errStr.toLowerCase().includes("overload")) {
        setErrorMsg("O serviço de IA está sobrecarregado. Tente novamente em instantes.")
      } else if (errStr.includes("401")) {
        setErrorMsg("Sessão expirada. Por favor, faça login novamente.")
      } else {
        setErrorMsg("Não foi possível obter resposta. Clique em 'Tentar novamente' ou envie sua mensagem de novo.")
      }
    },
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setErrorMsg(null)
    setRetryCount(0)
    sendMessage({ text: input })
    setInput("")
  }

  function handleSuggestion(suggestion: string) {
    if (isLoading) return
    setErrorMsg(null)
    setRetryCount(0)
    sendMessage({ text: suggestion })
  }

  function handleRetry() {
    setErrorMsg(null)
    setRetryCount((c) => c + 1)
    reload()
  }

  return (
    <motion.div
      className="flex h-screen flex-col p-6 md:p-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Coach IA</h1>
            <p className="text-sm text-muted-foreground">Seu personal trainer virtual disponível 24/7</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Online
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="glass-card flex flex-1 flex-col overflow-hidden rounded-xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <motion.div
              className="flex h-full flex-col items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="mb-5 rounded-2xl bg-primary/10 p-5 ring-1 ring-primary/20">
                <Bot className="h-12 w-12 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                Olá! Sou seu Coach IA
              </h2>
              <p className="mb-8 max-w-sm text-muted-foreground text-sm leading-relaxed">
                Estou aqui para ajudar com treinos, nutrição e motivação.
                Como posso te ajudar hoje?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestion(suggestion)}
                    className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-4 py-2 text-sm text-foreground transition-all hover:bg-muted hover:border-primary/30 hover:text-primary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.08, duration: 0.3 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/20">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed">
                              {part.text}
                            </p>
                          )
                        }
                        return null
                      })}
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border/50">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/20">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="h-2 w-2 rounded-full bg-primary/60"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">Pensando...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-destructive/20 bg-destructive/5 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="flex-1 text-sm text-destructive">{errorMsg}</p>
                <div className="flex shrink-0 gap-2">
                  {messages.length > 0 && (
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Tentar novamente
                    </button>
                  )}
                  <button
                    onClick={() => setErrorMsg(null)}
                    className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem... (Enter para enviar)"
              className="min-h-[44px] max-h-32 resize-none transition-all focus:ring-1 focus:ring-primary/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 shrink-0 transition-all"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground/60">
            Shift+Enter para nova linha · Enter para enviar
          </p>
        </div>
      </div>
    </motion.div>
  )
}
