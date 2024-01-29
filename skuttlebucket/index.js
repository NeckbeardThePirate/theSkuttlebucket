import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, query, where, addDoc, updateDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { firebaseConfig } from "../firebaseConfig.js";

console.log('before', firebaseConfig)

let testvar = firebaseConfig;

console.log('after', firebaseConfig)
console.log(FIREBASE_CONFIG, 'MAYBE')

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const firestore = getFirestore(app);

const switchToSignUpButton = document.getElementById('switch-to-register-button');

function login () {
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value 
  
  if (validateEmail(email) == false || validatePassword(password) == false) {
      alert('invalid input')
      return
  }

  signInWithEmailAndPassword(auth, email, password)
  .then(function() {
      var user = auth.currentUser
      var usersCollection = collection(firestore, 'users');
      var userRef = doc(usersCollection, user.uid);
      var userData = {
          lastLogin: Date.now()
      };

      updateDoc(userRef, userData);        
      localStorage.setItem('user', JSON.stringify(user));

      window.location.href = 'skuttlebukket_user.html'
      
  })
  .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      alert(errorMessage, errorCode)
  })
}

function validateEmail(email) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
      return true
  } else {
      return false;
  }
}

function validateUsername(userName) {
  var expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(userName) == true) {
      return false
  } else {
      return true;
  }
}

function validatePassword(password) {
  if (password < 6) {
      return false
  } else {
      return true
  }
}

function validateFields(field) {
  if (field == null) {
      return false
  } 
  if (field.length <= 0) {
      return false;
  } else {
      return true;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", login);
  loginButton.addEventListener("keyup",function(event) {
    if(event.keyCode === 13) {
        register;
        }
    });
});

switchToSignUpButton.addEventListener('click', function() {
    window.location.href = 'signup.html'
})
