import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Task, CalendarEvent, EmailInsight } from '../types';
import { getChiefOfStaffResponse } from '../services/gemini';

interface ChiefOfStaffProps {
  context: {
    tasks: Task[];
    events: CalendarEvent[];
    emails: EmailInsight[];
  };
}

const STORAGE_KEY = 'execai_chat_history';

const ChiefOfStaff: React.FC<ChiefOfStaffProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState<(ChatMessage & { sources?: any[] })[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    return [
      {
        id: '1',
        role: 'assistant',
        content: "Operational link established. I've analyzed your current stack. How shall we proceed with your strategic objectives?",
        timestamp: new Date()
      }
    ];
  });

  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const result = await getChiefOfStaffResponse(textToSend, messages, context);

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: result.text,
      sources: result.sources,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleClearHistory = () => {
    if (window.confirm("Purge strategic logs? This action resets the operational session.")) {
      const initialMsg = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: "Logs purged. New session initialized.",
        timestamp: new Date()
      };
      setMessages([initialMsg]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const directives = [
    { label: "Risks", prompt: "Identify top 3 schedule risks." },
    { label: "Board", prompt: "Draft board update draft." },
    { label: "Intel", prompt: "Latest competitor movements." }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 w-[320px] h-[480px] rounded-[1.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300">
          {/* Compact Executive Header */}
          <div className="p-4 bg-slate-50 dark:bg-[#111] border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                   <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white dark:border-[#111] rounded-full"></div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-[11px] tracking-tight">Intelligence</h3>
                <p className="text-[7px] text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] font-black">CoS Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-0.5">
              <button 
                onClick={handleClearHistory}
                className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                title="Clear Logs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4" />
                </svg>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Intelligence Stream */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-gradient-to-b from-white to-slate-50 dark:from-[#0d0d0d] dark:to-[#080808]">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-[#161616] text-slate-700 dark:text-gray-200 border border-slate-100 dark:border-white/5 rounded-tl-none'
                }`}>
                  <div className="font-medium whitespace-pre-wrap">{m.content}</div>
                  
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                       <div className="flex flex-wrap gap-1">
                         {m.sources.map((s: any, idx: number) => (
                           <a 
                             key={idx} 
                             href={s.web?.uri || s.maps?.uri} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-[8px] bg-slate-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-white/5 transition-all font-bold truncate max-w-full"
                           >
                             {s.web?.title || s.maps?.title || 'Source'}
                           </a>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
                <span className="text-[7px] text-slate-400 dark:text-gray-600 mt-1 font-black tracking-widest uppercase">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#161616] p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/5 flex items-center space-x-2 shadow-sm">
                  <div className="flex space-x-0.5">
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[8px] text-slate-500 dark:text-gray-400 font-black uppercase tracking-widest">Synthesizing</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Ledger & Input */}
          <div className="p-3 bg-slate-50 dark:bg-[#111] border-t border-slate-100 dark:border-white/5 space-y-2">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {directives.map((dir, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(dir.prompt)}
                  className="flex-shrink-0 px-2.5 py-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 rounded-full text-[8px] font-black text-slate-600 dark:text-gray-400 uppercase tracking-widest hover:border-blue-500 transition-all active:scale-95 shadow-sm"
                >
                  {dir.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Issue directive..."
                className="flex-1 bg-white dark:bg-[#080808] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-blue-600/50 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !isTyping ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 active:scale-90' : 'bg-slate-200 dark:bg-gray-800 text-slate-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_12px_24px_-4px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 group relative"
        >
          <div className="absolute inset-0 bg-blue-600 rounded-2xl animate-ping opacity-10 pointer-events-none"></div>
          <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChiefOfStaff;
