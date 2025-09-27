import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
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

async function drawAttendanceChart() {
  const snapshot = await getDocs(collection(db, 'attendance'));
  const dataByDate = {};

  snapshot.forEach(doc => {
    const { date, presentCount } = doc.data();
    dataByDate[date] = presentCount;
  });

  const labels = Object.keys(dataByDate);
  const values = Object.values(dataByDate);

  new Chart(document.getElementById('attendanceChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Present Students',
        data: values,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56,189,248,0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}
async function drawTeacherChart() {
  const snapshot = await getDocs(collection(db, 'teacher-logs'));
  const activity = {};

  snapshot.forEach(doc => {
    const { teacherName } = doc.data();
    activity[teacherName] = (activity[teacherName] || 0) + 1;
  });

  const labels = Object.keys(activity);
  const values = Object.values(activity);

  new Chart(document.getElementById('teacherChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Activity Count',
        data: values,
        backgroundColor: '#4ade80'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

async function drawClassChart() {
  const snapshot = await getDocs(collection(db, 'class-performance'));
  const labels = [];
  const values = [];

  snapshot.forEach(doc => {
    const { className, averageScore } = doc.data();
    labels.push(className);
    values.push(averageScore);
  });

  new Chart(document.getElementById('classChart'), {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: ['#f87171', '#facc15', '#34d399', '#60a5fa', '#a78bfa']
      }]
    },
    options: {
      responsive: true
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  drawAttendanceChart();
  drawTeacherChart();
  drawClassChart();
});

