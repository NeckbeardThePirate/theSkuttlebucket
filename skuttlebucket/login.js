import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, query, where, addDoc, updateDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAnvmVyCWmYiQlbXa8kF_bYeKbLmf8_Rhk",
    // authDomain: "theskuttlebucket.firebaseapp.com", <- this is my real domain
    authDomain: "theskuttlebucket.firebaseapp.com",
    projectId: "theskuttlebucket",
    storageBucket: "theskuttlebucket.appspot.com",
    messagingSenderId: "694795060337",
    appId: "1:694795060337:web:587136163506c2f83d47d0",
    measurementId: "G-BLWVYSCCS5"
    };

//VERY IMPORTANT TO REMOVE THE ["host": "localhost",] line from the firebase.json file before going live
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const firestore = getFirestore(app);


function register() {
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  var fullName = document.getElementById('full-name').value
  var userName = document.getElementById('username').value


  
  if (
      validateEmail(email) == false || 
      validatePassword(password) == false || 
      validateFields(fullName) == false ||
      validateUsername(userName) == false
      ) {
      alert('invalid input')
      return
  }


  const usersCollection = collection(firestore, 'users');
  const usernameAvailabilityQuery = query(usersCollection, where('userName', '==', userName));

  getDocs(usernameAvailabilityQuery)
      .then((querySnapshot) => {
          if (!querySnapshot.empty) {
              alert('that username is unavailable');
              return;
          } else {
              createUserWithEmailAndPassword(auth, email, password)
                  .then(async function() {
                      const user = auth.currentUser
                      var userData = {
                          email: email,
                          fullName: fullName,
                          lastLogin: Date.now(),
                          userName: userName,
                          buckets: {}
                      };

                      const userRef = await addDoc(usersCollection, userData);        
                      
                      alert('user created')
                  })
                  .catch(function(error) {
                      var errorCode = error.code;
                      var errorMessage = error.message;

                      alert(errorMessage, errorCode)
                  })
                          }
                      })
  

}
function login () {
  // var userName = document.getElementById('username').value
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  
  
  if (validateEmail(email) == false || validatePassword(password) == false) {
      alert('invalid input')
      return
  }

  signInWithEmailAndPassword(auth, email, password)
  .then(function() {
      const user = auth.currentUser
      const usersCollection = collection(firestore, 'users');
      const userRef = doc(usersCollection, user.uid);
      const userData = {
          lastLogin: Date.now()
      };

      updateDoc(userRef, userData);        
      
      
      alert('user logged in')
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
  if (expression.test(email) == true) {
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
  document.getElementById("login-button").addEventListener("click", login);
});

