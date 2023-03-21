import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyAT9x_0nBk0_XXN7-A_o6T0YGCLdKwDxmc",
  authDomain: "chatsocketio-digicard.firebaseapp.com",
  databaseURL: "https://chatsocketio-digicard-default-rtdb.firebaseio.com",
  projectId: "chatsocketio-digicard",
  storageBucket: "chatsocketio-digicard.appspot.com",
  messagingSenderId: "724302083098",
  appId: "1:724302083098:web:b7a603b665c9fd7cb74da3",
  measurementId: "G-Q6BPEYDXN7",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
const FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
const GithubAuthProvider = firebase.auth.GithubAuthProvider;
const database = firebase.database(); // instancia de Realtime Database

export {
  db,
  auth,
  storage,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  database
};
