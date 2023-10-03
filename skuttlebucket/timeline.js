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
    var currentUserData = docSnap.data();
    
} else {
    console.log('no such doc')
}


const waterTroughRef = await getDocs(usersCollection);

const returnToUserProfileButton = document.getElementById('profile-button');

const searchButton = document.getElementById('search-button');

const logoutButton = document.getElementById('logout-button');

const originalBuckets = {};

waterTroughRef.forEach((doc) => {
    if (doc.exists()) {
        const userData = doc.data();
        const userBuckets = userData.buckets;

        for (const key in userBuckets) {
            if (userBuckets.hasOwnProperty(key)) {
                const bucketText = userBuckets[key];
                if (!originalBuckets.hasOwnProperty(key)) {
                    originalBuckets[key] = { bucketText };
                  } else {
                    originalBuckets[key].bucketText = bucketText;
                  }
            }

        }
    }
})

const bucketTimestampArray = Object.values(originalBuckets);

bucketTimestampArray.sort((a, b) => {
    const timestampA = a.bucketText.bucketTimestamp;
    const timestampB = b.bucketText.bucketTimestamp;

    return timestampB - timestampA;
});

const filledBuckets = {};

bucketTimestampArray.forEach((subobject, index) => {
    filledBuckets[`subobject${index + 1}`] = subobject;
});

const bucketsTimelineColumn = document.getElementById('buckets-timeline-column')

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

for (const key in filledBuckets) {
    if (filledBuckets.hasOwnProperty(key)) {
        const bucketData = filledBuckets[key];
        
        const bucketContent = bucketData['bucketText']
        
        const showBucket = document.createElement('div');
        
        const bucketText = document.createElement('h3');
        
        const bucketAuthor = document.createElement('p');
        
        const bucketDate = document.createElement('p');
        
        bucketDate.classList.add('all-text');

        const postedBucketDate = new Date(bucketContent['bucketTimestamp']);
        
        const postedBucketWeekDay = daysOfWeek[postedBucketDate.getDay()];
        
        const postedBucketMonth = months[postedBucketDate.getMonth()];
        
        const postedBucketMonthDay = postedBucketDate.getDate();
        
        const postedBucketTime = `${postedBucketDate.getHours()}:${postedBucketDate.getMinutes()}`
        
        const fullPostTime = `Posted: ${postedBucketWeekDay}, ${postedBucketMonth} ${postedBucketMonthDay} at ${postedBucketTime}`

        bucketDate.textContent = `${fullPostTime}`;
        showBucket.classList.add('tweet-block');
        bucketText.classList.add('all-text');
        bucketAuthor.classList.add('all-text'); 
        bucketText.textContent = `${bucketContent['bucketText']}`;
        bucketAuthor.textContent = `@${bucketContent['bucketAuthor']}`;
        bucketDate.style.fontSize = '10px';
        bucketsTimelineColumn.appendChild(showBucket);
        showBucket.appendChild(bucketAuthor);
        showBucket.appendChild(bucketDate);
        showBucket.appendChild(bucketText);
    }
}

returnToUserProfileButton.addEventListener('click', function() {
    window.location.href = 'skuttlebukket_user.html'
});

searchButton.addEventListener('click', function() {
    console.log('clicked search button')
    window.location.href = 'search.html';

});

logoutButton.addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});

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

    const newBucketAuthor = currentUserData.userName;

    const newBucket = {
        bucketTimestamp: newBucketTimestamp,
        bucketAuthor: newBucketAuthor,
        bucketText: newBucketText,
    };
    currentUserData.buckets[`bucket${Date.now()}`] = newBucket;

    updateDoc(docRef, {buckets: currentUserData.buckets})
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
            }, 200);
}

dumpBucketButton.addEventListener('click', dumpBucket);

dumpBucketButton.addEventListener('keyup', function(event) {
    if(event.keyCode === 13) {
        dumpBucket();
    }
});
