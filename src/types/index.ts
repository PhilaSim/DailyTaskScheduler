export interface User {
  firstName: string;
  surname: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  timeStart: string;
  timeEnd: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface Schedule {
  date: string;
  tasks: Task[];
  quote: string;
}

export interface Settings {
  emailReminders: boolean;
  preferredStartTime: string;
  focusMode: 'normal' | 'pomodoro';
}

export type Page = 'signin' | 'dashboard' | 'settings';