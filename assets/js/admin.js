import {
  doc,
  getDoc,
  setDoc
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
    loadList('teachers', 'teacher-list');
    loadList('classes', 'class-list');
    loadList('sections', 'section-list');
  } else {
    alert("Invalid credentials");
  }
});

// 🔧 Add & Load Lists
async function updateList(docId, fieldId, listId) {
  const input = document.getElementById(fieldId);
  const value = input.value.trim();
  if (!value) return;

  const ref = doc(window.db, "config", docId);
  const snap = await getDoc(ref);
  const list = snap.exists() ? snap.data().list : [];
  list.push(value);
  await setDoc(ref, { list }, { merge: true });
  input.value = '';
  loadList(docId, listId);
}

async function loadList(docId, listId) {
  const ref = doc(window.db, "config", docId);
  const snap = await getDoc(ref);
  const list = snap.exists() ? snap.data().list : [];
  const container = document.getElementById(listId);
  container.innerHTML = '';
  list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    container.appendChild(li);
  });
}

// 🔗 Bind Inputs
document.getElementById('add-teacher').addEventListener('keypress', e => {
  if (e.key === 'Enter') updateList('teachers', 'add-teacher', 'teacher-list');
});
document.getElementById('add-class').addEventListener('keypress', e => {
  if (e.key === 'Enter') updateList('classes', 'add-class', 'class-list');
});
document.getElementById('add-section').addEventListener('keypress', e => {
  if (e.key === 'Enter') updateList('sections', 'add-section', 'section-list');
});
