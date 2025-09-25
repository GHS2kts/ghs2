import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const teacherSelect = document.getElementById('teacher-select');
const gridContainer = document.getElementById('grid-container');

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const maxPeriods = { Friday: 5, default: 8 };

let classes = [];
let subjects = [];

async function loadOptions() {
  const classSnap = await getDoc(doc(window.db, "config", "classes"));
  const subjectSnap = await getDoc(doc(window.db, "config", "subjects"));
  const teacherSnap = await getDoc(doc(window.db, "config", "teachers"));

  classes = classSnap.exists() ? classSnap.data().list : [];
  subjects = subjectSnap.exists() ? subjectSnap.data().list : [];
  const teacherList = teacherSnap.exists() ? teacherSnap.data().list : [];

  teacherList.forEach(name => {
    const opt = document.createElement('option');
    opt.textContent = name;
    teacherSelect.appendChild(opt);
  });
}

async function buildGrid() {
  const teacherName = teacherSelect.value;
  if (!teacherName) return;

  const ref = doc(window.db, "teacherTimetables", teacherName);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : { days: {} };

  gridContainer.innerHTML = '';

  for (const day of days) {
    const periods = data.days?.[day] || [];
    const limit = maxPeriods[day] || maxPeriods.default;

    const dayBlock = document.createElement('div');
    dayBlock.className = 'day-block';
    dayBlock.innerHTML = `<h3>${day}</h3>`;

    for (let i = 0; i < limit; i++) {
      const classSelect = document.createElement('select');
      classSelect.innerHTML = `<option value="Free">Free Period</option>` +
        classes.map(c => `<option>${c}</option>`).join('');
      classSelect.value = periods[i]?.class || 'Free';

      const subjectSelect = document.createElement('select');
      subjectSelect.innerHTML = `<option value="">— Subject —</option>` +
        subjects.map(s => `<option>${s}</option>`).join('');
      subjectSelect.value = periods[i]?.subject || '';

      const row = document.createElement('div');
      row.className = 'period-row';
      row.innerHTML = `<label>Period ${i + 1}</label>`;
      row.appendChild(classSelect);
      row.appendChild(subjectSelect);
      dayBlock.appendChild(row);

      classSelect.addEventListener('change', () =>
        savePeriod(teacherName, day, i, classSelect.value, subjectSelect.value)
      );
      subjectSelect.addEventListener('change', () =>
        savePeriod(teacherName, day, i, classSelect.value, subjectSelect.value)
      );
    }

    gridContainer.appendChild(dayBlock);
  }
}

async function savePeriod(teacherName, day, period, className, subject) {
  const teacherRef = doc(window.db, "teacherTimetables", teacherName);
  const teacherSnap = await getDoc(teacherRef);
  const teacherData = teacherSnap.exists() ? teacherSnap.data() : { days: {} };
  const dayData = teacherData.days?.[day] || [];

  dayData[period] = { class: className, subject };
  teacherData.days[day] = dayData;
  await setDoc(teacherRef, teacherData);

  // 🔄 Sync to class timetable
  if (className !== "Free") {
    const classRef = doc(window.db, "timetables", className);
    const classSnap = await getDoc(classRef);
    const classData = classSnap.exists() ? classSnap.data() : { days: {} };
    const classDay = classData.days?.[day] || [];
    classDay[period] = { subject, teacher: teacherName };
    classData.days[day] = classDay;
    await setDoc(classRef, classData);
  }
}

teacherSelect.addEventListener('change', buildGrid);
await loadOptions();
