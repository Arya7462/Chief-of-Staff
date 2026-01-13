
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import EmailIntelligence from './components/EmailIntelligence';
import MeetingNotes from './components/MeetingNotes';
import Settings from './components/Settings';
import Profile from './components/Profile';
import ChiefOfStaff from './components/ChiefOfStaff';
import { Task, CalendarEvent, EmailInsight, User, QuickAction } from './types';
import { analyzeDailyPlan } from './services/gemini';

const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { id: '1', label: 'Draft Board Update', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', prompt: 'Draft a concise update for the board highlighting Q3 progress and hiring velocity.' },
  { id: '2', label: 'Review Pipeline', icon: 'M13 10V3L4 14h7v7l9-11h-7z', prompt: 'Summarize the current sales pipeline and identify any high-risk deals.' },
  { id: '3', label: 'Competitor Intel', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', prompt: 'Pull recent news on top 3 competitors in our space.' },
  { id: '4', label: 'Draft Job Post', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', prompt: 'Create a job description for a Senior Frontend Engineer with Gemini expertise.' },
];

const INITIAL_USER: User = {
  id: 'exec-1',
  name: 'John Doe',
  email: 'john@hyperscale.io',
  role: 'Founder',
  company: 'HyperScale',
  bio: 'Building the next generation of verticalized executive intelligence. Focus: Operational Velocity.',
  quickActions: DEFAULT_QUICK_ACTIONS
};

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Approve series B pitch deck', status: 'pending', priority: 'high', dueTime: '2:00 PM' },
  { id: '2', title: 'Review engineering hiring roadmap', status: 'in-progress', priority: 'medium', dueTime: '4:30 PM' },
  { id: '3', title: 'Team sync: Q4 goals', status: 'pending', priority: 'medium', dueTime: '11:00 AM' },
  { id: '4', title: 'Update personal expense report', status: 'completed', priority: 'low', dueTime: '9:00 AM' },
  { id: '5', title: 'Urgent: Fix production login issue', status: 'in-progress', priority: 'high', dueTime: 'ASAP' },
];

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Board Update - Q3 Financials', startTime: '10:00 AM', endTime: '11:30 AM', attendees: ['Jane CFO', 'Board'], location: 'Zoom' },
  { id: '2', title: '1:1 with VP Product', startTime: '1:00 PM', endTime: '1:45 PM', attendees: ['VP Product'], location: 'HQ Coffee' },
  { id: '3', title: 'Deep Work: Strategy', startTime: '2:00 PM', endTime: '4:00 PM', attendees: ['Self'] },
];

const MOCK_EMAILS: EmailInsight[] = [
  { id: '1', from: 'marcus@vc-fund.com', subject: 'Follow up on term sheet', category: 'Urgent', summary: 'Investor requesting final signatures by EOD today on the Series B round.', actionRequired: true, receivedAt: '2h ago' },
  { id: '2', from: 'aws-billing@amazon.com', subject: 'Invoice #8821 available', category: 'Informational', summary: 'Standard monthly billing notification for infrastructure usage.', actionRequired: false, receivedAt: '4h ago' },
  { id: '3', from: 'recruiter@hiring.com', subject: 'Candidate: Senior ML Engineer', category: 'Follow-up', summary: 'Final round interview feedback required for the top prospect in engineering.', actionRequired: true, receivedAt: '5h ago' },
  { id: '4', from: 'news@tech-brief.com', subject: 'Daily Tech Trends', category: 'Ignore', summary: 'General news digest about the semiconductor market.', actionRequired: false, receivedAt: '6h ago' },
  { id: '5', from: 'sarah.p@product.com', subject: 'New Roadmap Draft', category: 'Follow-up', summary: 'Requested feedback on the Q1 product feature set.', actionRequired: true, receivedAt: '1h ago' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('execai-theme') as any) || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const updateTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.toggle('dark', isDark);
      localStorage.setItem('execai-theme', theme);
    };

    updateTheme();
    
    // Listen for system theme changes if in 'system' mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => updateTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeDailyPlan(MOCK_EVENTS, MOCK_EMAILS);
      setAiAnalysis(result);
    } catch (err) {
      console.error(err);
      setError("Strategic link interrupted. Re-connecting...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'completed' ? 'pending' : 'completed'
        };
      }
      return t;
    }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    if (error) return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md">
          <p className="text-red-400 font-bold text-lg mb-2">Sync Error</p>
          <p className="text-slate-600 dark:text-gray-400 text-sm mb-6">{error}</p>
          <button onClick={fetchData} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all">Reconnect Engine</button>
        </div>
      </div>
    );

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tasks={tasks} events={MOCK_EVENTS} emails={MOCK_EMAILS} aiAnalysis={aiAnalysis} quickActions={user.quickActions} />;
      case 'planner':
        return <Planner tasks={tasks} onToggleTask={handleToggleTask} />;
      case 'emails':
        return <EmailIntelligence emails={MOCK_EMAILS} />;
      case 'meetings':
        return <MeetingNotes />;
      case 'settings':
        return <Settings theme={theme} setTheme={setTheme} />;
      case 'profile':
        return <Profile user={user} onUpdateUser={handleUpdateUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-[#0a0a0a] min-h-screen text-slate-900 dark:text-gray-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      
      <main className="ml-64 flex-1 p-8 pb-32 max-w-7xl mx-auto w-full overflow-x-hidden relative">
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center space-x-2">
             <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
             <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-gray-500">Secure AI Uplink: {user.role} Mode</span>
           </div>
           
           <div className="flex items-center space-x-4">
             <div className="flex items-center bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-full px-4 py-1.5 space-x-3 shadow-sm">
               <span className="text-[10px] text-slate-500 dark:text-gray-400 font-black uppercase tracking-widest">Last synced: Just now</span>
               <button onClick={fetchData} className="hover:rotate-180 transition-transform duration-700 text-slate-400 dark:text-gray-500 hover:text-blue-500">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
               </button>
             </div>
           </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-8 text-slate-400 dark:text-gray-400 font-black uppercase tracking-[0.2em] text-xs animate-pulse">Synthesizing Executive Insights</p>
          </div>
        ) : renderContent()}
      </main>

      <ChiefOfStaff context={{ tasks, events: MOCK_EVENTS, emails: MOCK_EMAILS }} />
    </div>
  );
};

export default App;
