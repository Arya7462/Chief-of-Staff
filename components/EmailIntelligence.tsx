
import React, { useState } from 'react';
import { EmailInsight } from '../types';
import { generateVoiceBriefing } from '../services/gemini';

interface EmailIntelligenceProps {
  emails: EmailInsight[];
}

const EmailIntelligence: React.FC<EmailIntelligenceProps> = ({ emails: initialEmails }) => {
  const [emails, setEmails] = useState(initialEmails.map(e => ({
    ...e,
    extractedActionItems: e.extractedActionItems || [
      "Review attached document",
      "Draft response for CEO",
      "Add deadline to calendar"
    ]
  })));
  const [filter, setFilter] = useState<EmailInsight['category'] | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const categories = [
    { id: 'All', label: 'All', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', color: 'text-gray-400' },
    { id: 'Urgent', label: 'Urgent', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-red-500' },
    { id: 'Follow-up', label: 'Follow-up', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-amber-400' },
    { id: 'Informational', label: 'Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-blue-400' },
    { id: 'Ignore', label: 'Noise', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', color: 'text-gray-600' },
  ];

  const filteredEmails = emails.filter(e => {
    const matchesFilter = filter === 'All' || e.category === filter;
    const matchesSearch = e.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         e.from.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch && !e.snoozed;
  });

  const handleSnooze = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, snoozed: true } : e));
  };

  const handleVoiceBrief = async () => {
    setIsPlaying(true);
    const audioData = await generateVoiceBriefing(emails);
    if (audioData) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(audioData.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Email Intelligence</h2>
          <p className="text-gray-400 mt-1">AI-driven noise reduction and action extraction.</p>
        </div>

        <button 
          onClick={handleVoiceBrief}
          disabled={isPlaying}
          className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all border ${
            isPlaying ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/5'
          }`}
        >
          {isPlaying ? (
             <div className="flex space-x-1 items-end h-3">
               <div className="w-1 bg-blue-400 animate-pulse h-full"></div>
               <div className="w-1 bg-blue-400 animate-pulse h-2/3 delay-75"></div>
               <div className="w-1 bg-blue-400 animate-pulse h-full delay-150"></div>
             </div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
          <span>{isPlaying ? 'Analyzing Inbox...' : 'Listen to Brief'}</span>
        </button>
      </header>

      {/* Modern Segmented Category UI */}
      <div className="bg-[#111] border border-[#222] p-1.5 rounded-[2rem] flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-[1.5rem] transition-all text-sm font-bold ${
              filter === cat.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.02]' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]'
            }`}
          >
            <svg className={`w-4 h-4 ${filter === cat.id ? 'text-white' : cat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
            </svg>
            <span>{cat.label}</span>
          </button>
        ))}
        
        <div className="ml-auto relative flex-1 min-w-[200px] max-w-sm px-2">
           <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
           <input 
             type="text" 
             placeholder="Search intelligence ledger..." 
             className="w-full bg-[#0a0a0a] border border-[#222] rounded-[1.5rem] pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none text-white transition-all"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      <div className="grid gap-6 mt-8">
        {filteredEmails.length > 0 ? filteredEmails.map((email) => (
          <div 
            key={email.id} 
            className="bg-[#141414] border border-[#222] rounded-[2rem] p-8 hover:border-blue-500/30 transition-all group relative overflow-hidden shadow-2xl"
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              email.category === 'Urgent' ? 'bg-red-500' : 
              email.category === 'Follow-up' ? 'bg-amber-400' : 'bg-blue-400'
            }`} />
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border ${
                      email.category === 'Urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      email.category === 'Follow-up' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {email.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono tracking-widest">{email.receivedAt}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleSnooze(email.id)}
                      className="p-2.5 bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-amber-400 transition-all border border-[#222] hover:border-amber-400/20"
                      title="Snooze for focus"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button className="p-2.5 bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-all border border-[#222] hover:border-[#444]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-2xl font-bold text-gray-100 group-hover:text-white transition-colors leading-tight">{email.subject}</h4>
                  <p className="text-sm text-blue-400/80 font-bold mt-2 flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    {email.from}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#0a0a0a]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#222] group-hover:border-blue-500/10 transition-colors">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                      <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Synthesis</p>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{email.summary}</p>
                  </div>
                  
                  <div className="bg-[#0a0a0a]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#222] group-hover:border-blue-500/10 transition-colors">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest">Execution Path</p>
                    </div>
                    <ul className="space-y-2">
                      {email.extractedActionItems?.map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-500 flex items-start space-x-3">
                          <span className="text-blue-600 font-bold">0{idx + 1}</span>
                          <span className="truncate group-hover:text-gray-300 transition-colors">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {email.actionRequired && (
                <div className="flex items-center md:border-l md:border-[#222] md:pl-8">
                  <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-xs font-black transition-all shadow-xl shadow-blue-600/10 active:scale-95 uppercase tracking-widest">
                    Draft Reply
                  </button>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="py-24 text-center border border-dashed border-[#333] rounded-[2rem] bg-[#111]/30">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
            <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Inbox Cleared • Strategic Peace Established</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailIntelligence;
