import { Task } from '../types';

// Simulated AI service for generating schedules and quotes
export const aiService = {
  generateSchedule: async (
    tasks: string,
    startTime: string,
    focusMode: 'normal' | 'pomodoro'
  ): Promise<{ tasks: Task[]; quote: string }> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const taskList = tasks.split('\n').filter(task => task.trim());
    const generatedTasks: Task[] = [];
    
    let currentTime = parseTime(startTime);
    
    taskList.forEach((task, index) => {
      const priority = determinePriority(task);
      const duration = focusMode === 'pomodoro' ? 25 : getDuration(task, priority);
      
      const startTimeStr = formatTime(currentTime);
      currentTime += duration;
      const endTimeStr = formatTime(currentTime);
      
      generatedTasks.push({
        id: `task-${Date.now()}-${index}`,
        title: task.trim(),
        timeStart: startTimeStr,
        timeEnd: endTimeStr,
        priority,
        completed: false
      });
      
      // Add break time for pomodoro
      if (focusMode === 'pomodoro') {
        currentTime += index % 4 === 3 ? 30 : 5; // Long break every 4 tasks
      } else {
        currentTime += 15; // Regular break
      }
    });
    
    const quote = generateMotivationalQuote();
    
    return { tasks: generatedTasks, quote };
  },
  
  generateQuote: async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateMotivationalQuote();
  }
};

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function determinePriority(task: string): 'high' | 'medium' | 'low' {
  const highPriorityKeywords = ['urgent', 'important', 'deadline', 'meeting', 'call'];
  const lowPriorityKeywords = ['organize', 'clean', 'read', 'research'];
  
  const taskLower = task.toLowerCase();
  
  if (highPriorityKeywords.some(keyword => taskLower.includes(keyword))) {
    return 'high';
  }
  if (lowPriorityKeywords.some(keyword => taskLower.includes(keyword))) {
    return 'low';
  }
  return 'medium';
}

function getDuration(task: string, priority: 'high' | 'medium' | 'low'): number {
  const baseTime = priority === 'high' ? 90 : priority === 'medium' ? 60 : 45;
  const taskLength = task.length;
  
  if (taskLength > 50) return baseTime + 30;
  if (taskLength > 30) return baseTime + 15;
  return baseTime;
}

function generateMotivationalQuote(): string {
  const quotes = [
    "Success is built one focused hour at a time.",
    "Turn your dreams into scheduled reality today.",
    "Every completed task brings you closer to greatness.",
    "Productivity is the bridge between dreams and achievements.",
    "Focus transforms ordinary moments into extraordinary results.",
    "Your future self will thank you for today's dedication.",
    "Small consistent actions create massive life changes.",
    "Time blocked wisely becomes unstoppable momentum forward.",
    "Excellence emerges from intentional daily choices made.",
    "Today's schedule shapes tomorrow's success story completely."
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
}