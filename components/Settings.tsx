
import React, { useState } from 'react';

interface SettingsProps {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  const [personality, setPersonality] = useState('Strategic');
  const [brevity, setBrevity] = useState('Hyper-Concise');
  const [proactiveMode, setProactiveMode] = useState(true);
  const [researchDepth, setResearchDepth] = useState('Advanced');

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Executive Settings</h2>
        <p className="text-slate-500 dark:text-gray-400 mt-2">Fine-tune the intelligence engine to match your leadership style.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-3xl p-8 space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appearance Mode</h3>
              <p className="text-sm text-slate-500 dark:text-gray-500">Customize the visual interface of your Chief of Staff.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-[#0a0a0a] p-1 rounded-xl border border-slate-200 dark:border-[#222]">
              {[
                { id: 'light', label: 'Light', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z' },
                { id: 'dark', label: 'Dark', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
                { id: 'system', label: 'System', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    theme === t.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-500 dark:text-gray-500 hover:text-blue-500'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={t.icon} />
                  </svg>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-3xl p-8 space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chief of Staff Personality</h3>
              <p className="text-sm text-slate-500 dark:text-gray-500">How the AI interacts and prioritizes data for you.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-[#0a0a0a] p-1 rounded-xl border border-slate-200 dark:border-[#222]">
              {['Operational', 'Strategic', 'Radical'].map(p => (
                <button
                  key={p}
                  onClick={() => setPersonality(p)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    personality === p ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 dark:text-gray-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Information Density</h3>
              <p className="text-sm text-slate-500 dark:text-gray-500">Target length for briefings and chat responses.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-[#0a0a0a] p-1 rounded-xl border border-slate-200 dark:border-[#222]">
              {['Detailed', 'Balanced', 'Hyper-Concise'].map(b => (
                <button
                  key={b}
                  onClick={() => setBrevity(b)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    brevity === b ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 dark:text-gray-500'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-3xl p-8 space-y-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#222] pb-4">Strategic Workflow</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Proactive Mode</h3>
              <p className="text-sm text-slate-500 dark:text-gray-500">AI will automatically suggest actions and draft emails.</p>
            </div>
            <button 
              onClick={() => setProactiveMode(!proactiveMode)}
              className={`w-12 h-6 rounded-full relative transition-colors ${proactiveMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${proactiveMode ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Research Synthesis Depth</h3>
              <p className="text-sm text-slate-500 dark:text-gray-500">Depth of market analysis pulled from Google Search.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-[#0a0a0a] p-1 rounded-xl border border-slate-200 dark:border-[#222]">
              {['Standard', 'Advanced', 'Comprehensive'].map(d => (
                <button
                  key={d}
                  onClick={() => setResearchDepth(d)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    researchDepth === d ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-gray-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Security & Identity</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-[#222] hover:border-blue-300 dark:hover:border-[#333] transition-all">
               <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-800 dark:text-gray-200">Google Workspace Link</p>
                   <p className="text-xs text-slate-500 dark:text-gray-500">Founder Account • Last synced 1m ago</p>
                 </div>
               </div>
               <button className="text-xs text-red-500 font-bold hover:underline">Revoke Access</button>
             </div>
             
             <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-[#222]">
               <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                   <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                   </svg>
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-800 dark:text-gray-200">Critical Alerts</p>
                   <p className="text-xs text-slate-500 dark:text-gray-500">Enabled for items over $10k or Priority A</p>
                 </div>
               </div>
               <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                 <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
               </div>
             </div>
          </div>
        </section>

        <div className="flex gap-4">
           <button className="flex-1 py-4 bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] text-slate-500 dark:text-gray-400 font-bold rounded-2xl hover:text-slate-800 dark:hover:text-white transition-all shadow-sm">
            Export Executive Logs
          </button>
          <button className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/10 hover:bg-blue-500 transition-all">
            Save Strategy Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
