// js/firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  createUserWithEmailAndPassword,
  deleteUser
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
  where,
  deleteDoc,
  setDoc,
  onSnapshot,
  runTransaction
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb0JvLK74KgaZidcDuXXN8VqLn2DmMdSo",
  authDomain: "ori-lab.firebaseapp.com",
  projectId: "ori-lab",
  storageBucket: "ori-lab.appspot.com",
  messagingSenderId: "824707349314",
  appId: "1:824707349314:web:16d7f20d7cd7f65f4166db",
  measurementId: "G-KBJF3H839B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication Functions
const login = async (event) => {
  if (event) event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userRole = userDoc.exists() ? userDoc.data().role : 'technician';
    
    // Redirect based on role
    if (userRole === 'admin') {
      window.location.href = "admin.html";
    } else {
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    alert(`Login Failed: ${error.message}`);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently signed in.");

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Firestore Functions
const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

const updateData = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

const getData = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (!docSnap.exists()) throw new Error("Document not found");
    return docSnap.data();
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

const getAllData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

const queryData = async (collectionName, field, operator, value) => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error querying documents:", error);
    throw error;
  }
};

const deleteData = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Auth State Listener
const setupAuthListener = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Export everything
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
  where,
  deleteDoc,
  setDoc,
  onSnapshot,
  runTransaction,
  login,
  logout,
  changePassword,
  addData,
  updateData,
  getData,
  getAllData,
  queryData,
  deleteData,
  setupAuthListener,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
};