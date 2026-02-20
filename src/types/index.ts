export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export interface CheckIn {
  id: string;
  moduleId: string;
  date: Date;
  messages: Message[];
  summary?: string;
  duration: number; // seconds
  mode: "text" | "voice";
}

export interface Module {
  id: string;
  emoji: string;
  title: string;
  titleEN: string;
  description: string;
  descriptionEN: string;
  systemPrompt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  language: "FR" | "EN";
  teamId?: string;
}
