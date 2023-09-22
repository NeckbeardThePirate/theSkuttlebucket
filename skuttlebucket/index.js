import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, ref, set, update, child } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";


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
  const database = getDatabase(app);

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

    const usersRef = collection(database, 'users');
    const query = query(usersRef, where('userName', '==', userName));

    getDocs(query)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                alert('That Username is already in use');
                return;
            }
        })


    createUserWithEmailAndPassword(auth, email, password)
    .then(function() {
        var user = auth.currentUser
        var database = getDatabase();
        var databaseRef = ref(database);
        var userData = {
            email: email,
            fullName: fullName,
            lastLogin: Date.now(),
            userName: userName,
        };

        set(child(databaseRef, 'users/' + user.uid), userData);        
        
        alert('user created')
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        alert(errorMessage, errorCode)
    })

  }
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
        var database = getDatabase();
        var databaseRef = ref(database);
        var userData = {
            lastLogin: Date.now()
        };

        update(child(databaseRef, 'users/' + user.uid), userData);        
        
        
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
    document.getElementById("register-button").addEventListener("click", register);
});
