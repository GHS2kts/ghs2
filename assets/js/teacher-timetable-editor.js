import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const teacherSelect = document.getElementById("teacher-select");
const grid = document.getElementById("timetable-grid");
let classList = [];

async function loadTeachersAndClasses() {
  const teacherSnap = await getDoc(doc(window.db, "config", "teachers"));
  const classSnap = await getDoc(doc(window.db, "config", "classes"));
  const teacherList = teacherSnap.exists() ? teacherSnap.data().list : [];
  classList = classSnap.exists() ? classSnap.data().list : [];

  teacherSelect.innerHTML = teacherList.map(t => `<option value="${t}">${t}</option>`).join("");
  renderGrid();
}

function renderGrid() {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let html = `<table class="table-auto border w-full text-sm"><thead><tr><th>Day</th>`;
  for (let i = 1; i <= 8; i++) html += `<th>Period ${i}</th>`;
  html += `</tr></thead><tbody>`;

  weekdays.forEach(day => {
    html += `<tr><td class="font-semibold">${day}</td>`;
    const periods = day === "Friday" ? 5 : 8;
    for (let i = 1; i <= periods; i++) {
      html += `<td>
        <input type="text" placeholder="Subject" class="subject border p-1 w-full" data-day="${day}" data-period="${i}" />
        <select class="class border p-1 w-full mt-1" data-day="${day}" data-period="${i}">
          ${classList.map(c => `<option value="${c}">${c}</option>`).join("")}
        </select>
      </td>`;
    }
    if (day === "Friday") html += `<td colspan="3" class="bg-gray-200"></td>`;
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  grid.innerHTML = html;
}

document.getElementById("save-timetable").addEventListener("click", async () => {
  const teacherName = teacherSelect.value;
  if (!teacherName) return alert("Select a teacher");

  const data = { days: {} };
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  weekdays.forEach(day => {
    const periods = day === "Friday" ? 5 : 8;
    const dayData = [];
    for (let i = 1; i <= periods; i++) {
      const subject = document.querySelector(`.subject[data-day="${day}"][data-period="${i}"]`).value.trim();
      const className = document.querySelector(`.class[data-day="${day}"][data-period="${i}"]`).value;
      dayData.push({ subject, class: className });
    }
    data.days[day] = dayData;
  });

  await setDoc(doc(window.db, "teacherTimetables", teacherName), data);
  alert("Timetable saved!");
});

loadTeachersAndClasses();
