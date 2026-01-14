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

  // Store or update user details in Firestore
  const storeUserDetails = async (user) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (!userDoc.exists()) {
        // New user - create full profile
        await setDoc(userRef, {
          ...userData,
          name: user.displayName || user.email.split('@')[0],
          phone: user.phoneNumber || '',
          role: 'User',
          status: 'Active',
          joinDate: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp()
        });
        console.log('✅ New user profile created:', user.email);
      } else {
        // Existing user - update last login
        await setDoc(userRef, userData, { merge: true });
        console.log('✅ User login updated:', user.email);
      }
    } catch (error) {
      console.error('❌ Error storing user details:', error);
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