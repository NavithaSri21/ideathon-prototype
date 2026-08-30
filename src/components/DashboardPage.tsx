import React from 'react';
import { CareerAnalysisResult, LearningRoadmap, PageView, UserProfile } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { SkillBadge } from './SkillBadge';
import { sanitizeText } from '../services/storageService';
import { 
  Sparkles, 
  BrainCircuit, 
  Map, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Briefcase, 
  Calendar,
  Layers,
  ChevronRight,
  FolderGit2,
  RefreshCw,
  PlusCircle,
  FileText
} from 'lucide-react';

interface DashboardPageProps {
  user: UserProfile | null;
  currentAnalysis: CareerAnalysisResult | null;
  analyses: CareerAnalysisResult[];
  roadmap: LearningRoadmap | null;
  onNavigate: (page: PageView) => void;
  onSelectAnalysis: (analysis: CareerAnalysisResult) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  currentAnalysis,
  analyses,
  roadmap,
  onNavigate,
  onSelectAnalysis,
}) => {
  const topCareer = currentAnalysis?.topCareerRecommendations?.[0];
  const criticalGaps = currentAnalysis?.skillGaps || [];
  const completedDaysCount = roadmap?.completedDayNumbers?.length || 0;
  const progressPercent = roadmap?.progressPercent || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Welcome Message Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white border border-indigo-800 p-6 sm:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-300/60 shadow-md flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-indigo-800 text-white font-extrabold text-xl flex items-center justify-center border-2 border-indigo-300/60 shadow-md flex-shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20 uppercase tracking-wider">
                    Student AI Dashboard
                  </span>
                  {currentAnalysis && (
                    <span className="text-xs text-indigo-200 font-medium">
                      • Target: {topCareer?.roleTitle || currentAnalysis.inputProfile.careerGoal}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                  Welcome back, {user?.name || 'Student'}! 👋
                </h1>
                {user?.email && (
                  <p className="text-xs text-indigo-200/90 font-medium">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-indigo-100 max-w-2xl leading-relaxed">
              {currentAnalysis 
                ? `You're charting a high-impact course toward ${topCareer?.roleTitle || 'Software Engineering'}. Your career readiness index is currently ${currentAnalysis.jobReadinessScore}%.`
                : 'Complete your profile and diagnostic to get your personalized career readiness score and customized 30-day learning roadmap.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-start-analysis-btn"
              onClick={() => onNavigate('analysis')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>{currentAnalysis ? 'New Career Diagnostic' : 'Complete Profile Diagnostic'}</span>
            </button>

            {roadmap ? (
              <button
                id="dash-open-roadmap-btn"
                onClick={() => onNavigate('roadmap')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-semibold text-xs border border-indigo-700 transition-all cursor-pointer"
              >
                <Map className="w-4 h-4 text-indigo-300" />
                <span>View Roadmap ({progressPercent}%)</span>
              </button>
            ) : currentAnalysis && (
              <button
                onClick={() => onNavigate('roadmap')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-semibold text-xs border border-indigo-700 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Roadmap</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* 2. Career Readiness Score Section */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-display">
                    Career Readiness Score
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive index across technical skills, market alignment, and portfolio depth
                  </p>
                </div>
              </div>
              {currentAnalysis && (
                <button
                  onClick={() => onNavigate('analysis')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Re-evaluate</span>
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
            </div>

            {currentAnalysis ? (
              <>
                <ScoreGauge
                  score={currentAnalysis.jobReadinessScore}
                  level={currentAnalysis.readinessLevel}
                  breakdown={currentAnalysis.readinessBreakdown}
                  size="lg"
                />

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900">AI Diagnostic Summary: </span>
                  {sanitizeText(currentAnalysis.readinessSummary)}
                </div>
              </>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No Readiness Score Available</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Complete your profile to get your career analysis and benchmark your readiness against market hiring requirements.
                </p>
                <button
                  onClick={() => onNavigate('analysis')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Start Career Analysis</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Recommended Career Section */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-display">
                    Recommended Career Pathways
                  </h2>
                  <p className="text-xs text-slate-500">
                    High-demand software roles matched to your academic background and interests
                  </p>
                </div>
              </div>
              {currentAnalysis && (
                <span className="text-xs font-semibold text-slate-500">
                  {currentAnalysis.topCareerRecommendations?.length || 0} Matches
                </span>
              )}
            </div>

            {currentAnalysis && topCareer ? (
              <div className="space-y-4">
                {/* Primary Card */}
                <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                        Top Recommendation
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 font-display mt-1">
                        {topCareer.roleTitle}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                        {topCareer.matchPercentage}% Match
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                        {topCareer.averageSalary}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sanitizeText(topCareer.description)}
                  </p>

                  <div className="bg-white/80 p-3.5 rounded-xl border border-indigo-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                      Why It Fits:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sanitizeText(topCareer.whyFit)}
                    </p>
                  </div>

                  {topCareer.keyResponsibilities && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        Key Responsibilities:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {topCareer.keyResponsibilities.slice(0, 4).map((resp, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>{sanitizeText(resp)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Growth Outlook: <strong className="text-slate-800">{topCareer.growthOutlook}</strong>
                    </span>
                    <button
                      onClick={() => onNavigate('roadmap')}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      <span>Build Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Additional Career Recommendations */}
                {currentAnalysis.topCareerRecommendations?.slice(1).map((career, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{career.roleTitle}</h4>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {career.matchPercentage}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        {sanitizeText(career.description)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                      {career.averageSalary}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No Career Recommendations Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Complete your profile to get tailored recommendations for high-paying roles like Full-Stack AI Engineer, Cloud Architect, or Data Platform Specialist.
                </p>
                <button
                  onClick={() => onNavigate('analysis')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <span>Explore Career Pathways</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 4. Skill Gap Analysis Section */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-display">
                    Skill Gap Analysis
                  </h2>
                  <p className="text-xs text-slate-500">
                    High-priority technical skills required to meet target job qualifications
                  </p>
                </div>
              </div>
              {currentAnalysis && (
                <span className="text-xs font-semibold text-slate-500">
                  {criticalGaps.length} Target Areas
                </span>
              )}
            </div>

            {currentAnalysis && criticalGaps.length > 0 ? (
              <div className="space-y-3">
                {criticalGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <SkillBadge
                          skill={gap.skill}
                          category={gap.category}
                        />
                        <span className="text-xs text-slate-500">
                          Est. Time: <strong className="text-slate-800">{gap.estimatedTimeToLearn}</strong>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 pl-1">
                        {sanitizeText(gap.whyNeeded)}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('roadmap')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 self-start sm:self-center flex items-center gap-1 flex-shrink-0 cursor-pointer"
                    >
                      <span>Study Plan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No Skill Gaps Identified Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Run a diagnostic with your current languages and frameworks to discover key missing topics.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 1/3 width */}
        <div className="space-y-8">
          {/* 5. 30-Day Learning Roadmap Progress Section */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-display">
                    30-Day Roadmap Progress
                  </h3>
                  <p className="text-[11px] text-slate-500">Day-by-Day Milestone Plan</p>
                </div>
              </div>
              {roadmap && (
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {progressPercent}%
                </span>
              )}
            </div>

            {roadmap ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{completedDaysCount} of 30 Days Completed</span>
                    <span>{roadmap.totalHours} hrs</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(5, progressPercent)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3.5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Current Active Phase
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">
                    {roadmap.weeklyPhases[0]?.phaseTitle || 'Week 1: Core Foundations'}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {sanitizeText(roadmap.weeklyPhases[0]?.phaseGoal)}
                  </p>
                </div>

                <button
                  id="dash-continue-roadmap-btn"
                  onClick={() => onNavigate('roadmap')}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open 30-Day Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-slate-500">
                  No active 30-day roadmap generated yet. Turn your career diagnostic into a daily curriculum.
                </p>
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all cursor-pointer"
                >
                  Generate 30-Day Plan
                </button>
              </div>
            )}
          </div>

          {/* 6. Recent Career Analyses Section */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 font-display">
                  Recent Career Analyses
                </h3>
              </div>
              <button
                onClick={() => onNavigate('reports')}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                View All ({analyses.length})
              </button>
            </div>

            {analyses.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {analyses.map((an) => {
                  const isCurrent = currentAnalysis?.id === an.id;
                  const targetName = an.topCareerRecommendations?.[0]?.roleTitle || an.inputProfile.careerGoal || 'Software Engineer';
                  return (
                    <div
                      key={an.id}
                      onClick={() => onSelectAnalysis(an)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isCurrent
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-800 truncate max-w-[160px]">
                          {targetName}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(an.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="font-bold text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-800">
                        {an.jobReadinessScore}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">
                  No saved analyses in your account.
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Navigation Quick Links
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('analysis')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Run New Analysis</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Saved Reports</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Account & Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
