import React from 'react';
import { PageView } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  BrainCircuit, 
  Map, 
  Target, 
  Zap, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  GraduationCap, 
  Laptop,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
  onQuickDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onQuickDemo }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-blue-100/30 to-purple-100/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Powered by Gemini 3.7 AI & Industry Hiring Benchmarks</span>
            </div>

            {/* Main Title & Slogan */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.1]">
              Turn your skills into your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">career roadmap.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              CareerPilot AI diagnoses your academic coursework, programming languages, and projects to match top tech careers, pinpoint critical skill gaps, and generate a customized 30-day curriculum.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                id="hero-get-started-button"
                onClick={() => onNavigate('analysis')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-sign-in-button"
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-xs cursor-pointer"
              >
                <span>Sign In</span>
              </button>

              <button
                id="hero-demo-button"
                onClick={onQuickDemo}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 transition-all border border-indigo-200 cursor-pointer"
              >
                <Laptop className="w-4 h-4" />
                <span>Try Demo Profile</span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero guesswork role matching</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>30-Day Day-by-Day roadmaps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Real industry compensation data</span>
              </div>
            </div>
          </div>

          {/* Interactive Feature Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200/80 shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg font-display">
                    Real-Time Career Intelligence Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sample profile: CS Undergraduate → Full-Stack AI Engineer Target
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Job Readiness: 74% (Developing)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                    #1 Role Match
                  </span>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    92% Match
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 font-display">
                  Full-Stack AI Application Engineer
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  Building responsive React frontends integrated with server-side LLM orchestration and vector search.
                </p>
                <div className="text-xs font-bold text-emerald-700 pt-1">
                  $110,000 - $145,000 / yr
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                  Critical Skill Gaps
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg text-slate-800">
                    <span>Cloud Deployment & Docker</span>
                    <span className="text-[10px] text-rose-700 font-bold">Critical</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg text-slate-800">
                    <span>Relational Database Indexing</span>
                    <span className="text-[10px] text-amber-800 font-bold">High</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Estimated ramp-up time: 3 weeks with guided curriculum.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4.5 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                    30-Day Guided Roadmap
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 font-display mt-1">
                    4 Structured Milestone Phases
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Week 1: TypeScript API • Week 2: React UI • Week 3: Cloud Run AI • Week 4: Interviews
                  </p>
                </div>
                <button
                  onClick={onQuickDemo}
                  className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Explore Interactive Roadmap →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              How CareerPilot AI Guides Your Career
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Three straightforward steps from academic coursework to an industry-ready engineering portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-lg font-bold font-display">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Profile & Skills Input</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your education, degree, programming languages, completed coursework, and ideal career aspirations.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-lg font-bold font-display">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Gemini AI Career Diagnostics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gemini 3.7 evaluates top 3 matching career tracks, determines your readiness score, and identifies urgent skill gaps.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 text-lg font-bold font-display">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Personalized 30-Day Roadmap</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Follow a step-by-step 30-day curriculum with verifiable checkpoints, curated resources, and production projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-indigo-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-800 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display relative z-10">
              Ready to chart your technical career path?
            </h2>
            <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base relative z-10 leading-relaxed">
              Join thousands of university students bridging the gap between classroom theory and real-world tech engineering.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <button
                onClick={() => onNavigate('analysis')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-white hover:bg-slate-100 text-indigo-900 shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                Analyze My Career Now
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-800 hover:bg-indigo-700 border border-indigo-700 transition-all cursor-pointer"
              >
                Sign In with Google
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
