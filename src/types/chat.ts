export interface Message {
  id: string;
  content: string;
  role: 'system' | 'user' | 'assistant';
  timestamp: string;
}

export interface ProjectInfo {
  title: string | null;
  company: string | null;
  value: string | null;
  description: string | null;
  source_url: string | null;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  projectInfo: ProjectInfo | null;
} 