// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
// import { 
//     getAuth,
//     connectAuthEmulator,
//     signInWithEmailAndPassword,
//     createUserWithEmailAndPassword,
// } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"; // Corrected import


// const firebaseConfig = {
// apiKey: "AIzaSyAnvmVyCWmYiQlbXa8kF_bYeKbLmf8_Rhk",
// authDomain: "theskuttlebucket.firebaseapp.com",
// projectId: "theskuttlebucket",
// storageBucket: "theskuttlebucket.appspot.com",
// messagingSenderId: "694795060337",
// appId: "1:694795060337:web:587136163506c2f83d47d0",
// measurementId: "G-BLWVYSCCS5"
// };
// console.log('hello there')
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099");
// console.log('line 25')
// const loginEmailPassword = async () => {
//     var loginEmail = txtEmail.value;
//     var loginPassword = txtPassword.value;
//     console.log(loginEmail)


//     const usercredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
//     console.log(userCredential.user);
// }

// createUserWithEmailAndPassword(auth, loginEmail, loginPassword)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });
//   var ui = new firebaseui.auth.AuthUI(firebase.auth());

//   // Configure the Auth UI to use email/password sign-in.
// ui.start('#firebaseui-auth-container', {
//     signInOptions: [
//       firebase.auth.EmailAuthProvider.PROVIDER_ID
//     ],
//     // Other config options...
//   });
  
//   firebase.auth().createUserWithEmailAndPassword(loginEmail, password)
//   .then((userCredential) => {
//     // Signed in
//     var user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ..
//   });

//   firebase.auth().signInWithEmailAndPassword(loginEmail, password)
//   .then((userCredential) => {
//     // Signed in
//     var user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ..
//   });


//   ui.start('#firebaseui-auth-container', {
//     signInOptions: [
//       firebase.auth.EmailAuthProvider.PROVIDER_ID
//     ],
//     // Other config options...
//   });
// console.log('got to the bottom')
  