import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc
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

// 🧩 Utility: Render List Item
function renderItem(text, id, listEl, collectionName) {
  const li = document.createElement("li");
  li.textContent = text;
  li.className = "bg-white/10 p-2 rounded flex justify-between items-center";
  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.className = "ml-4 text-red-400 hover:text-red-200";
  delBtn.onclick = async () => {
    await deleteDoc(doc(db, collectionName, id));
  };
  li.appendChild(delBtn);
  listEl.appendChild(li);
}

// 👨‍🏫 Teachers
const teacherForm = document.getElementById("teacherForm");
const teacherList = document.getElementById("teacherList");
teacherForm.onsubmit = async (e) => {
  e.preventDefault();
  const name = teacherForm.teacherName.value.trim();
  const subject = teacherForm.teacherSubject.value.trim();
  const contact = teacherForm.teacherContact.value.trim();
  if (name && subject && contact) {
    await addDoc(collection(db, "teachers"), { name, subject, contact });
    teacherForm.reset();
  }
};
onSnapshot(collection(db, "teachers"), (snapshot) => {
  teacherList.innerHTML = "";
  snapshot.forEach(doc => {
    const t = doc.data();
    renderItem(`${t.name} · ${t.subject} · ${t.contact}`, doc.id, teacherList, "teachers");
  });
});

// 🏫 Classes
const classForm = document.getElementById("classForm");
const classList = document.getElementById("classList");
classForm.onsubmit = async (e) => {
  e.preventDefault();
  const name = classForm.className.value.trim();
  const grade = classForm.classGrade.value.trim();
  if (name && grade) {
    await addDoc(collection(db, "classes"), { name, grade });
    classForm.reset();
  }
};
onSnapshot(collection(db, "classes"), (snapshot) => {
  classList.innerHTML = "";
  snapshot.forEach(doc => {
    const c = doc.data();
    renderItem(`${c.name} · Grade ${c.grade}`, doc.id, classList, "classes");
  });
});

// 📚 Sections
const sectionForm = document.getElementById("sectionForm");
const sectionList = document.getElementById("sectionList");
sectionForm.onsubmit = async (e) => {
  e.preventDefault();
  const name = sectionForm.sectionName.value.trim();
  const linkedClass = sectionForm.sectionClass.value.trim();
  if (name && linkedClass) {
    await addDoc(collection(db, "sections"), { name, linkedClass });
    sectionForm.reset();
  }
};
onSnapshot(collection(db, "sections"), (snapshot) => {
  sectionList.innerHTML = "";
  snapshot.forEach(doc => {
    const s = doc.data();
    renderItem(`${s.name} · Class ${s.linkedClass}`, doc.id, sectionList, "sections");
  });
});

// 🖥️ Slides
const slideForm = document.getElementById("slideForm");
const slideList = document.getElementById("slideList");
slideForm.onsubmit = async (e) => {
  e.preventDefault();
  const title = slideForm.slideTitle.value.trim();
  const message = slideForm.slideMessage.value.trim();
  const image = slideForm.slideImage.value.trim();
  if (title && message && image) {
    await addDoc(collection(db, "slides"), { title, message, image });
    slideForm.reset();
  }
};
onSnapshot(collection(db, "slides"), (snapshot) => {
  slideList.innerHTML = "";
  snapshot.forEach(doc => {
    const s = doc.data();
    renderItem(`${s.title} · ${s.message}`, doc.id, slideList, "slides");
  });
});
