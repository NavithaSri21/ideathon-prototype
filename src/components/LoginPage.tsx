import React, { useState } from 'react';
import { PageView, UserProfile } from '../types';
import { Compass, Sparkles, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithGoogle } from '../services/firebase';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (page: PageView) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle();
      onLoginSuccess(user);
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      if (error?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in cancelled. Please try again.');
      } else if (error?.code === 'auth/popup-blocked') {
        setErrorMessage('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setErrorMessage(error?.message || 'Failed to authenticate with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC]">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-md shadow-indigo-500/25">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
              Sign in to CareerPilot AI
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              AI-driven career diagnostics & personalized 30-day learning roadmap
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Google Authentication Box */}
        <div className="space-y-4 relative z-10">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center space-y-1">
            <p className="text-xs font-bold text-slate-800">
              Official Student Sign-In
            </p>
            <p className="text-[11px] text-slate-500">
              Sign in securely with your Google account to access your diagnostics, roadmap, and saved reports.
            </p>
          </div>

          <button
            id="google-signin-button"
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs hover:shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Signing in with Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Trust & Privacy Notice */}
        <div className="border-t border-slate-100 pt-4 space-y-2 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Authenticated with Google Firebase Security</span>
          </div>
          <p className="text-[10px] text-slate-400">
            By signing in, your diagnostic reports and customized learning plans are securely saved to your Google profile.
          </p>
        </div>
      </div>
    </div>
  );
};
