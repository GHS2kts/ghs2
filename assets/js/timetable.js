import { doc, setDoc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const classSelector = document.getElementById('class-selector');
const gridBody = document.querySelector('#timetable-grid tbody');
const timetableDisplay = document.getElementById('timetable-display');
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const subjects = ['Math', 'English', 'Physics', 'Chemistry', 'Biology', 'Urdu', 'Islamiyat', 'Computer'];
const teachers = ['Miss Ayesha', 'Mr. Irfan', 'Mr. Asif', 'Miss Sana', 'Mr. Bilal', 'Miss Rabia'];

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

document.getElementById('save-timetable').addEventListener('click', async () => {
  const selectedClass = classSelector.value;
  const timetableData = { days: {} };
  [...gridBody.children].forEach((row, r) => {
    const day = days[r];
    timetableData.days[day] = [];
    [...row.children].slice(1).forEach(cell => {
      timetableData.days[day].push({
        subject: cell.children[0].value,
        teacher: cell.children[2].value
      });
    });
  });
  await setDoc(doc(window.db, "timetables", selectedClass), timetableData);
  alert(`Saved timetable for ${selectedClass}`);
});

document.getElementById('view-by-class').addEventListener('click', async () => {
  const selectedClass = classSelector.value;
  const ref = doc(window.db, "timetables", selectedClass);
  const snap = await getDoc(ref);
  if (!snap.exists()) return alert('No timetable found.');
  const data = snap.data();
  let html = `<h3>${selectedClass} Timetable</h3><table><tr><th>Day</th><th>Period</th><th>Subject</th><th>Teacher</th></tr>`;
  for (const day in data.days) {
    data.days[day].forEach((p, i) => {
      html += `<tr><td>${day}</td><td>${i + 1}</td><td>${p.subject}</td><td>${p.teacher}</td></tr>`;
    });
  }
  html += '</table>';
  timetableDisplay.innerHTML = html;
});

document.getElementById('view-by-teacher').addEventListener('click', async () => {
  const qs = await getDocs(collection(window.db, "timetables"));
  const teacherMap = {};
  qs.forEach(docSnap => {
    const className = docSnap.id;
    const data = docSnap.data();
    for (const day in data.days) {
      data.days[day].forEach((p, i) => {
        if (!teacherMap[p.teacher]) teacherMap[p.teacher] = [];
        teacherMap[p.teacher].push({ day, period: i + 1, class: className, subject: p.subject });
      });
    }
  });
  let html = '<h3>Teacher Timetables</h3>';
  for (const teacher in teacherMap) {
    html += `<h4>${teacher}</h4><table><tr><th>Day</th><th>Period</th><th>Class</th><th>Subject</th></tr>`;
    teacherMap[teacher].forEach(entry => {
      html += `<tr><td>${entry.day}</td><td>${entry.period}</td><td>${entry.class}</td><td>${entry.subject}</td></tr>`;
    });
    html += '</table>';
  }
  timetableDisplay.innerHTML = html;
});

buildGrid();
