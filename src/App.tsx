/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CareerAnalysisResult, 
  CareerProfileInput, 
  LearningRoadmap, 
  PageView, 
  UserProfile 
} from './types';
import { 
  loadUserDataFromFirestore,
  saveAnalysisResultToFirestore,
  deleteAnalysisResultFromFirestore,
  saveRoadmapToFirestore,
  toggleRoadmapTaskInFirestore,
  updateUserProfileData
} from './services/storageService';
import { onAuthChanged, logoutUser, testFirestoreConnection } from './services/firebase';
import { analyzeCareerAPI, generateRoadmapAPI, checkServerHealth } from './services/apiService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { AnalysisPage } from './components/AnalysisPage';
import { RoadmapPage } from './components/RoadmapPage';
import { SavedReportsPage } from './components/SavedReportsPage';
import { ProfilePage } from './components/ProfilePage';
import { Compass, Loader2 } from 'lucide-react';

const defaultInitialProfile: CareerProfileInput = {
  education: "Bachelor's Degree",
  degreeBranch: "Computer Science & Engineering",
  graduationYear: "2026",
  technicalSkills: ["React", "JavaScript", "HTML/CSS", "Git", "REST APIs", "Node.js (Basics)"],
  programmingLanguages: ["JavaScript", "Python", "TypeScript", "C++"],
  areasOfInterest: ["Full Stack Web Dev", "Artificial Intelligence", "Cloud Computing"],
  careerGoal: "Full-Stack AI Application Engineer",
  experienceLevel: "Intermediate",
  preferredWorkType: "Hybrid",
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [analyses, setAnalyses] = useState<CareerAnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<CareerAnalysisResult | null>(null);
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [profileDraft, setProfileDraft] = useState<CareerProfileInput>(defaultInitialProfile);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // 1. Firebase Authentication & Firestore Loader
  useEffect(() => {
    const unsubscribe = onAuthChanged(async (authenticatedUser) => {
      setUser(authenticatedUser);
      
      if (authenticatedUser) {
        try {
          // Load real production data from Cloud Firestore collections (users, careerAnalyses, roadmaps)
          const firestoreData = await loadUserDataFromFirestore(authenticatedUser.uid);
          
          setAnalyses(firestoreData.analyses);
          setCurrentAnalysis(firestoreData.currentAnalysis);
          setRoadmap(firestoreData.roadmap);
          
          if (firestoreData.currentAnalysis?.inputProfile) {
            setProfileDraft(firestoreData.currentAnalysis.inputProfile);
          }

          if (firestoreData.profile) {
            setUser({
              ...authenticatedUser,
              name: firestoreData.profile.name || authenticatedUser.name,
              institution: firestoreData.profile.institution,
            });
          }
        } catch (err) {
          console.error('Error fetching Firestore documents:', err);
        }

        // If on landing or login page, navigate to dashboard
        setCurrentPage((prev) => (prev === 'landing' || prev === 'login' ? 'dashboard' : prev));
      } else {
        // User logged out - clean state
        setAnalyses([]);
        setCurrentAnalysis(null);
        setRoadmap(null);
      }
      setIsAuthLoading(false);
    });

    testFirestoreConnection();
    checkServerHealth();
    return () => unsubscribe();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Route protection
  const handleNavigate = (page: PageView) => {
    const protectedPages: PageView[] = ['dashboard', 'analysis', 'roadmap', 'reports', 'profile'];
    if (protectedPages.includes(page) && !user) {
      setCurrentPage('login');
      showToast('Please sign in with Google to access this feature', 'info');
      return;
    }
    setCurrentPage(page);
  };

  const handleLoginSuccess = async (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthLoading(true);
    try {
      const data = await loadUserDataFromFirestore(loggedInUser.uid);
      setAnalyses(data.analyses);
      setCurrentAnalysis(data.currentAnalysis);
      setRoadmap(data.roadmap);
      if (data.currentAnalysis?.inputProfile) {
        setProfileDraft(data.currentAnalysis.inputProfile);
      }
      showToast(`Welcome back, ${loggedInUser.name}!`);
    } catch (e) {
      console.error('Firestore user load error', e);
    } finally {
      setIsAuthLoading(false);
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setAnalyses([]);
      setCurrentAnalysis(null);
      setRoadmap(null);
      showToast('Signed out successfully', 'info');
      setCurrentPage('landing');
    } catch (err) {
      console.error('Logout error:', err);
      showToast('Failed to sign out', 'error');
    }
  };

  const handleUpdateUser = async (updated: UserProfile) => {
    setUser(updated);
    if (user?.uid) {
      try {
        await updateUserProfileData(user.uid, updated);
        showToast('Profile updated in Cloud Firestore');
      } catch (err) {
        console.error('Failed to update profile:', err);
        showToast('Failed to save profile changes', 'error');
      }
    }
  };

  const handleRunAnalysis = async (profile: CareerProfileInput): Promise<CareerAnalysisResult> => {
    if (!user) {
      handleNavigate('login');
      throw new Error('Authentication required');
    }
    setIsLoading(true);
    try {
      setProfileDraft(profile);
      const result = await analyzeCareerAPI(profile);
      
      // Save directly to Cloud Firestore `careerAnalyses/{analysisId}`
      await saveAnalysisResultToFirestore(user.uid, result);
      
      setCurrentAnalysis(result);
      setAnalyses(prev => [result, ...prev.filter(a => a.id !== result.id)]);
      showToast('Career analysis saved to Cloud Firestore!');
      return result;
    } catch (err: any) {
      console.error('Analysis error:', err);
      showToast(err.message || 'Failed to complete analysis', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDay = async (dayNumber: number) => {
    if (!user || !roadmap) return;
    try {
      const updated = await toggleRoadmapTaskInFirestore(user.uid, roadmap, dayNumber);
      setRoadmap(updated);
    } catch (err) {
      console.error('Failed to toggle roadmap day:', err);
      showToast('Failed to update task completion', 'error');
    }
  };

  const handleRegenerateRoadmap = async (
    profile: CareerProfileInput, 
    targetRole?: string
  ): Promise<LearningRoadmap> => {
    if (!user) {
      handleNavigate('login');
      throw new Error('Authentication required');
    }
    setIsLoading(true);
    try {
      const generated = await generateRoadmapAPI(profile, targetRole);
      
      // Save directly to Cloud Firestore `roadmaps/{uid}`
      await saveRoadmapToFirestore(user.uid, generated);
      
      setRoadmap(generated);
      showToast('30-day roadmap saved to Cloud Firestore!');
      return generated;
    } catch (err: any) {
      console.error('Roadmap generation error:', err);
      showToast(err.message || 'Failed to generate roadmap', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnalysis = (analysis: CareerAnalysisResult) => {
    setCurrentAnalysis(analysis);
    showToast(`Loaded report for ${analysis.topCareerRecommendations?.[0]?.roleTitle || 'Selected Role'}`);
  };

  const handleDeleteAnalysis = async (id: string) => {
    if (!user) return;
    try {
      await deleteAnalysisResultFromFirestore(user.uid, id);
      const remaining = analyses.filter(a => a.id !== id);
      setAnalyses(remaining);
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(remaining.length > 0 ? remaining[0] : null);
      }
      showToast('Report deleted from Cloud Firestore', 'info');
    } catch (err) {
      console.error('Failed to delete report:', err);
      showToast('Failed to delete report', 'error');
    }
  };

  const handleNavigateToRoadmap = async (targetRole?: string) => {
    if (!user) {
      handleNavigate('login');
      return;
    }
    if (targetRole && (!roadmap || roadmap.targetRole !== targetRole)) {
      try {
        await handleRegenerateRoadmap(currentAnalysis?.inputProfile || profileDraft, targetRole);
      } catch (e) {
        console.error(e);
      }
    }
    setCurrentPage('roadmap');
  };

  // Initial Auth Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-pulse">
          <Compass className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Connecting to Cloud Firestore & Auth...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border ${
            notification.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : notification.type === 'info'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              notification.type === 'error' ? 'bg-rose-400' : notification.type === 'info' ? 'bg-indigo-400' : 'bg-emerald-400'
            }`} />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Protected Page Router */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onQuickDemo={() => handleNavigate('login')}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'dashboard' && user && (
          <DashboardPage
            user={user}
            currentAnalysis={currentAnalysis}
            analyses={analyses}
            roadmap={roadmap}
            onNavigate={handleNavigate}
            onSelectAnalysis={handleSelectAnalysis}
          />
        )}

        {currentPage === 'analysis' && user && (
          <AnalysisPage
            initialProfile={currentAnalysis?.inputProfile || profileDraft}
            latestResult={currentAnalysis}
            onRunAnalysis={handleRunAnalysis}
            onNavigateToRoadmap={handleNavigateToRoadmap}
            isLoading={isLoading}
          />
        )}

        {currentPage === 'roadmap' && user && (
          <RoadmapPage
            roadmap={roadmap}
            currentProfile={currentAnalysis?.inputProfile || profileDraft}
            onToggleDayCompleted={handleToggleDay}
            onRegenerateRoadmap={handleRegenerateRoadmap}
            isLoading={isLoading}
          />
        )}

        {currentPage === 'reports' && user && (
          <SavedReportsPage
            analyses={analyses}
            currentAnalysisId={currentAnalysis?.id}
            onSelectAnalysis={(item) => {
              handleSelectAnalysis(item);
              setCurrentPage('analysis');
            }}
            onDeleteAnalysis={handleDeleteAnalysis}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'profile' && user && (
          <ProfilePage
            user={user}
            analyses={analyses}
            roadmap={roadmap}
            onUpdateUser={handleUpdateUser}
            onNavigate={handleNavigate}
          />
        )}

        {/* Fallback to login for any unauthenticated attempt on protected routes */}
        {!user && currentPage !== 'landing' && currentPage !== 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
