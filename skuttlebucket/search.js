import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, query, where, addDoc, updateDoc, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { firebaseConfig } from "../firebaseConfig.js";


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

let checkFilteredUsers = [];

let searchTerm = ''

allUsersRef.forEach((doc) => {
    if(doc.exists()) {
        const userData = doc.data();
        const userName = userData.userName;
        checkFilteredUsers.push(userName);
        allUserNames.push(userName);
    }
})

if (localStorage.length === 0) {
    window.location.href = 'index.html'
};

function checkForMatchingUserNames(checkFilteredUsers, searchTerm) {
    filteredUsers = [];
    for (let i = 0; i < allUserNames.length; i++) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const lowerAllUserNames = checkFilteredUsers[i].toLowerCase();
        if(lowerAllUserNames.includes(lowerSearchTerm)) {
            filteredUsers.push(checkFilteredUsers[i]);
        }
    }
    checkFilteredUsers = filteredUsers;
}

function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }


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
            loadSearchResults();
            console.log('Successfully followed user:', foundUserName);
            const followSuccessMessageDiv = document.createElement('div');
            const followSuccessMessage = document.createElement('p');
            followSuccessMessageDiv.id = 'follow-success-message-div';
            followSuccessMessage.id = 'follow-success-message';
            followSuccessMessage.textContent = `✅ Successfully followed @${foundUserName}`;
            followSuccessMessage.classList.add('success-message');
            followSuccessMessage.classList.add('all-text');

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
            followSuccessMessage.classList.add('all-text');
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
    clearResultsContainer()
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
            var matchingUserAndFollowContainer = document.createElement('div');
            const showMatchingUser = document.createElement('div');
            const matchingUserName = document.createElement('h3');
            const followUser = document.createElement('button');
            matchingUserAndFollowContainer.classList.add('matching-user-div')
            matchingUserName.classList.add('all-text');
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
                showMatchingUser.addEventListener('click', function() {
                    if (loggedInUserName === filteredUsers[i]) {
                        window.location.href = 'skuttlebukket_user.html'
                    } else {
                        localStorage.setItem('userToLoad', JSON.stringify(filteredUsers[i]));
                        window.location.href = 'otherUserProfile.html';
                    }
                    console.log(loggedInUserName)
                    console.log(filteredUsers[i])
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
                        unFollowUserFunction(goingToUnFollow);
                        removeFoundUserFromFollowing(filteredUsers[i])
                    });
                showMatchingUser.addEventListener('click', function() {
                    if (loggedInUserName === filteredUsers[i]) {
                        window.location.href = 'skuttlebukket_user.html'
                    } else {
                        localStorage.setItem('userToLoad', JSON.stringify(filteredUsers[i]));
                        window.location.href = 'otherUserProfile.html';
                    }
                });
            }
            
        };
    }
};


function clearResultsContainer() {
    const resultsContainer = document.getElementById('results-container')
    while (resultsContainer.firstChild) {
        const firstChild = resultsContainer.firstChild;
        resultsContainer.removeChild(firstChild)
    }
}

function loadSearchResults() {
    console.log(resultsContainer)
    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild)
    }
    filteredUsers = []
    var searchTerm = searchBarField.value;
    checkForMatchingUserNames(allUserNames, searchTerm);
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

// export { chatLoadSearchResults, checkForMatchingUserNames, displayMatchingSearchResults, resultsContainer }

searchBarField.addEventListener('keydown', function(event) {
    if (event.keyCode === 8) {
        searchTerm = searchTerm.slice(0, -1);
        checkFilteredUsers = allUserNames;
        checkForMatchingUserNames(checkFilteredUsers, searchTerm);
        displayMatchingSearchResults(filteredUsers);
    }
})

searchBarField.addEventListener('keypress', function(event) {
    const charCode = event.which || event.keyCode;
    const charStr = String.fromCharCode(charCode);
    const allowedChars = /^[0-9a-zA-Z_-]*$/;
    if (allowedChars.test(charStr)) {
        const newLetter = event.key;
        searchTerm = searchTerm+newLetter;
        checkForMatchingUserNames(checkFilteredUsers, searchTerm);
        displayMatchingSearchResults(filteredUsers);
    }
})
