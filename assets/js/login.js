const form = document.getElementById("loginForm");
const errorEl = document.getElementById("loginError");

// 🌠 Ambient Background
const bg = document.getElementById("ambient-bg");
const hour = new Date().getHours();
if (hour < 12) bg.style.backgroundImage = "url('../assets/bg-morning.jpg')";
else if (hour < 17) bg.style.backgroundImage = "url('../assets/bg-afternoon.jpg')";
else bg.style.backgroundImage = "url('../assets/bg-evening.jpg')";

// 🔐 Login Logic
form.onsubmit = (e) => {
  e.preventDefault();
  const user = form.username.value.trim();
  const pass = form.password.value.trim();
  const role = new URLSearchParams(window.location.search).get("role");

  const valid =
    (user === "admin" && pass === "1234" && role === "admin") ||
    (user === "teacher" && pass === "1234" && role === "teacher");

  if (valid) {
    const target =
      role === "admin" ? "../pages/admin.html" : "../pages/teacher-portal.html";
    window.location.href = target;
  } else {
    errorEl.classList.remove("hidden");
  }
};
