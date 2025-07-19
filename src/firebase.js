import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0M7f5gqr-PiWaXFM2HfJKJhlk99e-XMY",
  authDomain: "egeweb-23ff5.firebaseapp.com",
  projectId: "egeweb-23ff5",
  storageBucket: "egeweb-23ff5.firebasestorage.app",
  messagingSenderId: "543963070045",
  appId: "1:543963070045:web:eb155e1877292e0f5517b4",
  measurementId: "G-V5LSFE8MWN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Functions with error handling and region
let functions;
try {
  functions = getFunctions(app, 'us-central1'); // Specify the same region as your Firebase project
  console.log('Firebase Functions initialized successfully for region:', functions.region);
} catch (error) {
  console.error('Error initializing Firebase Functions:', error);
  // Create a mock functions object to prevent crashes in development
  functions = {
    region: 'us-central1',
    // Add a no-op function to prevent errors
    httpsCallable: () => () => Promise.resolve({ data: {} })
  };
}

// Admin email
const ADMIN_EMAIL = 'egeagritechpvtltd@gmail.com';

// Export everything
export {
  app as default,
  app,
  auth,
  db,
  storage,
  functions,
  ADMIN_EMAIL,
  signInWithEmailAndPassword,
  firebaseSignOut
};

// Also export as a single object for convenience
export const firebaseExports = {
  app,
  auth,
  db,
  storage,
  functions,
  ADMIN_EMAIL
};
