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

if (localStorage.length === 0) {
    window.location.href = 'index.html'
};
const userFromLogin = JSON.parse(localStorage.getItem('user'));

const userUID = userFromLogin.uid

const usersCollection = collection(firestore, 'users');

const findUserQuery = query(usersCollection, where('userID', '==', userUID));

const userRef = await getDocs(findUserQuery);

if (!userRef.empty) {
    var DocID = userRef.docs[0].id;
    
}

const docRef = doc(firestore, 'users', DocID);

const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    var userData = docSnap.data();
    if (userData.buckets && typeof userData.buckets === 'object') {
        
        for (const key in userData.buckets) {
            if (userData.buckets.hasOwnProperty(key)) {
            }
        }
    } else {
        console.log('Buckets data is missing or not an object.');
    }
} else {
    console.log('no such doc')
}

const userDisplayName = document.createElement('h2');

const profileHeader = document.getElementById('profile-header');

const userDisplayNameContainer = document.createElement('div');

const userHandle = document.createElement('p');

const subProfileInfo = document.createElement('div');

const followingCount = document.createElement('button');

const followerCount = document.createElement('button');

const joinDate = document.createElement('p');

const bucketsColumn = document.getElementById('buckets-column');

const originalUserBuckets = userData.buckets

const userDescription = document.createElement('button');

const userJoinDate = new Date(userData.joinDate);

const followerList = userData.followerList;

const followingList = userData.followingList
console.log(userData.followingList)
console.log(followingList)

const joinMonth = userJoinDate.toLocaleString('default', { month: 'long' });

const joinYear = userJoinDate.getFullYear();

const formattedJoinDate = `${joinMonth} ${joinYear}`; 

const bucketTimestampArray = Object.values(originalUserBuckets);

bucketTimestampArray.sort((a, b) => b.bucketTimestamp - a.bucketTimestamp);

const userBuckets = {};
bucketTimestampArray.forEach((subobject, index) => {
    userBuckets[`subobject${index + 1}`] = subobject;
});

const logoutButton = document.getElementById('logout-button');

const timelineButton = document.getElementById('timeline-button');

subProfileInfo.id = 'subprofile-info';
followingCount.textContent = `Following: ${userData.followingCount}`;
followerCount.textContent = `Followers: ${userData.followerCount}`;
joinDate.textContent = `Member since: ${formattedJoinDate}`;
followingCount.id = 'following-count'
followerCount.id = 'follower-count'
joinDate.id = 'join-date'
followingCount.classList.add('identifying-numbers')
followerCount.classList.add('identifying-numbers')
joinDate.classList.add('identifying-numbers')
userDisplayNameContainer.id = 'user-identifiers'
userDisplayNameContainer.style.backgroundColor = '#D1D1D1';
userDisplayName.textContent = `${userData.fullName}`//this is the one
userDisplayName.classList.add('all-text');
userDisplayName.id = 'user-display-name';
userHandle.id = 'handle';
userHandle.textContent = `@${userData.userName}`;

if (userData.userDescription === '') {
    userDescription.textContent = `Click me to tell us a bit about yourself!`;

} else {
    userDescription.textContent = `${userData.userDescription}`;
}
userDescription.classList.add('identifying-numbers', 'all-text');
userDescription.id = 'profile-description';
profileHeader.appendChild(userDisplayNameContainer);
userDisplayNameContainer.appendChild(userDisplayName);
userDisplayNameContainer.appendChild(userHandle);
profileHeader.appendChild(subProfileInfo);
subProfileInfo.appendChild(followingCount);
subProfileInfo.appendChild(followerCount);
subProfileInfo.appendChild(joinDate);
profileHeader.appendChild(userDescription);

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

for (let bucket in userBuckets) {
    if (userBuckets.hasOwnProperty(bucket)) {
        const subBucket = userBuckets[bucket]

        const bucketContent = subBucket['bucketText'];

        const showBucket = document.createElement('div');

        const bucketText = document.createElement('h3');

        const bucketAuthor = document.createElement('p');

        const bucketDate = document.createElement('p');

        bucketDate.classList.add('all-text');

        const postedBucketDate = new Date(subBucket['bucketTimestamp']);

        const postedBucketWeekDay = daysOfWeek[postedBucketDate.getDay()];

        const postedBucketMonth = months[postedBucketDate.getMonth()];

        const postedBucketMonthDay = postedBucketDate.getDate();

        const postedBucketTime = `${postedBucketDate.getHours()}:${postedBucketDate.getMinutes()}`

        const fullPostTime = `Posted: ${postedBucketWeekDay}, ${postedBucketMonth} ${postedBucketMonthDay} at ${postedBucketTime}`

        bucketDate.textContent = `${fullPostTime}`;
        showBucket.classList.add('tweet-block');
        bucketText.classList.add('all-text'); 
        bucketAuthor.classList.add('all-text'); 
        bucketText.textContent = `${bucketContent}`;
        bucketAuthor.textContent = `@${subBucket['bucketAuthor']}`;
        bucketDate.style.fontSize = '10px';
        bucketsColumn.appendChild(showBucket);
        showBucket.appendChild(bucketAuthor);
        showBucket.appendChild(bucketDate);
        showBucket.appendChild(bucketText);
    }
}

const createNewBucketWindow = document.getElementById('create-bucket-window');

const openNewBucketWindow = document.getElementById('buckets-header');

const closeNewBucketWindow = document.getElementById('close-bucket-window-button')

function createNewBucket() {
    createNewBucketWindow.style.display = 'block';
}

function closeBucketCreationWindow() {
    createNewBucketWindow.style.display = 'none';
}

openNewBucketWindow.addEventListener('click', createNewBucket);
closeNewBucketWindow.addEventListener('click', closeBucketCreationWindow);

window.addEventListener('click', (event) => {
    if (event.target === createNewBucketWindow) {
        closeBucketCreationWindow();
    }
})

const dumpBucketButton = document.getElementById('dump-bucket-button');

function dumpBucket() {
    const newBucketText = document.getElementById('new-bucket-text').value

    const newBucketTimestamp = Date.now();

    const newBucketAuthor = userData.userName;

    const newBucket = {
        bucketTimestamp: newBucketTimestamp,
        bucketAuthor: newBucketAuthor,
        bucketText: newBucketText,
    };
    userData.buckets[`bucket${Date.now()}`] = newBucket;

    updateDoc(docRef, {buckets: userData.buckets})
        .then(() => {
            console.log('Firestore document updated successfully.');
        })
        .catch((error) => {
            console.error('Error updating Firestore document:', error);
            alert('there was an error dumping your bucket, please contact our tech support at (placeholder)')
        });
        closeBucketCreationWindow();
        setTimeout(() => {
            location.reload(true);
            }, 1000);
}

const editProfileWindow = document.getElementById('edit-profile-description-window');

const openEditProfileWindowButton = document.getElementById('profile-description');

const closeEditProfileWindowButton = document.getElementById('close-profile-description-window-button');

const saveNewProfileDescriptionButton = document.getElementById('save-profile-description-button')

const searchRedirectButton = document.getElementById('search-link');

const followersListWindow = document.getElementById('followers-list-window');

const showFollowersButton = document.getElementById('follower-count')

const hideFollowersButton = document.getElementById('close-follower-list-window-button');

const followersListBlock = document.getElementById('show-followers-window-content');

const followingListWindow = document.getElementById('following-list-window');

// const showFollowingButton = document.getElementById('following-count')

const hideFollowingButton = document.getElementById('close-following-list-window-button');

const followingListBlock = document.getElementById('show-following-window-content');

searchRedirectButton.addEventListener('click', function() {
    window.location.href = 'search.html';
});

function editProfileDescription() {
    editProfileWindow.style.display = 'block';
    const oldProfileDescriptionText = userData.userDescription;
    const oldProfileDescriptionTextArea = document.getElementById('edit-profile-description-text');
    oldProfileDescriptionTextArea.value = `${oldProfileDescriptionText}`    
}

function closeEditProfileWindow() {
    editProfileWindow.style.display = 'none';
}

dumpBucketButton.addEventListener('click', dumpBucket);

dumpBucketButton.addEventListener('keyup', function(event) {
    if(event.keyCode === 13) {
        dumpBucket();
    }
});

userDescription.addEventListener('click', editProfileDescription); 

closeEditProfileWindowButton.addEventListener('click', closeEditProfileWindow);

window.addEventListener('click', (event) => {
    if (event.target === editProfileWindow) {
        closeEditProfileWindow();
    }
})

function saveNewProfileDescription() {
    const newProfileDescriptionText = document.getElementById('edit-profile-description-text').value;
    userData.userDescription = newProfileDescriptionText;
    updateDoc(docRef, {userDescription: newProfileDescriptionText})
        .then(() => {
            console.log('firestore updated profile description successfully');
        })
        .catch((error) => {
            console.error('Error updating Firestore document:', error);
            alert('there was an error updating your profile, please contact our tech support at (placeholder)')
        });
        closeEditProfileWindow();
        setTimeout(() => {
            location.reload(true);
            }, 1000);
}

saveNewProfileDescriptionButton.addEventListener('click', saveNewProfileDescription);

saveNewProfileDescriptionButton.addEventListener('keyup', function(event) {
    if(event.keyCode === 13) {
        saveNewProfileDescription();
    }
});

let followersLoadInstance = 0;


function showFollowers() {
    if (followersLoadInstance === 0) {
        followersLoadInstance++
        followersListWindow.style.display = 'block';
        for (const follower in followerList) {
            const userFollowerBubble = document.createElement('div');

            const userFollowerUserName = document.createElement('p');

            userFollowerBubble.classList.add('follower-div')
            userFollowerUserName.classList.add('follower-list-username-text')
            userFollowerUserName.classList.add('all-text');
            userFollowerUserName.textContent = `@${follower}`;
            followersListBlock.appendChild(userFollowerBubble);
            userFollowerBubble.appendChild(userFollowerUserName);
        }
    } else {
        followersListWindow.style.display = 'block';
    }
}

let followingLoadInstance = 0;

function showFollowing() {
    console.log('hit showFollowing function')
    console.log(followingList)
    
    if (followingLoadInstance === 0) {
        followingLoadInstance++
        followingListWindow.style.display = 'block';
        for (const following in followingList) {
            if (followingList.hasOwnProperty(following)) {
            console.log('found a followee')

            }
            console.log('found a followee')
            const userFollowingBubble = document.createElement('div');
            const userFollowingUserName = document.createElement('p');
            userFollowingBubble.classList.add('following-div')
            userFollowingUserName.classList.add('following-list-username-text')
            userFollowingUserName.classList.add('all-text');
            userFollowingUserName.textContent = `@${following}`;
            followingListBlock.appendChild(userFollowingBubble);
            userFollowingBubble.appendChild(userFollowingUserName);
         }
    } else {
        followingListWindow.style.display = 'block';
    }
}

function hideFollowersWindow() {
    followersListWindow.style.display = 'none';
};

function hideFollowingWindow() {
    followingListWindow.style.display = 'none'
};

showFollowersButton.addEventListener('click', showFollowers);

hideFollowersButton.addEventListener('click', function() {
    hideFollowersWindow();
});

followingCount.addEventListener('click', showFollowing);

hideFollowingButton.addEventListener('click', hideFollowingWindow);

window.addEventListener('click', (event) => {
    if (event.target === followersListWindow) {
        hideFollowersWindow();
    }
});

window.addEventListener('click', (event) => {
    if (event.target === followingListWindow) {
        hideFollowingWindow();
    }
});

logoutButton.addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});

timelineButton.addEventListener('click', function() {
    window.location.href = 'timeline.html';
})