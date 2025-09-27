import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc
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
async function loadTimetable() {
  const grid = document.getElementById('timetableGrid');
  const snapshot = await getDocs(collection(db, 'timetable'));
  let html = "";

  snapshot.forEach(doc => {
    const { day, period, subject } = doc.data();
    html += `<div class="bg-white/10 p-2 rounded">${day} · ${period}<br /><span class="font-semibold">${subject}</span></div>`;
  });

  grid.innerHTML = html;
}

async function populateDropdowns() {
  const classSelect = document.getElementById('classSelect');
  const sectionSelect = document.getElementById('sectionSelect');

  const classSnap = await getDocs(collection(db, 'classes'));
  classSnap.forEach(doc => {
    const { name } = doc.data();
    classSelect.innerHTML += `<option value="${name}">${name}</option>`;
  });

  const sectionSnap = await getDocs(collection(db, 'sections'));
  sectionSnap.forEach(doc => {
    const { name } = doc.data();
    sectionSelect.innerHTML += `<option value="${name}">${name}</option>`;
  });
}

document.getElementById('markAttendanceBtn').addEventListener('click', async () => {
  const className = document.getElementById('classSelect').value;
  const sectionName = document.getElementById('sectionSelect').value;
  const notes = document.getElementById('attendanceNotes').value.trim();
  const status = document.getElementById('attendanceStatus');

  await addDoc(collection(db, 'attendance'), {
    className,
    sectionName,
    notes,
    timestamp: Date.now()
  });

  status.textContent = "Attendance submitted successfully!";
});

document.getElementById('submitSpotlightBtn').addEventListener('click', async () => {
  const studentName = document.getElementById('studentName').value.trim();
  const achievement = document.getElementById('achievement').value.trim();
  const status = document.getElementById('spotlightStatus');

  if (!studentName || !achievement) {
    status.textContent = "Please enter both name and achievement.";
    return;
  }

  await addDoc(collection(db, 'spotlight'), {
    studentName,
    achievement,
    timestamp: Date.now()
  });

  status.textContent = "Spotlight submitted successfully!";
});

document.addEventListener('DOMContentLoaded', () => {
  loadTimetable();
  populateDropdowns();
});

