function setAmbientBackground() {
  const hour = new Date().getHours();
  const bg = document.getElementById('ambient-bg');

  if (hour >= 6 && hour < 12) {
    bg.style.backgroundImage = "url('assets/bg-morning.jpg')";
  } else if (hour >= 12 && hour < 18) {
    bg.style.backgroundImage = "url('assets/bg-afternoon.jpg')";
  } else {
    bg.style.backgroundImage = "url('assets/bg-evening.jpg')";
  }

  bg.style.transition = 'background-image 1s ease-in-out';
}

document.addEventListener('DOMContentLoaded', setAmbientBackground);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const db = getFirestore(app);

async function loadAnnouncement() {
  const ref = doc(db, 'config', 'announcement');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    document.getElementById('announcement').textContent = snap.data().message;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');

  if (role === 'admin') window.location.href = 'admin.html';
  else if (role === 'teacher') window.location.href = 'teacher-portal.html';
});

function launchConfettiIfSpecialDay() {
  const today = new Date().toISOString().slice(5, 10); // MM-DD
  const specialDays = ['09-27', '03-23', '08-14']; // Khurram’s launch, Pakistan Day, Independence Day

  if (specialDays.includes(today)) {
    // Trigger confetti (use canvas-confetti or CSS animation)
    console.log("🎉 Special day! Launching celebration.");
  }
}

document.addEventListener('DOMContentLoaded', launchConfettiIfSpecialDay);




document.addEventListener('DOMContentLoaded', loadAnnouncement);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log("✅ Service Worker registered"))
    .catch(err => console.error("❌ Service Worker failed", err));
}
