function updateDateTime() {
  const now = new Date();
  const datetime = now.toLocaleString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  document.getElementById('datetime').textContent = datetime;
}

setInterval(updateDateTime, 1000);
updateDateTime();
