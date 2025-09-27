import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBK5n_xfpyPpXB8YOa5_fs53ciLpRoC5lI",
  authDomain: "ghs-dashboard.firebaseapp.com",
  projectId: "ghs-dashboard",
  storageBucket: "ghs-dashboard.firebasestorage.app",
  messagingSenderId: "692567259749",
  appId: "1:692567259749:web:4ef59b0ad8ba554d9de48c",
  measurementId: "G-P5DP6W67DH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
function createRow(data = {}) {
  const row = document.createElement('div');
  row.className = 'grid grid-cols-6 gap-4 text-sm';

  row.innerHTML = `
    <input type="text" value="${data.day || ''}" placeholder="Mon" class="p-2 rounded bg-white text-black" />
    <input type="text" value="${data.period || ''}" placeholder="1st" class="p-2 rounded bg-white text-black" />
    <input type="text" value="${data.subject || ''}" placeholder="Math" class="p-2 rounded bg-white text-black" />
    <input type="text" value="${data.teacher || ''}" placeholder="Mr. Ali" class="p-2 rounded bg-white text-black" />
    <input type="text" value="${data.room || ''}" placeholder="Room 5" class="p-2 rounded bg-white text-black" />
    <button class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">🗑️</button>
  `;

  row.querySelector('button').addEventListener('click', () => row.remove());
  document.getElementById('timetableRows').appendChild(row);
}

document.getElementById('addRowBtn').addEventListener('click', () => createRow());

document.getElementById('saveTimetableBtn').addEventListener('click', async () => {
  const rows = document.querySelectorAll('#timetableRows > div');
  const status = document.getElementById('saveStatus');

  // Clear old timetable
  const oldSnap = await getDocs(collection(db, 'timetable'));
  for (const docSnap of oldSnap.docs) {
    await deleteDoc(doc(db, 'timetable', docSnap.id));
  }

  // Save new rows
  for (const row of rows) {
    const inputs = row.querySelectorAll('input');
    await addDoc(collection(db, 'timetable'), {
      day: inputs[0].value.trim(),
      period: inputs[1].value.trim(),
      subject: inputs[2].value.trim(),
      teacher: inputs[3].value.trim(),
      room: inputs[4].value.trim()
    });
  }

  status.textContent = "Timetable saved successfully!";
});
async function loadExistingTimetable() {
  const snapshot = await getDocs(collection(db, 'timetable'));
  snapshot.forEach(doc => createRow(doc.data()));
}

document.addEventListener('DOMContentLoaded', loadExistingTimetable);




