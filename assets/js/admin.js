function setAmbientBackground() {
  const hour = new Date().getHours();
  const bg = document.getElementById('ambient-bg');

  if (hour >= 6 && hour < 12) {
    bg.style.backgroundImage = "url('../assets/bg-morning.jpg')";
  } else if (hour >= 12 && hour < 18) {
    bg.style.backgroundImage = "url('../assets/bg-afternoon.jpg')";
  } else {
    bg.style.backgroundImage = "url('../assets/bg-evening.jpg')";
  }

  bg.style.transition = 'background-image 1s ease-in-out';
}

document.addEventListener('DOMContentLoaded', setAmbientBackground);

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(`tab-${target}`).classList.remove('hidden');
  });
});

import { collection, getDocs } from "./firebase.js";

async function loadCollection(name, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<p class="text-sm italic text-blue-200">Loading ${name}…</p>`;

  const snapshot = await getDocs(collection(window.db, name));
  let html = `<h3 class="text-lg font-bold mb-2">${name}</h3><ul class="space-y-2">`;

  snapshot.forEach(doc => {
    const data = doc.data();
    html += `<li class="bg-white/10 p-2 rounded">${data.name || doc.id}</li>`;
  });

  html += `</ul>`;
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  loadCollection('teachers', 'tab-teachers');
  loadCollection('classes', 'tab-classes');
  loadCollection('sections', 'tab-sections');
});
