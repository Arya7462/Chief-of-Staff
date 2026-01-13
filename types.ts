
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Founder' | 'CXO' | 'Investor';
  company: string;
  bio?: string;
  profilePhoto?: string;
  quickActions: QuickAction[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
  dueTime: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  location?: string;
  summary?: string;
  actionItems?: string[];
}

export interface EmailInsight {
  id: string;
  from: string;
  subject: string;
  category: 'Urgent' | 'Follow-up' | 'Ignore' | 'Informational';
  summary: string;
  actionRequired: boolean;
  receivedAt: string;
  snoozed?: boolean;
  extractedActionItems?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}
