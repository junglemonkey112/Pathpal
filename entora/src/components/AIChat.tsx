"use client";

import { useState, useRef, useEffect } from "react";
import { GraduationCap, X, Send, MessageCircle, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_FREE_QUESTIONS = 3;

interface Message {
  role: "user" | "ai";
  content: string;
}

const knowledgeBase = [
  { keywords: ["timeline", "when", "schedule"], response: "Application Timeline:\n\nSep-Oct: Prepare essays, request recommendations\nNov: ED/EA deadlines\nJan: RD deadlines\nFeb-Apr: Wait for decisions\n\nWhich stage are you in?" },
  { keywords: ["gpa", "grade", "transcript"], response: "GPA is important but not everything.\n\nTop schools typically want 3.8+, but you can compensate with strong essays, outstanding extracurriculars, and great recommendations.\n\nWhat's your GPA?" },
  { keywords: ["essay", "personal statement", "writing"], response: "Essay Tips:\n\n1. Hook the reader from the start\n2. Show, don't tell\n3. Be authentic\n4. Revise 5-10+ times\n\nNeed help with a specific essay topic?" },
  { keywords: ["school", "college", "university", "choose"], response: "Key factors to consider: academic fit, campus culture, location, career outcomes, and cost.\n\nUse our School Explorer to compare universities side by side!\n\nWhat matters most to you?" },
  { keywords: ["major", "degree", "interest"], response: "If you're undecided, that's okay! Many schools let you explore.\n\n1. Start with foundational subjects\n2. Consider interdisciplinary programs\n3. Look at career outcomes by major\n\nWhat subjects excite you?" },
  { keywords: ["sat", "act", "test", "score"], response: "Many schools are test-optional now, but good scores still help.\n\nSAT 1500+ / ACT 33+ for top schools.\n\nCheck our Roadmap for the best time to start prep!" },
  { keywords: ["financial", "aid", "scholarship", "cost"], response: "Financial aid options:\n\n1. FAFSA (apply early!)\n2. CSS Profile for private schools\n3. Merit scholarships\n4. Need-based grants\n\nCheck our Resource Library for detailed guides!" },
  { keywords: ["international", "visa", "f-1"], response: "International student tips:\n\n1. Research schools friendly to international applicants\n2. Prepare for English proficiency tests (TOEFL/IELTS)\n3. Start visa process early\n\nWhat country are you applying from?" },
];

const getFallbackResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  for (const item of knowledgeBase) {
    if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return item.response;
    }
  }
  return "Great question! For deeper guidance, check out our Community forum or browse our Resource Library.\n\nWhat specific topic would you like help with?";
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm Entora AI\n\nAsk me anything about college admissions \u2014 applications, essays, financial aid, or school selection. I'll answer 3 questions for free!" }
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

    if (newCount >= MAX_FREE_QUESTIONS) {
      setIsTyping(true);
      const response = await getAIResponse(userMessage, newMessages);
      const recommendationText = `${response}\n\n---\n\nYou've used your ${MAX_FREE_QUESTIONS} free questions! For deeper, personalized guidance, explore our Community forum or check the Resource Library for free guides and checklists.`;
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Open AI chat assistant"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full sm:bottom-6 sm:right-6 sm:w-[28rem] md:w-[32rem] bg-white dark:bg-neutral-900 sm:rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          <span className="font-semibold">Entora AI</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Free</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded" aria-label="Close chat">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
        <Sparkles className="w-3 h-3" />
        Free questions remaining: {Math.max(0, MAX_FREE_QUESTIONS - questionCount)}
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2",
              msg.role === "user"
                ? "ml-auto bg-indigo-600 text-white rounded-br-sm"
                : "bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
            )}
          >
            <p className="text-sm whitespace-pre-line">{msg.content}</p>
          </div>
        ))}
        {isTyping && (
          <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-bl-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        {questionCount >= MAX_FREE_QUESTIONS ? (
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Free questions used. Explore our free resources!</p>
            <a
              href="/community"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-indigo-600 text-white py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse Community
            </a>
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
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-neutral-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
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
