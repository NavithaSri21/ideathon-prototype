export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CareerProfileInput {
  education: string;
  degreeBranch: string;
  graduationYear: string;
  technicalSkills: string[];
  programmingLanguages: string[];
  areasOfInterest: string[];
  careerGoal: string;
  experienceLevel: ExperienceLevel;
  preferredWorkType?: 'Remote' | 'Hybrid' | 'Onsite' | 'Any';
}

export interface ReadinessBreakdown {
  technicalProficiency: number;
  marketAlignment: number;
  portfolioReadiness: number;
  domainBreadth: number;
  industryDemandIndex: number;
}

export interface ScoreExplanation {
  technicalProficiency: number;
  marketAlignment: number;
  portfolioReadiness: number;
  domainBreadth: number;
  industryDemandIndex: number;
  majorFactorsSummary: string;
  keyStrengths: string[];
  keyImprovementsNeeded: string[];
}

export interface CareerRecommendation {
  career: string;
  roleTitle?: string;
  matchPercentage: number;
  reason: string;
  whyFit?: string;
  requiredSkills: string[];
  description?: string;
  averageSalary?: string;
  growthOutlook?: string;
  keyResponsibilities?: string[];
  entryBarrier?: 'Low' | 'Moderate' | 'High';
}

export interface SkillGapItem {
  skill: string;
  priority: 'Critical' | 'High Priority' | 'Recommended';
  recommendedWayToLearn: string;
  estimatedTimeToLearn: string;
  category?: string;
  whyNeeded?: string;
}

export interface RecommendedProject {
  title: string;
  description: string;
  techStack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  outcome: string;
}

export interface PersonalizedRecommendations {
  actionableAdvice: string[];
  recommendedProjects: RecommendedProject[];
  certifications: string[];
  resumeTips: string[];
  interviewPrepFocus: string[];
}

export interface CareerAnalysisResult {
  id: string;
  timestamp: string;
  inputProfile: CareerProfileInput;
  jobReadinessScore: number;
  currentLevel: string;
  readinessLevel?: 'Starting Out' | 'Developing' | 'Career Ready' | 'Industry Leader';
  readinessSummary: string;
  scoreExplanation: ScoreExplanation;
  readinessBreakdown: ReadinessBreakdown;
  userExistingSkills: string[];
  skillGaps: SkillGapItem[];
  recommendedTechnologies: string[];
  careerRecommendations: CareerRecommendation[];
  topCareerRecommendations: CareerRecommendation[];
  requiredSkills: {
    coreTechnical: string[];
    toolsAndFrameworks: string[];
    softAndDomainSkills: string[];
  };
  personalizedRecommendations: PersonalizedRecommendations;
}

export interface RoadmapResource {
  name: string;
  type: 'article' | 'video' | 'practice' | 'documentation' | 'project';
  urlOrQuery: string;
}

export interface RoadmapDayItem {
  day: number;
  topic: string;
  objective: string;
  activity: string;
  estimatedMinutes: number;
  checkpoint?: string;
  resources?: RoadmapResource[];
  completed?: boolean;
}

export interface RoadmapDayTask {
  day: number;
  title: string;
  description: string;
  hoursEstimated: number;
  keyTopics: string[];
  resources: RoadmapResource[];
  checkpoint: string;
  topic?: string;
  objective?: string;
  activity?: string;
  estimatedMinutes?: number;
  completed?: boolean;
  notes?: string;
}

export interface RoadmapWeekPhase {
  week: number;
  phaseTitle: string;
  phaseGoal: string;
  focusArea: string;
  milestoneProject: {
    title: string;
    description: string;
    deliverable: string;
  };
  days: RoadmapDayTask[];
}

export interface LearningRoadmap {
  id: string;
  targetRole: string;
  createdAt: string;
  summary: string;
  totalHours: number;
  roadmap: RoadmapDayItem[];
  weeklyPhases: RoadmapWeekPhase[];
  completedDayNumbers: number[];
  progressPercent: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  institution?: string;
  isDemoUser?: boolean;
}

export type PageView = 'landing' | 'login' | 'dashboard' | 'analysis' | 'roadmap' | 'reports' | 'profile';
