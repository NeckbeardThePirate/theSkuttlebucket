import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, query, where, addDoc, updateDoc, getDocs, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";


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

const firestore = getFirestore(app);

const auth = getAuth(app); 

if (localStorage.length === 0) {
    window.location.href = 'index.html'
};

const barnYardToLoad = 'barnyard1'
const barnyardCollection = collection(firestore, 'barnyards');

const findbarnyardquery = query(barnyardCollection, where('DocID', '===', barnYardToLoad))

const barnyardRef = doc(firestore, 'barnyards', barnYardToLoad);

const barnyardSnap = await getDoc(barnyardRef)

if (barnyardSnap.exists()) {
    var barnyardData = barnyardSnap.data();
}

function loadRecentPosts() {
    const feedBin = document.getElementById('main-display')
    const messages = barnyardData.recentMessages;
    for (const message in messages)  {
        console.log(messages[message])
        const messageBox = document.createElement('div')
        const messageInfoContainer = document.createElement('div')
        const messageContent = document.createElement('div')
        const messageAuthorContainer = document.createElement('div')
        const messageTimestampContainer = document.createElement('div')

        messageBox.classList.add('message-box');
        messageBox.classList.add('all-text');
        messageInfoContainer.classList.add('message-info-container');
        messageContent.classList.add('message-content');messageBox.classList.add('message-box');
        messageInfoContainer.classList.add('message-info-container');
        messageContent.classList.add('message-content');

        messageContent.textContent = `${messages[message].messageText}`
        messageAuthorContainer.textContent = `@${messages[message].messageAuthor}`
        messageTimestampContainer.textContent = `${messages[message].messageTimestamp}`
        feedBin.appendChild(messageBox);
        messageBox.appendChild(messageInfoContainer);
        messageInfoContainer.appendChild(messageAuthorContainer);
        messageInfoContainer.appendChild(messageTimestampContainer);
        messageBox.appendChild(messageContent);
    }
}

loadRecentPosts()