// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  // Tambahkan ini

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUOkfpDOqbWrWhYzx3_mZroTAn6RKgvoQ",
  authDomain: "onlineshopproject-7b59d.firebaseapp.com",
  projectId: "onlineshopproject-7b59d",
  storageBucket: "onlineshopproject-7b59d.appspot.com",
  messagingSenderId: "145838612639",
  appId: "1:145838612639:web:97e9ba766d58cd79d802aa",
  measurementId: "G-287MES0EG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);  // Tambahkan ini

export { app, analytics, auth };  // Ekspor auth
    