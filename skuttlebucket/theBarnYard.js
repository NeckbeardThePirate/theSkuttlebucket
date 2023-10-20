import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, query, where, addDoc, updateDoc, getDocs, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// import { docSnap } from "./userProfile";


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

let usersBarnyards = userData.barnyards;

const barnYardToLoad = 'barnyard1'

const barnyardCollection = collection(firestore, 'barnyards');

const allBarnyardsRef = await getDocs(barnyardCollection);

// const allBarnyardsSnap = docSnap(allBarnyardsRef);

// const allBarnyardsData = allBarnyardsSnap.data()

const findbarnyardquery = query(barnyardCollection, where('DocID', '===', barnYardToLoad))

const barnyardRef = doc(firestore, 'barnyards', barnYardToLoad);

const barnyardSnap = await getDoc(barnyardRef)

var barnyardData = barnyardSnap.data();

const postButton = document.getElementById('message-send-button')

const timelineButton = document.getElementById('timeline-button');

const userProfileButton = document.getElementById('user-profile-button');

let recentMessagesArray = barnyardData.recentMessages

let elderlyMessagesArray = barnyardData.elderlyMessages

const allUsersRef = await getDocs(usersCollection);

let searchValue = '';

const createBarnyardButton = document.getElementById('create-button');

let allUserNames = [];

let filteredUsers = [];

let checkFilteredUsers = [];

let AUList = [];

allUsersRef.forEach((doc) => {
    if(doc.exists()) {
        const userData = doc.data();
        const userName = userData.userName;
        allUserNames.push(userName);
        checkFilteredUsers.push(userName)
    }
})

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

    
    try {
        const refreshedData = await getDoc(barnyardRef)
        barnyardData = refreshedData.data();
        recentMessagesArray = barnyardData.recentMessages
        elderlyMessagesArray = barnyardData.elderlyMessages
        recentMessagesArray.unshift(newPost);
        updateRecentArray();
        await updateDoc(barnyardRef, { 
            recentMessages: recentMessagesArray,
            elderlyMessages: elderlyMessagesArray
         }).then(() => {
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

const textInputArea = document.getElementById('message-input')

textInputArea.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        createNewPost();
    }
})


function loadAvailableBarnYards() {
    const leftPanel = document.getElementById('left-sidebar')
    for (const barnyard in usersBarnyards) {
        const barnyardContainer = document.createElement('div')
        const barnyardTitle = document.createElement('h3');
        const barnyardDescription = document.createElement('p');
        const barnyardMembers = document.createElement('p');
        const stringBarnYardMemebers = usersBarnyards[barnyard].barnyardMembers 
        barnyardTitle.textContent = usersBarnyards[barnyard].barnyardTitle;
        barnyardDescription.textContent = usersBarnyards[barnyard].barnyardDescription;
        barnyardMembers.textContent = stringBarnYardMemebers.toString();

        barnyardContainer.classList.add('info-window')

        leftPanel.appendChild(barnyardContainer);
        barnyardContainer.appendChild(barnyardTitle);
        barnyardContainer.appendChild(barnyardDescription);
        barnyardContainer.appendChild(barnyardMembers);

    }
}

function openCreateNewBarnyardWindow() {
    AUList = []
    const displayCreateNewBarnyardWindowBackground = document.createElement('div');
    const displayCreateNewBarnyardWindowContent = document.createElement('div');
    const displayCreateNewBarnyardWindowHeader = document.createElement('h2');
    const displayCreateNewBarnyardWindowHeaderContainer = document.createElement('div');
    const displayCreateNewBarnyardWindowContentBlock = document.createElement('div');
    const displayCreateNewBarnyardWindowContentBlockBarnyardNameHeaderContainer = document.createElement('div');
    const displayCreateNewBarnyardWindowContentBlockBarnyardNameHeader = document.createElement('h3');
    const displayCreateNewBarnyardWindowContentBlockBarnyardName = document.createElement('input');
    const displayCreateNewBarnyardWindowContentBlockAuthorizedUsersHeaderContainer = document.createElement('div');
    const displayCreateNewBarnyardWindowContentBlockAuthorizedUsersHeader = document.createElement('h3');
    const displayCreateNewBarnyardWindowContentBlockAuthorizedUsers = document.createElement('input');
    const displayCreateNewBarnyardWindowContentBlockSearchResultsContainer = document.createElement('div');
    const finalizeBarnyardCreationButton = document.createElement('button');

    displayCreateNewBarnyardWindowHeader.textContent = 'Fill in your Barnyard info: ';
    // displayCreateNewBarnyardWindowContentBlockAuthorizedUsersAddButton.textContent = 'Add';
    finalizeBarnyardCreationButton.textContent = 'Go!';
    displayCreateNewBarnyardWindowContentBlockAuthorizedUsersHeader.textContent = 'Add Users: ';
    displayCreateNewBarnyardWindowContentBlockBarnyardNameHeader.textContent = 'Barnyard Name: ';

    displayCreateNewBarnyardWindowContentBlockBarnyardName.id = 'new-barnyard-name'
    displayCreateNewBarnyardWindowContentBlockAuthorizedUsers.id = 'new-barnyard-AU'
    displayCreateNewBarnyardWindowContentBlockSearchResultsContainer.id = 'search-results-container';

    displayCreateNewBarnyardWindowBackground.classList.add('modal');
    displayCreateNewBarnyardWindowContent.classList.add('modal-content');
    displayCreateNewBarnyardWindowContentBlock.classList.add('modal-content-block');
    displayCreateNewBarnyardWindowHeaderContainer.classList.add('modal-header');
    displayCreateNewBarnyardWindowHeader.classList.add('modal-header-content');
    displayCreateNewBarnyardWindowHeader.classList.add('all-text');
    displayCreateNewBarnyardWindowContentBlockBarnyardNameHeader.classList.add('all-text');
    displayCreateNewBarnyardWindowContentBlockBarnyardNameHeaderContainer.classList.add('interior-element');
    displayCreateNewBarnyardWindowContentBlockAuthorizedUsersHeaderContainer.classList.add('interior-element');
    displayCreateNewBarnyardWindowContentBlockAuthorizedUsersHeader.classList.add('all-text');
    displayCreateNewBarnyardWindowContentBlockAuthorizedUsers.classList.add('modal-content-piece');
    displayCreateNewBarnyardWindowContentBlockBarnyardName.classList.add('modal-content-piece');

    document.body.appendChild(displayCreateNewBarnyardWindowBackground);
    displayCreateNewBarnyardWindowBackground.appendChild(displayCreateNewBarnyardWindowContent);
    displayCreateNewBarnyardWindowContent.appendChild(displayCreateNewBarnyardWindowHeaderContainer);
    displayCreateNewBarnyardWindowHeaderContainer.appendChild(displayCreateNewBarnyardWindowHeader);
    displayCreateNewBarnyardWindowContent.appendChild(displayCreateNewBarnyardWindowContentBlock);
    displayCreateNewBarnyardWindowContentBlock.appendChild(displayCreateNewBarnyardWindowContentBlockBarnyardNameHeaderContainer);
    displayCreateNewBarnyardWindowContentBlockBarnyardNameHeaderContainer.appendChild(displayCreateNewBarnyardWindowContentBlockBarnyardNameHeader);
    displayCreateNewBarnyardWindowContentBlock.appendChild(displayCreateNewBarnyardWindowContentBlockBarnyardName);
    displayCreateNewBarnyardWindowContentBlock.appendChild(displayCreateNewBarnyardWindowContentBlockAuthorizedUsersHeaderContainer);
    displayCreateNewBarnyardWindowContentBlockAuthorizedUsersHeaderContainer.appendChild(displayCreateNewBarnyardWindowContentBlockAuthorizedUsersHeader);
    displayCreateNewBarnyardWindowContentBlock.appendChild(displayCreateNewBarnyardWindowContentBlockAuthorizedUsers);
    displayCreateNewBarnyardWindowContentBlock.appendChild(displayCreateNewBarnyardWindowContentBlockSearchResultsContainer)
    displayCreateNewBarnyardWindowContent.appendChild(finalizeBarnyardCreationButton);

    displayCreateNewBarnyardWindowContentBlockBarnyardName.focus();

    displayCreateNewBarnyardWindowContentBlockAuthorizedUsers.addEventListener('keydown', function(event) {
        if (event.keyCode === 8) {
            searchValue = searchValue.slice(0, -1);
            checkFilteredUsers = allUserNames;
            checkForMatchingUserNames(checkFilteredUsers, searchValue);
            displayMatchingUserNames(filteredUsers);
        }
    })

    displayCreateNewBarnyardWindowContentBlockAuthorizedUsers.addEventListener('keypress', function(event) {
        const charCode = event.which || event.keyCode;
        const charStr = String.fromCharCode(charCode);
        const allowedChars = /^[0-9a-zA-Z_-]*$/;
        if (allowedChars.test(charStr)) {
            const newLetter = event.key;
            searchValue = searchValue+newLetter;
            checkForMatchingUserNames(checkFilteredUsers, searchValue);
            displayMatchingUserNames(filteredUsers);
        }
    })

    finalizeBarnyardCreationButton.addEventListener('click', function() {
        createNewBarnyard();
    })

    finalizeBarnyardCreationButton.addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            createNewBarnyard();
        }
    })

    window.addEventListener('click', function(event) {
        if (event.target === displayCreateNewBarnyardWindowBackground) {
            document.body.removeChild(displayCreateNewBarnyardWindowBackground);
        }
    });
    
    window.addEventListener('keyup', function(event) {
        if (event.keyCode === 27) {
            document.body.removeChild(displayCreateNewBarnyardWindowBackground);
        }
    });    
}

createBarnyardButton.addEventListener('click', openCreateNewBarnyardWindow);

createBarnyardButton.addEventListener('keyup', function(event) {
    if (event.keycode === 13) {
        openCreateNewBarnyardWindow();
    }
})

async function createNewBarnyard() {
    const newBarnyardName = document.getElementById('new-barnyard-name').value;
    const newBarnyardAU = document.getElementById('new-barnyard-AU').value;
    AUList.push(userName)
    const newBarnyard = {
        barnyardOwner: userName,
        authorizedUsers: AUList,
        elderlyMessages: [],
        recentMessages: [],
    }
    try {
        await setDoc(doc(firestore, 'barnyards', newBarnyardName), newBarnyard);
    } catch (error) {
        console.log('error: ', error)
    }

    usersBarnyards.push(newBarnyardName)
}

loadAvailableBarnYards()

function checkForMatchingUserNames(checkFilteredUsers, searchValue) {
    filteredUsers = []
    for (let i = 0; i < checkFilteredUsers.length; i++) {
        const lowerSearchTerm = searchValue.toLowerCase();
        const lowerAllUserNames = checkFilteredUsers[i].toLowerCase();
        if(lowerAllUserNames.includes(lowerSearchTerm)) {
            filteredUsers.push(checkFilteredUsers[i]);
        }
    }
    checkFilteredUsers = filteredUsers;
}

function displayMatchingUserNames(filteredUsers) {
    clearResultsContainer()
    const resultsContainer = document.getElementById('search-results-container')
    if (filteredUsers.length === 0){
        const showNoResults = document.createElement('div');
        const showNoResultsMessage = document.createElement('h3');
        showNoResultsMessage.textContent = 'No results found';
        showNoResults.classList.add('found-user');
        showNoResultsMessage.classList.add('found-username');
        showNoResultsMessage.classList.add('all-text');
        resultsContainer.appendChild(showNoResults);
        showNoResults.appendChild(showNoResultsMessage);
    } else {
        for (let i = 0; i < filteredUsers.length; i++) {
            var matchingUserAndAddContainer = document.createElement('div');
            const showMatchingUser = document.createElement('div');
            const matchingUserName = document.createElement('h3');
            const addUser = document.createElement('button');
            matchingUserAndAddContainer.classList.add('matching-user-div')
            matchingUserName.classList.add('all-text');
            addUser.textContent = `Add`;
            addUser.classList.add('add-button')
            matchingUserName.textContent = `@${filteredUsers[i]}`
            showMatchingUser.classList.add('found-user')
            if (filteredUsers[i].length >= 16) {
                matchingUserName.classList.add('sixteen-charachter-plus-username')
            } if (filteredUsers[i].length >= 18) {
                matchingUserName.classList.remove('sixteen-charachter-plus-username')
                matchingUserName.classList.add('eighteen-charachter-plus-username')
            } if (filteredUsers[i].length >= 20) {
                matchingUserName.classList.remove('eighteen-charachter-plus-username')
                matchingUserName.classList.add('twenty-charachter-plus-username')
            }
            matchingUserAndAddContainer.style.display = 'flex';
            resultsContainer.appendChild(matchingUserAndAddContainer);
            matchingUserAndAddContainer.appendChild(showMatchingUser);
            matchingUserAndAddContainer.appendChild(addUser);
            showMatchingUser.appendChild(matchingUserName);

            addUser.addEventListener('click', function() {
                const addToBarnyard = filteredUsers[i];
                console.log('Add clicked for user:', addToBarnyard);
                AUList.push(addToBarnyard)
            });
        };
    }
};

function clearResultsContainer() {
    const resultsContainer = document.getElementById('search-results-container')
    while (resultsContainer.firstChild) {
        const firstChild = resultsContainer.firstChild;
        resultsContainer.removeChild(firstChild)
    }
}