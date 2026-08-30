import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  query,
  where,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, CareerAnalysisResult, LearningRoadmap, CareerProfileInput } from '../types';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Operation Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validate Firestore connection
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    if (!auth.currentUser) return true;
    await getDocFromServer(doc(db, 'users', auth.currentUser.uid));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline or connecting.');
    }
    return false;
  }
}

/**
 * Perform Google Sign-In using Firebase Auth
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;

  const userProfile: UserProfile = {
    uid: fbUser.uid,
    name: fbUser.displayName || 'Student Scholar',
    email: fbUser.email || '',
    avatarUrl: fbUser.photoURL || undefined,
    institution: undefined,
    isDemoUser: false,
  };

  // Sync / create user profile document in Firestore `users/{userId}`
  const userPath = `users/${fbUser.uid}`;
  try {
    const userRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      userProfile.institution = data.institution || userProfile.institution;
      if (data.name) userProfile.name = data.name;
      
      // Update last active
      await setDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
    } else {
      await setDoc(userRef, {
        uid: userProfile.uid,
        name: userProfile.name,
        email: userProfile.email,
        avatarUrl: userProfile.avatarUrl || null,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }

  return userProfile;
}

/**
 * Sign out current authenticated user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Listen to Firebase Auth state changes
 */
export function onAuthChanged(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      const userProfile: UserProfile = {
        uid: fbUser.uid,
        name: fbUser.displayName || 'Student Scholar',
        email: fbUser.email || '',
        avatarUrl: fbUser.photoURL || undefined,
        isDemoUser: false,
      };

      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.institution) userProfile.institution = data.institution;
          if (data.name) userProfile.name = data.name;
        }
      } catch (err) {
        console.warn('Firestore profile fetch fallback:', err);
      }

      callback(userProfile);
    } else {
      callback(null);
    }
  });
}

/**
 * 1. User Profile Management in Firestore `users/{userId}`
 */
export async function fetchUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  const userPath = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }
}

export async function saveUserProfileToFirestore(uid: string, profile: Partial<UserProfile>): Promise<void> {
  const userPath = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...profile,
      uid,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

/**
 * 2. Career Analyses Collection in Firestore `careerAnalyses/{analysisId}`
 */
export async function fetchUserAnalysesFromFirestore(uid: string): Promise<CareerAnalysisResult[]> {
  const analysesPath = 'careerAnalyses';
  try {
    const analysesRef = collection(db, 'careerAnalyses');
    const q = query(
      analysesRef, 
      where('userId', '==', uid),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    const results: CareerAnalysisResult[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      results.push({
        ...data,
        id: d.id,
      } as CareerAnalysisResult);
    });
    return results;
  } catch (error) {
    // If order-by index is creating or indexing, fallback to filtering client-side
    try {
      const analysesRef = collection(db, 'careerAnalyses');
      const q = query(analysesRef, where('userId', '==', uid));
      const snapshot = await getDocs(q);
      const results: CareerAnalysisResult[] = [];
      snapshot.forEach((d) => {
        results.push({ ...d.data(), id: d.id } as CareerAnalysisResult);
      });
      return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (fallbackError) {
      handleFirestoreError(fallbackError, OperationType.LIST, analysesPath);
    }
  }
}

export async function saveUserAnalysisToFirestore(uid: string, analysis: CareerAnalysisResult): Promise<void> {
  const docPath = `careerAnalyses/${analysis.id}`;
  try {
    const analysisRef = doc(db, 'careerAnalyses', analysis.id);
    const payload = {
      ...analysis,
      userId: uid,
      createdAt: analysis.timestamp || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(analysisRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteUserAnalysisFromFirestore(uid: string, analysisId: string): Promise<void> {
  const docPath = `careerAnalyses/${analysisId}`;
  try {
    const analysisRef = doc(db, 'careerAnalyses', analysisId);
    await deleteDoc(analysisRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * 3. Roadmaps Collection in Firestore `roadmaps/{roadmapId}`
 */
export async function fetchUserRoadmapFromFirestore(uid: string): Promise<LearningRoadmap | null> {
  const docPath = `roadmaps/${uid}`;
  try {
    const roadmapRef = doc(db, 'roadmaps', uid);
    const snap = await getDoc(roadmapRef);
    if (snap.exists()) {
      return snap.data() as LearningRoadmap;
    }

    // Secondary check for documents in `roadmaps` with `userId == uid`
    const roadmapsRef = collection(db, 'roadmaps');
    const q = query(roadmapsRef, where('userId', '==', uid));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as LearningRoadmap;
    }

    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

export async function saveUserRoadmapToFirestore(uid: string, roadmap: LearningRoadmap): Promise<void> {
  const docPath = `roadmaps/${uid}`;
  try {
    const roadmapRef = doc(db, 'roadmaps', uid);
    const payload = {
      ...roadmap,
      userId: uid,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(roadmapRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}
