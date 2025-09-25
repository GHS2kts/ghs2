import {
  doc,
  getDoc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const teacherSelect = document.getElementById('teacher-select');
const dashboard = document.getElementById('dashboard');
const teacherNameSpan = document.getElementById('teacher-name');
const timetableBody = document.querySelector('#teacher-timetable tbody');
const vacantBody = document.querySelector('#vacant-periods tbody');
const upcomingPeriod = document.getElementById('upcoming-period');

// 🔄 Load teacher list from Firebase
async function loadTeachers() {
  const ref = doc(window.db, "config", "teachers");
  const snap = await getDoc(ref);
  const list = snap.exists() ? snap.data().list : [];
  list.forEach(name => {
    const option = document.createElement('option');
    option.textContent = name;
    teacherSelect.appendChild(option);
  });
}
loadTeachers();

// 🧠 On teacher selection
teacherSelect.addEventListener('change', async () => {
  const selected = teacherSelect.value;
  teacherNameSpan.textContent = selected;
  dashboard.style.display = 'block';

  // 🗓️ Load all timetables
  const timetableSnap = await getDocs(collection(window.db, "timetables"));
  const teacherPeriods = [];

  timetableSnap.forEach(docSnap => {
    const className = docSnap.id;
    const data = docSnap.data();
    for (const day in data.days) {
      data.days[day].forEach((p, i) => {
        if (p.teacher === selected) {
          teacherPeriods.push({ day, period: i + 1, class: className, subject: p.subject });
        }
      });
    }
  });

  // Render timetable
  timetableBody.innerHTML = '';
  teacherPeriods.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.day}</td><td>${entry.period}</td><td>${entry.class}</td><td>${entry.subject}</td>`;
    timetableBody.appendChild(row);
  });

  // 🔔 Upcoming period
  const now = new Date();
  const hour = now.getHours();
  const period = Math.floor((hour - 8) / 1); // Assuming 8 AM start
  const today = now.toLocaleDateString('en-PK', { weekday: 'long' });

  const upcoming = teacherPeriods.find(e => e.day === today && e.period === period);
  upcomingPeriod.textContent = upcoming
    ? `Period ${upcoming.period} – ${upcoming.subject} in ${upcoming.class}`
    : 'No scheduled period right now.';

  // 📋 Vacant assignments
  const vacantSnap = await getDocs(collection(window.db, "vacantPeriods"));
  const assigned = vacantSnap.docs
    .map(d => d.data())
    .filter(v => v.assignedTeacher === selected);

  vacantBody.innerHTML = '';
  assigned.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.date}</td><td>${entry.className}</td><td>${entry.period}</td><td>${entry.absentTeacher}</td>`;
    vacantBody.appendChild(row);
  });
});
