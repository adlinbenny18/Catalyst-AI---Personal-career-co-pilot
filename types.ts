
export enum AppStep {
  SETUP = 0,
  INTERVIEW = 1,
  ROADMAP = 2
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface RoadmapPhase {
  day: string;
  focus: string;
  tasks: string[];
}

export interface RoadmapData {
  thirty_day_plan: RoadmapPhase[];
}

export interface SkillItem {
  name: string;
  type: 'technical' | 'soft';
  status: 'met' | 'missing';
}

export interface InitialAnalysis {
  skill_gap_summary: string;
  assessment_questions: string[];
  skills: SkillItem[];
  other_suggestions: string[];
  project_suggestions: string[];
  job_pathways: string[];
}
