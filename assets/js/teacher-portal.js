import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Load class list
const classSelect = document.getElementById("class-select");
async function loadClasses() {
  const snap = await getDoc(doc(window.db, "config", "classes"));
  const list = snap.exists() ? snap.data().list : [];
  classSelect.innerHTML = list.map(name => `<option value="${name}">${name}</option>`).join("");
}

// Submit attendance
document.getElementById("submit-attendance").addEventListener("click", async () => {
  const className = classSelect.value;
  const date = document.getElementById("attendance-date").value;
  const present = parseInt(document.getElementById("present").value) || 0;
  const absent = parseInt(document.getElementById("absent").value) || 0;
  const leave = parseInt(document.getElementById("leave").value) || 0;
  const sick = parseInt(document.getElementById("sick").value) || 0;
  const other = parseInt(document.getElementById("other").value) || 0;

  if (!className || !date) return alert("Select class and date");
  const ref = doc(window.db, `attendance/${date}`, className);
  await setDoc(ref, { present, absent, leave, sick, other });
  alert("Attendance submitted!");
});

loadClasses();
document.getElementById("attendance-date").value = new Date().toISOString().split("T")[0];
