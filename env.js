// env.js - Production environment variables for GitHub Pages deployment
// File này sẽ được GitHub Actions thay thế với giá trị thực từ environment variables

window.ENV = {
  VITE_FIREBASE_API_KEY: "{{VITE_FIREBASE_API_KEY}}",
  VITE_FIREBASE_AUTH_DOMAIN: "{{VITE_FIREBASE_AUTH_DOMAIN}}",
  VITE_FIREBASE_PROJECT_ID: "{{VITE_FIREBASE_PROJECT_ID}}",
  VITE_FIREBASE_STORAGE_BUCKET: "{{VITE_FIREBASE_STORAGE_BUCKET}}",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "{{VITE_FIREBASE_MESSAGING_SENDER_ID}}",
  VITE_FIREBASE_APP_ID: "{{VITE_FIREBASE_APP_ID}}"
};

// Debug log cho development
const isProduction = window.ENV.VITE_FIREBASE_API_KEY !== "{{VITE_FIREBASE_API_KEY}}";
console.log('🔥 Environment variables status:', {
  mode: isProduction ? 'production' : 'development',
  hasApiKey: !!window.ENV.VITE_FIREBASE_API_KEY && window.ENV.VITE_FIREBASE_API_KEY !== "{{VITE_FIREBASE_API_KEY}}",
  hasAuthDomain: !!window.ENV.VITE_FIREBASE_AUTH_DOMAIN && window.ENV.VITE_FIREBASE_AUTH_DOMAIN !== "{{VITE_FIREBASE_AUTH_DOMAIN}}",
  hasProjectId: !!window.ENV.VITE_FIREBASE_PROJECT_ID && window.ENV.VITE_FIREBASE_PROJECT_ID !== "{{VITE_FIREBASE_PROJECT_ID}}",
  hasStorageBucket: !!window.ENV.VITE_FIREBASE_STORAGE_BUCKET && window.ENV.VITE_FIREBASE_STORAGE_BUCKET !== "{{VITE_FIREBASE_STORAGE_BUCKET}}",
  hasMessagingSenderId: !!window.ENV.VITE_FIREBASE_MESSAGING_SENDER_ID && window.ENV.VITE_FIREBASE_MESSAGING_SENDER_ID !== "{{VITE_FIREBASE_MESSAGING_SENDER_ID}}",
  hasAppId: !!window.ENV.VITE_FIREBASE_APP_ID && window.ENV.VITE_FIREBASE_APP_ID !== "{{VITE_FIREBASE_APP_ID}}"
});

if (!isProduction) {
  console.warn('⚠️ Running in development mode - env variables not replaced by GitHub Actions');
  console.log('💡 For local development, use dev-env-loader.js or set localStorage manually');
}
