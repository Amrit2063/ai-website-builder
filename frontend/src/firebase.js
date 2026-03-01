// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-ef9a5.firebaseapp.com",
  projectId: "genwebai-ef9a5",
  storageBucket: "genwebai-ef9a5.firebasestorage.app",
  messagingSenderId: "1059961600770",
  appId: "1:1059961600770:web:7af4343cbbdb668b3ca01b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };