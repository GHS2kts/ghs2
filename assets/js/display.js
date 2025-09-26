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
setInterval(rotateSlides, 6000);
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
  container.innerHTML = `<h2 class="text-2xl font-bold mb-4">👨‍🏫 Teachers Present Now</h2>
    <p class="text-lg">${[...teachers].join(", ") || "—"}</p>`;
}

// 📊 Attendance Chart
async function loadAttendanceChart() {
  const today = new Date().toLocaleDateString("en-CA");
  const snap = await getDocs(collection(window.db, `attendance/${today}`));
  const totals = { present: 0, absent: 0, leave: 0, sick: 0, other: 0 };
  snap.forEach(docSnap => {
    const data = docSnap.data();
    for (const key in totals) totals[key] += data[key] || 0;
  });

  const ctx = document.getElementById("attendance-chart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(totals),
      datasets: [{
        data: Object.values(totals),
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#6b7280"]
      }]
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "📊 Attendance Summary Today" }
      }
    }
  });
}

// 🏅 Student of the Month
async function loadStudentOfMonth() {
  const snap = await getDoc(doc(window.db, "config", "studentOfMonth"));
  if (!snap.exists()) return;
  const data = snap.data();
  const container = document.getElementById("slide-student");
  container.innerHTML = `<h2 class="text-2xl font-bold mb-4">🏅 Student of the Month</h2>
    <img src="${data.photo}" />
    <h3 class="text-xl mt-2">${data.name}</h3>
    <p class="mt-1">${data.reason || ""}</p>`;
}

// 📰 News Ticker
async function loadNews() {
  const snap = await getDoc(doc(window.db, "config", "news"));
  const list = snap.exists() ? snap.data().items : [];
  const container = document.getElementById("slide-news");
  container.innerHTML = `<h2 class="text-2xl font-bold mb-4">📰 News & Announcements</h2>
    <ul class="space-y-2">${list.map(item => `<li>${item}</li>`).join("")}</ul>`;
}

loadTeachersPresent();
loadAttendanceChart();
loadStudentOfMonth();
loadNews();
