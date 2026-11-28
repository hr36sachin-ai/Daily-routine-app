import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoxZ34Ryf7udbFZ9GCtjlJ-3qnRDnLZ9Q",
  authDomain: "daily-routine-app-ff74e.firebaseapp.com",
  projectId: "daily-routine-app-ff74e",
  storageBucket: "daily-routine-app-ff74e.firebasestorage.app",
  messagingSenderId: "641699207181",
  appId: "1:641699207181:web:1eb699810ad82024169d44",
  measurementId: "G-R9F9GPX3DT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);