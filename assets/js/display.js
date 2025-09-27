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

import { doc, getDoc } from "./firebase.js";

async function loadSlides() {
  const ref = doc(window.db, 'config', 'slide-config');
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const { slides } = snap.data();
  const activeSlides = slides.filter(s => s.visible);
  rotateSlides(activeSlides);
}

function rotateSlides(slides) {
  const container = document.getElementById('slideContainer');
  let index = 0;

  function showSlide() {
    const slide = slides[index];
    container.textContent = slide.title;
    container.classList.add('fade-in');
    setTimeout(() => container.classList.remove('fade-in'), 1000);

    index = (index + 1) % slides.length;
    setTimeout(showSlide, slide.duration * 1000);
  }

  showSlide();
}

document.addEventListener('DOMContentLoaded', loadSlides);

function showSpotlight(name, reason, photo) {
  const block = document.getElementById('spotlight');
  block.querySelector('img').src = photo;
  block.querySelector('p:nth-child(2)').textContent = name;
  block.querySelector('p:nth-child(3)').textContent = reason;
  block.classList.remove('hidden');
}



