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
    var userFromLoginData = docSnap.data();
} else {
    console.log('no such doc')
}

const userToLoadJSON = localStorage.getItem('userToLoad');

const userToLoad = JSON.parse(userToLoadJSON);

console.log(userToLoad);

const findUserToLoadquery = query(usersCollection, where('userName', '==', userToLoad));

const userToLoadRef = await getDocs(findUserToLoadquery);

if (!userToLoadRef.empty) {
    var userToLoadDocID = userToLoadRef.docs[0].id;
}

const userToLoadDocRef = doc(firestore, 'users', userToLoadDocID);

const userToLoadDocSnap = await getDoc(userToLoadDocRef);

if (userToLoadDocSnap.exists()) {
    var userData = userToLoadDocSnap.data();
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


const searchRedirectButton = document.getElementById('search-link');

const followButton = document.getElementById('buckets-header');

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


const joinMonth = userJoinDate.toLocaleString('default', { month: 'long' });

const joinYear = userJoinDate.getFullYear();

const formattedJoinDate = `${joinMonth} ${joinYear}`; 

const bucketTimestampArray = Object.values(originalUserBuckets);

const userName = userData.userName;


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
    userDescription.textContent = `${userData.userName} doesn't have a description yet`;

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
        showBucket.classList.add('bucket-block');
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

let followingUser = true;

// Set button state
const userFromLoginFollowingList = userFromLoginData.followingList;
if (userName in userFromLoginFollowingList) {
    followButton.classList.add('unfollow-user-button');
    followButton.textContent = 'Unfollow User';
    
} else {
    followingUser = false;
}

function addUserToFollowing() {
    userFromLoginFollowingList[userName] = userName;
    let updatedFollowingCount = userFromLoginData.followingCount;
    updatedFollowingCount++
    updateDoc(docRef, {
        followingList: userFromLoginFollowingList,
        followingCount: updatedFollowingCount
    })
    .then(() => {
        console.log('Successfully followed user:', userName);
        followButton.textContent = 'UnFollowUser';
        followingUser = true;
    })
    .catch((error) => {
        console.error('Error following user:', foundUserName, error);
    });
}

function removeUserFromFollowing() {
    delete userFromLoginFollowingList[userName];
    let updatedFollowingCount = userFromLoginData.followingCount;
    updatedFollowingCount--
    updateDoc(docRef, {
        followingList: userFromLoginFollowingList,
        followingCount: updatedFollowingCount
    })
    .then(() => {
        console.log('Successfully unfollowed user:', userName);
        followButton.textContent = 'Follow User';
        followButton.style.backgroundColor = 'white';
        followingUser = false;
    })
    .catch((error) => {
        console.error('Error UnFollowing user:', userName, error);
    });
}

function followUserFunction() {
    const updatedFollowerCount = userData.followerCount + 1;
    const userNameToAdd = userFromLoginData.userName;
    followerList[userNameToAdd] = userNameToAdd;
    console.log(followerList)
    console.log(userNameToAdd)

    try {
        updateDoc(userToLoadDocRef, {
            followerList: followerList,
            followerCount: updatedFollowerCount,
        }
            );
        console.log('successfully followed user in both functions')
    } catch (error) {
        console.error(`Error following this individual:`, error);
    }
}

function unFollowUserFunction() {
    const updatedFollowerCount = userData.followerCount - 1;
    const userNameToRemove = userFromLoginData.userName;

    delete followerList[userNameToRemove];

    try {
        updateDoc(userToLoadDocRef, {
            followerList: followerList,
            followerCount: updatedFollowerCount,
        }
            );
        console.log('successfully unfollowed user in both functions')
    } catch (error) {
        console.error(`Error unfollowing this individual:`, error);
    }
}





followButton.addEventListener('click', function() {
    if (followingUser) {
        removeUserFromFollowing()
        unFollowUserFunction()
    } else {
        addUserToFollowing();
        followUserFunction();
    }
})

logoutButton.addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});

timelineButton.addEventListener('click', function() {
    window.location.href = 'timeline.html';
})
searchRedirectButton.addEventListener('click', function() {
    window.location.href = 'search.html';
});
