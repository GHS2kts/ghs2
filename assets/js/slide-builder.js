import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBK5n_xfpyPpXB8YOa5_fs53ciLpRoC5lI",
  authDomain: "ghs-dashboard.firebaseapp.com",
  projectId: "ghs-dashboard",
  storageBucket: "ghs-dashboard.firebasestorage.app",
  messagingSenderId: "692567259749",
  appId: "1:692567259749:web:4ef59b0ad8ba554d9de48c",
  measurementId: "G-P5DP6W67DH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


document.getElementById('saveSlideBtn').addEventListener('click', async () => {
  const type = document.getElementById('slideType').value;
  const title = document.getElementById('slideTitle').value.trim();
  const duration = parseInt(document.getElementById('slideDuration').value);
  const notes = document.getElementById('slideNotes').value.trim();
  const status = document.getElementById('slideStatus');

  if (!type || !title || !duration) {
    status.textContent = "Please fill in all required fields.";
    return;
  }

  await addDoc(collection(db, 'slides'), {
    type,
    title,
    duration,
    notes,
    timestamp: Date.now()
  });

  status.textContent = "Slide saved successfully!";
  loadSlides();
});

async function loadSlides() {
  const list = document.getElementById('slideList');
  list.innerHTML = "<p class='text-sm italic text-blue-200'>Loading slides…</p>";

  const snapshot = await getDocs(collection(db, 'slides'));
  let html = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    html += `
      <div class="bg-white/10 p-3 rounded shadow-md flex justify-between items-center">
        <div>
          <p class="font-semibold">${data.title}</p>
          <p class="text-xs text-blue-200">${data.type} · ${data.duration}s</p>
        </div>
        <button class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded" data-id="${docSnap.id}">🗑️</button>
      </div>
    `;
  });

  list.innerHTML = html;

  document.querySelectorAll('#slideList button').forEach(btn => {
    btn.addEventListener('click', async () => {
      await deleteDoc(doc(db, 'slides', btn.dataset.id));
      loadSlides();
    });
  });
}

document.addEventListener('DOMContentLoaded', loadSlides);


