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

const userName = userData.userName;

const barnYardToLoad = 'barnyard1'

const barnyardCollection = collection(firestore, 'barnyards');

const findbarnyardquery = query(barnyardCollection, where('DocID', '===', barnYardToLoad))

const barnyardRef = doc(firestore, 'barnyards', barnYardToLoad);

const barnyardSnap = await getDoc(barnyardRef)

var barnyardData = barnyardSnap.data();

const postButton = document.getElementById('message-send-button')

const timelineButton = document.getElementById('timeline-button');

const userProfileButton = document.getElementById('user-profile-button');

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
        const messageBoxContainer = document.createElement('div')
        const messageBox = document.createElement('div')
        const messageInfoContainer = document.createElement('div')
        const messageContent = document.createElement('div')
        const messageAuthorContainer = document.createElement('div')
        const messageTimestampContainer = document.createElement('div')
        if (recentMessagesArray[message].messageAuthor === userName) {
            messageBox.classList.add('sent-message-box');
            messageBoxContainer.classList.add('sent-message-box-container');
        } else {
            messageBox.classList.add('message-box');
            messageBoxContainer.classList.add('message-box-container');
        }
        messageBox.classList.add('all-text');
        messageInfoContainer.classList.add('message-info-container');
        messageContent.classList.add('message-content');
        messageContent.classList.add('post-data-block');
        messageAuthorContainer.classList.add('post-data-block');
        messageTimestampContainer.classList.add('post-data-block');

        messageContent.textContent = `${recentMessagesArray[message].messageText}`
        messageAuthorContainer.textContent = `@${recentMessagesArray[message].messageAuthor}`
        messageTimestampContainer.textContent = `${recentMessagesArray[message].messageTimestamp}`
        feedBin.appendChild(messageBoxContainer);
        messageBoxContainer.appendChild(messageBox);
        messageBox.appendChild(messageInfoContainer);
        messageInfoContainer.appendChild(messageAuthorContainer);
        messageInfoContainer.appendChild(messageTimestampContainer);
        messageBox.appendChild(messageContent);
    }
}



async function createNewPost() {
    const postText = document.getElementById('message-input')
    const messageTimestamp = Date.now()
    const newPost = {
        messageAuthor: userData['userName'],
        messageTimestamp: messageTimestamp,
        messageText: postText.value,
    }

    postText.value = ''
    postText.focus()
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

function loadBarnYardAnimals() {
    const animalsArray = barnyardData.authorizedUsers;
    console.log(animalsArray)
    const membershipWindow = document.getElementById('membership-window');
    for (const animal of animalsArray) {
        const barnyardAnimalContainer = document.createElement('div');
        barnyardAnimalContainer.textContent = `@${animal}`
        barnyardAnimalContainer.classList.add('barnyard-animal-container')
        barnyardAnimalContainer.classList.add('all-text')
        membershipWindow.appendChild(barnyardAnimalContainer)
    }
}

loadBarnYardAnimals()
userProfileButton.addEventListener('keyup', function(event) {
    if (event.keycode === 13) {
        window.location.href = 'skuttlebukket_user.html'
    }
})

userProfileButton.addEventListener('click', function() {
    window.location.href = 'skuttlebukket_user.html'
})

timelineButton.addEventListener('click', function() {
    window.location.href = 'timeline.html'
})

timelineButton.addEventListener('keyup', function(event) {
    if (event.keycode === 13) {
        window.location.href = 'timeline.html'
    }
})