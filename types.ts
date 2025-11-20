import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt?: Timestamp;
  lastLogin?: Timestamp;
}

export interface AuditData {
  id?: string;
  userId: string;
  username: string;
  bio: string;
  postsPerWeek: number;
  reelRatio: number;
  hasProfilePic: boolean;
  score: number;
  suggestions: string[];
  timestamp: any; // Firestore Timestamp
}

export interface VisitorData {
  timestamp: any;
  userAgent: string;
}

export const ADMIN_EMAIL = "admin@speedtech.com";