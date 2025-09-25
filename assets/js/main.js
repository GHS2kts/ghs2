import {
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const grid = document.getElementById('live-grid');
const now = new Date();
const hour = now.getHours();
const period = Math.floor((hour - 8) / 1); // Assuming school starts at 8 AM
const today = now.toLocaleDateString('en-PK', { weekday: 'long' });

async function loadLivePeriods() {
  const timetableSnap = await getDocs(collection(window.db, "timetables"));
  const vacantSnap = await getDocs(collection(window.db, "vacantPeriods"));
  const vacantList = vacantSnap.docs.map(d => d.data());

  grid.innerHTML = '';

  timetableSnap.forEach(docSnap => {
    const className = docSnap.id;
    const data = docSnap.data();
    const todayPeriods = data.days?.[today];
    const current = todayPeriods?.[period];

    let teacher = current?.teacher || '—';
    let subject = current?.subject || '—';

    const vacant = vacantList.find(v =>
      v.className === className &&
      v.period === period &&
      v.date === now.toISOString().split('T')[0]
    );

    if (vacant) {
      teacher = `${vacant.assignedTeacher} (sub)`;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${className}</td>
      <td>${period + 1}</td>
      <td>${subject}</td>
      <td>${teacher}</td>
    `;
    grid.appendChild(row);
  });
}

loadLivePeriods();
