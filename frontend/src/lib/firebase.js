// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuUnlx3bvE91qulq1CVmNoTwDqLjMYG9o",
  authDomain: "stay-determined.firebaseapp.com",
  projectId: "stay-determined",
  storageBucket: "stay-determined.firebasestorage.app",
  messagingSenderId: "1057405241956",
  appId: "1:1057405241956:web:0efa8c7f15250fe3fa2d71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);