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
const userFromLogin = JSON.parse(localStorage.getItem('user'));

const userUID = userFromLogin.uid

const usersCollection = collection(firestore, 'users');

const findUserQuery = query(usersCollection, where('userID', '==', userUID));

const userRef = await getDocs(findUserQuery);

const DocID = userRef.docs[0].id;

const userDocRef = doc(firestore, 'users', DocID);

const userDocSnap = await getDoc(userDocRef);

const userData = userDocSnap.data();

console.log(userData)

const barnYardToLoad = 'barnyard1'

const barnyardCollection = collection(firestore, 'barnyards');

const findbarnyardquery = query(barnyardCollection, where('DocID', '===', barnYardToLoad))

const barnyardRef = doc(firestore, 'barnyards', barnYardToLoad);

const barnyardSnap = await getDoc(barnyardRef)

var barnyardData = barnyardSnap.data();

const postButton = document.getElementById('message-send-button')

let recentMessagesArray = barnyardData.recentMessages

let elderlyMessagesArray = barnyardData.elderlyMessages

postButton.addEventListener('click', function() {
    createNewPost()
})

postButton.addEventListener('keyup', function(event) {
    if (event.keycode === 13) {
        createNewPost()
    }
})

async function loadRecentPosts() {
    const feedBin = document.getElementById('posted-messages-container')
    const barnyardSnap = await getDoc(barnyardRef)

    let barnyardData = barnyardSnap.data();

    let recentMessagesArray = barnyardData.recentMessages

    for (const message in recentMessagesArray)  {
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

        messageContent.textContent = `${recentMessagesArray[message].messageText}`
        messageAuthorContainer.textContent = `@${recentMessagesArray[message].messageAuthor}`
        messageTimestampContainer.textContent = `${recentMessagesArray[message].messageTimestamp}`
        feedBin.appendChild(messageBox);
        messageBox.appendChild(messageInfoContainer);
        messageInfoContainer.appendChild(messageAuthorContainer);
        messageInfoContainer.appendChild(messageTimestampContainer);
        messageBox.appendChild(messageContent);
    }
}



async function createNewPost() {
    const postText = document.getElementById('message-input').value
    const messageTimestamp = Date.now()
    const newPost = {
        messageAuthor: userData['userName'],
        messageTimestamp: messageTimestamp,
        messageText: postText,
    }

    console.log(newPost);

    recentMessagesArray.unshift(newPost);
    console.log(recentMessagesArray);
    updateRecentArray();
    clearPosts();
    loadRecentPosts();
    try {
        await updateDoc(barnyardRef, { 
            recentMessages: recentMessagesArray,
            elderlyMessages: elderlyMessagesArray
         })
    } catch (error) {
        console.log('error: ', error);
    }
}

function clearPosts() {
    const feedBin = document.getElementById('posted-messages-container')
    if (feedBin.firstChild) {
        while (feedBin.firstChild) {
            const firstChild = feedBin.firstChild;
            feedBin.removeChild(firstChild)
        }
    }
}

function updateRecentArray() {
    while (recentMessagesArray.length > 100) {
        const toRotateOut = recentMessagesArray.length - 1;
        elderlyMessagesArray.unshift(recentMessagesArray[toRotateOut]);
        recentMessagesArray.pop()
    }
}



loadRecentPosts()

onSnapshot(barnyardRef, (doc) => {
    if (doc.exists()) {
        clearPosts()
        loadRecentPosts();
    } else {
        console.log("No such document exists!");
    }
});