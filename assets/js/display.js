import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getFirestore, collection, onSnapshot
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

// 🖥️ Slide Rotation
const titleEl = document.getElementById("slideTitle");
const msgEl = document.getElementById("slideMessage");
const imgEl = document.getElementById("slideImage");

let slides = [];
let index = 0;

function showSlide(i) {
  const s = slides[i];
  titleEl.textContent = s.title;
  msgEl.textContent = s.message;
  imgEl.src = s.image;
}

onSnapshot(collection(db, "slides"), (snapshot) => {
  slides = [];
  snapshot.forEach(doc => slides.push(doc.data()));
  if (slides.length > 0) {
    index = 0;
    showSlide(index);
    setInterval(() => {
      index = (index + 1) % slides.length;
      showSlide(index);
    }, 8000);
  }
});
