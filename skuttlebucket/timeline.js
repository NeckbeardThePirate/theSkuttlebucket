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


const waterTroughRef = await getDocs(usersCollection);

const returnToUserProfileButton = document.getElementById('profile-button');


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

bucketTimestampArray.sort((a, b) => b.bucketTimestamp - a.bucketTimestamp);

const filledBuckets = {};
bucketTimestampArray.forEach((subobject, index) => {
    filledBuckets[`subobject${index + 1}`] = subobject;
});
console.log('filledBuckets: ', filledBuckets)

var bucketsTimelineColumn = document.getElementById('buckets-timeline-column')


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
        console.log('bucketContent', bucketContent)
        var showBucket = document.createElement('div');
        var bucketText = document.createElement('h3');
        var bucketAuthor = document.createElement('p');
        var bucketDate = document.createElement('p');
        bucketDate.classList.add('all-text');

        const postedBucketDate = new Date(bucketContent['bucketTimestamp']);
        const postedBucketWeekDay = daysOfWeek[postedBucketDate.getDay()];
        const postedBucketMonth = months[postedBucketDate.getMonth()];
        const postedBucketMonthDay = postedBucketDate.getDate();
        const postedBucketTime = `${postedBucketDate.getHours()}:${postedBucketDate.getMinutes()}`
        const fullPostTime = `Posted: ${postedBucketWeekDay}, ${postedBucketMonth} ${postedBucketMonthDay} at ${postedBucketTime}`


        console.log(fullPostTime)
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