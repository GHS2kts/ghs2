import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const classSelect = document.getElementById("class-select");
const grid = document.getElementById("timetable-grid");
let teacherList = [];

async function loadClassesAndTeachers() {
  const classSnap = await getDoc(doc(window.db, "config", "classes"));
  const teacherSnap = await getDoc(doc(window.db, "config", "teachers"));
  const classList = classSnap.exists() ? classSnap.data().list : [];
  teacherList = teacherSnap.exists() ? teacherSnap.data().list : [];

  classSelect.innerHTML = classList.map(c => `<option value="${c}">${c}</option>`).join("");
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
        <select class="teacher border p-1 w-full mt-1" data-day="${day}" data-period="${i}">
          ${teacherList.map(t => `<option value="${t}">${t}</option>`).join("")}
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
  const className = classSelect.value;
  if (!className) return alert("Select a class");

  const data = { days: {} };
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  weekdays.forEach(day => {
    const periods = day === "Friday" ? 5 : 8;
    const dayData = [];
    for (let i = 1; i <= periods; i++) {
      const subject = document.querySelector(`.subject[data-day="${day}"][data-period="${i}"]`).value.trim();
      const teacher = document.querySelector(`.teacher[data-day="${day}"][data-period="${i}"]`).value;
      dayData.push({ subject, teacher });
    }
    data.days[day] = dayData;
  });

  await setDoc(doc(window.db, "timetables", className), data);
  alert("Timetable saved!");
});

loadClassesAndTeachers();
