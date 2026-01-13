
import React, { useState } from 'react';
import { summarizeMeeting } from '../services/gemini';

interface MeetingNote {
  id: string;
  date: string;
  title: string;
  transcript?: string;
  summary?: string;
  decisions?: string[];
  actionItems?: string[];
}

const MeetingNotes: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingNote[]>([
    { id: '1', date: 'Oct 24, 2024', title: 'Product Architecture Review', summary: 'Aligned on microservices strategy for Q1.', decisions: ['Use gRPC for internal comms'], actionItems: ['Dave to draft tech spec'] },
  ]);
  const [activeMeeting, setActiveMeeting] = useState<MeetingNote | null>(null);
  const [inputTranscript, setInputTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleProcessTranscript = async () => {
    if (!inputTranscript.trim()) return;
    setIsAnalyzing(true);
    const result = await summarizeMeeting(inputTranscript);
    
    const newMeeting: MeetingNote = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      title: 'New Executive Sync',
      transcript: inputTranscript,
      ...result
    };
    
    setMeetings([newMeeting, ...meetings]);
    setActiveMeeting(newMeeting);
    setInputTranscript('');
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#111] border border-[#222] rounded-3xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Meeting Ledger</h3>
          <div className="space-y-3">
            {meetings.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMeeting(m)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  activeMeeting?.id === m.id ? 'bg-blue-600/10 border-blue-500/40 text-blue-400' : 'bg-[#1a1a1a] border-[#222] text-gray-400 hover:border-[#333]'
                }`}
              >
                <p className="text-[10px] font-mono mb-1">{m.date}</p>
                <p className="font-bold text-sm truncate">{m.title}</p>
              </button>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-dashed border-[#333] rounded-2xl text-xs font-bold text-gray-500 hover:text-blue-400 transition-all">
            + Log New Record
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        {!activeMeeting ? (
          <div className="bg-[#111] border border-[#222] rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Process Intelligence</h3>
            <p className="text-gray-500 mb-8 max-w-sm">Paste a transcript or upload an audio file to generate executive intelligence from your meetings.</p>
            <textarea
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-2xl p-5 text-sm text-gray-300 focus:ring-2 focus:ring-blue-600/50 min-h-[150px] mb-4 outline-none"
              placeholder="Paste meeting transcript here..."
              value={inputTranscript}
              onChange={(e) => setInputTranscript(e.target.value)}
            />
            <button
              onClick={handleProcessTranscript}
              disabled={isAnalyzing || !inputTranscript.trim()}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                isAnalyzing ? 'bg-blue-600/20 text-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20'
              }`}
            >
              {isAnalyzing ? 'Extracting Strategic Insights...' : 'Process Intelligence'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="bg-[#111] border border-[#222] rounded-3xl p-8">
               <div className="flex justify-between items-start mb-8">
                 <div>
                   <h2 className="text-3xl font-bold text-white">{activeMeeting.title}</h2>
                   <p className="text-gray-500 mt-1">{activeMeeting.date} • Strategic Sync</p>
                 </div>
                 <button onClick={() => setActiveMeeting(null)} className="text-gray-500 hover:text-white transition-colors">Close View</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                   <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#222]">
                     <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Executive Summary</h4>
                     <p className="text-sm text-gray-400 leading-relaxed italic">{activeMeeting.summary}</p>
                   </div>
                 </div>

                 <div className="space-y-6">
                   <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#222]">
                     <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">Key Decisions</h4>
                     <ul className="space-y-3">
                       {activeMeeting.decisions?.map((d, i) => (
                         <li key={i} className="flex items-start space-x-3 text-sm text-gray-400">
                           <span className="text-green-500 mt-1">✓</span>
                           <span>{d}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                   
                   <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#222]">
                     <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">Action Items</h4>
                     <ul className="space-y-3">
                       {activeMeeting.actionItems?.map((a, i) => (
                         <li key={i} className="flex items-start space-x-3 text-sm text-gray-400">
                           <span className="w-2 h-2 rounded-full bg-yellow-500/50 mt-1.5" />
                           <span>{a}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingNotes;
