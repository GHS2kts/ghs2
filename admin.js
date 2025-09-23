const form = document.getElementById('vacant-form');
const logBody = document.querySelector('#vacant-log tbody');
const summaryList = document.getElementById('teacher-summary');

let coverageStats = {};

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const date = document.getElementById('vacant-date').value;
  const className = document.getElementById('vacant-class').value;
  const period = document.getElementById('vacant-period').value;
  const assigned = document.getElementById('assigned-teacher').value;
  const absent = document.getElementById('absent-teacher').value;

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${date}</td>
    <td>${className}</td>
    <td>${period}</td>
    <td>${assigned}</td>
    <td>${absent}</td>
  `;
  logBody.appendChild(row);

  coverageStats[assigned] = (coverageStats[assigned] || 0) + 1;
  coverageStats[absent] = (coverageStats[absent] || 0);

  updateSummary();
  form.reset();
});

function updateSummary() {
  summaryList.innerHTML = '';
  for (const teacher in coverageStats) {
    const li = document.createElement('li');
    li.textContent = `${teacher}: ${coverageStats[teacher]} vacant periods covered`;
    summaryList.appendChild(li);
  }
}
