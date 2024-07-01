// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
          getAuth,
          signInWithPopup,
          GoogleAuthProvider,
          onAuthStateChanged,
          User
         } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSYbluy2IXc4uhKzFWSsXa9bSTyMIo3E8",
  authDomain: "yt-clone-29849.firebaseapp.com",
  projectId: "yt-clone-29849",
  appId: "1:468781181806:web:c7509baed411610877af7f",
  measurementId: "G-X8LFWCX966"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)

/**
 * Signs the users in with a google popup.
 * @returns A promise that resolves with the user's credentials
 */
export function signInWithGoogle() {
   return signInWithPopup(auth, new GoogleAuthProvider())
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
  return auth.signOut()
}

/**
 * Trigger a callback when the user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}