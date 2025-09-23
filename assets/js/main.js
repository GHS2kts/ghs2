function updateDateTime() {
  const now = new Date();
  const datetime = now.toLocaleString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  document.getElementById('datetime').textContent = datetime;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Simulated live period data
const classes = [
  { class: '6th', section: 'White', period: 3, teacher: 'Miss Ayesha', status: 'Teaching' },
  { class: '6th', section: 'Blue', period: 3, teacher: 'Mr. Irfan', status: 'Teaching' },
  { class: '7th', section: 'White', period: 3, teacher: 'VACANT', status: 'Substitute: Mr. Bilal' },
  { class: '7th', section: 'Blue', period: 3, teacher: 'Mr. Asif', status: 'Teaching' },
  { class: '8th', section: 'White', period: 3, teacher: 'Miss Sana', status: 'Teaching' },
  { class: '8th', section: 'Blue', period: 3, teacher: 'VACANT', status: 'Unassigned' },
];

const tableBody = document.querySelector('#live-period-table tbody');
classes.forEach(entry => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${entry.class}</td>
    <td>${entry.section}</td>
    <td>${entry.period}</td>
    <td>${entry.teacher}</td>
    <td>${entry.status}</td>
  `;
  if (entry.teacher === 'VACANT') {
    row.style.backgroundColor = '#ffcccc';
  }
  tableBody.appendChild(row);
});
