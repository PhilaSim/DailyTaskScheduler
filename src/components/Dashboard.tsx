import React, { useState, useEffect } from 'react';
import { User, Schedule, Settings, Task } from '../types';
import { storage } from '../utils/storage';
import { aiService } from '../utils/aiService';
import { exportToPDF } from '../utils/pdfExport';
import { FileText, Sparkles, Settings as SettingsIcon, Clock, Zap } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (page: 'dashboard' | 'settings') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [tasks, setTasks] = useState('');
  const [settings, setSettings] = useState<Settings>(storage.getSettings());
  const [schedule, setSchedule] = useState<Schedule | null>(storage.getSchedule());
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>(storage.getCompletedTasks());
  const [currentQuote, setCurrentQuote] = useState('');
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);

  useEffect(() => {
    // Load today's schedule if it exists
    const storedSchedule = storage.getSchedule();
    if (storedSchedule && storedSchedule.date === new Date().toISOString().split('T')[0]) {
      setSchedule(storedSchedule);
      setCurrentQuote(storedSchedule.quote);
    }
  }, []);

  const generateSchedule = async () => {
    if (!tasks.trim()) return;

    setIsGenerating(true);
    try {
      const result = await aiService.generateSchedule(tasks, settings.preferredStartTime, settings.focusMode);
      
      const newSchedule: Schedule = {
        date: new Date().toISOString().split('T')[0],
        tasks: result.tasks,
        quote: result.quote
      };

      setSchedule(newSchedule);
      setCurrentQuote(result.quote);
      storage.setSchedule(newSchedule);
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateNewQuote = async () => {
    setIsGeneratingQuote(true);
    try {
      const newQuote = await aiService.generateQuote();
      setCurrentQuote(newQuote);
      
      if (schedule) {
        const updatedSchedule = { ...schedule, quote: newQuote };
        setSchedule(updatedSchedule);
        storage.setSchedule(updatedSchedule);
      }
    } catch (error) {
      console.error('Error generating quote:', error);
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    const newCompletedTasks = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    
    setCompletedTasks(newCompletedTasks);
    storage.setCompletedTasks(newCompletedTasks);
  };

  const handleExportPDF = () => {
    if (schedule) {
      exportToPDF(schedule, user);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    storage.setSettings(updatedSettings);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-[#ff6b6b] bg-[#ff6b6b]/10';
      case 'medium': return 'border-[#ffd93d] bg-[#ffd93d]/10';
      case 'low': return 'border-[#6bcf7f] bg-[#6bcf7f]/10';
      default: return 'border-[#00e0ff] bg-[#00e0ff]/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6f7ff]">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#e6f7ff]">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="text-[#c2d9e8] mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={() => onNavigate('settings')}
              className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg 
                       hover:border-[#00e0ff] transition-all duration-200 group"
            >
              <SettingsIcon className="w-5 h-5 text-[#c2d9e8] group-hover:text-[#00e0ff]" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Task Input Section */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-[#e6f7ff] mb-4">
            📝 What do you need to accomplish today?
          </h2>
          
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Enter your tasks, one per line:
• Complete project proposal
• Review quarterly reports  
• Team meeting at 2 PM
• Grocery shopping
• Workout session"
            className="w-full h-32 px-4 py-3 bg-[#0d1117] border border-[#30363d] 
                     rounded-lg text-[#e6f7ff] placeholder-[#7d8590] resize-none
                     focus:outline-none focus:ring-2 focus:ring-[#00e0ff] focus:border-[#00e0ff]"
          />

          {/* Settings Row */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#00e0ff]" />
              <label className="text-[#c2d9e8] text-sm">Preferred Start Time:</label>
              <input
                type="time"
                value={settings.preferredStartTime}
                onChange={(e) => updateSettings({ preferredStartTime: e.target.value })}
                className="px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded-md 
                         text-[#e6f7ff] text-sm focus:outline-none focus:ring-1 focus:ring-[#00e0ff]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#ff6bff]" />
              <label className="text-[#c2d9e8] text-sm">Focus Mode:</label>
              <select
                value={settings.focusMode}
                onChange={(e) => updateSettings({ focusMode: e.target.value as 'normal' | 'pomodoro' })}
                className="px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded-md 
                         text-[#e6f7ff] text-sm focus:outline-none focus:ring-1 focus:ring-[#00e0ff]"
              >
                <option value="normal">Normal</option>
                <option value="pomodoro">Pomodoro</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateSchedule}
            disabled={!tasks.trim() || isGenerating}
            className="w-full mt-6 py-4 bg-gradient-to-r from-[#00e0ff] to-[#ff6bff] 
                     text-[#0d1117] font-bold rounded-lg hover:shadow-lg 
                     hover:shadow-[#00e0ff]/20 transition-all duration-300 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     animate-pulse hover:animate-none"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[#0d1117] border-t-transparent 
                              rounded-full animate-spin mr-2"></div>
                🤖 AI is optimizing your schedule...
              </div>
            ) : (
              '🔁 Generate My Schedule'
            )}
          </button>
        </div>

        {/* Schedule Display */}
        {schedule && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#e6f7ff]">
                📋 Your Optimized Schedule
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={generateNewQuote}
                  disabled={isGeneratingQuote}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#ff6bff]/20 
                           border border-[#ff6bff] rounded-lg text-[#ff6bff] 
                           hover:bg-[#ff6bff]/30 transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">New Motivation</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#00e0ff]/20 
                           border border-[#00e0ff] rounded-lg text-[#00e0ff] 
                           hover:bg-[#00e0ff]/30 transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Export PDF</span>
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {schedule.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border-l-4 rounded-lg transition-all duration-200 
                           ${getPriorityColor(task.priority)}
                           ${completedTasks.includes(task.id) ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={completedTasks.includes(task.id)}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="w-5 h-5 text-[#00e0ff] bg-[#0d1117] border-[#30363d] 
                                 rounded focus:ring-[#00e0ff] focus:ring-2"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#00e0ff] font-mono font-bold text-sm">
                            {task.timeStart} - {task.timeEnd}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${task.priority === 'high' ? 'bg-[#ff6b6b] text-white' : 
                              task.priority === 'medium' ? 'bg-[#ffd93d] text-[#0d1117]' : 
                              'bg-[#6bcf7f] text-white'}`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className={`text-[#e6f7ff] mt-1 ${
                          completedTasks.includes(task.id) ? 'line-through' : ''
                        }`}>
                          {task.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Motivational Quote */}
            {currentQuote && (
              <div className="mt-6 p-6 bg-gradient-to-r from-[#ff6bff]/10 to-[#00e0ff]/10 
                           border border-[#ff6bff]/30 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-medium text-[#e6f7ff] italic">
                    "{currentQuote}"
                  </p>
                  <p className="text-[#c2d9e8] text-sm mt-2">
                    — Your AI Productivity Coach
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};