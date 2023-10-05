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

const resultsContainer = document.getElementById('results-container');

let filteredUsers = [];
const searchModal = document.getElementById('searchModal') 


const closeSearchButton = document.getElementById('closeModal')


const seeAllBucketsButton = document.getElementById('all-buckets-button');

const seeBucketsForMeButton = document.getElementById('buckets-for-me-button');

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

const userFollowingList = currentUserData.followingList;


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


const bucketsForUser = {};

let counter = 0;

for (const key in originalBuckets) {
    const bucketData = originalBuckets[key]
    const bucketContent = bucketData['bucketText']
    const bucketAuthor = bucketContent['bucketAuthor']
    if (bucketAuthor in userFollowingList || bucketAuthor === currentUserData.userName) {
        console.log('bucket author is : ', bucketAuthor, '||' , currentUserData.userName)
        bucketsForUser[`individualBucket${counter}`] = originalBuckets[key]
        counter++
    }
}

console.log(bucketsForUser)

const bucketTimestampArray = Object.values(originalBuckets);

const forUserBucketTimestampArray = Object.values(bucketsForUser);

bucketTimestampArray.sort((a, b) => {
    const timestampA = a.bucketText.bucketTimestamp;
    const timestampB = b.bucketText.bucketTimestamp;

    return timestampB - timestampA;
});

forUserBucketTimestampArray.sort((a, b) => {
    const timestampA = a.bucketText.bucketTimestamp;
    const timestampB = b.bucketText.bucketTimestamp;

    return timestampB - timestampA;
});


const forUserFilledBuckets = {};

const filledBuckets = {};



bucketTimestampArray.forEach((subobject, index) => {
    filledBuckets[`subobject${index + 1}`] = subobject;
});

forUserBucketTimestampArray.forEach((subobject, index) => {
    forUserFilledBuckets[`subobject${index + 1}`] = subobject;
});



const bucketsTimelineColumn = document.getElementById('buckets-timeline-column')

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
function loadAllBuckets() {
    seeBucketsForMeButton.classList.add('inactive-timeline-button');
    seeBucketsForMeButton.classList.add('view-button');
    seeBucketsForMeButton.classList.remove('active-timeline-button');
    seeAllBucketsButton.classList.add('active-timeline-button')
    seeAllBucketsButton.classList.remove('inactive-timeline-button')
    seeAllBucketsButton.classList.remove('view-button')

    // seeAllBucketsButton.style.backgroundColor = 'white';
    for (const key in filledBuckets) {
        if (filledBuckets.hasOwnProperty(key)) {
            const bucketData = filledBuckets[key];
            
            const bucketContent = bucketData['bucketText']
            
            const bucketID = bucketContent['bucketID']

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

            showBucket.addEventListener('click', function() {
                const bucketID = bucketContent['bucketID'];
                const bucketAuthor = `${bucketContent['bucketAuthor']}`;
                const bucketText = bucketContent['bucketText'];
                loadBucket(bucketAuthor, bucketID, bucketText)
            })
            
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
}

function loadBucketsForUser() {
    seeAllBucketsButton.classList.remove('active-timeline-button')
    seeAllBucketsButton.classList.add('view-button')
    seeAllBucketsButton.classList.add('inactive-timeline-button')

    // seeAllBucketsButton.style.backgroundColor = 'grey';
    seeBucketsForMeButton.classList.add('active-timeline-button')
    seeBucketsForMeButton.classList.remove('inactive-timeline-button')
    seeBucketsForMeButton.classList.remove('view-button')
    // seeBucketsForMeButton.style.scale = 1.05;
    // seeAllBucketsButton.style.scale = 0.8;
    for(const key in forUserFilledBuckets) {
        if (forUserFilledBuckets.hasOwnProperty(key)) {
            const bucketData = forUserFilledBuckets[key];
            
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

            showBucket.addEventListener('click', function() {
                const bucketID = bucketContent['bucketID']
                loadBucket(bucketID)
            })

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
}

let timelineLoadInstance = 0;

if (timelineLoadInstance === 0) {
    loadAllBuckets()
}

returnToUserProfileButton.addEventListener('click', function() {
    window.location.href = 'skuttlebukket_user.html'
});

searchButton.addEventListener('click', function() {
    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild)
    }
    filteredUsers = []
    searchModal.style.display = 'block';
});

closeSearchButton.addEventListener('click', function() {
    searchModal.style.display = 'none';
})

logoutButton.addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});

window.addEventListener('click', (event) => {
    if (event.target === searchModal) {
        searchModal.style.display = 'none';
    }
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
        bucketID: newBucketAuthor+Date.now(),
        bucketComments: {},
    };
    currentUserData.buckets[`${newBucketAuthor}${Date.now()}`] = newBucket;

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
            }, 400);
}


function clearTheRunway() {
    while (bucketsTimelineColumn.firstChild) {
        bucketsTimelineColumn.removeChild(bucketsTimelineColumn.firstChild)
        
    }
}

dumpBucketButton.addEventListener('click', dumpBucket);

dumpBucketButton.addEventListener('keyup', function(event) {
    if(event.keyCode === 13) {
        dumpBucket();
    }
});

seeAllBucketsButton.addEventListener('click', function() {
    clearTheRunway()
    loadAllBuckets()

});

seeBucketsForMeButton.addEventListener('click', function() {
    clearTheRunway()
    loadBucketsForUser()

});


function loadBucket(bucketAuthor, bucketID, bucketText) {
    console.log('author: ', bucketAuthor);

    console.log(`clicked on bucket ${bucketID}`)
    const bucketDisplayBackgroundWindow = document.createElement('div');
    const bucketDisplayContent = document.createElement('div');
    const bucketDisplayCloseButton = document.createElement('span');
    const bucketDisplayHeaderContainer = document.createElement('div');
    const bucketDisplayHeader = document.createElement('h3');
    const bucketDisplayTextContentContainer = document.createElement('div');
    const bucketDisplayTextContent = document.createElement('p');
    const bucketDisplayActionButtonsContainer = document.createElement('div');
    const bucketDisplayFollowButton = document.createElement('div');
    const bucketDisplayFollowButtonTextContent = document.createElement('p');
    const bucketDisplayCommentButton = document.createElement('div');
    const bucketDisplayCommentButtonTextContent = document.createElement('p');
    const bucketDisplayViewUserProfileButton = document.createElement('div');
    const bucketDisplayViewUserProfileButtonTextContent = document.createElement('p');

    bucketDisplayBackgroundWindow.classList.add('bucket-display-modal');
    bucketDisplayContent.classList.add('bucket-display-modal-content');
    bucketDisplayCloseButton.classList.add('close');
    bucketDisplayBackgroundWindow.style.display = 'block';
    bucketDisplayHeaderContainer.classList.add('bucket-display-header-container');
    bucketDisplayHeader.classList.add('all-text');
    bucketDisplayTextContentContainer.classList.add('bucket-display-text-content-container');
    bucketDisplayTextContent.classList.add('all-text');
    bucketDisplayActionButtonsContainer.classList.add('bucket-display-action-buttons-container');
    bucketDisplayFollowButton.classList.add('action-button');
    bucketDisplayCommentButton.classList.add('action-button');
    bucketDisplayViewUserProfileButton.classList.add('action-button');
    bucketDisplayFollowButtonTextContent.classList.add('all-text');
    bucketDisplayCommentButtonTextContent.classList.add('all-text');
    bucketDisplayViewUserProfileButtonTextContent.classList.add('all-text');

    bucketDisplayHeader.textContent = `${bucketAuthor} says:`;
    bucketDisplayTextContent.textContent = `"${bucketText}"`;
    console.log(bucketAuthor)
    if (bucketAuthor in userFollowingList) {
        bucketDisplayFollowButtonTextContent.textContent = `UnFollow @${bucketAuthor}`;
        bucketDisplayFollowButton.addEventListener('click', function() {
            document.body.removeChild(bucketDisplayBackgroundWindow);
            unFollowPostAuthorFunction(bucketAuthor)
            removePostAuthorFromFollowing(bucketAuthor, bucketID, bucketText, bucketDisplayFollowButton);
        });
    } else {
        bucketDisplayFollowButtonTextContent.textContent = `Follow @${bucketAuthor}`;
        bucketDisplayFollowButton.addEventListener('click', function() {
            document.body.removeChild(bucketDisplayBackgroundWindow);
            addPostAuthorToFollowing(bucketAuthor, bucketID, bucketText, bucketDisplayFollowButton);
            followPostAuthorFunction(bucketAuthor, bucketID, bucketText, bucketDisplayFollowButton);
        });

    }
    bucketDisplayViewUserProfileButtonTextContent.textContent = `See @${bucketAuthor}`
    bucketDisplayCommentButtonTextContent.textContent = `Comment`;


    document.body.appendChild(bucketDisplayBackgroundWindow);
    bucketDisplayBackgroundWindow.appendChild(bucketDisplayContent);
    bucketDisplayContent.appendChild(bucketDisplayCloseButton);
    bucketDisplayContent.appendChild(bucketDisplayHeaderContainer);
    bucketDisplayHeaderContainer.appendChild(bucketDisplayHeader);
    bucketDisplayContent.appendChild(bucketDisplayActionButtonsContainer);
    bucketDisplayActionButtonsContainer.appendChild(bucketDisplayFollowButton);
    bucketDisplayFollowButton.appendChild(bucketDisplayFollowButtonTextContent);
    bucketDisplayActionButtonsContainer.appendChild(bucketDisplayCommentButton);
    bucketDisplayCommentButton.appendChild(bucketDisplayCommentButtonTextContent);
    bucketDisplayActionButtonsContainer.appendChild(bucketDisplayViewUserProfileButton);
    bucketDisplayViewUserProfileButton.appendChild(bucketDisplayViewUserProfileButtonTextContent);
    bucketDisplayContent.appendChild(bucketDisplayTextContentContainer);
    bucketDisplayTextContentContainer.appendChild(bucketDisplayTextContent);

    bucketDisplayCloseButton.addEventListener('click', function() {
        document.body.removeChild(bucketDisplayBackgroundWindow);
    });
    window.addEventListener('click', (event) => {
        if (event.target === bucketDisplayBackgroundWindow) {
            document.body.removeChild(bucketDisplayBackgroundWindow);
        }
    })


    
    bucketDisplayCommentButton.addEventListener('click', function() {
        alert(`LOL that one doesn't work either`);
    });
    bucketDisplayViewUserProfileButton.addEventListener('click', function() {
        localStorage.setItem('userToLoad', JSON.stringify(bucketAuthor));
        window.location.href = 'otherUserProfile.html';
    });
}

function addPostAuthorToFollowing(bucketAuthor, bucketID, bucketText, bucketDisplayFollowButton) {
    if (!currentUserData.followingList || !currentUserData.followingList[bucketAuthor]) {
        if (!currentUserData.followingList) {
            currentUserData.followingList = {};
        }
        currentUserData.followingList[bucketAuthor] = bucketAuthor;
        currentUserData.followingCount++;
        updateDoc(docRef, {
            followingList: currentUserData.followingList,
            followingCount: currentUserData.followingCount

        })
        
        .then(() => {
            console.log('Successfully followed user:', bucketAuthor);
            loadBucket(bucketAuthor, bucketID, bucketText, bucketDisplayFollowButton)
        })
        .catch((error) => {
            console.error('Error following user:', bucketAuthor, error);
        });
    } else {
        console.log('Already following user:', bucketAuthor);
    }
}

function removePostAuthorFromFollowing(bucketAuthor, bucketID, bucketText, bucketDisplayFollowButton) {
    if (currentUserData.followingList[bucketAuthor]) {
        if (!currentUserData.followingList) {
            currentUserData.followingList = {};
        }
        const followingList = currentUserData.followingList;
        delete followingList[bucketAuthor];
        currentUserData.followingCount--;
        updateDoc(docRef, {
            followingList: followingList,
            followingCount: currentUserData.followingCount
        })
        .then(() => {
            console.log('Successfully UnFollowed user:', bucketAuthor);
            loadBucket(bucketAuthor, bucketID, bucketText, bucketDisplayFollowButton)
        })
        .catch((error) => {
            console.error('Error UnFollowing user:', bucketAuthor, error);
        });
    } else {
        console.log('Already not following user:', bucketAuthor);
    }
}

function followPostAuthorFunction(bucketAuthor) {
    waterTroughRef.forEach(async (doc) => {
        if(doc.exists()) {
            const checkUserData = doc.data();
            const checkUserName = checkUserData.userName;
            const currentUserName = currentUserData.userName;
            const followers = checkUserData.followerList || {};
            if (bucketAuthor === checkUserName) {
                const updatedFollowerCount = checkUserData.followerCount + 1;
                followers[currentUserName] = currentUserName;


                const userDocRef = doc.ref;
                try {
                    await updateDoc(userDocRef, {
                        followerList: followers,
                        followerCount: updatedFollowerCount,
                    }
                        );
                    console.log('successfully followed userX2')
                } catch (error) {
                    console.error(`Error following ${bucketAuthor}:`, error);
                }

            }
        }
    })
}

function unFollowPostAuthorFunction(bucketAuthor) {
    console.log('it at least tried to Unfollow')
    waterTroughRef.forEach(async (doc) => {
        if(doc.exists()) {
            const checkUserData = doc.data();
            const checkUserName = checkUserData.userName;
            const currentUserName = currentUserData.userName;
            const followers = checkUserData.followerList || {};
            if (bucketAuthor === checkUserName) {
                const updatedFollowerCount = checkUserData.followerCount - 1;
                delete followers[currentUserName];


                const userDocRef = doc.ref;
                try {
                    await updateDoc(userDocRef, {
                        followerList: followers,
                        followerCount: updatedFollowerCount,
                    }
                        );
                    console.log('successfully UnFollowed userX2')
                } catch (error) {
                    console.error(`Error UnFollowing ${bucketAuthor}:`, error);
                }

            }
        }
    })
}