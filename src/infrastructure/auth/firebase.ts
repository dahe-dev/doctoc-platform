import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signUp = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  
  return userCredential.user;
};

export const savePatientIdToAuth = async (patientId: string): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    const currentDisplayName = user.displayName || '';
    const newDisplayName = `${currentDisplayName}|pid:${patientId}`;
    await updateProfile(user, { displayName: newDisplayName });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('patient_id', patientId);
    }
  }
};

export const getPatientIdFromAuth = (): string | null => {
  const user = auth.currentUser;
  if (user?.displayName) {
    const match = user.displayName.match(/\|pid:([^|]+)/);
    if (match) {
      const patientId = match[1];
      if (typeof window !== 'undefined') {
        localStorage.setItem('patient_id', patientId);
      }
      return patientId;
    }
  }
  
  if (typeof window !== 'undefined') {
    return localStorage.getItem('patient_id');
  }
  
  return null;
};

export const getCleanDisplayName = (): string | null => {
  const user = auth.currentUser;
  if (user?.displayName) {
    const cleanName = user.displayName.split('|pid:')[0];
    return cleanName || user.displayName;
  }
  return null;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; max-age=0';
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      document.cookie = `auth_token=${token}; path=/; max-age=3600; SameSite=Lax`;
    }
    return token;
  }
  return null;
};

export const saveUserPatientId = async (uid: string, patientId: string): Promise<void> => {
  await setDoc(doc(db, 'users', uid), {
    patientId,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const getUserPatientId = async (uid: string): Promise<string | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data()?.patientId || null;
  }
  return null;
};

export { auth, db };