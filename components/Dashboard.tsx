
import React, { useState } from 'react';
import { Task, CalendarEvent, EmailInsight, QuickAction } from '../types';
import { generateVoiceSummary } from '../services/gemini';

interface DashboardProps {
  tasks: Task[];
  events: CalendarEvent[];
  emails: EmailInsight[];
  aiAnalysis: string;
  quickActions: QuickAction[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, events, emails, aiAnalysis, quickActions }) => {
  const [isBriefingPlaying, setIsBriefingPlaying] = useState(false);

  const handlePlayBriefing = async () => {
    if (isBriefingPlaying || !aiAnalysis) return;
    setIsBriefingPlaying(true);

    try {
      const audioData = await generateVoiceSummary(aiAnalysis);
      if (audioData) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const dataInt16 = new Int16Array(audioData.buffer);
        const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsBriefingPlaying(false);
        source.start();
      } else {
        setIsBriefingPlaying(false);
      }
    } catch (err) {
      console.error("Briefing playback failed", err);
      setIsBriefingPlaying(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Executive Hub</h2>
          <p className="text-slate-500 dark:text-gray-400 mt-2 font-medium uppercase tracking-widest text-[10px]">Oct 24 • Operational Intelligence Active</p>
        </div>
        
        <button 
          onClick={handlePlayBriefing}
          disabled={isBriefingPlaying}
          className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-black transition-all border ${
            isBriefingPlaying 
              ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/20 cursor-wait' 
              : 'bg-white dark:bg-white text-black hover:bg-slate-100 shadow-xl shadow-slate-200 dark:shadow-white/5 border-slate-200 dark:border-transparent'
          }`}
        >
          {isBriefingPlaying ? (
            <div className="flex items-end space-x-1 h-4">
              <div className="w-1 bg-blue-500 animate-[pulse_1s_infinite]"></div>
              <div className="w-1 bg-blue-500 animate-[pulse_1s_infinite_200ms]"></div>
              <div className="w-1 bg-blue-500 animate-[pulse_1s_infinite_400ms]"></div>
            </div>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.982 5.982 0 0115 10a5.982 5.982 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.982 3.982 0 0013 10a3.982 3.982 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          )}
          <span className="text-xs uppercase tracking-widest">{isBriefingPlaying ? 'Voice Briefing Active' : 'Listen to Briefing'}</span>
        </button>
      </header>

      {/* Strategic Shortcuts Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button 
            key={action.id}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-3xl hover:border-blue-500/30 hover:bg-slate-50 dark:hover:bg-[#161616] transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-500 mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
            </div>
            <span className="text-[10px] font-black text-slate-600 dark:text-gray-300 uppercase tracking-widest">{action.label}</span>
          </button>
        ))}
        <button className="flex flex-col items-center justify-center p-6 bg-transparent border border-dashed border-slate-300 dark:border-[#333] rounded-3xl text-slate-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-gray-400 hover:border-blue-400 dark:hover:border-[#444] transition-all">
          <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-widest">Add Shortcut</span>
        </button>
      </section>

      {/* AI Intelligence Summary */}
      <section className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:via-blue-900/10 dark:to-[#0a0a0a] border border-indigo-100 dark:border-blue-500/20 rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl shadow-indigo-500/5">
        <div className="absolute top-0 right-0 p-8">
           <span className="bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm backdrop-blur-sm">
             Cognitive Uplink
           </span>
        </div>
        <h3 className="text-xl font-black text-indigo-600 dark:text-blue-400 flex items-center mb-8 uppercase tracking-widest">
          <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Intelligence Synthesis
        </h3>
        <div className="text-slate-700 dark:text-gray-300 leading-relaxed prose prose-invert max-w-none text-lg font-medium">
          {aiAnalysis ? (
            <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>') }} />
          ) : (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-white/5 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-5/6"></div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Urgent Signals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Urgent Communications</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">Intelligence Hub</button>
          </div>
          <div className="space-y-4">
            {emails.filter(e => e.category === 'Urgent' || e.actionRequired).map(email => (
              <div key={email.id} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-[2rem] p-8 hover:border-blue-300 dark:hover:border-blue-500/20 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                      email.category === 'Urgent' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {email.category}
                    </span>
                    <h4 className="text-xl font-black text-slate-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors tracking-tight">{email.subject}</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400/70 font-bold">{email.from}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.2em]">{email.receivedAt}</span>
                </div>
                <div className="mt-6 bg-slate-50 dark:bg-[#0a0a0a] p-5 rounded-2xl border border-slate-100 dark:border-[#222] group-hover:bg-slate-100 dark:group-hover:bg-[#0d0d0d] transition-colors">
                   <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium italic">AI Brief: {email.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Schedule */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Focus Blocks</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">Tactical View</button>
          </div>
          <div className="space-y-4 relative">
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 to-transparent opacity-20 dark:opacity-50"></div>
            {events.map((event, idx) => (
              <div key={event.id} className="relative pl-14">
                <div className={`absolute left-[18px] top-4 w-3.5 h-3.5 rounded-full border-4 border-slate-50 dark:border-[#0a0a0a] z-10 ${
                  idx === 0 ? 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse' : 'bg-slate-300 dark:bg-gray-700'
                }`}></div>
                <div className={`rounded-2xl p-6 border transition-all ${
                  idx === 0 
                    ? 'bg-blue-600 text-white dark:bg-blue-600/10 dark:text-white border-blue-500/30 shadow-xl shadow-blue-600/10' 
                    : 'bg-white dark:bg-[#111] border-slate-200 dark:border-[#222] text-slate-700 dark:text-gray-400 shadow-sm'
                }`}>
                  <p className={`text-[9px] font-black mb-1 tracking-[0.2em] uppercase ${idx === 0 ? 'text-blue-100 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500'}`}>{event.startTime} - {event.endTime}</p>
                  <h4 className={`text-sm font-black ${idx === 0 ? 'text-white' : 'text-slate-800 dark:text-gray-200'}`}>{event.title}</h4>
                  {event.location && (
                    <p className={`text-[10px] mt-3 flex items-center font-bold uppercase tracking-widest ${idx === 0 ? 'text-blue-200' : 'text-slate-500 dark:text-gray-500'}`}>
                      <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
