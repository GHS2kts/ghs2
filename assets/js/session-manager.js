import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const sessionForm = document.getElementById('session-form');
const sessionList = document.getElementById('session-list');
const archiveButton = document.getElementById('archive-button');
const archiveStatus = document.getElementById('archive-status');

// 🆕 Create new session
sessionForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('session-name').value.trim();
  if (!name) return;

  const ref = doc(window.db, "sessions", name);
  const snap = await getDoc(ref);
  if (snap.exists()) return alert("Session already exists.");

  await setDoc(ref, { createdAt: Date.now(), archived: false });
  await loadSessions();
  sessionForm.reset();
});

// 📋 Load existing sessions
async function loadSessions() {
  const qs = await getDocs(collection(window.db, "sessions"));
  sessionList.innerHTML = '';
  qs.forEach(docSnap => {
    const li = document.createElement('li');
    li.textContent = docSnap.id;
    sessionList.appendChild(li);
  });
}
loadSessions();

// 🗃️ Archive current data
archiveButton.addEventListener('click', async () => {
  const now = new Date().toISOString().split('T')[0];
  const archiveRef = doc(window.db, "archives", now);

  // Fetch timetables
  const timetableSnap = await getDocs(collection(window.db, "timetables"));
  const timetables = {};
  timetableSnap.forEach(doc => timetables[doc.id] = doc.data());

  // Fetch attendance
  const attendanceSnap = await getDocs(collection(window.db, "attendance"));
  const attendance = attendanceSnap.docs.map(doc => doc.data());

  // Fetch vacant periods
  const vacantSnap = await getDocs(collection(window.db, "vacantPeriods"));
  const vacant = vacantSnap.docs.map(doc => doc.data());

  await setDoc(archiveRef, {
    date: now,
    timetables,
    attendance,
    vacant,
    archivedAt: Date.now()
  });

  archiveStatus.textContent = `✅ Archived data on ${now}`;
});
