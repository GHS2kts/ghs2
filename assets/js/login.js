document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role') || 'guest';
  const roleName = document.getElementById('roleName');
  const roleLabel = document.getElementById('roleLabel');
  const loginBtn = document.getElementById('loginBtn');
  const status = document.getElementById('loginStatus');

  roleName.textContent = role.charAt(0).toUpperCase() + role.slice(1);

  loginBtn.addEventListener('click', () => {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (!user || !pass) {
      status.textContent = "Please enter both username and password.";
      return;
    }

    // 🔐 Replace this with real auth logic later
    if (user === "admin" && pass === "1234" && role === "admin") {
      window.location.href = "../pages/admin.html";
    } else if (user === "teacher" && pass === "1234" && role === "teacher") {
      window.location.href = "../pages/teacher-portal.html";
    } else {
      status.textContent = "Invalid credentials or role mismatch.";
    }
  });
});
