import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Test Firebase connection and permissions
export const testFirebaseConnection = async () => {
  console.log('🧪 Testing Firebase connection...');
  
  try {
    // Test 1: Check if user is authenticated
    console.log('👤 Current user:', auth.currentUser?.email || 'Not authenticated');
    
    // Test 2: Try to read from a test collection
    console.log('📖 Testing read permissions...');
    const testRef = collection(db, 'test');
    const snapshot = await getDocs(testRef);
    console.log('✅ Read test passed. Documents found:', snapshot.size);
    
    // Test 3: Try to write to a test collection
    console.log('✍️ Testing write permissions...');
    const docRef = await addDoc(testRef, {
      message: 'Test document',
      timestamp: serverTimestamp(),
      user: auth.currentUser?.email || 'anonymous'
    });
    console.log('✅ Write test passed. Document ID:', docRef.id);
    
    // Test 4: Test stores collection specifically
    console.log('🏪 Testing stores collection...');
    const storesRef = collection(db, 'stores');
    const storesSnapshot = await getDocs(storesRef);
    console.log('✅ Stores collection accessible. Documents:', storesSnapshot.size);
    
    // Test 5: Test users collection specifically
    console.log('👥 Testing users collection...');
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    console.log('✅ Users collection accessible. Documents:', usersSnapshot.size);
    
    console.log('🎉 All Firebase tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide specific guidance based on error
    if (error.code === 'permission-denied') {
      console.error('🔒 PERMISSION DENIED - Possible solutions:');
      console.error('1. Check Firestore Security Rules');
      console.error('2. Make sure user is authenticated');
      console.error('3. Verify user has proper permissions');
    } else if (error.code === 'unavailable') {
      console.error('🌐 SERVICE UNAVAILABLE - Possible solutions:');
      console.error('1. Check internet connection');
      console.error('2. Verify Firebase project is active');
      console.error('3. Try again later');
    } else if (error.code === 'not-found') {
      console.error('🔍 NOT FOUND - Possible solutions:');
      console.error('1. Check Firebase project ID');
      console.error('2. Verify collection names are correct');
    }
    
    return false;
  }
};

// Test function that can be called from browser console
window.testFirebaseConnection = testFirebaseConnection;