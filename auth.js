import { auth, googleProvider } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const authSection = document.getElementById("authSection");
const appSection = document.querySelector(".app");
const authMessage = document.getElementById("authMessage");

appSection.style.display = "none";

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    authMessage.textContent = "Account created successfully!";
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    authMessage.textContent = error.message;
  }
});
document.getElementById("forgotPasswordBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();

    if (!email) {
        authMessage.textContent = "Please enter your email first.";
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        authMessage.textContent = "Password reset link sent to your email!";
    } catch (error) {
        authMessage.textContent = error.message;
    }
});

document.getElementById("googleLoginBtn").addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = "none";
    appSection.style.display = "block";
  } else {
    authSection.style.display = "block";
    appSection.style.display = "none";
  }
});
document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        authMessage.textContent = error.message;
    }
});