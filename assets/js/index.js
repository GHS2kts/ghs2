function setAmbientBackground() {
  const hour = new Date().getHours();
  const bg = document.getElementById('ambient-bg');

  if (hour >= 6 && hour < 12) {
    bg.style.backgroundImage = "url('assets/bg-morning.jpg')";
  } else if (hour >= 12 && hour < 18) {
    bg.style.backgroundImage = "url('assets/bg-afternoon.jpg')";
  } else {
    bg.style.backgroundImage = "url('assets/bg-evening.jpg')";
  }

  bg.style.transition = 'background-image 1s ease-in-out';
}

document.addEventListener('DOMContentLoaded', setAmbientBackground);
