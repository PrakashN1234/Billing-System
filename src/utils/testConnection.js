import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to read from Firestore
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    
    console.log('✅ Firebase connection successful!');
    console.log(`Found ${snapshot.size} documents in test collection`);
    
    // Try to write to Firestore
    await addDoc(testCollection, {
      message: 'Connection test successful',
      timestamp: new Date()
    });
    
    console.log('✅ Firebase write operation successful!');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.error('Check your Firebase configuration and internet connection');
    return false;
  }
};

// Make it available globally for testing
window.testFirebaseConnection = testFirebaseConnection;