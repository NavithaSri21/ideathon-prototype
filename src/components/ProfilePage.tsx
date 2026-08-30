import React, { useState } from 'react';
import { UserProfile, CareerAnalysisResult, LearningRoadmap, PageView } from '../types';
import { User, Mail, School, ShieldCheck, Award, Map, BrainCircuit, CheckCircle, Save } from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  analyses: CareerAnalysisResult[];
  roadmap: LearningRoadmap | null;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigate: (page: PageView) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  analyses,
  roadmap,
  onUpdateUser,
  onNavigate,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [institution, setInstitution] = useState(user.institution || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      institution: institution.trim() || undefined,
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const completedDays = roadmap?.completedDayNumbers?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold text-2xl flex items-center justify-center border-2 border-indigo-200 shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              {user.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Authenticated Student
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" />
            {user.email}
          </p>
          {user.institution && (
            <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1 font-medium">
              <School className="w-3.5 h-3.5 text-indigo-600" />
              {user.institution}
            </p>
          )}
        </div>

        <div className="flex sm:flex-col gap-3">
          <div className="text-center bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Reports</span>
            <span className="text-lg font-black text-slate-900">{analyses.length}</span>
          </div>
          <div className="text-center bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Days Done</span>
            <span className="text-lg font-black text-indigo-700">{completedDays}/30</span>
          </div>
        </div>
      </div>

      {/* Account Settings Form */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Personal & Academic Information
          </h2>
          <p className="text-xs text-slate-500">
            Update your profile details used for tailoring Gemini career intelligence outputs.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              University / College / Institution
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Stanford University, UC Berkeley, IIT Bombay"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigate('analysis')}
          className="bg-white border border-slate-200/80 hover:border-indigo-300 p-5 rounded-2xl shadow-xs cursor-pointer transition-all flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Career Diagnostic</h4>
            <p className="text-xs text-slate-500">Run a new AI skills & readiness analysis</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('roadmap')}
          className="bg-white border border-slate-200/80 hover:border-indigo-300 p-5 rounded-2xl shadow-xs cursor-pointer transition-all flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">30-Day Curriculum</h4>
            <p className="text-xs text-slate-500">Check off daily tasks & track milestones</p>
          </div>
        </div>
      </div>
    </div>
  );
};
