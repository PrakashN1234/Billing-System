import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    return signOut(auth);
  };

  // Store or update user details in Firestore (optimized)
  const storeUserDetails = async (user) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Only update essential fields to reduce write operations
      const userData = {
        uid: user.uid,
        email: user.email,
        lastLogin: serverTimestamp()
      };

      // Check if user exists first to avoid unnecessary reads
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // New user - create minimal profile
        await setDoc(userRef, {
          ...userData,
          displayName: user.displayName || user.email.split('@')[0],
          createdAt: serverTimestamp()
        });
        console.log('✅ New user profile created:', user.email);
      } else {
        // Existing user - just update last login
        await setDoc(userRef, userData, { merge: true });
      }
    } catch (error) {
      console.error('❌ Error storing user details:', error);
      // Don't throw error to prevent blocking login
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Store/update user details when they log in
      if (user) {
        await storeUserDetails(user);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};