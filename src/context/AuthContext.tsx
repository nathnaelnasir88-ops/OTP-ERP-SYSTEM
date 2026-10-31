import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../services/firebase';
import { UserProfile, UserRole, Department } from '../types';
import { initialCurrentUser } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
    department: Department
  ) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemoUser: (profile: Partial<UserProfile>) => void;
  updateUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_PROFILE_KEY = 'OTP_ERP_USER_PROFILE';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    return saved ? JSON.parse(saved) : initialCurrentUser;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
            localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(data));
          } else {
            // Create user doc if not yet in Firestore
            const newProfile: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || 'OTP Team Member',
              role: 'Managing Director',
              department: 'Management',
              avatarUrl:
                firebaseUser.photoURL ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              status: 'Active',
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(userDocRef, newProfile);
            } catch (err) {
              console.warn('Could not write user profile to Firestore (using local):', err);
            }
            setUserProfile(newProfile);
            localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
          }
        } catch (err) {
          console.warn('Firestore fetch failed, using fallback profile:', err);
        }
      } else {
        // If no firebaseUser, retain existing session or default to demo user for exploration
        const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (!saved) {
          setUserProfile(initialCurrentUser);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  // 1. Google Sign-In with popup
  const loginWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const profile: UserProfile = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        fullName: firebaseUser.displayName || 'Agency Member',
        role: 'Managing Director',
        department: 'Management',
        avatarUrl:
          firebaseUser.photoURL ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), profile, { merge: true });
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }

      setUserProfile(profile);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      setAuthError(error.message || 'Failed to sign in with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 2. Email & Password Login
  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = result.user;

      try {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (snap.exists()) {
          const profile = snap.data() as UserProfile;
          setUserProfile(profile);
          localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
        }
      } catch (e) {
        console.warn('Firestore fetch failed:', e);
      }
    } catch (error: any) {
      console.error('Email Login Error:', error);
      setAuthError(error.message || 'Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 3. Email & Password Registration
  const registerWithEmail = async (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
    department: Department
  ) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = result.user;

      const profile: UserProfile = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        fullName: fullName || 'OTP Employee',
        role,
        department,
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }

      setUserProfile(profile);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (error: any) {
      console.error('Registration Error:', error);
      setAuthError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 4. Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    } finally {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
      setLoading(false);
    }
  };

  // 5. 1-Click Demo Login with agency profiles
  const loginAsDemoUser = (custom: Partial<UserProfile>) => {
    const profile: UserProfile = {
      ...initialCurrentUser,
      ...custom
    };
    setUserProfile(profile);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
  };

  // 6. Role Switcher for active session
  const updateUserRole = (role: UserRole) => {
    if (!userProfile) return;
    const updated = { ...userProfile, role };
    setUserProfile(updated);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authError,
        clearAuthError,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        loginAsDemoUser,
        updateUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
