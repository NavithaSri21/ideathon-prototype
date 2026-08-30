import React, { useState } from 'react';
import { CareerProfileInput, LearningRoadmap, RoadmapDayTask, RoadmapWeekPhase } from '../types';
import confetti from 'canvas-confetti';
import { 
  Map, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  ExternalLink, 
  Award, 
  FolderGit2, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Layers,
  ArrowRight,
  Printer,
  Check,
  Zap,
  Target,
  FileCheck2,
  Code
} from 'lucide-react';

interface RoadmapPageProps {
  roadmap: LearningRoadmap | null;
  currentProfile: CareerProfileInput;
  onToggleDayCompleted: (dayNumber: number) => void;
  onRegenerateRoadmap: (profile: CareerProfileInput, targetRole?: string) => Promise<LearningRoadmap>;
  isLoading: boolean;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  roadmap,
  currentProfile,
  onToggleDayCompleted,
  onRegenerateRoadmap,
  isLoading,
}) => {
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [targetRoleInput, setTargetRoleInput] = useState<string>(
    roadmap?.targetRole || currentProfile.careerGoal || 'Full-Stack AI Application Engineer'
  );
  const [showRegenModal, setShowRegenModal] = useState(false);

  const toggleDayExpansion = (day: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleTaskClick = (day: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleDayCompleted(day);
    
    // Check if task is being marked completed (not uncompleted)
    const isCompleted = roadmap?.completedDayNumbers?.includes(day);
    if (!isCompleted) {
      // Trigger festive confetti
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06B6D4', '#3B82F6', '#6366F1', '#10B981'],
      });
    }
  };

  const handleRegenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onRegenerateRoadmap(currentProfile, targetRoleInput);
      setShowRegenModal(false);
    } catch (err) {
      console.error('Roadmap regeneration failed', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto shadow-xs">
          <Map className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">
          No Roadmap Generated Yet
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Generate your personalized 30-day learning curriculum tailored to your career goals and current skill gaps.
        </p>
        <button
          onClick={() => onRegenerateRoadmap(currentProfile, targetRoleInput)}
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
        >
          {isLoading ? 'Generating 30-Day Roadmap...' : 'Generate Personalized 30-Day Roadmap'}
        </button>
      </div>
    );
  }

  const completedCount = roadmap.completedDayNumbers?.length || 0;
  const progressPercent = roadmap.progressPercent || 0;

  // Filter phases or days
  const displayedPhases = selectedWeekFilter === 'all'
    ? roadmap.weeklyPhases
    : roadmap.weeklyPhases.filter(p => p.week === selectedWeekFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI-Generated 30-Day Intensive Curriculum</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display">
                {roadmap.targetRole} Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1 leading-relaxed">
                {roadmap.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="print-roadmap-btn"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                id="open-regen-modal-btn"
                onClick={() => setShowRegenModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate Roadmap</span>
              </button>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div className="sm:col-span-3 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Overall 30-Day Progress</span>
                <span className="text-indigo-700 font-bold">{completedCount} of 30 Days Completed ({progressPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(4, progressPercent)}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Workload
              </span>
              <span className="text-lg font-black text-slate-900 font-display">
                {roadmap.totalHours} Hours
              </span>
              <span className="text-[10px] text-slate-500 block">~3 hrs / day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week Tabs Filter */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSelectedWeekFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedWeekFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          All 30 Days ({roadmap.weeklyPhases.reduce((acc, p) => acc + p.days.length, 0)} Tasks)
        </button>

        {roadmap.weeklyPhases.map((phase) => {
          const completedInWeek = phase.days.filter(d => roadmap.completedDayNumbers?.includes(d.day)).length;
          return (
            <button
              key={phase.week}
              onClick={() => setSelectedWeekFilter(phase.week)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedWeekFilter === phase.week
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>Week {phase.week}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 font-semibold text-slate-700">
                {completedInWeek}/{phase.days.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phase & Day Modules */}
      <div className="space-y-10">
        {displayedPhases.map((phase) => (
          <div key={phase.week} className="space-y-6">
            {/* Week Phase Banner */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                    Phase {phase.week}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Focus: {phase.focusArea}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                  {phase.phaseTitle}
                </h2>
                <p className="text-xs text-slate-600">
                  {phase.phaseGoal}
                </p>
              </div>

              {/* Milestone Project Badge */}
              <div className="bg-slate-50 border border-indigo-200/80 rounded-xl p-3.5 max-w-sm flex-shrink-0 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Week {phase.week} Milestone Project:</span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {phase.milestoneProject.title}
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-2">
                  {phase.milestoneProject.description}
                </div>
              </div>
            </div>

            {/* Days Grid / List */}
            <div className="space-y-3">
              {phase.days.map((dayTask) => {
                const isCompleted = roadmap.completedDayNumbers?.includes(dayTask.day);
                const isExpanded = expandedDays[dayTask.day] ?? false;

                return (
                  <div
                    key={dayTask.day}
                    id={`roadmap-day-${dayTask.day}`}
                    className={`rounded-2xl border transition-all duration-200 ${
                      isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200 opacity-95'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {/* Collapsible Header */}
                    <div
                      onClick={() => toggleDayExpansion(dayTask.day)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={(e) => handleTaskClick(dayTask.day, e)}
                          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-50 border border-slate-300 text-transparent hover:border-indigo-500'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 font-display">
                              Day {dayTask.day}
                            </span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {dayTask.hoursEstimated} hrs
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                                Completed ✓
                              </span>
                            )}
                          </div>
                          <h3 className={`text-sm sm:text-base font-bold truncate mt-0.5 ${
                            isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}>
                            {dayTask.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5">
                          {dayTask.keyTopics.slice(0, 2).map((topic, tIdx) => (
                            <span key={tIdx} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                              {topic}
                            </span>
                          ))}
                        </div>

                        <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {dayTask.description}
                        </p>

                        {/* Key Topics */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Key Core Topics:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {dayTask.keyTopics.map((topic, idx) => (
                              <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Verifiable Checkpoint */}
                        <div className="bg-slate-50 border border-indigo-100 rounded-xl p-3.5 flex items-start gap-2.5">
                          <FileCheck2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              Day {dayTask.day} Verifiable Checkpoint:
                            </span>
                            <span className="text-slate-600 leading-relaxed">
                              {dayTask.checkpoint}
                            </span>
                          </div>
                        </div>

                        {/* Curated Resources */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Curated Learning Resources & Documentation:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {dayTask.resources.map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.urlOrQuery.startsWith('http') ? res.urlOrQuery : `https://www.google.com/search?q=${encodeURIComponent(res.urlOrQuery)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 transition-colors flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <BookOpen className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                                  <span className="truncate font-medium">{res.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-600 uppercase bg-white border border-slate-200 px-1.5 py-0.5 rounded flex-shrink-0">
                                  {res.type}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Regeneration Modal */}
      {showRegenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Regenerate 30-Day Roadmap</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowRegenModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegenerateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Role or Specialty
                </label>
                <input
                  type="text"
                  required
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  placeholder="e.g. Full-Stack AI Engineer, Cloud Architect, Data Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                Gemini AI will regenerate all 30 days of structured daily lessons, milestones, and practice projects specifically geared toward <strong className="text-slate-900">{targetRoleInput || 'your career goal'}</strong>.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegenModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? 'Regenerating...' : 'Generate New Roadmap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
