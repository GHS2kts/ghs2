const timetable = [
  { day: 'Monday', period: 1, class: '8th Blue', subject: 'Math' },
  { day: 'Monday', period: 2, class: '9th White', subject: 'Physics' },
  { day: 'Tuesday', period: 3, class: '10th Blue', subject: 'Chemistry' },
];

const vacantAssignments = [
  { date: '2025-09-22', class: '7th White', period: 4, reason: 'Substitute for Mr. Asif' },
  { date: '2025-09-23', class: '6th Blue', period: 2, reason: 'Emergency Leave' },
];

const timetableBody = document.querySelector('#teacher-timetable tbody');
const vacantBody = document.querySelector('#vacant-periods tbody');

timetable.forEach(entry => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${entry.day}</td>
    <td>${entry.period}</td>
    <td>${entry.class}</td>
    <td>${entry.subject}</td>
  `;
  timetableBody.appendChild(row);
});

vacantAssignments.forEach(entry => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${entry.date}</td>
    <td>${entry.class}</td>
    <td>${entry.period}</td>
    <td>${entry.reason}</td>
  `;
  vacantBody.appendChild(row);
});

document.getElementById('teacher-attendance-form').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Attendance submitted successfully!');
  this.reset();
});
