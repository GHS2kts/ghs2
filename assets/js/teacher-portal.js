import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, serverTimestamp, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🌠 Ambient Background
const bg = document.getElementById("ambient-bg");
const hour = new Date().getHours();
if (hour < 12) bg.style.backgroundImage = "url('../assets/bg-morning.jpg')";
else if (hour < 17) bg.style.backgroundImage = "url('../assets/bg-afternoon.jpg')";
else bg.style.backgroundImage = "url('../assets/bg-evening.jpg')";

// 🕒 Smart Period Detection
async function detectPeriod() {
  const now = new Date();
  const day = now.toLocaleDateString("en-PK", { weekday: "long" });
  const hour = now.getHours();
  const periodRef = doc(db, "periods", day);
  const snap = await getDoc(periodRef);
  if (snap.exists()) {
    const periods = snap.data().slots;
    const current = periods.find(p => hour >= p.start && hour < p.end);
    const display = current ? `Current Period: ${current.name}` : "No active period";
    const el = document.createElement("p");
    el.textContent = display;
    el.className = "text-yellow-300 font-semibold text-lg animate-glow mt-4";
    document.body.querySelector("section").appendChild(el);
  }
}
detectPeriod();

// 📝 Attendance Submission
document.querySelector("#notes")?.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submitAttendance();
  }
});
document.querySelector("button.btn-role")?.addEventListener("click", submitAttendance);

async function submitAttendance() {
  const notes = document.getElementById("notes").value.trim();
  if (notes) {
    await addDoc(collection(db, "attendance"), {
      notes,
      timestamp: serverTimestamp()
    });
    document.getElementById("notes").value = "";
    alert("✅ Attendance submitted");
  }
}

// 🌟 Student Spotlight
document.querySelector("#studentName")?.addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("achievement").focus();
});
document.querySelector("#achievement")?.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submitSpotlight();
  }
});
document.querySelectorAll("button.btn-role")[1]?.addEventListener("click", submitSpotlight);

async function submitSpotlight() {
  const name = document.getElementById("studentName").value.trim();
  const reason = document.getElementById("achievement").value.trim();
  if (name && reason) {
    await addDoc(collection(db, "spotlights"), {
      name,
      reason,
      timestamp: serverTimestamp()
    });
    document.getElementById("studentName").value = "";
    document.getElementById("achievement").value = "";
    alert("🌟 Spotlight submitted");
  }
}

// 📦 Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../service-worker.js");
}
