import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { UserProfile } from './types';

// NOTE: Replace these placeholders with your actual Firebase Config keys
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "mock_key",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "mock_project.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "mock_project",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "mock_project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save/Update user in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const userData: UserProfile = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp() as any
    };

    if (!userSnap.exists()) {
      // New user
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp()
      });
    } else {
      // Existing user update
      await setDoc(userRef, userData, { merge: true });
    }

    return user;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const recordVisitor = async () => {
  try {
    await addDoc(collection(db, "visitors"), {
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent
    });
  } catch (e) {
    console.error("Analytics error", e);
  }
};
