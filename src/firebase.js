import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_wUERgvmONHbydzo4PzbuKyLd4Ocmo1k",
  authDomain: "praba-7c10c.firebaseapp.com",
  projectId: "praba-7c10c",
  storageBucket: "praba-7c10c.firebasestorage.app",
  messagingSenderId: "841497281260",
  appId: "1:841497281260:web:69763d4d7596abd4d01bc9",
  measurementId: "G-DEYLXL9VT2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;