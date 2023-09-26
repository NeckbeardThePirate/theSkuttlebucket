import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, query, where, addDoc, updateDoc, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";


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


const usersCollection = collection(firestore, 'users');


const allUsersRef = await getDocs(usersCollection);

const searchButton = document.getElementById('button-for-searching');

// const searchTerm = searchInputBar.value


const allUserNames = [];

var searchBarField = document.getElementById('search-space');
const resultsContainer = document.getElementById('results-container');


allUsersRef.forEach((doc) => {
    if(doc.exists()) {
        const userData = doc.data();
        const userName = userData.userName;
        allUserNames.push(userName);
    }
})
console.log(allUserNames)

let filteredUsers = [];


function checkForMatchingUserNames(allUserNames, searchTerm) {
    filteredUsers = [];
    for (let i = 0; i < allUserNames.length; i++) {
        if(allUserNames[i].includes(searchTerm)) {
            filteredUsers.push(allUserNames[i]);
        }
    }
}


function displayMatchingSearchResults(filteredUsers) {
    for (let i = 0; i < filteredUsers.length; i++) {
        const showMatchingUser = document.createElement('div');
        const matchingUserName = document.createElement('h3');
        matchingUserName.textContent = `@${filteredUsers[i]}`
        showMatchingUser.classList.add('found-user')
        matchingUserName.classList.add('found-username')

        resultsContainer.appendChild(showMatchingUser);
        showMatchingUser.appendChild(matchingUserName);
    };
};

searchButton.addEventListener('click', function() {
    var searchTerm = searchBarField.value;
    checkForMatchingUserNames(allUserNames, searchTerm);
    console.log(filteredUsers);
    displayMatchingSearchResults(filteredUsers);
})
