"use client";

import { useState, useRef, useEffect } from "react";
import { GraduationCap, X, Send, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { consultants } from "@/data/consultants";
import { clsx } from "clsx";
import Link from "next/link";

interface Message {
  role: "user" | "ai";
  content: string;
}

// Common Q&A knowledge base
const knowledgeBase = [
  {
    keywords: ["timeline", "when", "schedule"],
    response: "Application Timeline:\n\nSep-Oct: Prepare essays, request recommendations\nNov: ED/EA deadlines\nJan: RD deadlines\nFeb-Apr: Wait for decisions\n\nWhich stage are you in?"
  },
  {
    keywords: ["gpa", "grade", "transcript"],
    response: "GPA is important but not everything.\n\nTop schools typically want 3.8+, but you can compensate with:\n- Strong essays\n- Outstanding extracurriculars\n- Great recommendations\n\nWhat's your GPA?"
  },
  {
    keywords: ["essay", "personal statement", "writing"],
    response: "Essay Tips:\n\n1. Hook the reader from the start\n2. Show, don't tell\n3. Be authentic\n4. Revise 5-10+ times\n\nAny specific essay questions?"
  },
  {
    keywords: ["school", "college", "university", "choose"],
    response: "School Selection Factors:\n\n- Academic fit\n- Campus culture\n- Location\n- Career outcomes\n- Cost\n\nWhat matters most to you?"
  },
  {
    keywords: ["major", "degree", "interest"],
    response: "Major Selection:\n\nIf undecided:\n1. Choose undecided (many schools allow)\n2. Start with foundational subjects\n3. Consider interdisciplinary programs\n\nWhat's your interest?"
  },
  {
    keywords: ["sat", "act", "test", "score"],
    response: "Standardized Tests:\n\nMany schools are test-optional, but good scores help.\n\nSAT 1500+ / ACT 33+ for top schools.\n\nNeed help planning?"
  },
  {
    keywords: ["activity", "extracurricular", "club"],
    response: "Extracurricular Tips:\n\nQuality over quantity:\n1. Deep involvement in 2-3 activities\n2. Show leadership\n3. Measurable impact\n\nAny activities you're involved in?"
  },
  {
    keywords: ["recommendation", "recommender", "teacher"],
    response: "Recommendation Tips:\n\nAsk teachers who:\n- Taught you core subjects\n- Can give specific examples\n- Know your growth\n\nRequest at least 2 months in advance."
  },
];

// Default fallback responses (fixed, no random)
const defaultFallback = "Great question! Want to dive deeper? I can recommend a professional consultant. Which school or major interests you?";

// Get AI response based on user message
const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Find matching knowledge
  for (const item of knowledgeBase) {
    if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return item.response;
    }
  }
  
  return defaultFallback;
};

// Recommend consultant based on conversation context
const recommendConsultant = () => {
  // Simply recommend top rated consultants
  const topConsultants = [...consultants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 2);
  
  return topConsultants;
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm PathPal AI Assistant 🎓\n\nAsk me anything about US college admissions. I'll answer 3 questions for free, then recommend the best matching consultants." }
  ]);
  const [input, setInput] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    // Check if should recommend consultant (after 3 questions)
    if (questionCount >= 3) {
      const recommended = recommendConsultant();
      setTimeout(() => {
        const recommendationText = `You've asked 3 questions! 👆\n\nBased on your questions, I recommend these consultants:\n\n${recommended.map((c, i) => {
          const link = `/consultant/${c.id}`;
          return `${i+1}. ${c.name} - ${c.school} ($${c.services[0].price}/session)\n   Specialties: ${c.specialties.slice(0, 2).join(", ")}\n   📅 Book: ${link}`;
        }).join("\n\n")}\n\nReady to book a 1-on-1 session?`;
        
        setMessages(prev => [...prev, { role: "ai", content: recommendationText }]);
      }, 500);
      return;
    }
    
    // Get AI response
    const response = getAIResponse(userMessage);
    setQuestionCount(prev => prev + 1);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", content: response }]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          <span className="font-semibold">PathPal AI</span>
          <span className="text-xs bg-emerald-500 px-2 py-0.5 rounded-full">Free</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Question counter */}
      <div className="bg-emerald-50 px-4 py-2 text-xs text-emerald-700 flex items-center gap-2">
        <Sparkles className="w-3 h-3" />
        Free questions remaining: {3 - questionCount}
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
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
            <p className="text-sm whitespace-pre-line" dangerouslySetInnerHTML={{ 
              __html: msg.content.replace(/📅 Book: (\/consultant\/\d+)/g, '📅 <a href="$1" class="text-emerald-600 underline hover:text-emerald-700" target="_blank" rel="noopener">$1</a>')
            }} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your question..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {questionCount >= 2 && (
          <Link 
            href="/become-consultant"
            onClick={() => setIsOpen(false)}
            className="block text-center text-xs text-emerald-600 hover:text-emerald-700 mt-2"
          >
            Become a Consultant →
          </Link>
        )}
      </div>
    </div>
  );
}