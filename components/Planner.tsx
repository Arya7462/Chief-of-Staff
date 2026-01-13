
import React, { useState, useMemo, useEffect } from 'react';
import { Task } from '../types';
import { summarizeTask, generatePlannerVoiceBriefing } from '../services/gemini';

interface PlannerProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

type PriorityFilter = 'all' | 'high' | 'medium' | 'low';
type SortOrder = 'desc' | 'asc';

const Planner: React.FC<PlannerProps> = ({ tasks, onToggleTask }) => {
  const [filter, setFilter] = useState<PriorityFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [taskSummaries, setTaskSummaries] = useState<Record<string, { summary: string, subtasks: string[] }>>({});
  const [isPlayingBrief, setIsPlayingBrief] = useState(false);
  
  // Feedback states
  const [lastCompletedTitle, setLastCompletedTitle] = useState<string | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const priorityWeight = {
    high: 3,
    medium: 2,
    low: 1
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    if (filter !== 'all') {
      result = result.filter(task => task.priority === filter);
    }
    result.sort((a, b) => {
      const weightA = priorityWeight[a.priority];
      const weightB = priorityWeight[b.priority];
      return sortOrder === 'desc' ? weightB - weightA : weightA - weightB;
    });
    return result;
  }, [tasks, filter, sortOrder]);

  const handleToggleTaskWithFeedback = (task: Task) => {
    const isNowComplete = task.status !== 'completed';
    
    if (isNowComplete) {
      setAnimatingId(task.id);
      setLastCompletedTitle(task.title);
      
      // Clear animation state after duration
      setTimeout(() => setAnimatingId(null), 600);
      // Clear toast after 3 seconds
      setTimeout(() => setLastCompletedTitle(null), 3000);
    }
    
    onToggleTask(task.id);
  };

  const handlePlayBriefing = async () => {
    if (isPlayingBrief) return;
    setIsPlayingBrief(true);
    try {
      const audioData = await generatePlannerVoiceBriefing(tasks);
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
        source.onended = () => setIsPlayingBrief(false);
        source.start();
      } else {
        setIsPlayingBrief(false);
      }
    } catch (err) {
      console.error(err);
      setIsPlayingBrief(false);
    }
  };

  const handleSummarize = async (task: Task) => {
    if (summarizingId) return;
    setSummarizingId(task.id);
    const result = await summarizeTask(task);
    setTaskSummaries(prev => ({ ...prev, [task.id]: result }));
    setSummarizingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Daily Planner</h2>
          <p className="text-slate-500 dark:text-gray-400 mt-1 font-medium text-sm">Synchronizing tactical objectives with strategic vision.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handlePlayBriefing}
            disabled={isPlayingBrief}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              isPlayingBrief 
                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
                : 'bg-white dark:bg-[#111] border-slate-200 dark:border-[#222] text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/50 shadow-sm'
            }`}
          >
            {isPlayingBrief ? (
              <div className="flex items-end space-x-0.5 h-3">
                <div className="w-0.5 bg-blue-500 animate-pulse h-full"></div>
                <div className="w-0.5 bg-blue-500 animate-pulse h-2/3 delay-75"></div>
                <div className="w-0.5 bg-blue-500 animate-pulse h-full delay-150"></div>
              </div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
            <span className="uppercase tracking-widest text-[10px]">Strategic Brief</span>
          </button>

          <div className="flex bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-xl p-1 shadow-sm">
            {(['all', 'high', 'medium', 'low'] as PriorityFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  filter === p ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-4">
        {filteredAndSortedTasks.length > 0 ? (
          filteredAndSortedTasks.map((task) => (
            <div 
              key={task.id} 
              className={`bg-white dark:bg-[#161616] border rounded-[2rem] p-6 flex flex-col transition-all group shadow-sm ${
                task.status === 'completed' 
                  ? 'opacity-60 border-emerald-900/10 grayscale-[0.5]' 
                  : 'border-slate-200 dark:border-[#222] hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-md'
              } ${animatingId === task.id ? 'scale-[0.98] ring-2 ring-emerald-500/30' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className={`w-1.5 h-12 rounded-full transition-all duration-500 ${
                    task.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                    task.priority === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <h4 className={`text-xl font-black transition-all tracking-tight ${
                      task.status === 'completed' ? 'text-slate-400 dark:text-gray-500 line-through' : 'text-slate-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white'
                    }`}>{task.title}</h4>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-[10px] font-black text-slate-400 dark:text-gray-500 flex items-center uppercase tracking-widest">
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Deadline: {task.dueTime}
                      </span>
                      {task.status === 'in-progress' && (
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-2 animate-pulse" />
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleToggleTaskWithFeedback(task)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      task.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-slate-100 dark:bg-[#222] text-slate-500 dark:text-gray-400 border-transparent hover:bg-emerald-600/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/20'
                    }`}
                  >
                    {task.status === 'completed' ? 'Archived' : 'Mark Done'}
                  </button>
                  
                  <button 
                    onClick={() => handleSummarize(task)}
                    disabled={summarizingId === task.id || task.status === 'completed'}
                    className={`p-3 rounded-xl transition-all border ${
                      summarizingId === task.id 
                        ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 border-blue-500/20 animate-pulse' 
                        : 'bg-slate-50 dark:bg-[#1a1a1a] border-slate-200 dark:border-[#222] text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/20'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75V19a2 2 0 11-4 0v-.25c0-.965-.35-1.89-1-2.583l-.547-.547z" />
                    </svg>
                  </button>
                </div>
              </div>

              {taskSummaries[task.id] && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#222] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl p-6 border border-slate-200 dark:border-blue-500/10 shadow-inner">
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-3">Executive Intelligence Synthesis</p>
                    <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed mb-6 font-medium">{taskSummaries[task.id].summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {taskSummaries[task.id].subtasks.map((sub, i) => (
                        <div key={i} className="flex items-center space-x-3 text-[11px] font-bold text-slate-500 dark:text-gray-500 bg-white dark:bg-[#111] p-3 rounded-xl border border-slate-100 dark:border-[#222] shadow-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full" />
                          <span className="truncate">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-[#222] rounded-[3rem] text-slate-400 dark:text-gray-600">
            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-black uppercase tracking-widest text-xs">No active tactical objectives detected.</p>
          </div>
        )}
      </div>

      {/* Confirmation Toast */}
      {lastCompletedTitle && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="bg-emerald-600 dark:bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 border border-white/20">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-0.5">Objective Secured</p>
              <p className="text-sm font-bold truncate max-w-[200px]">{lastCompletedTitle}</p>
            </div>
            <div className="h-8 w-[1px] bg-white/20 mx-2" />
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">+1 Strategic Velocity</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
