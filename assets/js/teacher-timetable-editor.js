import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const teacherSelect = document.getElementById("teacher-select");
const daySelect = document.getElementById("day-select");
const container = document.getElementById("periods-container");

let classList = [];

async function loadTeachersAndClasses() {
  const teacherSnap = await getDoc(doc(window.db, "config", "teachers"));
  const classSnap = await getDoc(doc(window.db, "config", "classes"));
  const teacherList = teacherSnap.exists() ? teacherSnap.data().list : [];
  classList = classSnap.exists() ? classSnap.data().list : [];

  teacherSelect.innerHTML = teacherList.map(t => `<option value="${t}">${t}</option>`).join("");
  renderPeriodInputs();
}

function renderPeriodInputs() {
  const day = daySelect.value;
  const periods = day === "Friday" ? 5 : 8;
  container.innerHTML = "";

  for (let i = 1; i <= periods; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>Period ${i}:</label>
      <input type="text" placeholder="Subject" id="subject-${i}" />
      <select id="class-${i}">
        ${classList.map(c => `<option value="${c}">${c}</option>`).join("")}
      </select>
    `;
    container.appendChild(div);
  }
}

daySelect.addEventListener("change", renderPeriodInputs);

document.getElementById("save-timetable").addEventListener("click", async () => {
  const teacherName = teacherSelect.value;
  const day = daySelect.value;
  const periods = day === "Friday" ? 5 : 8;
  const dayData = [];

  for (let i = 1; i <= periods; i++) {
    const subject = document.getElementById(`subject-${i}`).value.trim();
    const className = document.getElementById(`class-${i}`).value;
    dayData.push({ subject, class: className });
  }

  const ref = doc(window.db, "teacherTimetables", teacherName);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  data.days = data.days || {};
  data.days[day] = dayData;

  await setDoc(ref, data);
  alert("Timetable saved!");
});

loadTeachersAndClasses();
