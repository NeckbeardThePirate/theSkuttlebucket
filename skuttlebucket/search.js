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

var searchBarField = document.getElementById('search-space');
const resultsContainer = document.getElementById('results-container');

const timelineButton = document.getElementById('timeline-button');
const profileButton = document.getElementById('profile-button');
const logoutButton = document.getElementById('logout-button');


allUsersRef.forEach((doc) => {
    if(doc.exists()) {
        const userData = doc.data();
        const userName = userData.userName;
        allUserNames.push(userName);
    }
})

let filteredUsers = [];


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
    window.location.href = 'login.html'
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
    console.log(loggedInUserName)
}




function addFoundUserToFollowing(foundUserName) {
    console.log('got to the function')
    if (!loggedInUserData.following || !loggedInUserData.following[foundUserName]) {
        console.log('got inside the first if block')
        // If not already following, add the found user to the following object
        if (!loggedInUserData.following) {
            console.log('got to the second if block')
            loggedInUserData.following = {};
        }
        loggedInUserData.following[foundUserName] = foundUserName;

        // Increase the following count by 1
        loggedInUserData.followingCount++;
        console.log('are we still rolling?', loggedInUserData.followingCount)
        // Update the user's document in Firestore
        updateDoc(docRef, {
            following: loggedInUserData.following,
            followingCount: loggedInUserData.followingCount
        })
        .then(() => {
            console.log('Successfully followed user:', foundUserName);
        })
        .catch((error) => {
            console.error('Error following user:', foundUserName, error);
        });
    } else {
        console.log('Already following user:', foundUserName);
    }
}




function followUserFunction(goingToFollow) {
    console.log('it at least tried')
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



function displayMatchingSearchResults(filteredUsers) {
    for (let i = 0; i < filteredUsers.length; i++) {
        const showMatchingUser = document.createElement('div');
        const matchingUserName = document.createElement('h3');
        const followUser = document.createElement('button');
        followUser.textContent = `Follow`;
        followUser.classList.add('follow-button')
        matchingUserName.textContent = `@${filteredUsers[i]}`
        showMatchingUser.classList.add('found-user')
        matchingUserName.classList.add('found-username')

        resultsContainer.appendChild(showMatchingUser);
        resultsContainer.appendChild(followUser);
        showMatchingUser.appendChild(matchingUserName);

        let mouseIsOverUserBlock = false;
        let isMouseOverFollowButton = false;

        showMatchingUser.addEventListener('mouseover', function() {
            followUser.style.display = 'block';
            mouseIsOverUserBlock = true;
        });

        showMatchingUser.addEventListener('mouseleave', function() {
            mouseIsOverUserBlock = false;
            isMouseOverFollowButton = false;
            setTimeout(() => {
                if (!mouseIsOverUserBlock && !isMouseOverFollowButton) {
                    followUser.style.display = 'none';
                    isMouseOverFollowButton = true;
                }
            }, 220);
        });

        followUser.addEventListener('mouseenter', function() {
            followUser.style.display = 'block';
            isMouseOverFollowButton = true;
        });

        followUser.addEventListener('mouseleave', function() {
            setTimeout(() => {
                followUser.style.display = 'none';                
            }, 220);
        });

        followUser.addEventListener('click', function() {
           let goingToFollow = filteredUsers[i];
            console.log('Follow clicked for user:', goingToFollow);
            followUserFunction(goingToFollow);
            addFoundUserToFollowing(filteredUsers[i])
        });
    };
};

searchButton.addEventListener('click', function() {
    var searchTerm = searchBarField.value;
    checkForMatchingUserNames(allUserNames, searchTerm);
    console.log(filteredUsers);
    displayMatchingSearchResults(filteredUsers);
})

timelineButton.addEventListener('click', function() {
    window.location.href = 'timeline.html';
});

profileButton.addEventListener('click', function() {
    window.location.href = 'skuttlebukket_user.html';
});

logoutButton.addEventListener('click', function() {
        console.log('Signed Out');
        localStorage.clear();
        window.location.href = 'login.html' 
});