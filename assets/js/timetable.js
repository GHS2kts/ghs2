import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const classSelect = document.getElementById("class-select");
const daySelect = document.getElementById("day-select");
const container = document.getElementById("periods-container");

let teacherList = [];

async function loadClassesAndTeachers() {
  const classSnap = await getDoc(doc(window.db, "config", "classes"));
  const teacherSnap = await getDoc(doc(window.db, "config", "teachers"));
  const classList = classSnap.exists() ? classSnap.data().list : [];
  teacherList = teacherSnap.exists() ? teacherSnap.data().list : [];

  classSelect.innerHTML = classList.map(c => `<option value="${c}">${c}</option>`).join("");
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
      <select id="teacher-${i}">
        ${teacherList.map(t => `<option value="${t}">${t}</option>`).join("")}
      </select>
    `;
    container.appendChild(div);
  }
}

daySelect.addEventListener("change", renderPeriodInputs);

document.getElementById("save-timetable").addEventListener("click", async () => {
  const className = classSelect.value;
  const day = daySelect.value;
  const periods = day === "Friday" ? 5 : 8;
  const dayData = [];

  for (let i = 1; i <= periods; i++) {
    const subject = document.getElementById(`subject-${i}`).value.trim();
    const teacher = document.getElementById(`teacher-${i}`).value;
    dayData.push({ subject, teacher });
  }

  const ref = doc(window.db, "timetables", className);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  data.days = data.days || {};
  data.days[day] = dayData;

  await setDoc(ref, data);
  alert("Timetable saved!");
});

loadClassesAndTeachers();
