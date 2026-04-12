import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2F3nLBub62VarUrZ33BN1EfNAaQGLh4M",
  authDomain: "rasoi-ghar-9729e.firebaseapp.com",
  projectId: "rasoi-ghar-9729e",
  storageBucket: "rasoi-ghar-9729e.firebasestorage.app",
  messagingSenderId: "341253759604",
  appId: "1:341253759604:web:d1d0eec5d5569c1325a721",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
