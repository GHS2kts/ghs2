const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const subjects = ['Math', 'English', 'Physics', 'Chemistry', 'Biology', 'Urdu', 'Islamiyat', 'Computer'];
const teachers = ['Miss Ayesha', 'Mr. Irfan', 'Mr. Asif', 'Miss Sana', 'Mr. Bilal', 'Miss Rabia'];

const gridBody = document.querySelector('#timetable-grid tbody');
const classSelector = document.getElementById('class-selector');
const timetableDisplay = document.getElementById('timetable-display');
let timetableData = {};

function createDropdown(options) {
  const select = document.createElement('select');
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
  return select;
}

function buildGrid() {
  gridBody.innerHTML = '';
  days.forEach(day => {
    const row = document.createElement('tr');
    const dayCell = document.createElement('td');
    dayCell.textContent = day;
    row.appendChild(dayCell);

    for (let i = 1; i <= 8; i++) {
      const cell = document.createElement('td');
      const subjectDropdown = createDropdown(subjects);
      const teacherDropdown = createDropdown(teachers);
      cell.appendChild(subjectDropdown);
      cell.appendChild(document.createElement('br'));
      cell.appendChild(teacherDropdown);
      row.appendChild(cell);
    }

    gridBody.appendChild(row);
  });
}

document.getElementById('save-timetable').addEventListener('click', () => {
  const selectedClass = classSelector.value;
  timetableData[selectedClass] = [];

  [...gridBody.children].forEach((row, rowIndex) => {
    const day = days[rowIndex];
    const periods = [];

    [...row.children].slice(1).forEach(cell => {
      const subject = cell.children[0].value;
      const teacher = cell.children[2].value;
      periods.push({ subject, teacher });
    });

    timetableData[selectedClass].push({ day, periods });
  });

  alert(`Timetable saved for ${selectedClass}`);
});

document.getElementById('view-by-class').addEventListener('click', () => {
  const selectedClass = classSelector.value;
  const data = timetableData[selectedClass];
  if (!data) return alert('No timetable saved yet.');

  let html = `<h3>${selectedClass} Timetable</h3><table><tr><th>Day</th><th>Period</th><th>Subject</th><th>Teacher</th></tr>`;
  data.forEach(entry => {
    entry.periods.forEach((p, i) => {
      html += `<tr><td>${entry.day}</td><td>${i + 1}</td><td>${p.subject}</td><td>${p.teacher}</td></tr>`;
    });
  });
  html += '</table>';
  timetableDisplay.innerHTML = html;
});

document.getElementById('view-by-teacher').addEventListener('click', () => {
  const teacherTimetable = {};
  for (const cls in timetableData) {
    timetableData[cls].forEach(entry => {
      entry.periods.forEach((p, i) => {
        if (!teacherTimetable[p.teacher]) teacherTimetable[p.teacher] = [];
        teacherTimetable[p.teacher].push({ class: cls, day: entry.day, period: i + 1, subject: p.subject });
      });
    });
  }

  let html = '<h3>Teacher Timetables</h3>';
  for (const teacher in teacherTimetable) {
    html += `<h4>${teacher}</h4><table><tr><th>Day</th><th>Period</th><th>Class</th><th>Subject</th></tr>`;
    teacherTimetable[teacher].forEach(entry => {
      html += `<tr><td>${entry.day}</td><td>${entry.period}</td><td>${entry.class}</td><td>${entry.subject}</td></tr>`;
    });
    html += '</table>';
  }
  timetableDisplay.innerHTML = html;
});

buildGrid();
