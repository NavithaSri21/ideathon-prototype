import React from 'react';
import { CareerAnalysisResult, PageView } from '../types';
import { sanitizeText } from '../services/storageService';
import { 
  FileText, 
  Calendar, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  Briefcase, 
  BrainCircuit, 
  ArrowRight,
  Printer
} from 'lucide-react';

interface SavedReportsPageProps {
  analyses: CareerAnalysisResult[];
  currentAnalysis: CareerAnalysisResult | null;
  onSelectAnalysis: (analysis: CareerAnalysisResult) => void;
  onDeleteAnalysis: (id: string) => void;
  onNavigate: (page: PageView) => void;
}

export const SavedReportsPage: React.FC<SavedReportsPageProps> = ({
  analyses,
  currentAnalysis,
  onSelectAnalysis,
  onDeleteAnalysis,
  onNavigate,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Evaluation Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Saved Career Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Access and compare your previous AI career diagnostics, readiness scores, and skill progression milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('analysis')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>New Career Analysis</span>
          </button>
        </div>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            No Saved Reports Yet
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Complete your profile and run a career diagnostic to generate your first comprehensive report.
          </p>
          <button
            onClick={() => onNavigate('analysis')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            Run Career Analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((report) => {
            const isCurrent = currentAnalysis?.id === report.id;
            const topRole = report.topCareerRecommendations?.[0];
            const dateStr = new Date(report.timestamp).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={report.id}
                className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5 transition-all ${
                  isCurrent ? 'border-indigo-400 ring-2 ring-indigo-500/10' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Meta */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {dateStr}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {report.jobReadinessScore}% Score
                    </span>
                  </div>

                  {/* Title & Goal */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                      Target Role
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-display truncate">
                      {topRole?.roleTitle || report.inputProfile.careerGoal || 'Software Engineer'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {report.inputProfile.degreeBranch} • Graduating {report.inputProfile.graduationYear}
                    </p>
                  </div>

                  {/* Summary snippet */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {sanitizeText(report.readinessSummary)}
                  </p>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Level</span>
                      <span className="font-bold text-slate-800">{report.readinessLevel}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Avg Salary</span>
                      <span className="font-bold text-emerald-700 truncate block">{topRole?.averageSalary || '$95,000'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onDeleteAnalysis(report.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectAnalysis(report);
                        onNavigate('analysis');
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all cursor-pointer"
                    >
                      <span>View Full Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
