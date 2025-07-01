import { User, Schedule, Settings, Task } from '../types';

const STORAGE_KEYS = {
  USER: 'task_scheduler_user',
  SCHEDULE: 'task_scheduler_schedule',
  SETTINGS: 'task_scheduler_settings',
  COMPLETED_TASKS: 'task_scheduler_completed_tasks',
} as const;

export const storage = {
  // User data
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  
  // Schedule data
  setSchedule: (schedule: Schedule) => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  },
  
  getSchedule: (): Schedule | null => {
    const schedule = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return schedule ? JSON.parse(schedule) : null;
  },
  
  // Settings data
  setSettings: (settings: Settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
  
  getSettings: (): Settings => {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      emailReminders: false,
      preferredStartTime: '08:00',
      focusMode: 'normal'
    };
  },
  
  // Completed tasks
  setCompletedTasks: (taskIds: string[]) => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(taskIds));
  },
  
  getCompletedTasks: (): string[] => {
    const tasks = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
    return tasks ? JSON.parse(tasks) : [];
  },
  
  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};