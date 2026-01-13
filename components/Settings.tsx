
import React, { useState } from 'react';

interface SettingsProps {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme, onLogout }) => {
  const [personality, setPersonality] = useState('Strategic');
  const [brevity, setBrevity] = useState('Hyper-Concise');
  const [proactiveMode, setProactiveMode] = useState(true);
  const [researchDepth, setResearchDepth] = useState('Advanced');

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Executive Settings</h2>
          <p className="text-slate-500 dark:text-gray-400 mt-2">Fine-tune the intelligence engine to match your leadership style.</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
        >
          Terminate Session
        </button>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-3xl p-8 space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appearance Mode</h3>
              <p className="text-sm text-slate-500 dark:text-gray-500">Customize the visual interface of your Chief of Staff.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
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

        <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-3xl p-8 space-y-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chief of Staff Personality</h3>
              <p className="text-sm text-slate-500 dark:text-gray-500">How the AI interacts and prioritizes data for you.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
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
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
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

        <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-3xl p-8 space-y-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-4">Strategic Workflow</h3>
          
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
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
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

        <div className="flex gap-4">
           <button className="flex-1 py-4 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 text-slate-500 dark:text-gray-400 font-bold rounded-2xl hover:text-slate-800 dark:hover:text-white transition-all shadow-sm">
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
