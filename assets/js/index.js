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
function updateClockTitle() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  document.title = `GHS Dashboard · ${time}`;
}

// Initial call + update every minute
updateClockTitle();
setInterval(updateClockTitle, 60000);
