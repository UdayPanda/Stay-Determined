import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuUnlx3bvE91qulq1CVmNoTwDqLjMYG9o",
  authDomain: "stay-determined.firebaseapp.com",
  projectId: "stay-determined",
  storageBucket: "stay-determined.firebasestorage.app",
  messagingSenderId: "1057405241956",
  appId: "1:1057405241956:web:0efa8c7f15250fe3fa2d71"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);