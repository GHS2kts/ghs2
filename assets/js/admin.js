import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 Save Session
document.getElementById("save-session").addEventListener("click", async () => {
  const name = document.getElementById("session-name").value.trim();
  if (!name) return alert("Enter session name");
  await setDoc(doc(window.db, "sessions", "current"), { name });
  alert("Session saved!");
});

// 👨‍🏫 Save Teachers
document.getElementById("save-teachers").addEventListener("click", async () => {
  const raw = document.getElementById("teacher-list").value.trim();
  const list = raw.split("\n").map(x => x.trim()).filter(x => x);
  await setDoc(doc(window.db, "config", "teachers"), { list });
  alert("Teachers saved!");
});

// 🏫 Save Classes
document.getElementById("save-classes").addEventListener("click", async () => {
  const raw = document.getElementById("class-list").value.trim();
  const list = raw.split("\n").map(x => x.trim()).filter(x => x);
  await setDoc(doc(window.db, "config", "classes"), { list });
  alert("Classes saved!");
});

// 🏅 Save Student of the Month
document.getElementById("save-student").addEventListener("click", async () => {
  const name = document.getElementById("student-name").value.trim();
  const photo = document.getElementById("student-photo").value.trim();
  const reason = document.getElementById("student-reason").value.trim();
  if (!name || !photo) return alert("Enter name and photo URL");
  await setDoc(doc(window.db, "config", "studentOfMonth"), { name, photo, reason });
  alert("Student updated!");
});

// 📰 Save News
document.getElementById("save-news").addEventListener("click", async () => {
  const raw = document.getElementById("news-items").value.trim();
  const items = raw.split("\n").filter(line => line.trim());
  await setDoc(doc(window.db, "config", "news"), { items });
  alert("News updated!");
});

// 📂 Save Vacant Periods
document.getElementById("save-vacant").addEventListener("click", async () => {
  const date = document.getElementById("vacant-date").value;
  const className = document.getElementById("vacant-class").value.trim();
  const raw = document.getElementById("vacant-periods").value.trim();
  const periods = raw.split(",").map(x => parseInt(x)).filter(x => !isNaN(x));
  if (!date || !className || periods.length === 0) return alert("Fill all fields");
  await setDoc(doc(window.db, `vacantPeriods/${date}`, className), { periods });
  alert("Vacant periods saved!");
});
