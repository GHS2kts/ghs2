import {
  collection,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔄 Slide Rotation
let current = 0;
const slides = document.querySelectorAll(".slide");
function rotateSlides() {
  slides.forEach(s => s.classList.remove("active"));
  slides[current].classList.add("active");
  current = (current + 1) % slides.length;
}
setInterval(rotateSlides, 5000);
rotateSlides();

// 👨‍🏫 Teachers Present Now
async function loadTeachersPresent() {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const hour = now.getHours();
  const snap = await getDocs(collection(window.db, "timetables"));
  const teachers = new Set();

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const periods = data.days?.[day] || [];
    const currentPeriod = periods.find((_, i) => hour === 8 + i);
    if (currentPeriod?.teacher) teachers.add(currentPeriod.teacher);
  });

  const container = document.getElementById("slide-teachers");
  container.innerHTML = `<h2>👨‍🏫 Teachers Present Now</h2><p>${[...teachers].join(", ") || "—"}</p>`;
}

// 📊 Attendance Summary
async function loadAttendanceSummary() {
  const today = new Date().toLocaleDateString("en-CA");
  const snap = await getDocs(collection(window.db, `attendance/${today}`));
  const totals = { present: 0, absent: 0, leave: 0, sick: 0, other: 0 };
  snap.forEach(docSnap => {
    const data = docSnap.data();
    for (const key in totals) totals[key] += data[key] || 0;
  });

  const container = document.getElementById("slide-attendance");
  container.innerHTML = `<h2>📊 Attendance Summary</h2>` +
    Object.entries(totals).map(([k, v]) => `<p>${k}: ${v}</p>`).join("");
}

// 🏅 Student of the Month
async function loadStudentOfMonth() {
  const snap = await getDoc(doc(window.db, "config", "studentOfMonth"));
  if (!snap.exists()) return;
  const data = snap.data();
  const container = document.getElementById("slide-student");
  container.innerHTML = `<h2>🏅 Student of the Month</h2>
    <img src="${data.photo}" />
    <h3>${data.name}</h3>
    <p>${data.reason || ""}</p>`;
}

// 📰 News
async function loadNews() {
  const snap = await getDoc(doc(window.db, "config", "news"));
  const list = snap.exists() ? snap.data().items : [];
  const container = document.getElementById("slide-news");
  container.innerHTML = `<h2>📰 News & Announcements</h2><ul>` +
    list.map(item => `<li>${item}</li>`).join("") + `</ul>`;
}

loadTeachersPresent();
loadAttendanceSummary();
loadStudentOfMonth();
loadNews();
