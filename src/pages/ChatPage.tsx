import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Olá! 👋 Sou o assistente de bem-estar da Quality Life. Posso ajudar com dicas de saúde, alongamentos, alimentação saudável e muito mais. Como posso ajudar você hoje?",
  },
];

const mockResponses = [
  "Que ótima pergunta! Para melhorar sua postura no trabalho, tente: 1) Ajuste a altura da cadeira para que seus pés fiquem apoiados no chão. 2) Mantenha o monitor na altura dos olhos. 3) Faça pausas a cada 50 minutos para alongar.",
  "Beber água é essencial! A recomendação é de pelo menos 2 litros por dia. Uma dica: mantenha uma garrafa ao lado do computador e estabeleça lembretes a cada hora.",
  "Para reduzir o estresse no trabalho, experimente a técnica 4-7-8: inspire por 4 segundos, segure por 7 e expire por 8. Repita 3 vezes. Isso ativa o sistema nervoso parassimpático e promove calma.",
  "Exercícios de alongamento no trabalho são muito importantes! Tente girar suavemente o pescoço, alongar os braços acima da cabeça e fazer rotações de punho a cada hora.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Mock AI response (will be replaced with Lovable AI)
    await new Promise((r) => setTimeout(r, 1200));
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Chat de Bem-Estar</h1>
        <p className="text-muted-foreground text-sm">Converse com nossa IA sobre saúde e qualidade de vida.</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === "assistant" ? "wellness-gradient-bg" : "bg-muted"
            }`}>
              {msg.role === "assistant" ? (
                <Bot className="w-4 h-4 text-primary-foreground" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "assistant"
                ? "bg-card border border-border text-foreground"
                : "wellness-gradient-bg text-primary-foreground"
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full wellness-gradient-bg flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Digite sua pergunta sobre bem-estar..."
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="w-12 h-12 rounded-xl wellness-gradient-bg flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
