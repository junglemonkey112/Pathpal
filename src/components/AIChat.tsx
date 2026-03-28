"use client";

import { useState, useRef, useEffect } from "react";
import { GraduationCap, X, Send, MessageCircle, Sparkles, Loader2 } from "lucide-react";
import { counsellors } from "@/data/counsellors";
import { clsx } from "clsx";
import Link from "next/link";
import { MAX_FREE_QUESTIONS, AI_RESPONSE_DELAY_MS } from "@/lib/constants";

interface Message {
  role: "user" | "ai";
  content: string;
}

// Fallback Q&A knowledge base (used when API is unavailable)
const knowledgeBase = [
  { keywords: ["timeline", "when", "schedule"], response: "Application Timeline:\n\nSep-Oct: Prepare essays, request recommendations\nNov: ED/EA deadlines\nJan: RD deadlines\nFeb-Apr: Wait for decisions\n\nWhich stage are you in?" },
  { keywords: ["gpa", "grade", "transcript"], response: "GPA is important but not everything.\n\nTop schools typically want 3.8+, but you can compensate with:\n- Strong essays\n- Outstanding extracurriculars\n- Great recommendations\n\nWhat's your GPA?" },
  { keywords: ["essay", "personal statement", "writing"], response: "Essay Tips:\n\n1. Hook the reader from the start\n2. Show, don't tell\n3. Be authentic\n4. Revise 5-10+ times\n\nAny specific essay questions?" },
  { keywords: ["school", "college", "university", "choose"], response: "School Selection Factors:\n\n- Academic fit\n- Campus culture\n- Location\n- Career outcomes\n- Cost\n\nWhat matters most to you?" },
  { keywords: ["major", "degree", "interest"], response: "Major Selection:\n\nIf undecided:\n1. Choose undecided (many schools allow)\n2. Start with foundational subjects\n3. Consider interdisciplinary programs\n\nWhat's your interest?" },
  { keywords: ["sat", "act", "test", "score"], response: "Standardized Tests:\n\nMany schools are test-optional, but good scores help.\n\nSAT 1500+ / ACT 33+ for top schools.\n\nNeed help planning?" },
  { keywords: ["activity", "extracurricular", "club"], response: "Extracurricular Tips:\n\nQuality over quantity:\n1. Deep involvement in 2-3 activities\n2. Show leadership\n3. Measurable impact\n\nAny activities you're involved in?" },
  { keywords: ["recommendation", "recommender", "teacher"], response: "Recommendation Tips:\n\nAsk teachers who:\n- Taught you core subjects\n- Can give specific examples\n- Know your growth\n\nRequest at least 2 months in advance." },
];

const defaultFallback = "Great question! Want to dive deeper? I can recommend a professional consultant. Which school or major interests you?";

const getFallbackResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  for (const item of knowledgeBase) {
    if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return item.response;
    }
  }
  return defaultFallback;
};

const recommendConsultant = () => {
  return [...counsellors].sort((a, b) => b.rating - a.rating).slice(0, 2);
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm PathPal AI Assistant 🎓\n\nAsk me anything about US college admissions. I'll answer 3 questions for free, then recommend the best matching consultants." }
  ]);
  const [input, setInput] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getAIResponse = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory.map(m => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("API unavailable");

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data.content;
    } catch {
      return getFallbackResponse(userMessage);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    // On the last free question, get AI response then show recommendation
    if (newCount >= MAX_FREE_QUESTIONS) {
      setIsTyping(true);
      const response = await getAIResponse(userMessage, newMessages);
      const recommended = recommendConsultant();
      const recommendationText = `${response}\n\n---\n\nYou've used your ${MAX_FREE_QUESTIONS} free questions! For deeper, personalized guidance, I recommend booking a 1-on-1 session:\n\n${recommended.map((c, i) => {
        const link = `/consultant/${c.id}`;
        return `${i+1}. ${c.name} - ${c.school} ($${c.services[0].price}/session)\n   Specialties: ${c.specialties.slice(0, 2).join(", ")}\n   📅 Book: ${link}`;
      }).join("\n\n")}`;
      setMessages(prev => [...prev, { role: "ai", content: recommendationText }]);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const response = await getAIResponse(userMessage, newMessages);
    setMessages(prev => [...prev, { role: "ai", content: response }]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Open AI chat assistant"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full sm:bottom-6 sm:right-6 sm:w-[28rem] md:w-[32rem] bg-white sm:rounded-2xl shadow-2xl z-50 overflow-hidden">
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          <span className="font-semibold">PathPal AI</span>
          <span className="text-xs bg-emerald-500 px-2 py-0.5 rounded-full">Free</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded" aria-label="Close chat">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-emerald-50 px-4 py-2 text-xs text-emerald-700 flex items-center gap-2">
        <Sparkles className="w-3 h-3" />
        Free questions remaining: {Math.max(0, MAX_FREE_QUESTIONS - questionCount)}
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={clsx(
              "max-w-[85%] rounded-2xl px-4 py-2",
              msg.role === "user"
                ? "ml-auto bg-slate-900 text-white rounded-br-sm"
                : "bg-slate-100 text-slate-800 rounded-bl-sm"
            )}
          >
            <p className="text-sm whitespace-pre-line">
              {msg.content.split(/(📅 Book: \/consultant\/\d+)/).map((part, i) => {
                const linkMatch = part.match(/📅 Book: (\/consultant\/\d+)/);
                if (linkMatch) {
                  return (
                    <span key={i}>
                      📅{" "}
                      <Link href={linkMatch[1]} className="text-emerald-600 underline hover:text-emerald-700">
                        Book Now
                      </Link>
                    </span>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </p>
          </div>
        ))}
        {isTyping && (
          <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-slate-100 text-slate-800 rounded-bl-sm">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3">
        {questionCount >= MAX_FREE_QUESTIONS ? (
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500">Free questions used. Get personalized help from a consultant.</p>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-emerald-500 text-white py-2.5 rounded-full text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Browse Consultants
            </Link>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isTyping ? "Waiting for response..." : "Ask your question..."}
                disabled={isTyping}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            {questionCount === MAX_FREE_QUESTIONS - 1 && (
              <p className="text-center text-xs text-amber-600 mt-1.5">Last free question!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
