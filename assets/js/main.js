import {
  collection,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 📡 Live Period Tracker
async function loadLivePeriods() {
  const sessionSnap = await getDoc(doc(window.db, "sessions", "current"));
  const session = sessionSnap.exists() ? sessionSnap.data().name : "2025";
  const now = new Date();
  const today = now.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = `${hour}:${minute < 10 ? "0" + minute : minute}`;

  const timetableSnap = await getDocs(collection(window.db, "timetables"));
  const container = document.getElementById("live-periods");
  container.innerHTML = "";

  timetableSnap.forEach(docSnap => {
    const className = docSnap.id;
    const data = docSnap.data();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const periods = data.days?.[day] || [];

    const currentPeriod = periods.find((_, i) => {
      // Customize this logic based on your period timing
      const startHour = 8 + i; // Example: 1st period starts at 8am
      return hour === startHour;
    });

    const li = document.createElement("li");
    li.className = "p-2 bg-white rounded shadow";
    li.innerHTML = `<strong>${className}</strong><br/>${currentPeriod?.subject || "—"} by ${currentPeriod?.teacher || "—"}`;
    container.appendChild(li);
  });
}

// 📊 Attendance Summary
async function loadAttendanceSummary() {
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const snap = await getDocs(collection(window.db, `attendance/${today}`));
  const totals = { present: 0, absent: 0, leave: 0, sick: 0, other: 0 };

  snap.forEach(docSnap => {
    const data = docSnap.data();
    for (const key in totals) {
      totals[key] += data[key] || 0;
    }
  });

  const container = document.getElementById("attendance-summary");
  container.innerHTML = Object.entries(totals).map(([key, value]) =>
    `<div class="p-2 bg-white rounded shadow"><strong>${key}</strong><br/>${value}</div>`
  ).join("");
}

// 🏅 Student of the Month
async function loadStudentOfMonth() {
  const snap = await getDoc(doc(window.db, "config", "studentOfMonth"));
  if (!snap.exists()) return;
  const data = snap.data();
  document.getElementById("student-name").textContent = data.name;
  document.getElementById("student-photo").src = data.photo;
  document.getElementById("student-reason").textContent = data.reason || "";
}

// 📰 News & Announcements
async function loadNews() {
  const snap = await getDoc(doc(window.db, "config", "news"));
  const list = snap.exists() ? snap.data().items : [];
  const container = document.getElementById("news-list");
  container.innerHTML = list.map(item => `<li>${item}</li>`).join("");
}

// 🔄 Init
loadLivePeriods();
loadAttendanceSummary();
loadStudentOfMonth();
loadNews();
