
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

const ChiefOfStaff: React.FC<ChiefOfStaffProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<(ChatMessage & { sources?: any[] })[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Briefing complete. You have a gap at 2 PM—I recommend using it to prep for the Series B update. Should I pull the latest market comps for you?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const result = await getChiefOfStaffResponse(input, messages, context);

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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-[#141414] border border-[#262626] w-[420px] h-[600px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-5 bg-[#1a1a1a] border-b border-[#262626] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                   <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                   </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Intelligence Engine</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Active Session</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth bg-gradient-to-b from-[#141414] to-[#0a0a0a]">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10' 
                    : 'bg-[#1e1e1e] text-gray-200 border border-[#2a2a2a] rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                       <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Sources:</p>
                       <div className="flex flex-wrap gap-2">
                         {m.sources.map((s: any, idx: number) => (
                           <a 
                             key={idx} 
                             href={s.web?.uri || s.maps?.uri} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-[10px] bg-white/5 hover:bg-white/10 text-blue-400 px-2 py-1 rounded border border-white/5 transition-colors"
                           >
                             {s.web?.title || s.maps?.title || 'Source'}
                           </a>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-600 mt-2 font-mono">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1e1e1e] p-4 rounded-2xl rounded-tl-none border border-[#2a2a2a] flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Synthesizing</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-5 bg-[#1a1a1a] border-t border-[#262626]">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Delegate a task or ask for research..."
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-white placeholder-gray-600"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <button className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  input.trim() && !isTyping ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="group flex items-center">
          <div className="mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs text-white pointer-events-none">
            Chief of Staff is ready
          </div>
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 group relative"
          >
            <div className="absolute inset-0 bg-blue-600 rounded-3xl animate-ping opacity-20 pointer-events-none"></div>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChiefOfStaff;
