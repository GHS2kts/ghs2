import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const loginForm = document.getElementById('admin-login');
const dashboard = document.getElementById('admin-dashboard');
const loginSection = document.getElementById('login-section');

// 🔐 Admin Login
loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;

  const ref = doc(window.db, "config", "admin");
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : { password: "kikukiku" };

  if (username === "Admin" && password === data.password) {
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
    loadTeachers();
    loadClasses();
    loadVacantLog();
  } else {
    alert("Invalid credentials");
  }
});

// 👨‍🏫 Manage Teachers
const teacherList = document.getElementById('teacher-list');
document.getElementById('new-teacher').addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const name = e.target.value.trim();
    if (!name) return;
    const ref = doc(window.db, "config", "teachers");
    const snap = await getDoc(ref);
    const list = snap.exists() ? snap.data().list : [];
    list.push(name);
    await setDoc(ref, { list }, { merge: true });
    e.target.value = '';
    loadTeachers();
  }
});

async function loadTeachers() {
  const ref = doc(window.db, "config", "teachers");
  const snap = await getDoc(ref);
  const list = snap.exists() ? snap.data().list : [];
  teacherList.innerHTML = '';
  list.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    teacherList.appendChild(li);
  });
}

// 🏫 Manage Classes
const classList = document.getElementById('class-list');
document.getElementById('new-class').addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const name = e.target.value.trim();
    if (!name) return;
    const ref = doc(window.db, "config", "classes");
    const snap = await getDoc(ref);
    const list = snap.exists() ? snap.data().list : [];
    list.push(name);
    await setDoc(ref, { list }, { merge: true });
    e.target.value = '';
    loadClasses();
  }
});

async function loadClasses() {
  const ref = doc(window.db, "config", "classes");
  const snap = await getDoc(ref);
  const list = snap.exists() ? snap.data().list : [];
  classList.innerHTML = '';
  list.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    classList.appendChild(li);
  });
}

// 📋 Manage Vacant Periods
const vacantForm = document.getElementById('vacant-form');
const vacantLog = document.querySelector('#vacant-log tbody');

vacantForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const payload = {
    date: document.getElementById('vacant-date').value,
    className: document.getElementById('vacant-class').value,
    period: parseInt(document.getElementById('vacant-period').value),
    assignedTeacher: document.getElementById('assigned-teacher').value,
    absentTeacher: document.getElementById('absent-teacher').value,
    ts: Date.now()
  };
  await addDoc(collection(window.db, "vacantPeriods"), payload);
  vacantForm.reset();
  loadVacantLog();
});

async function loadVacantLog() {
  const snapshot = await getDocs(collection(window.db, "vacantPeriods"));
  const rows = snapshot.docs.map(doc => doc.data());
  vacantLog.innerHTML = '';
  rows.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.className}</td>
      <td>${entry.period}</td>
      <td>${entry.assignedTeacher}</td>
      <td>${entry.absentTeacher}</td>
    `;
    vacantLog.appendChild(row);
  });
}
