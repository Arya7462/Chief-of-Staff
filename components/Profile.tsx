
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { generateExecutiveAvatar } from '../services/gemini';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const requirements = useMemo(() => [
    { key: 'name', label: 'Full Identity', value: user.name, weight: 20 },
    { key: 'role', label: 'Executive Persona', value: user.role, weight: 20 },
    { key: 'company', label: 'Organizational Link', value: user.company, weight: 20 },
    { key: 'bio', label: 'Strategic Vision', value: user.bio, weight: 20 },
    { key: 'profilePhoto', label: 'Visual Uplink', value: user.profilePhoto, weight: 20 },
  ], [user]);

  const completionPercent = useMemo(() => {
    return requirements.reduce((acc, req) => acc + (req.value ? req.weight : 0), 0);
  }, [requirements]);

  const handleGenerateAvatar = async () => {
    setIsGeneratingAvatar(true);
    const photo = await generateExecutiveAvatar(user.role, user.company);
    if (photo) {
      onUpdateUser({ ...user, profilePhoto: photo });
    }
    setIsGeneratingAvatar(false);
  };

  const handleRoleChange = (role: User['role']) => {
    onUpdateUser({ ...user, role });
  };

  const metrics = [
    { label: 'Focus Efficiency', value: '94%', sub: 'Target: 90%', color: 'bg-blue-500' },
    { label: 'Decision Velocity', value: '4.2h', sub: 'Target: 6.0h', color: 'bg-emerald-500' },
    { label: 'Strategic Alignment', value: '88%', sub: 'Target: 85%', color: 'bg-indigo-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* High-Fidelity Header */}
      <header className="relative h-80 bg-gradient-to-br from-indigo-950 via-blue-900 to-[#0a0a0a] rounded-[3rem] overflow-hidden border border-blue-500/20 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        
        <div className="absolute bottom-10 left-12 flex items-end space-x-8 w-full pr-24">
          <div className="relative group flex-shrink-0">
            <div className={`absolute -inset-1 bg-gradient-to-r ${!user.profilePhoto ? 'from-amber-500 to-orange-600' : 'from-blue-600 to-indigo-600'} rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}></div>
            <div className="relative w-40 h-40 rounded-full bg-[#0a0a0a] border-4 border-[#0a0a0a] flex items-center justify-center text-5xl font-black text-white shadow-2xl overflow-hidden">
               {user.profilePhoto ? (
                 <img src={user.profilePhoto} alt="Executive Avatar" className="w-full h-full object-cover" />
               ) : (
                 <span className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                   {user.name.split(' ').map(n => n[0]).join('')}
                 </span>
               )}
               {isGeneratingAvatar && (
                 <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-2">
                   <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
                   <p className="text-[10px] text-blue-400 font-bold uppercase animate-pulse">Generating</p>
                 </div>
               )}
            </div>
            {!user.profilePhoto && !isGeneratingAvatar && (
              <button 
                onClick={handleGenerateAvatar}
                className="absolute -bottom-2 right-0 bg-amber-500 p-2.5 rounded-full shadow-lg border-2 border-[#0a0a0a] hover:scale-110 transition-all group/btn"
                title="Sync Visual Identity"
              >
                <svg className="w-4 h-4 text-white animate-pulse group-hover/btn:animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
          <div className="mb-6 flex-1">
            <div className="flex items-center space-x-3 mb-2">
               <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Verified {user.role}</span>
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
            <input 
              value={user.name}
              onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
              className="bg-transparent text-4xl font-black text-white tracking-tight border-none outline-none focus:ring-0 w-full"
              placeholder="Identity Required"
            />
            <p className="text-gray-400 font-bold tracking-wide uppercase text-sm mt-1 flex items-center">
              Executive Role <span className="mx-2 text-gray-700">•</span> {user.company || 'Missing Entity'}
            </p>
          </div>
        </div>
      </header>

      {/* Completion Intelligence Section */}
      <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-[2rem] p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest">Cognitive Sync Progress</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-xl font-black ${completionPercent === 100 ? 'text-emerald-500' : 'text-blue-600 dark:text-blue-400'}`}>
                  {completionPercent}%
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Operational Integrity</span>
              </div>
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden border border-slate-200 dark:border-[#222]">
              <div 
                className={`h-full bg-gradient-to-r transition-all duration-1000 ${
                  completionPercent === 100 ? 'from-emerald-500 to-teal-500' : 'from-blue-600 to-indigo-600'
                } rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]`} 
                style={{ width: `${completionPercent}%` }} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex items-center gap-2">
            {requirements.map(req => (
              <div 
                key={req.key}
                className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                  req.value 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-slate-100 dark:bg-[#1a1a1a] border-slate-200 dark:border-[#222] text-slate-400 dark:text-gray-600 opacity-50'
                }`}
              >
                {req.label}
              </div>
            ))}
          </div>
        </div>

        {completionPercent < 100 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex items-start space-x-4 animate-pulse">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Incomplete Sync Signals</p>
              <p className="text-xs text-slate-600 dark:text-gray-400 font-medium leading-relaxed">
                Strategic capabilities are limited. Missing: {requirements.filter(r => !r.value).map(r => r.label).join(', ')}. Populate these anchors to enable advanced proactive reasoning.
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Identity Controls Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-sm font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-6">Identity Control</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 dark:text-gray-600 uppercase tracking-widest block mb-2">Active Persona</label>
                <div className="grid grid-cols-1 gap-2">
                  {(['Founder', 'CXO', 'Investor'] as User['role'][]).map(r => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                        user.role === r 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                          : 'bg-slate-100 dark:bg-[#1a1a1a] border-slate-200 dark:border-[#222] text-slate-500 dark:text-gray-500 hover:border-slate-300 dark:hover:border-[#444]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`transition-all ${!user.company ? 'ring-2 ring-amber-500/30 rounded-2xl' : ''}`}>
                <label className="text-[10px] font-black text-slate-500 dark:text-gray-600 uppercase tracking-widest block mb-2">Global Entity</label>
                <input 
                  value={user.company}
                  onChange={(e) => onUpdateUser({ ...user, company: e.target.value })}
                  placeholder="Entity Name Required"
                  className={`w-full bg-slate-100 dark:bg-[#1a1a1a] border rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500 transition-all ${
                    !user.company ? 'border-amber-500/50 text-amber-600 dark:text-amber-400' : 'border-slate-200 dark:border-[#222] text-slate-900 dark:text-white'
                  }`}
                />
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-sm font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-8">Executive Benchmarks</h3>
            <div className="space-y-8">
              {metrics.map((m, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold text-slate-500 dark:text-gray-400">{m.label}</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{m.value}</p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden border border-slate-200 dark:border-[#222]">
                    <div className={`${m.color} h-full rounded-full transition-all duration-1000`} style={{ width: m.value }} />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-gray-600 font-medium">{m.sub}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Vision & Narrative */}
        <div className="lg:col-span-8 space-y-8">
          <section className={`bg-white dark:bg-[#111] border rounded-[2rem] p-8 shadow-xl transition-all ${
            !user.bio ? 'border-amber-500/50 ring-2 ring-amber-500/10' : 'border-slate-200 dark:border-[#222]'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest">Strategic Mission</h3>
              {!user.bio && <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Sync Required</span>}
            </div>
            <textarea 
              value={user.bio}
              onChange={(e) => onUpdateUser({ ...user, bio: e.target.value })}
              placeholder="Define your strategic vision... This anchor is critical for AI decision alignment."
              className={`w-full h-40 bg-transparent text-xl font-medium leading-relaxed border-none outline-none focus:ring-0 p-0 resize-none italic ${
                !user.bio ? 'text-amber-500/50' : 'text-slate-700 dark:text-gray-200'
              }`}
            />
          </section>

          <section className="bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-[2rem] p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest">Cognitive Anchors</h3>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Manage Macros</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
               {user.quickActions.map((action, i) => (
                 <div key={i} className="p-5 bg-slate-50 dark:bg-[#0a0a0a] rounded-[1.5rem] border border-slate-200 dark:border-[#222] hover:border-blue-500/20 transition-all flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-gray-100">{action.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-500 font-bold tracking-widest uppercase">Active</p>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
