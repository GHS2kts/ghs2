import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Load teacher names
const teacherSelect = document.getElementById("teacher-select");
const grid = document.getElementById("timetable-grid");

async function loadTeachers() {
  const snap = await getDoc(doc(window.db, "config", "teachers"));
  const list = snap.exists() ? snap.data().list : [];
  teacherSelect.innerHTML = list.map(name => `<option value="${name}">${name}</option>`).join("");
}

// Load timetable
document.getElementById("load-timetable").addEventListener("click", async () => {
  const name = teacherSelect.value;
  if (!name) return alert("Select a teacher");
  const snap = await getDoc(doc(window.db, "teacherTimetables", name));
  if (!snap.exists()) return alert("No timetable found");
  const data = snap.data().days || {};
  renderGrid(data);
});

function renderGrid(days) {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let html = `<table border="1" class="w-full text-center"><thead><tr><th>Day</th>`;
  for (let i = 1; i <= 8; i++) html += `<th>Period ${i}</th>`;
  html += `</tr></thead><tbody>`;

  weekdays.forEach(day => {
    html += `<tr><td>${day}</td>`;
    const periods = days[day] || [];
    for (let i = 0; i < 8; i++) {
      const p = periods[i];
      html += `<td>${p ? `${p.subject}<br/>(${p.class})` : "—"}</td>`;
    }
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  grid.innerHTML = html;
}

loadTeachers();
