import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById('attendance-form');
const logBody = document.querySelector('#attendance-log tbody');
const chartCanvas = document.getElementById('attendance-chart');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const payload = {
    date: document.getElementById('attendance-date').value,
    className: document.getElementById('class-select').value,
    present: parseInt(document.getElementById('present-count').value) || 0,
    absent: parseInt(document.getElementById('absent-count').value) || 0,
    sick: parseInt(document.getElementById('sick-count').value) || 0,
    ts: Date.now()
  };

  await addDoc(collection(window.db, "attendance"), payload);
  await refresh();
  form.reset();
});

async function refresh() {
  const snapshot = await getDocs(collection(window.db, "attendance"));
  const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  logBody.innerHTML = '';
  records.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.className}</td>
      <td>${entry.present}</td>
      <td>${entry.absent}</td>
      <td>${entry.sick}</td>
      <td><button onclick="editEntry('${entry.id}')">Edit</button></td>
    `;
    logBody.appendChild(row);
  });

  updateChart(records);
}

window.editEntry = async function (id) {
  const entry = await getDoc(doc(window.db, "attendance", id));
  if (!entry.exists()) return;

  const data = entry.data();
  document.getElementById('attendance-date').value = data.date;
  document.getElementById('class-select').value = data.className;
  document.getElementById('present-count').value = data.present;
  document.getElementById('absent-count').value = data.absent;
  document.getElementById('sick-count').value = data.sick;

  await updateDoc(doc(window.db, "attendance", id), {
    present: data.present,
    absent: data.absent,
    sick: data.sick
  });

  await refresh();
};

function updateChart(records) {
  const totals = { Present: 0, Absent: 0, Sick: 0 };
  records.forEach(entry => {
    totals.Present += entry.present;
    totals.Absent += entry.absent;
    totals.Sick += entry.sick;
  });

  chart.data.datasets[0].data = [totals.Present, totals.Absent, totals.Sick];
  chart.update();
}

const chart = new Chart(chartCanvas, {
  type: 'pie',
  data: {
    labels: ['Present', 'Absent', 'Sick'],
    datasets: [{
      label: 'School Attendance',
      data: [0, 0, 0],
      backgroundColor: ['#90ee90', '#ff6b6b', '#fdd835']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Overall Attendance Distribution' }
    }
  }
});

refresh();
