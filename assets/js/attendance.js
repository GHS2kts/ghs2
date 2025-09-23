const form = document.getElementById('attendance-form');
const logBody = document.querySelector('#attendance-log tbody');
const chartCanvas = document.getElementById('attendance-chart');

let attendanceRecords = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const date = document.getElementById('attendance-date').value;
  const className = document.getElementById('class-select').value;
  const present = parseInt(document.getElementById('present-count').value) || 0;
  const absent = parseInt(document.getElementById('absent-count').value) || 0;
  const sick = parseInt(document.getElementById('sick-count').value) || 0;

  attendanceRecords.push({ date, className, present, absent, sick });
  updateLog();
  updateChart();
  form.reset();
});

function updateLog() {
  logBody.innerHTML = '';
  attendanceRecords.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.className}</td>
      <td>${entry.present}</td>
      <td>${entry.absent}</td>
      <td>${entry.sick}</td>
      <td><button onclick="editEntry(${index})">Edit</button></td>
    `;
    logBody.appendChild(row);
  });
}

function editEntry(index) {
  const entry = attendanceRecords[index];
  document.getElementById('attendance-date').value = entry.date;
  document.getElementById('class-select').value = entry.className;
  document.getElementById('present-count').value = entry.present;
  document.getElementById('absent-count').value = entry.absent;
  document.getElementById('sick-count').value = entry.sick;
  attendanceRecords.splice(index, 1);
  updateLog();
  updateChart();
}

function updateChart() {
  const totals = { Present: 0, Absent: 0, Sick: 0 };
  attendanceRecords.forEach(entry => {
    totals.Present += entry.present;
    totals.Absent += entry.absent;
    totals.Sick += entry.sick;
  });

  chart.data.datasets[0].data = [totals.Present, totals.Absent, totals.Sick];
  chart.update();
}

let chart = new Chart(chartCanvas, {
  type: 'pie',
  data: {
    labels: ['Present', 'Absent', 'Sick'],
    datasets: [{
      label: 'School Attendance',
      data: [0, 0, 0],
      backgroundColor: ['#90ee90', '#ff6b6b', '#fdd835'],
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
