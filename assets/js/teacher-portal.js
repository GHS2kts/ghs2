import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const classSelect = document.getElementById("class-select");
const summary = document.getElementById("attendance-summary");

async function loadClasses() {
  const snap = await getDoc(doc(window.db, "config", "classes"));
  const list = snap.exists() ? snap.data().list : [];
  classSelect.innerHTML = list.map(name => `<option value="${name}">${name}</option>`).join("");
}

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
  loadSummary(date);
});

async function loadSummary(date) {
  const snap = await getDocs(collection(window.db, `attendance/${date}`));
  summary.innerHTML = "";
  snap.forEach(docSnap => {
    const data = docSnap.data();
    const className = docSnap.id;
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow";
    card.innerHTML = `<h3 class="font-bold">${className}</h3>
      <p>✅ Present: ${data.present}</p>
      <p>❌ Absent: ${data.absent}</p>
      <p>📝 Leave: ${data.leave}</p>
      <p>🤒 Sick: ${data.sick}</p>
      <p>📌 Other: ${data.other}</p>`;
    summary.appendChild(card);
  });
}

loadClasses();
document.getElementById("attendance-date").value = new Date().toISOString().split("T")[0];
loadSummary(document.getElementById("attendance-date").value);
