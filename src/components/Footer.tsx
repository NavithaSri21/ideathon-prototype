import React from 'react';
import { Compass, Sparkles, Shield, Cpu, Cloud, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 font-display">CareerPilot AI</span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Empowering students and aspiring software engineers to turn their academic skills, coursework, and personal projects into actionable 30-day career roadmaps.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                Gemini 3.7 Flash Engine
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700">
                <Cloud className="w-3.5 h-3.5 text-blue-600" />
                Google Cloud Run Ready
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 font-display">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">AI Skill Gap Diagnostic</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">30-Day Intensive Roadmaps</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Market Salary Benchmarks</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">ATS Resume Recommendations</li>
            </ul>
          </div>

          {/* Technical Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 font-display">
              Platform & Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-600">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Firebase Auth & Security Rules
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <Code className="w-3.5 h-3.5 text-indigo-600" />
                Strict TypeScript Type Safety
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Zero-Latency Schema Validation
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} CareerPilot AI. Built with Google AI Studio.</p>
          <p className="text-slate-500">
            Dedicated to helping university students launch high-impact tech careers.
          </p>
        </div>
      </div>
    </footer>
  );
};

