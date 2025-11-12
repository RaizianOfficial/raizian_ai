import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLhiNwNOQBAoH-Mtq75vdIoiVYYx2iyxQ",
  authDomain: "raizian-ai.firebaseapp.com",
  projectId: "raizian-ai",
  storageBucket: "raizian-ai.firebasestorage.app",
  messagingSenderId: "1002133928631",
  appId: "1:1002133928631:web:d704d8911d8930b7cceb32",
  measurementId: "G-EWS7GN3T7D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
