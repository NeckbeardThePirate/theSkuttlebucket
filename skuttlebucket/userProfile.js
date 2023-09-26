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
    console.log('full name is ',userData.fullName)
    if (userData.buckets && typeof userData.buckets === 'object') {
        // userData.buckets is an object
        for (const key in userData.buckets) {
            if (userData.buckets.hasOwnProperty(key)) {
                console.log('Key:', key);
                console.log('Value:', userData.buckets[key]);
                // You can perform any operations you need with each key-value pair here
            }
        }
    } else {
        console.log('Buckets data is missing or not an array.');
    }
} else {
    console.log('no such doc')
}



var userDisplayName = document.createElement('h2');

var profileHeader = document.getElementById('profile-header');

var userDisplayNameContainer = document.createElement('div');

var userHandle = document.createElement('p');

var subProfileInfo = document.createElement('div');

var followingCount = document.createElement('p');

var followerCount = document.createElement('p');

var joinDate = document.createElement('p');

var bucketsColumn = document.getElementById('buckets-column');

var userBuckets = userData.buckets

var userDescription = document.createElement('button');

const userJoinDate = new Date(userData.joinDate);

const joinMonth = userJoinDate.toLocaleString('default', { month: 'long' });
const joinYear = userJoinDate.getFullYear();

const formattedJoinDate = `${joinMonth} ${joinYear}`; 


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
console.log('user display name is ', userData.fullName)
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
        var showBucket = document.createElement('div');
        var bucketText = document.createElement('h3');
        var bucketAuthor = document.createElement('p');
        var bucketDate = document.createElement('p');
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
    
  

//   var checkUserHandle = userData.userName;

}

const createNewBucketWindow = document.getElementById('create-bucket-window');
const openNewBucketWindow = document.getElementById('buckets-header');
const closeNewBucketWindow = document.getElementById('close-bucket-window-button')


function createNewBucket() {
    createNewBucketWindow.style.display = 'block';
    console.log('wll you clicked it')
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
    console.log('well the function ran heres the full bucket object', newBucket)
    userData.buckets[`bucket${Date.now()}`] = newBucket;
    console.log(userData.buckets);
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
    console.log(newProfileDescriptionText);
    userData.userDescription = newProfileDescriptionText;
    console.log(userData.userDescription);
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