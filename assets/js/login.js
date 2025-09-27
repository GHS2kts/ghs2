import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config (same as firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyBK5n_xfpyPpXB8YOa5_fs53ciLpRoC5lI",
  authDomain: "ghs-dashboard.firebaseapp.com",
  projectId: "ghs-dashboard",
  storageBucket: "ghs-dashboard.firebasestorage.app",
  messagingSenderId: "692567259749",
  appId: "1:692567259749:web:4ef59b0ad8ba554d9de48c",
  measurementId: "G-P5DP6W67DH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔐 Login Handler
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('roleSelect').value;
  const errorMsg = document.getElementById('errorMsg');

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // 🔀 Role-based redirection
    if (role === 'admin') window.location.href = 'admin.html';
    else if (role === 'teacher') window.location.href = 'teacher-portal.html';
    else if (role === 'display') window.location.href = 'display.html';
  } catch (error) {
    errorMsg.textContent = "Login failed. Please check your credentials.";
  }
});
