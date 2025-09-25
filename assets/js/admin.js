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
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;
  console.log("🔑 Login attempt:", username, password);

  try {
    const ref = doc(window.db, "config", "admin");
    const snap = await getDoc(ref);
    console.log("📄 Fetched admin doc:", snap.exists());

    const data = snap.exists() ? snap.data() : {};
    console.log("🔐 Admin data:", data);

    if (username === "Admin" && password === data.password) {
      console.log("✅ Login successful");
      loginSection.style.display = 'none';
      dashboard.style.display = 'block';
      loadList('teachers', 'teacher-list');
      loadList('classes', 'class-list');
      loadList('sections', 'section-list');
    } else {
      alert("❌ Invalid credentials");
      console.log("🚫 Login failed");
    }
  } catch (err) {
    console.error("🔥 Login error:", err);
    alert("Error connecting to Firebase");
  }
});

// 📥 Add item to list
async function updateList(docId, fieldId, listId) {
  const input = document.getElementById(fieldId);
  const value = input.value.trim();
  if (!value) return;

  try {
    const ref = doc(window.db, "config", docId);
    const snap = await getDoc(ref);
    const list = snap.exists() ? snap.data().list : [];
    list.push(value);
    await setDoc(ref, { list }, { merge: true });
    input.value = '';
    loadList(docId, listId);
    console.log(`✅ Added "${value}" to ${docId}`);
  } catch (err) {
    console.error(`🔥 Error updating ${docId}:`, err);
  }
}

// 📤 Load list from Firestore
async function loadList(docId, listId) {
  try {
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
    console.log(`📃 Loaded ${docId}:`, list);
  } catch (err) {
    console.error(`🔥 Error loading ${docId}:`, err);
  }
}

// ⌨️ Bind Enter key to add
document.getElementById('add-teacher').addEventListener('keypress', e => {
  if (e.key === 'Enter') updateList('teachers', 'add-teacher', 'teacher-list');
});
document.getElementById('add-class').addEventListener('keypress', e => {
  if (e.key === 'Enter') updateList('classes', 'add-class', 'class-list');
});
document.getElementById('add-section').addEventListener('keypress', e => {
  if (e.key === 'Enter') updateList('sections', 'add-section', 'section-list');
});
