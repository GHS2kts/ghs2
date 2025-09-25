import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("✅ Admin panel script loaded");

const loginForm = document.getElementById('admin-login');
const dashboard = document.getElementById('admin-dashboard');
const loginSection = document.getElementById('login-section');

// 🔐 Admin Login
loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('admin-username').value.trim().toLowerCase();
  const password = document.getElementById('admin-password').value;

  try {
    const ref = doc(window.db, "config", "admin");
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};

    if (username === "admin" && password === data.password) {
      loginSection.style.display = 'none';
      dashboard.style.display = 'block';
      showTab('teachers');
      loadList('teachers', 'teacher-list');
      loadList('classes', 'class-list');
    } else {
      alert("❌ Invalid credentials");
    }
  } catch (err) {
    console.error("🔥 Login error:", err);
    alert("Error connecting to Firebase");
  }
});

// 🧭 Tab switching
function showTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(div => div.style.display = 'none');
  document.getElementById(`tab-${tab}`).style.display = 'block';
}

// 👨‍🏫 Add Teachers in Bulk
async function addTeachers() {
  const input = document.getElementById('bulk-teachers').value;
  const names = input.split('\n').map(n => n.trim()).filter(n => n);
  if (!names.length) return;

  const ref = doc(window.db, "config", "teachers");
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data().list : [];
  const updated = [...new Set([...existing, ...names])];
  await setDoc(ref, { list: updated });
  document.getElementById('bulk-teachers').value = '';
  loadList('teachers', 'teacher-list');
}

// 🏫 Add Class with Section
async function addClass() {
  const className = document.getElementById('class-name').value.trim();
  const section = document.getElementById('section-name').value;
  if (!className) return;

  const fullName = `${className} ${section}`;
  const ref = doc(window.db, "config", "classes");
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data().list : [];
  const updated = [...new Set([...existing, fullName])];
  await setDoc(ref, { list: updated });
  document.getElementById('class-name').value = '';
  loadList('classes', 'class-list');
}

// 🗑️ Load and show list with delete
async function loadList(docId, listId) {
  const ref = doc(window.db, "config", docId);
  const snap = await getDoc(ref);
  const list = snap.exists() ? snap.data().list : [];
  const container = document.getElementById(listId);
  container.innerHTML = '';
  list.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = item;
    const btn = document.createElement('button');
    btn.textContent = '🗑️';
    btn.style.marginLeft = '10px';
    btn.onclick = async () => {
      const updated = list.filter((_, idx) => idx !== i);
      await setDoc(ref, { list: updated });
      loadList(docId, listId);
    };
    li.appendChild(btn);
    container.appendChild(li);
  });
}
