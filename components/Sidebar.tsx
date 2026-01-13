
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'planner', label: 'Daily Planner', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'emails', label: 'Email Intelligence', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'meetings', label: 'Meeting Notes', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#111] border-r border-slate-200 dark:border-[#222] h-screen fixed left-0 top-0 flex flex-col shadow-sm">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent">
          ExecAI
        </h1>
        <p className="text-[10px] text-slate-500 dark:text-gray-500 font-bold tracking-widest uppercase mt-1">
          Digital Chief of Staff
        </p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20' 
                : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="text-sm font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-[#222]">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center space-x-3 px-2 py-2 rounded-xl transition-all ${
            activeTab === 'profile' ? 'bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#333]' : 'hover:bg-slate-50 dark:hover:bg-[#1a1a1a]'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-500/20 overflow-hidden text-white">
            {user.profilePhoto ? (
              <img src={user.profilePhoto} className="w-full h-full object-cover" />
            ) : (
              user.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-sm font-bold text-slate-800 dark:text-gray-200 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-gray-500 truncate uppercase font-bold tracking-widest">{user.role}</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
