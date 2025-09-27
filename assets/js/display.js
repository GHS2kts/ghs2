import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
window.db = db; // expose globally for reuse

function setAmbientBackground() {
  const hour = new Date().getHours();
  const bg = document.getElementById('ambient-bg');

  if (hour >= 6 && hour < 12) {
    bg.style.backgroundImage = "url('../assets/bg-morning.jpg')";
  } else if (hour >= 12 && hour < 18) {
    bg.style.backgroundImage = "url('../assets/bg-afternoon.jpg')";
  } else {
    bg.style.backgroundImage = "url('../assets/bg-evening.jpg')";
  }

  bg.style.transition = 'background-image 1s ease-in-out';
}

let lastPeriod = null;

async function updatePeriodLoop() {
  const ref = doc(db, 'config', 'periods');
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const schedule = snap.data().schedule;

  function checkPeriod() {
    const now = new Date();
    const current = `${now.getHours()}`.padStart(2, '0') + ":" + `${now.getMinutes()}`.padStart(2, '0');
    let currentPeriod = "Off Period";

    for (const p of schedule) {
      if (current >= p.start && current < p.end) {
        currentPeriod = p.name;
        break;
      }
    }

    if (currentPeriod !== lastPeriod) {
      lastPeriod = currentPeriod;
      const el = document.getElementById('currentPeriod');
      el.textContent = currentPeriod;
      el.classList.add('animate-flash');
      setTimeout(() => el.classList.remove('animate-flash'), 1000);
    }
  }

  checkPeriod();
  setInterval(checkPeriod, 60000);
}

document.addEventListener('DOMContentLoaded', () => {
  setAmbientBackground();
  updatePeriodLoop();
});
