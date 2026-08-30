import { CareerAnalysisResult, CareerProfileInput, LearningRoadmap, UserProfile } from '../types';
import { 
  fetchUserProfileFromFirestore,
  saveUserProfileToFirestore,
  fetchUserAnalysesFromFirestore, 
  saveUserAnalysisToFirestore, 
  deleteUserAnalysisFromFirestore, 
  fetchUserRoadmapFromFirestore, 
  saveUserRoadmapToFirestore,
} from './firebase';

export const sanitizeText = (text: string | undefined | null): string => {
  if (!text) return '';
  return text
    .replace(/\\n/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Load all user data from Cloud Firestore
 */
export async function loadUserDataFromFirestore(uid: string): Promise<{
  profile: UserProfile | null;
  analyses: CareerAnalysisResult[];
  currentAnalysis: CareerAnalysisResult | null;
  roadmap: LearningRoadmap | null;
}> {
  try {
    const [profile, analyses, roadmap] = await Promise.all([
      fetchUserProfileFromFirestore(uid).catch(() => null),
      fetchUserAnalysesFromFirestore(uid).catch(() => []),
      fetchUserRoadmapFromFirestore(uid).catch(() => null),
    ]);

    const currentAnalysis = analyses.length > 0 ? analyses[0] : null;

    return {
      profile,
      analyses,
      currentAnalysis,
      roadmap,
    };
  } catch (error) {
    console.error('Failed to load user data from Firestore:', error);
    return {
      profile: null,
      analyses: [],
      currentAnalysis: null,
      roadmap: null,
    };
  }
}

/**
 * Save user profile to Firestore
 */
export async function updateUserProfileData(uid: string, updates: Partial<UserProfile>): Promise<void> {
  await saveUserProfileToFirestore(uid, updates);
}

/**
 * Save a new career analysis result to Firestore
 */
export async function saveAnalysisResultToFirestore(uid: string, analysis: CareerAnalysisResult): Promise<void> {
  await saveUserAnalysisToFirestore(uid, analysis);
}

/**
 * Delete a career analysis result from Firestore
 */
export async function deleteAnalysisResultFromFirestore(uid: string, analysisId: string): Promise<void> {
  await deleteUserAnalysisFromFirestore(uid, analysisId);
}

/**
 * Save a roadmap to Firestore
 */
export async function saveRoadmapToFirestore(uid: string, roadmap: LearningRoadmap): Promise<void> {
  await saveUserRoadmapToFirestore(uid, roadmap);
}

/**
 * Toggle completed day task and persist to Firestore
 */
export async function toggleRoadmapTaskInFirestore(
  uid: string, 
  currentRoadmap: LearningRoadmap, 
  dayNumber: number
): Promise<LearningRoadmap> {
  const completedSet = new Set(currentRoadmap.completedDayNumbers || []);
  
  if (completedSet.has(dayNumber)) {
    completedSet.delete(dayNumber);
  } else {
    completedSet.add(dayNumber);
  }

  const completedList = Array.from(completedSet);
  const progressPercent = Math.round((completedList.length / 30) * 100);

  const updatedPhases = currentRoadmap.weeklyPhases.map(phase => ({
    ...phase,
    days: phase.days.map(d => ({
      ...d,
      completed: completedSet.has(d.day),
    })),
  }));

  const updatedRoadmap: LearningRoadmap = {
    ...currentRoadmap,
    completedDayNumbers: completedList,
    progressPercent,
    weeklyPhases: updatedPhases,
  };

  await saveUserRoadmapToFirestore(uid, updatedRoadmap);
  return updatedRoadmap;
}
