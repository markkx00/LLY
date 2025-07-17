// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
// IMPORTANT: Replace these with your actual Firebase project credentials
const firebaseConfig = {
   apiKey: "AIzaSyA0EMhp-HHrZ_XwSKsWnjX560rCYP3uMFI",
   authDomain: "stats-6de27.firebaseapp.com",
   projectId: "stats-6de27",
   storageBucket: "stats-6de27.firebasestorage.app",
   messagingSenderId: "750972948448",
   appId: "1:750972948448:web:be40a8b5cefbb631976585",
   measurementId: "G-LGYZ719V73"
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Fallback: Create mock objects for development
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { app, auth, db, storage };

// Common Firebase error patterns and solutions:
/*
1. "Firebase: Error (auth/invalid-api-key)" 
   Solution: Check your API key in firebaseConfig

2. "Firebase: Error (auth/network-request-failed)"
   Solution: Check internet connection and Firebase project status

3. "Firebase: Error (auth/user-not-found)"
   Solution: User doesn't exist in Firebase Auth

4. "Firebase: Error (auth/wrong-password)"
   Solution: Incorrect password for existing user

5. "Firebase: Error (permission-denied)"
   Solution: Check Firestore security rules
*/ 