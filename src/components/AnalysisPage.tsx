import React, { useState } from 'react';
import { 
  CareerAnalysisResult, 
  CareerProfileInput, 
  ExperienceLevel, 
  PageView, 
  CareerRecommendation 
} from '../types';
import { ScoreGauge } from './ScoreGauge';
import { SkillBadge } from './SkillBadge';
import { 
  BrainCircuit, 
  Sparkles, 
  GraduationCap, 
  Code, 
  Layers, 
  Target, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  FolderGit2, 
  FileText, 
  Briefcase,
  HelpCircle,
  RotateCcw,
  Check,
  Zap,
  TrendingUp,
  Map,
  Compass,
  Lightbulb,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AnalysisPageProps {
  initialProfile?: CareerProfileInput;
  latestResult: CareerAnalysisResult | null;
  onRunAnalysis: (profile: CareerProfileInput) => Promise<CareerAnalysisResult>;
  onNavigateToRoadmap: (targetRole?: string) => void;
  isLoading: boolean;
}

const defaultFormProfile: CareerProfileInput = {
  education: "Bachelor's Degree",
  degreeBranch: "Computer Science & Engineering",
  graduationYear: "2026",
  technicalSkills: ["React", "JavaScript", "HTML/CSS", "Git", "REST APIs", "Node.js (Basics)"],
  programmingLanguages: ["JavaScript", "Python", "TypeScript", "C++"],
  areasOfInterest: ["Full Stack Web Dev", "Artificial Intelligence", "Cloud Computing"],
  careerGoal: "Become a Full-Stack AI Engineer at a top product tech company",
  experienceLevel: "Intermediate",
  preferredWorkType: "Hybrid"
};

const POPULAR_TECHNICAL_SKILLS = [
  "React", "Node.js", "Python", "SQL / PostgreSQL", "Docker", "Git & GitHub",
  "REST APIs", "TypeScript", "Tailwind CSS", "AWS / Cloud", "MongoDB",
  "Machine Learning", "FastAPI", "GraphQL", "Next.js", "Kubernetes"
];

const POPULAR_LANGUAGES = [
  "JavaScript", "Python", "TypeScript", "C++", "Java", "SQL", "Go", "Rust", "C#", "HTML/CSS"
];

const POPULAR_INTERESTS = [
  "Full Stack Web Dev", "Artificial Intelligence / ML", "Cloud & DevOps",
  "Data Science & Analytics", "Cybersecurity", "Mobile App Development",
  "Distributed Systems", "UI/UX Engineering"
];

const EDUCATION_OPTIONS = [
  "Bachelor's Degree",
  "Master's Degree",
  "Associate Degree",
  "High School / Pre-University",
  "PhD / Doctoral",
  "Bootcamp / Self-Taught"
];

const GRAD_YEARS = ["2024", "2025", "2026", "2027", "2028", "2029", "Already Graduated"];

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  initialProfile,
  latestResult,
  onRunAnalysis,
  onNavigateToRoadmap,
  isLoading,
}) => {
  // Form State
  const [profile, setProfile] = useState<CareerProfileInput>(initialProfile || defaultFormProfile);
  const [customTechSkill, setCustomTechSkill] = useState('');
  const [customLang, setCustomLang] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [activeResult, setActiveResult] = useState<CareerAnalysisResult | null>(latestResult);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync active result if prop updates
  React.useEffect(() => {
    if (latestResult) {
      setActiveResult(latestResult);
    }
  }, [latestResult]);

  // Handle Multi-Select toggles
  const toggleSkill = (skill: string) => {
    setProfile(prev => {
      const exists = prev.technicalSkills.includes(skill);
      return {
        ...prev,
        technicalSkills: exists
          ? prev.technicalSkills.filter(s => s !== skill)
          : [...prev.technicalSkills, skill],
      };
    });
  };

  const toggleLang = (lang: string) => {
    setProfile(prev => {
      const exists = prev.programmingLanguages.includes(lang);
      return {
        ...prev,
        programmingLanguages: exists
          ? prev.programmingLanguages.filter(l => l !== lang)
          : [...prev.programmingLanguages, lang],
      };
    });
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => {
      const exists = prev.areasOfInterest.includes(interest);
      return {
        ...prev,
        areasOfInterest: exists
          ? prev.areasOfInterest.filter(i => i !== interest)
          : [...prev.areasOfInterest, interest],
      };
    });
  };

  const addCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customTechSkill.trim()) return;
    if (!profile.technicalSkills.includes(customTechSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, customTechSkill.trim()],
      }));
    }
    setCustomTechSkill('');
  };

  const addCustomLang = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customLang.trim()) return;
    if (!profile.programmingLanguages.includes(customLang.trim())) {
      setProfile(prev => ({
        ...prev,
        programmingLanguages: [...prev.programmingLanguages, customLang.trim()],
      }));
    }
    setCustomLang('');
  };

  const addCustomInterest = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customInterest.trim()) return;
    if (!profile.areasOfInterest.includes(customInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        areasOfInterest: [...prev.areasOfInterest, customInterest.trim()],
      }));
    }
    setCustomInterest('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!profile.education || !profile.degreeBranch.trim()) {
      setErrorMessage("Please enter your education level and degree / major branch.");
      return;
    }
    if (!profile.careerGoal.trim()) {
      setErrorMessage("Please specify your target career goal or dream role.");
      return;
    }

    try {
      const res = await onRunAnalysis(profile);
      setActiveResult(res);
      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('analysis-results-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error("Analysis execution error:", err);
      setErrorMessage(err.message || "Failed to generate career analysis. Please check your connection and try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Career Intelligence & Market Evaluator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Career Analysis & Skill Diagnostic
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Provide your academic background, current technical stack, and career aspirations. Our Gemini AI engine evaluates your job readiness score, analyzes skill gaps, and recommends targeted paths to industry standards.
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-rose-600 font-bold hover:text-rose-900 cursor-pointer text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Education & Branch */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 font-display">
                1. Academic Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Education Level
                </label>
                <select
                  value={profile.education}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Degree / Major / Branch
                </label>
                <input
                  type="text"
                  value={profile.degreeBranch}
                  onChange={(e) => setProfile({ ...profile, degreeBranch: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering, Data Science"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Graduation Year
                </label>
                <select
                  value={profile.graduationYear}
                  onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  {GRAD_YEARS.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Programming Languages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900 font-display">
                  2. Programming Languages
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                {profile.programmingLanguages.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_LANGUAGES.map((lang) => {
                const isSelected = profile.programmingLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLang(lang)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Language input */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customLang}
                onChange={(e) => setCustomLang(e.target.value)}
                onKeyDown={addCustomLang}
                placeholder="Add other language (e.g. Kotlin, Scala)..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={addCustomLang}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* 3. Technical Skills & Tools */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900 font-display">
                  3. Technical Skills & Frameworks
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                {profile.technicalSkills.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_TECHNICAL_SKILLS.map((skill) => {
                const isSelected = profile.technicalSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Skill input */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customTechSkill}
                onChange={(e) => setCustomTechSkill(e.target.value)}
                onKeyDown={addCustomSkill}
                placeholder="Add other framework/tool (e.g. Redis, Prisma)..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* 4. Areas of Interest */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900 font-display">
                  4. Areas of Interest & Specializations
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                {profile.areasOfInterest.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_INTERESTS.map((interest) => {
                const isSelected = profile.areasOfInterest.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Interest */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={addCustomInterest}
                placeholder="Add other domain (e.g. FinTech, Game Dev)..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={addCustomInterest}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* 5. Career Goal & Experience Level */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 font-display">
                5. Career Aspiration & Experience Level
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Career Goal / Dream Job Title
                </label>
                <input
                  type="text"
                  value={profile.careerGoal}
                  onChange={(e) => setProfile({ ...profile, careerGoal: e.target.value })}
                  placeholder="e.g. Full-Stack AI Engineer, Cloud Infrastructure Architect"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Experience Level
                </label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as ExperienceLevel })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Beginner">Beginner (Foundations / Early Student)</option>
                  <option value="Intermediate">Intermediate (Built Projects / Core Stack)</option>
                  <option value="Advanced">Advanced (Internship Exp / Production Ready)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Evaluates current market supply & hiring requirements in real time via Gemini AI.
            </p>

            <button
              id="analysis-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Diagnostic with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run Complete Career Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {activeResult && (
        <div id="analysis-results-section" className="space-y-8 animate-fade-in">
          {/* Results Header Card: Job Readiness Score & Explanation */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                    Diagnostic Result Generated
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                    Level: {activeResult.currentLevel || activeResult.readinessLevel || 'Developing'}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 font-display mt-1.5">
                  Overall Career Readiness Assessment
                </h2>
                <p className="text-xs text-slate-500">
                  Target Role: <strong>{profile.careerGoal}</strong> • Evaluated on {new Date(activeResult.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToRoadmap(activeResult.topCareerRecommendations?.[0]?.roleTitle || activeResult.topCareerRecommendations?.[0]?.career)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <Map className="w-4 h-4" />
                  <span>Build 30-Day Roadmap</span>
                </button>
              </div>
            </div>

            {/* Gauge & Breakdown */}
            <ScoreGauge
              score={activeResult.jobReadinessScore}
              level={activeResult.currentLevel || activeResult.readinessLevel || 'Developing'}
              breakdown={activeResult.readinessBreakdown || activeResult.scoreExplanation}
              size="lg"
            />

            {/* Detailed Factors Affecting Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Major Factors Driving Score</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeResult.scoreExplanation?.majorFactorsSummary || activeResult.readinessSummary}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Key Identified Strengths</span>
                </h3>
                <div className="space-y-1">
                  {(activeResult.scoreExplanation?.keyStrengths || [
                    "Solid foundation in core languages and project fundamentals",
                    "Strong alignment with modern cloud and software demands"
                  ]).map((strength, sIdx) => (
                    <div key={sIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Career Matches Grid */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Top Career Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by alignment with your programming foundation, education, and career goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(activeResult.careerRecommendations || activeResult.topCareerRecommendations || []).map((career, idx) => {
                const isTop = idx === 0;
                const roleName = career.career || career.roleTitle || "Software Engineer";
                const fitReason = career.reason || career.whyFit || "Strong alignment with your profile.";

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition-all ${
                      isTop 
                        ? 'bg-indigo-50/40 border-indigo-200 ring-2 ring-indigo-500/10' 
                        : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          isTop ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200/70 text-slate-700'
                        }`}>
                          {isTop ? 'Primary Recommendation' : `Option #${idx + 1}`}
                        </span>
                        <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-100">
                          {career.matchPercentage}% Match
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-slate-900 font-display">
                          {roleName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-emerald-700">
                            {career.averageSalary || "$105,000 - $140,000 / yr"}
                          </span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            Barrier: <strong>{career.entryBarrier || "Moderate"}</strong>
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {career.description || fitReason}
                      </p>

                      <div className="bg-white/90 p-3 rounded-xl border border-slate-200/60 text-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-700 block">Why You Fit:</span>
                        <p className="text-slate-600 line-clamp-2">{fitReason}</p>
                      </div>

                      {/* Required Skills Badges */}
                      {career.requiredSkills && career.requiredSkills.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-slate-500 block">
                            Key Required Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {career.requiredSkills.slice(0, 5).map((skill, sIdx) => (
                              <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigateToRoadmap(roleName)}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>Generate 30-Day Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skill Gap Analysis Section (Existing Skills vs Skills to Learn) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Skill Gap Analysis & Learning Strategy
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of your verified capabilities vs missing competencies with recommended ways to learn
              </p>
            </div>

            {/* 1. Skills You Already Have */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Skills You Already Have ({activeResult.userExistingSkills?.length || profile.technicalSkills.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(activeResult.userExistingSkills && activeResult.userExistingSkills.length > 0 
                  ? activeResult.userExistingSkills 
                  : [...profile.technicalSkills, ...profile.programmingLanguages]
                ).map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Skills You Need to Learn */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Skills You Need to Learn (Prioritized)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeResult.skillGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <SkillBadge skill={gap.skill} category={gap.priority || gap.category} />
                      <span className="text-xs text-slate-500">
                        Est. Time: <strong className="text-slate-800">{gap.estimatedTimeToLearn}</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {gap.whyNeeded}
                    </p>

                    {gap.recommendedWayToLearn && (
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/60 text-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase text-indigo-700 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-indigo-600" />
                          <span>Recommended Way to Learn:</span>
                        </span>
                        <p className="text-slate-600">{gap.recommendedWayToLearn}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Recommended Technologies */}
            {activeResult.recommendedTechnologies && activeResult.recommendedTechnologies.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Recommended Technologies & Tools to Adopt</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeResult.recommendedTechnologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Personalized Portfolio Projects & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recommended Flagship Projects */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FolderGit2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 font-display">
                  Recommended Flagship Projects
                </h3>
              </div>

              <div className="space-y-4">
                {activeResult.personalizedRecommendations?.recommendedProjects?.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">{proj.title}</h4>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {proj.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60">
                      <strong>Target Outcome:</strong> {proj.outcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Actionable Tips */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 font-display">
                  Recommended Industry Certifications
                </h3>
              </div>

              <div className="space-y-2.5">
                {activeResult.personalizedRecommendations?.certifications?.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                    <Award className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{cert}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Strategic Action Items
                </h4>
                <div className="space-y-2">
                  {activeResult.personalizedRecommendations?.actionableAdvice?.map((adv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
