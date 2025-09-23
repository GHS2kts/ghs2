const form = document.getElementById('timetable-form');
const tableBody = document.querySelector('#timetable-table tbody');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const className = document.getElementById('class-select').value;
  const day = document.getElementById('day-select').value;
  const period = document.getElementById('period-number').value;
  const subject = document.getElementById('subject').value;
  const teacher = document.getElementById('teacher-name').value;

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${className}</td>
    <td>${day}</td>
    <td>${period}</td>
    <td>${subject}</td>
    <td>${teacher}</td>
  `;
  tableBody.appendChild(row);

  form.reset();
});
