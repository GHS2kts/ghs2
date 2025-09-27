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
import { doc, getDoc, setDoc } from "./firebase.js";

async function loadSlideConfig() {
  const container = document.getElementById('tab-slides');
  const ref = doc(window.db, 'config', 'slide-config');
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    container.innerHTML = "<p class='text-red-300'>Slide config not found.</p>";
    return;
  }

  const { slides } = snap.data();
  let html = `<h3 class="text-lg font-bold mb-2">Slide Configuration</h3><form id="slideForm" class="space-y-4">`;

  slides.forEach((slide, index) => {
    html += `
      <div class="bg-white/10 p-3 rounded">
        <label class="block font-semibold">${slide.title}</label>
        <input type="number" name="duration-${index}" value="${slide.duration}" class="w-20 p-1 rounded text-black" />
        <label class="ml-4">
          <input type="checkbox" name="visible-${index}" ${slide.visible ? 'checked' : ''} />
          Visible
        </label>
      </div>
    `;
  });

  html += `<button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Save Changes</button></form>`;
  container.innerHTML = html;

  document.getElementById('slideForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const updatedSlides = slides.map((slide, i) => ({
      ...slide,
      duration: parseInt(e.target[`duration-${i}`].value),
      visible: e.target[`visible-${i}`].checked
    }));

    await setDoc(ref, { slides: updatedSlides });
    alert("Slide configuration updated.");
  });
}

document.addEventListener('DOMContentLoaded', loadSlideConfig);
