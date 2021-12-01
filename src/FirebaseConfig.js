import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseApp = initializeApp({
  apiKey: "Your API Key Here",
  authDomain: "Your AuthDomain Here",
  projectId: "Your Project Id here",
  storageBucket: "gs://fir-react-df53d.appspot.com",
});

export const db = getFirestore();

export const auth = getAuth();
