const teacherSelect = document.getElementById('teacher-select');
const dashboard = document.getElementById('dashboard');
const teacherNameSpan = document.getElementById('teacher-name');
const timetableBody = document.querySelector('#teacher-timetable tbody');
const vacantBody = document.querySelector('#vacant-periods tbody');
const upcomingPeriod = document.getElementById('upcoming-period');

const sampleTimetable = {
  'Miss Ayesha': [
    { day: 'Monday', period: 1, class: '6th White', subject: 'Math' },
    { day: 'Tuesday', period: 3, class: '7th Blue', subject: 'English' },
  ],
  'Mr. Irfan': [
    { day: 'Monday', period: 2, class: '6th Blue', subject: 'Physics' },
    { day: 'Wednesday', period: 4, class: '8th White', subject: 'Urdu' },
  ]
};

const vacantAssignments = {
  'Miss Ayesha': [
    { date: '2025-09-22', class: '9th Blue', period: 5, reason: 'Substitute for Mr. Bilal' }
  ],
  'Mr. Irfan': [
    { date: '2025-09-23', class: '7th White', period: 2, reason: 'Emergency Leave' }
  ]
};

teacherSelect.addEventListener('change', () => {
  const selected = teacherSelect.value;
  teacherNameSpan.textContent = selected;
  dashboard.style.display = 'block';

  // Timetable
  timetableBody.innerHTML = '';
  (sampleTimetable[selected] || []).forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.day}</td><td>${entry.period}</td><td>${entry.class}</td><td>${entry.subject}</td>`;
    timetableBody.appendChild(row);
  });

  // Vacant Periods
  vacantBody.innerHTML = '';
  (vacantAssignments[selected] || []).forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.date}</td><td>${entry.class}</td><td>${entry.period}</td><td>${entry.reason}</td>`;
    vacantBody.appendChild(row);
  });

  // Upcoming Period (simulated)
  const now = new Date();
  const hour = now.getHours();
  const period = Math.floor((hour - 8) / 1); // Assuming school starts at 8 AM
  const today = now.toLocaleDateString('en-PK', { weekday: 'long' });

  const upcoming = (sampleTimetable[selected] || []).find(e => e.day === today && e.period === period);
  upcomingPeriod.textContent = upcoming
    ? `Period ${upcoming.period} – ${upcoming.subject} in ${upcoming.class}`
    : 'No scheduled period right now.';
});
