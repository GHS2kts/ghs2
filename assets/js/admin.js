import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ SESSION MANAGER
const sessionList = document.getElementById("session-list");
document.getElementById("add-session").onclick = async () => {
  const newSession = document.getElementById("new-session").value.trim();
  if (!newSession) return alert("Enter session name");
  const ref = doc(window.db, "sessions", "list");
  const snap = await getDoc(ref);
  const list = snap.exists() ? snap.data().list : [];
  if (list.includes(newSession)) return alert("Session already exists");
  list.push(newSession);
  await setDoc(ref, { list });
  renderSessions(list);
};

async function renderSessions(list) {
  const currentSnap = await getDoc(doc(window.db, "sessions", "current"));
  const current = currentSnap.exists() ? currentSnap.data().name : "";
  sessionList.innerHTML = list.map(name => `
    <li class="flex items-center justify-between bg-white p-2 border rounded">
      <span>${name} ${name === current ? "(Current)" : ""}</span>
      <div class="space-x-2">
        <button onclick="setCurrentSession('${name}')" class="text-blue-600">Set Current</button>
        <button onclick="removeSession('${name}')" class="text-red-600">Delete</button>
      </div>
    </li>
  `).join("");
}

window.setCurrentSession = async (name) => {
  await setDoc(doc(window.db, "sessions", "current"), { name });
  alert("Session updated");
  loadSessions();
};

window.removeSession = async (name) => {
  const ref = doc(window.db, "sessions", "list");
  const snap = await getDoc(ref);
  let list = snap.exists() ? snap.data().list : [];
  list = list.filter(s => s !== name);
  await setDoc(ref, { list });
  renderSessions(list);
};

async function loadSessions() {
  const snap = await getDoc(doc(window.db, "sessions", "list"));
  const list = snap.exists() ? snap.data().list : [];
  renderSessions(list);
}

// ✅ TEACHER MANAGER
const teacherTable = document.getElementById("teacher-table");
document.getElementById("save-teachers").onclick = async () => {
  const rows = teacherTable.querySelectorAll("input");
  const list = [...rows].map(r => r.value.trim()).filter(x => x);
  await setDoc(doc(window.db, "config", "teachers"), { list });
  alert("Teachers saved");
};

async function loadTeachers() {
  const snap = await getDoc(doc(window.db, "config", "teachers"));
  const list = snap.exists() ? snap.data().list : [];
  teacherTable.innerHTML = list.map((name, i) => `
    <tr><td><input value="${name}" class="border p-1 w-full" /></td></tr>
  `).join("") + `<tr><td><input placeholder="Add new..." class="border p-1 w-full" /></td></tr>`;
}

// ✅ CLASS MANAGER
const classTable = document.getElementById("class-table");
document.getElementById("save-classes").onclick = async () => {
  const rows = classTable.querySelectorAll("input");
  const list = [...rows].map(r => r.value.trim()).filter(x => x);
  await setDoc(doc(window.db, "config", "classes"), { list });
  alert("Classes saved");
};

async function loadClasses() {
  const snap = await getDoc(doc(window.db, "config", "classes"));
  const list = snap.exists() ? snap.data().list : [];
  classTable.innerHTML = list.map((name, i) => `
    <tr><td><input value="${name}" class="border p-1 w-full" /></td></tr>
  `).join("") + `<tr><td><input placeholder="Add new..." class="border p-1 w-full" /></td></tr>`;
}

// ✅ STUDENT OF MONTH
document.getElementById("save-student").onclick = async () => {
  const name = document.getElementById("student-name").value.trim();
  const photo = document.getElementById("student-photo").value.trim();
  const reason = document.getElementById("student-reason").value.trim();
  if (!name || !photo) return alert("Name and photo required");
  await setDoc(doc(window.db, "config", "studentOfMonth"), { name, photo, reason });
  alert("Student updated");
};

// ✅ NEWS
document.getElementById("save-news").onclick = async () => {
  const raw = document.getElementById("news-items").value.trim();
  const items = raw.split("\n").filter(x => x.trim());
  await setDoc(doc(window.db, "config", "news"), { items });
  alert("News updated");
};

// ✅ VACANT PERIODS
document.getElementById("save-vacant").onclick = async () => {
  const date = document.getElementById("vacant-date").value;
  const className = document.getElementById("vacant-class").value.trim();
  const raw = document.getElementById("vacant-periods").value.trim();
  const periods = raw.split(",").map(x => parseInt(x)).filter(x => !isNaN(x));
  if (!date || !className || periods.length === 0) return alert("Fill all fields");
  await setDoc(doc(window.db, `vacantPeriods/${date}`, className), { periods });
  alert("Vacant periods saved");
};

// 🔄 INIT
loadSessions();
loadTeachers();
loadClasses();
