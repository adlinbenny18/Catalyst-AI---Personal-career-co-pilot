
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

export interface RoadmapTask {
  text: string;
  type: 'documentation' | 'practice' | 'project' | 'general';
}

export interface DocumentationLink {
  title: string;
  url: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: string;
  relevanceScore: number;
  estimatedReadTime: string;
}

export interface RoadmapPhase {
  day: string;
  focus: string;
  tasks: RoadmapTask[];
  documentation: DocumentationLink[];
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

export interface SkillReportItem {
  name: string;
  beforeScore: number;
  afterScore: number;
  improvement: number;
  insight: string;
}

export interface ProgressReportData {
  userName: string;
  targetRole: string;
  date: string;
  initialScore: number;
  finalScore: number;
  totalImprovement: number;
  tasksCompleted: number;
  totalTasks: number;
  projectsBuilt: string[];
  consistencyRate: string;
  growthAnalysis: string;
  skillBreakdown: SkillReportItem[];
  keyAchievements: string[];
  readinessAssessment: string;
  finalRecommendation: string;
}
