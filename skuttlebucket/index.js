import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, query, where, addDoc, updateDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAnvmVyCWmYiQlbXa8kF_bYeKbLmf8_Rhk",
    authDomain: "theskuttlebucket.firebaseapp.com",
    projectId: "theskuttlebucket",
    storageBucket: "theskuttlebucket.appspot.com",
    messagingSenderId: "694795060337",
    appId: "1:694795060337:web:587136163506c2f83d47d0",
    measurementId: "G-BLWVYSCCS5"
    };

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
                    localStorage.setItem('userName', userName);
                      const user = auth.currentUser
                      var userData = {
                          email: email,
                          fullName: fullName,
                          lastLogin: Date.now(),
                          userName: userName,
                          buckets: {},
                          userID: user.uid,
                          joinDate: Date.now(),
                          followerCount: 0,
                          followingCount: 0,
                          userDescription: '',
                          followingList: {},
                          followerList: {},
                      };

                      const userRef = await addDoc(usersCollection, userData);        
                      localStorage.setItem('user', JSON.stringify(user));
                      

                      window.location.href = 'skuttlebukket_user.html' //this needs to inclue skuttlebucket.judahhelland.com/ for live version

                      
                  })
                  .catch(function(error) {
                      var errorCode = error.code;
                      var errorMessage = error.message;

                      alert(errorMessage, errorCode)
                  })
                          }
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
  var expression = /[^a-zA-Z0-9.-_]/g;
  if (expression.test(userName) == true) {
    alert('[INVALID USERNAME] UserNames may only contain alphanumeric upper and lowercase letters and the special charachters "-", "_", and "."')  
    return false
  } else {
      return true;
  }
}
function validateName(fullName) {
    var expression = /[^a-zA-Z]/g;
    if (expression.test(userName) == true) {
        alert('[INVALID FULL NAME]');
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
    const registerButton = document.getElementById("register-button")
    registerButton.addEventListener("click", register);
    registerButton.addEventListener("keyup",function(event) {
        if(event.keyCode === 13) {
            register;
            }
        });
    });

