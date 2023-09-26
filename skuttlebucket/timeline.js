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


var bucketsTimelineColumn = document.getElementById('buckets-timeline-column')

for (const key in filledBuckets) {
    if (filledBuckets.hasOwnProperty(key)) {
        const bucketData = filledBuckets[key];
        const bucketContent = bucketData['bucketText']
        console.log(`Bucket Key: ${key}`);
        console.log(`Bucket Text: ${bucketContent}`);
        console.log('---');
        var showTweet = document.createElement('div');
        var tweetText = document.createElement('h3');
        showTweet.classList.add('tweet-block');
        tweetText.classList.add('all-text');
        // tweetDate.classList.add('all-text');
        tweetText.textContent = `${bucketContent['bucketText']}`;
        
        bucketsTimelineColumn.appendChild(showTweet);
        showTweet.appendChild(tweetText);


    }
}
