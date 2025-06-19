// js/firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { 
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCb0JvLK74KgaZidcDuXXN8VqLn2DmMdSo",
  authDomain: "ori-lab.firebaseapp.com",
  projectId: "ori-lab",
  storageBucket: "ori-lab.appspot.com",
  messagingSenderId: "824707349314",
  appId: "1:824707349314:web:16d7f20d7cd7f65f4166db",
  measurementId: "G-KBJF3H839B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication Functions
export async function login(event) {
  if (event) event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Login Failed: " + error.message);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is signed in");

  try {
    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
}

// Firestore Functions
export async function createLabRequest(requestData) {
  try {
    const docRef = await addDoc(collection(db, "labRequests"), requestData);
    localStorage.setItem("currentRequestId", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating lab request:", error);
    throw error;
  }
}

// ... (keep all other Firestore functions the same)

export { 
  auth, 
  db,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where
};