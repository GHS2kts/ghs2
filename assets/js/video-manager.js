import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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
const storage = getStorage(app);
document.getElementById('uploadBtn').addEventListener('click', async () => {
  const file = document.getElementById('videoFile').files[0];
  const title = document.getElementById('videoTitle').value.trim();
  const tags = document.getElementById('videoTags').value.trim().split(',').map(t => t.trim());
  const status = document.getElementById('uploadStatus');

  if (!file || !title) {
    status.textContent = "Please select a video and enter a title.";
    return;
  }
async function loadVideos() {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = "<p class='text-sm italic text-blue-200'>Loading videos…</p>";

  const snapshot = await getDocs(collection(db, 'videos'));
  let html = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    html += `
      <div class="bg-white/10 p-3 rounded shadow-md">
        <video controls class="w-full h-48 rounded mb-2">
          <source src="${data.url}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p class="font-semibold">${data.title}</p>
        <p class="text-xs text-blue-200">${data.tags.join(', ')}</p>
      </div>
    `;
  });

  grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', loadVideos);

  const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'videos'), {
    title,
    tags,
    url,
    timestamp: Date.now()
  });

  status.textContent = "Video uploaded successfully!";
  loadVideos();
});
