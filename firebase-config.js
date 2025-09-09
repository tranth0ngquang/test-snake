// firebase-config.js - Firebase khởi tạo và cấu hình
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';

/**
 * Lấy environment variable từ nhiều nguồn
 * @param {string} key - Tên biến môi trường
 * @returns {string|null} Giá trị hoặc null nếu không tìm thấy
 */
function getEnvVar(key) {
  // 1. Production: Từ window.ENV (được GitHub Actions thay thế)
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    const value = window.ENV[key];
    // Kiểm tra không phải template placeholder
    if (!value.includes('{{') && !value.includes('}}')) {
      console.log(`✅ Found ${key} from production environment`);
      return value;
    } else {
      console.warn(`⚠️ ${key} still contains placeholder: ${value}`);
    }
  }
  
  // 2. Development: Từ localStorage hoặc fallback
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) {
      console.log(`✅ Found ${key} from localStorage`);
      return stored;
    }
  }
  
  console.error(`❌ Missing environment variable: ${key}`);
  return null;
}

// Tạo async function để load config
async function initializeFirebase() {
  try {
    // Firebase config từ environment variables
    const firebaseConfig = {
      apiKey: getEnvVar("VITE_FIREBASE_API_KEY"),
      authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN"),
      projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID"),
      storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET"),
      messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID"),
      appId: getEnvVar("VITE_FIREBASE_APP_ID")
    };

    console.log('🔍 Firebase Config Debug:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      hasStorageBucket: !!firebaseConfig.storageBucket,
      hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
      hasAppId: !!firebaseConfig.appId,
      environment: window.ENV ? 'production' : 'development'
    });

    // Kiểm tra xem có đủ config không
    const hasValidConfig = Object.values(firebaseConfig).every(value => value !== null && value !== undefined && value !== "");

    if (hasValidConfig) {
      // Khởi tạo Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      console.log('🔥 Firebase initialized successfully');
      console.log('🔑 Config loaded from:', window.ENV ? 'production env' : 'development env');
      return { app, db, hasFirebase: true };
    } else {
      console.warn('⚠️ Firebase config incomplete - running in offline mode');
      console.log('Missing config keys:', Object.entries(firebaseConfig)
        .filter(([key, value]) => !value)
        .map(([key]) => key)
      );
      return { app: null, db: null, hasFirebase: false };
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
    console.log('🎮 Game will run without leaderboard features');
    return { app: null, db: null, hasFirebase: false };
  }
}

// Initialize Firebase và export
const firebaseInit = await initializeFirebase();
export const { app, db, hasFirebase } = firebaseInit;
