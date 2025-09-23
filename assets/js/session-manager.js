const loginForm = document.getElementById('admin-login');
const dashboard = document.getElementById('admin-dashboard');
const loginSection = document.getElementById('login-section');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;

  if (username === 'Admin' && password === 'kikukiku') {
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
  } else {
    alert('Invalid credentials');
  }
});

// Teacher Management
const teacherList = document.getElementById('teacher-list');
function addTeacher() {
  const name = document.getElementById('new-teacher').value.trim();
  if (name) {
    const li = document.createElement('li');
    li.textContent = name;
    teacherList.appendChild(li);
    document.getElementById('new-teacher').value = '';
  }
}

// Class Management
const classList = document.getElementById('class-list');
function addClass() {
  const name = document.getElementById('new-class').value.trim();
  if (name) {
    const li = document.createElement('li');
    li.textContent = name;
    classList.appendChild(li);
    document.getElementById('new-class').value = '';
  }
}

// Vacant Periods
const vacantForm = document.getElementById('vacant-form');
const vacantLog = document.querySelector('#vacant-log tbody');

vacantForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const date = document.getElementById('vacant-date').value;
  const className = document.getElementById('vacant-class').value;
  const period = document.getElementById('vacant-period').value;
  const assigned = document.getElementById('assigned-teacher').value;
  const absent = document.getElementById('absent-teacher').value;

  const row = document.createElement('tr');
  row.innerHTML = `<td>${date}</td><td>${className}</td><td>${period}</td><td>${assigned}</td><td>${absent}</td>`;
  vacantLog.appendChild(row);

  vacantForm.reset();
});
