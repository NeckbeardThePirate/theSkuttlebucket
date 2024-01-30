import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAnvmVyCWmYiQlbXa8kF_bYeKbLmf8_Rhk",
    authDomain: "theskuttlebucket.firebaseapp.com",
    projectId: "theskuttlebucket",
    storageBucket: "theskuttlebucket.appspot.com",
    messagingSenderId: "694795060337",
    appId: "1:694795060337:web:587136163506c2f83d47d0",
    measurementId: "G-BLWVYSCCS5"
}



const app = initializeApp(firebaseConfig);

const auth = getAuth(app); 

const firestore = getFirestore(app);

const switchToSignUpButton = document.getElementById('switch-to-register-button');

const passwordField = document.getElementById('password');

const passResetButton = document.getElementById('forgot-password');



function login() {
  const email = document.getElementById('email').value

  const password = document.getElementById('password').value
  
  if (validateEmail(email) === false || validatePassword(password) === false) {
      alert('invalid input')
      return
  }

  signInWithEmailAndPassword(auth, email, password)
  .then(function() {
      const user = auth.currentUser;

      const usersCollection = collection(firestore, 'users');
      
      const userRef = doc(usersCollection, user.uid);
      
      const userData = {
          lastLogin: Date.now()
      };

      updateDoc(userRef, userData);        
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = 'skuttlebukket_user.html'
  })
  .catch(function(error) {
      const errorCode = error.code;

      const errorMessage = error.message;

      alert(errorMessage, errorCode)
  })
}

function validateEmail(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/

  if (expression.test(email) == true) {
      return true
  } else {
      return false;
  }
}

function validatePassword(password) {
  if (password < 6) {
      return false
  } else {
      return true
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const loginButton = document.getElementById("login-button");

  loginButton.addEventListener("click", login);
  loginButton.addEventListener("keyup",function(event) {
    if(event.key === 13) {
        register;
        }
    });
});

switchToSignUpButton.addEventListener('click', function() {
    window.location.href = 'signup.html'
})



passwordField.addEventListener('keydown', function() {
        if (event.key === 'Enter') {
        login()
    }
})

function sendResetEmail() {
    const emailAddress = document.getElementById('email').value;

    sendPasswordResetEmail(auth, emailAddress)
        .then(() => {
            alert('A reset email has been sent')
        })
        .catch((err) => {
            alert(err.message)
        })
}

passResetButton.addEventListener('click', function() {
    sendResetEmail()
    console.log('reset email button triggered')
})