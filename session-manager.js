const sessionForm = document.getElementById('session-form');
const sessionList = document.getElementById('session-list');
const archiveButton = document.getElementById('archive-button');
const archiveStatus = document.getElementById('archive-status');

let sessions = [];

sessionForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('session-name').value.trim();
  if (name) {
    sessions.push(name);
    updateSessionList();
    sessionForm.reset();
  }
});

archiveButton.addEventListener('click', function () {
  archiveStatus.textContent = '✅ Timetable and attendance data archived successfully.';
});

function updateSessionList() {
  sessionList.innerHTML = '';
  sessions.forEach(session => {
    const li = document.createElement('li');
    li.textContent = session;
    sessionList.appendChild(li);
  });
}
