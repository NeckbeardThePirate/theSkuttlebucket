import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, query, where, addDoc, updateDoc, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
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

const usersCollection = collection(firestore, 'users');

const allUsersRef = await getDocs(usersCollection);

const searchButton = document.getElementById('button-for-searching');

const allUserNames = [];

const searchBarField = document.getElementById('search-space');

const resultsContainer = document.getElementById('results-container');

const timelineButton = document.getElementById('timeline-button');

const profileButton = document.getElementById('profile-button');

const logoutButton = document.getElementById('logout-button');

let filteredUsers = [];

allUsersRef.forEach((doc) => {
    if(doc.exists()) {
        const userData = doc.data();
        const userName = userData.userName;
        allUserNames.push(userName);
    }
})

function checkForMatchingUserNames(allUserNames, searchTerm) {
    filteredUsers = [];
    for (let i = 0; i < allUserNames.length; i++) {
        if(allUserNames[i].includes(searchTerm)) {
            filteredUsers.push(allUserNames[i]);
        }
    }
}
function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
if (localStorage.length === 0) {
    window.location.href = 'index.html'
};

const userFromLogin = JSON.parse(localStorage.getItem('user'));
const userUID = userFromLogin.uid
const loginCheckUsersCollection = collection(firestore, 'users');
const findUserQuery = query(loginCheckUsersCollection, where('userID', '==', userUID));
const userRef = await getDocs(findUserQuery);

if (!userRef.empty) {
    var DocID = userRef.docs[0].id;    
}

const docRef = doc(firestore, 'users', DocID);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    var loggedInUserData = docSnap.data();
    var loggedInUserName = loggedInUserData.userName;
}

function addFoundUserToFollowing(foundUserName) {
    if (!loggedInUserData.followingList || !loggedInUserData.followingList[foundUserName]) {
        if (!loggedInUserData.followingList) {
            loggedInUserData.followingList = {};
        }
        loggedInUserData.followingList[foundUserName] = foundUserName;
        loggedInUserData.followingCount++;
        updateDoc(docRef, {
            followingList: loggedInUserData.followingList,
            followingCount: loggedInUserData.followingCount
        })
        .then(() => {
            loadSearchResults()
            console.log('Successfully followed user:', foundUserName);
            const followSuccessMessageDiv = document.createElement('div');
            const followSuccessMessage = document.createElement('p');
            followSuccessMessageDiv.id = 'follow-success-message-div';
            followSuccessMessage.id = 'follow-success-message';
            followSuccessMessage.textContent = `✅ Successfully followed @${foundUserName}`;
            followSuccessMessage.classList.add('success-message');
            followSuccessMessageDiv.classList.add('success-message-div');
            resultsContainer.appendChild(followSuccessMessageDiv);
            followSuccessMessageDiv.appendChild(followSuccessMessage);

        })
        .catch((error) => {
            console.error('Error following user:', foundUserName, error);
        });
    } else {
        console.log('Already following user:', foundUserName);
    }
}


function removeFoundUserFromFollowing(foundUserName) {
    if (loggedInUserData.followingList[foundUserName]) {
        if (!loggedInUserData.followingList) {
            loggedInUserData.followingList = {};
        }
        const followingList = loggedInUserData.followingList;
        delete followingList[foundUserName];
        loggedInUserData.followingCount--;
        updateDoc(docRef, {
            followingList: followingList,
            followingCount: loggedInUserData.followingCount
        })
        .then(() => {
            loadSearchResults()
            console.log('Successfully UnFollowed user:', foundUserName);
            const followSuccessMessageDiv = document.createElement('div');
            const followSuccessMessage = document.createElement('p');
            followSuccessMessageDiv.id = 'unfollow-success-message-div';
            followSuccessMessage.id = 'unfollow-success-message';
            followSuccessMessage.textContent = `✅ Successfully UnFollowed @${foundUserName}`;
            followSuccessMessage.classList.add('success-message');
            followSuccessMessageDiv.classList.add('success-message-div');
            resultsContainer.appendChild(followSuccessMessageDiv);
            followSuccessMessageDiv.appendChild(followSuccessMessage);

        })
        .catch((error) => {
            console.error('Error UnFollowing user:', foundUserName, error);
        });
    } else {
        console.log('Already not following user:', foundUserName);
    }
}

function followUserFunction(goingToFollow) {
    allUsersRef.forEach(async (doc) => {
        if(doc.exists()) {
            const checkUserData = doc.data();
            const checkUserName = checkUserData.userName;
            const followers = checkUserData.followerList || {};
            if (goingToFollow === checkUserName) {
                const updatedFollowerCount = checkUserData.followerCount + 1;
                followers[loggedInUserName] = loggedInUserName;


                const userDocRef = doc.ref;
                try {
                    await updateDoc(userDocRef, {
                        followerList: followers,
                        followerCount: updatedFollowerCount,
                    }
                        );
                    console.log('successfully followed user')
                } catch (error) {
                    console.error(`Error following ${goingToFollow}:`, error);
                }

            }
        }
    })
}

function unFollowUserFunction(goingToUnFollow) {
    console.log('it at least tried to Unfollow')
    allUsersRef.forEach(async (doc) => {
        if(doc.exists()) {
            const checkUserData = doc.data();
            const checkUserName = checkUserData.userName;
            const followers = checkUserData.followerList || {};
            if (goingToUnFollow === checkUserName) {
                const updatedFollowerCount = checkUserData.followerCount - 1;
                delete followers[goingToUnFollow];


                const userDocRef = doc.ref;
                try {
                    await updateDoc(userDocRef, {
                        followerList: followers,
                        followerCount: updatedFollowerCount,
                    }
                        );
                    console.log('successfully UnFollowed user')
                } catch (error) {
                    console.error(`Error UnFollowing ${goingToUnFollow}:`, error);
                }

            }
        }
    })
}

function displayMatchingSearchResults(filteredUsers) {
    if (filteredUsers.length === 0){
        const showNoResults = document.createElement('div');
        const showNoResultsMessage = document.createElement('h3');
        showNoResultsMessage.textContent = 'No results found';
        showNoResults.classList.add('found-user');
        showNoResultsMessage.classList.add('found-username');
        resultsContainer.appendChild(showNoResults);
        showNoResults.appendChild(showNoResultsMessage);
    } else {
        for (let i = 0; i < filteredUsers.length; i++) {
            var matchingUserAndFollowContainer = document.createElement('div');
            const showMatchingUser = document.createElement('div');
            const matchingUserName = document.createElement('h3');
            const followUser = document.createElement('button');
            matchingUserAndFollowContainer.classList.add('matching-user-div')
            console.log(loggedInUserData.followingList)
            if (!loggedInUserData.followingList[filteredUsers[i]]) {
                followUser.textContent = `Follow`;
                followUser.classList.add('follow-button')
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
                } if (filteredUsers[i].length >= 22) {
                    matchingUserName.classList.remove('twenty-charachter-plus-username')
                    matchingUserName.classList.add('twenty-two-charachter-plus-username')
                } if (filteredUsers[i].length >= 24) {
                    matchingUserName.classList.remove('twenty-two-charachter-plus-username')
                    matchingUserName.classList.add('twenty-four-charachter-plus-username')
                } if (filteredUsers[i].length >= 26) {
                    matchingUserName.classList.remove('twenty-four-charachter-plus-username')
                    matchingUserName.classList.add('twenty-six-charachter-plus-username')
                } if  (filteredUsers[i].length <= 26) {
                    matchingUserName.classList.add('found-username')
                }
                matchingUserAndFollowContainer.style.display = 'flex';
                resultsContainer.appendChild(matchingUserAndFollowContainer);
                matchingUserAndFollowContainer.appendChild(showMatchingUser);
                matchingUserAndFollowContainer.appendChild(followUser);
                showMatchingUser.appendChild(matchingUserName);

                followUser.addEventListener('click', function() {
                let goingToFollow = filteredUsers[i];
                    console.log('Follow clicked for user:', goingToFollow);
                    followUserFunction(goingToFollow);
                    addFoundUserToFollowing(filteredUsers[i])
                });
            } else {
                followUser.textContent = `UnFollow`;
                followUser.classList.add('unfollow-button')
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
                } if (filteredUsers[i].length >= 22) {
                    matchingUserName.classList.remove('twenty-charachter-plus-username')
                    matchingUserName.classList.add('twenty-two-charachter-plus-username')
                } if (filteredUsers[i].length >= 24) {
                    matchingUserName.classList.remove('twenty-two-charachter-plus-username')
                    matchingUserName.classList.add('twenty-four-charachter-plus-username')
                } if (filteredUsers[i].length >= 26) {
                    matchingUserName.classList.remove('twenty-four-charachter-plus-username')
                    matchingUserName.classList.add('twenty-six-charachter-plus-username')
                } if  (filteredUsers[i].length <= 26) {
                    matchingUserName.classList.add('found-username')
                }
                matchingUserAndFollowContainer.style.display = 'flex';
                resultsContainer.appendChild(matchingUserAndFollowContainer);
                matchingUserAndFollowContainer.appendChild(showMatchingUser);
                matchingUserAndFollowContainer.appendChild(followUser);
                showMatchingUser.appendChild(matchingUserName);

                followUser.addEventListener('click', function() {
                    let goingToUnFollow = filteredUsers[i];
                        console.log('UnFollow clicked for user:', goingToUnFollow);
                        unFollowUserFunction(goingToUnFollow); //this needs to be built as an unfollow function
                        removeFoundUserFromFollowing(filteredUsers[i])  //this also needs to change
                    });
            }
            
        };
    }
};


function loadSearchResults() {
    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild)
    }
    filteredUsers = []
    var searchTerm = searchBarField.value;
    checkForMatchingUserNames(allUserNames, searchTerm);
    console.log(filteredUsers);
    displayMatchingSearchResults(filteredUsers);
};


searchButton.addEventListener('click', loadSearchResults);

timelineButton.addEventListener('click', function() {
    window.location.href = 'timeline.html';
});

profileButton.addEventListener('click', function() {
    window.location.href = 'skuttlebukket_user.html';
});

logoutButton.addEventListener('click', function() {
        console.log('Signed Out');
        localStorage.clear();
        window.location.href = 'index.html' 
});