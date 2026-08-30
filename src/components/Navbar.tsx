import React from 'react';
import { Compass, User, LogOut, Sparkles, LayoutDashboard, BrainCircuit, Map, FileText } from 'lucide-react';
import { PageView, UserProfile } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          id="nav-brand-logo"
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-display">
                CareerPilot<span className="text-indigo-600">.ai</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block leading-none">
              AI Career & Learning Navigator
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        {user ? (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              id="nav-link-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'dashboard'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-link-analysis"
              onClick={() => onNavigate('analysis')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'analysis'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
              <span>Career Analysis</span>
            </button>

            <button
              id="nav-link-roadmap"
              onClick={() => onNavigate('roadmap')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'roadmap'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-indigo-600" />
              <span>Learning Roadmap</span>
            </button>

            <button
              id="nav-link-reports"
              onClick={() => onNavigate('reports')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'reports'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Saved Reports</span>
            </button>

            <button
              id="nav-link-profile"
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'profile'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Profile</span>
            </button>
          </nav>
        ) : (
          <nav className="hidden sm:flex items-center gap-2">
            <button
              id="nav-link-guest-features"
              onClick={() => onNavigate('landing')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Overview
            </button>
          </nav>
        )}

        {/* Right Action: User Info or Sign In / Sign Out */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                id="user-profile-btn"
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-indigo-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate hidden sm:inline-block">
                  {user.name}
                </span>
              </button>

              <button
                id="nav-sign-out-btn"
                onClick={onLogout}
                title="Sign Out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-signin-button"
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                id="nav-getstarted-button"
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      {user && (
        <div className="lg:hidden flex items-center justify-around px-2 py-2 bg-slate-50 border-t border-slate-200 text-xs overflow-x-auto">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap ${
              currentPage === 'dashboard' ? 'text-indigo-700 bg-white shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onNavigate('analysis')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap ${
              currentPage === 'analysis' ? 'text-indigo-700 bg-white shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
            <span>Analysis</span>
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap ${
              currentPage === 'roadmap' ? 'text-indigo-700 bg-white shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-indigo-600" />
            <span>Roadmap</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap ${
              currentPage === 'reports' ? 'text-indigo-700 bg-white shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Reports</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium whitespace-nowrap ${
              currentPage === 'profile' ? 'text-indigo-700 bg-white shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Profile</span>
          </button>
        </div>
      )}
    </header>
  );
};
