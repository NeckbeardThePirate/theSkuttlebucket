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

let activeComment = false;

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

let timelineIsForMe = false;

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
        bucketsForUser[`individualBucket${counter}`] = originalBuckets[key]
        counter++
    }
}


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
    timelineIsForMe = false;
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
                const bucketComments = bucketContent['bucketComments']
                const mooCount = bucketContent['mooCount'];
                const goatCount = bucketContent['goatCount'];
                loadBucket(bucketAuthor, bucketID, bucketText, bucketComments, mooCount, goatCount)
            })
            
            bucketDate.textContent = `${fullPostTime}`;
            showBucket.classList.add('bucket-block');
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
    timelineIsForMe = true;
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
                const bucketID = bucketContent['bucketID'];
                const bucketAuthor = `${bucketContent['bucketAuthor']}`;
                const bucketText = bucketContent['bucketText'];
                const bucketComments = bucketContent['bucketComments'];
                const mooCount = bucketContent['mooCount'];
                const goatCount = bucketContent['goatCount'];
                console.log(bucketContent)
                console.log(bucketContent['bucketComments'])
                loadBucket(bucketAuthor, bucketID, bucketText, bucketComments, mooCount, goatCount)
            })

            bucketDate.textContent = `${fullPostTime}`;
            showBucket.classList.add('bucket-block');
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
        mooCount: 0,
        goatCount: 0,
    };
    if (newBucketText.length < 100 || newBucketAuthor == 'Dev') {
        console.log('we hit the if statement properly')
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

        } else {
            alert('The current bucket limit is 100 charachters. You will soon be able to post bigger buckets by spending the cows and goats you earn');
        }
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


async function loadBucket(bucketAuthor, bucketID, bucketText, bucketComments, mooCount, goatCount) {
    const bucketDisplayBackgroundWindow = document.createElement('div');
    const bucketDisplayContent = document.createElement('div');
    const bucketDisplayContentComments = document.createElement('div');
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
    const bucketDisplayCountersContainer = document.createElement('div');
    const bucketDisplayMooCount = document.createElement('div');
    const bucketDisplayGoatCount = document.createElement('div');

    bucketDisplayContentComments.id = 'bucket-display-content'
    bucketDisplayMooCount.id = 'bucket-display-moo-count'
    bucketDisplayGoatCount.id = 'bucket-display-goat-count'
    bucketDisplayBackgroundWindow.classList.add('bucket-display-modal');
    bucketDisplayContent.classList.add('bucket-display-modal-content');
    bucketDisplayContentComments.classList.add('comments-column');
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
    bucketDisplayCountersContainer.classList.add('counters-container')
    bucketDisplayMooCount.classList.add('moo-count');
    bucketDisplayMooCount.classList.add('all-text');
    bucketDisplayGoatCount.classList.add('goat-count');
    bucketDisplayGoatCount.classList.add('all-text');
    var currentGoatCount = goatCount;
    var currentMooCount = mooCount;
    bucketDisplayHeader.textContent = `@${bucketAuthor} says:`;
    bucketDisplayTextContent.textContent = `"${bucketText}"`;
    displayMooCount(usersCollection, bucketAuthor, bucketID)
    displayGoatCount(usersCollection, bucketAuthor, bucketID)

    bucketDisplayMooCount.addEventListener('click', function() {
        const userName = currentUserData.userName;
        if (userName === bucketAuthor) {
            alert('Naw bruh, you cannot give yourself cows and goats. selfish. - @Dev')
        } else {
            updateMooCount(bucketID, bucketAuthor, userName)
            displayMooCount(usersCollection, bucketAuthor, bucketID)
        }
    })

    bucketDisplayGoatCount.addEventListener('click', function() {
        const userName = currentUserData.userName;
        if (userName === bucketAuthor) {
            alert('Naw bruh, you cannot give yourself cows and goats. selfish. - @Dev')
        } else {
            updateGoatCount(bucketID, bucketAuthor)
            displayGoatCount(usersCollection, bucketAuthor, bucketID)
            
        }
    })

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
    bucketDisplayContent.appendChild(bucketDisplayCountersContainer);
    bucketDisplayCountersContainer.appendChild(bucketDisplayMooCount);
    bucketDisplayCountersContainer.appendChild(bucketDisplayGoatCount);
    bucketDisplayContent.appendChild(bucketDisplayContentComments);

    loadComments(bucketAuthor, bucketDisplayContentComments, bucketID)

    bucketDisplayCloseButton.addEventListener('click', function() {
        document.body.removeChild(bucketDisplayBackgroundWindow);
    });
    window.addEventListener('click', (event) => {
        if (event.target === bucketDisplayBackgroundWindow) {
            activeComment = false;
            setTimeout(() => {
                if (timelineIsForMe) {
                    clearTheRunway();
                    loadBucketsForUser();
                }
                }, 600);
            document.body.removeChild(bucketDisplayBackgroundWindow);
            
        }
    })


    
    bucketDisplayCommentButton.addEventListener('click', function() {
        const currentUserName = currentUserData.userName;
        if (activeComment === false) {
            activeComment = true;
            writeComment(currentUserName, bucketDisplayContentComments, bucketID, bucketAuthor, bucketText, bucketComments)
        } else {
            const displayCreateCommentPostButton = document.getElementById('display-create-comment-post-button');
            displayCreateCommentPostButton.scrollIntoView({ behavior: 'smooth' });
            const displayCreateCommentInput = document.getElementById('display-create-comment-input')
            setTimeout(() => {
                displayCreateCommentInput.focus();
            },550);
        }
    });
    bucketDisplayViewUserProfileButton.addEventListener('click', function() {
        if (currentUserData.userName === bucketAuthor) {
            window.location.href = 'skuttlebukket_user.html'
        } else {
            localStorage.setItem('userToLoad', JSON.stringify(bucketAuthor));
            window.location.href = 'otherUserProfile.html';
        }
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

function writeComment(currentUserName, bucketDisplayContentComments, bucketID, bucketAuthor, bucketText, bucketComments) {
    const displayCreateCommentHeaderContainer = document.createElement('div');
    const displayCreateCommentHeader = document.createElement('h3');
    const displayCreateCommentInput = document.createElement('textarea');
    const displayCreateCommentPostButton = document.createElement('div');

    displayCreateCommentPostButton.id = 'display-create-comment-post-button'
    displayCreateCommentInput.id = 'display-create-comment-input'

    displayCreateCommentHeader.textContent = `@${currentUserName}:`;
    displayCreateCommentPostButton.classList.add('action-button');
    displayCreateCommentPostButton.classList.add('all-text');
    displayCreateCommentHeaderContainer.classList.add('display-create-comment-header');
    displayCreateCommentPostButton.textContent = 'Post';
    displayCreateCommentInput.classList.add('add-comment-text-content-container');
    displayCreateCommentHeader.classList.add('all-text');

    displayCreateCommentPostButton.addEventListener('click', function() {
        const commentToPost = displayCreateCommentInput.value;
        if (commentToPost.length < 100) {
            postComment(commentToPost, currentUserName, bucketID, bucketAuthor, bucketText, bucketComments);
        } else {
            alert('The current comment length max at this time is 100 charachters')
        }
    });
    
    bucketDisplayContentComments.appendChild(displayCreateCommentHeaderContainer);
    displayCreateCommentHeaderContainer.appendChild(displayCreateCommentHeader);
    bucketDisplayContentComments.appendChild(displayCreateCommentInput);
    bucketDisplayContentComments.appendChild(displayCreateCommentPostButton);

    displayCreateCommentPostButton.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
        displayCreateCommentInput.focus();
    },550);
}

async function postComment(commentToPost, currentUserName, bucketID, bucketAuthor, bucketText, bucketComments, mooCount, goatCount) {
    activeComment = false;
    const newCommentTimestamp = Date.now();
    const newCommentAuthor = currentUserName;
    const newComment = {
        commentAuthor: newCommentAuthor,
        commentTime: newCommentTimestamp,
        commentText: commentToPost,
        commentID: `comment${currentUserName}${newCommentTimestamp}`,
        mooCount: 0,
        goatCount: 0,
    }
    try {
        const findPostAuthorQuery = query(usersCollection, where('userName', '==', bucketAuthor));
        const bucketAuthorQuerySnapshot = await getDocs(findPostAuthorQuery);

        if (!bucketAuthorQuerySnapshot.empty) {
            const bucketAuthorDocID = bucketAuthorQuerySnapshot.docs[0].id;

            const bucketAuthorDocRef = doc(firestore, 'users', bucketAuthorDocID);
            const bucketAuthorDocSnap = await getDoc(bucketAuthorDocRef);

            if (bucketAuthorDocSnap.exists()) {
                const workingPostData = bucketAuthorDocSnap.data();
                const workingPostDataBuckets = workingPostData.buckets;

                if (bucketID in workingPostDataBuckets) {
                    const workingPostDataActiveBucket = workingPostDataBuckets[bucketID];
                    const workingPostDataActiveBucketPostComments = workingPostDataActiveBucket['bucketComments']
                    workingPostDataActiveBucketPostComments[`comment${currentUserName}${newCommentTimestamp}`] = newComment;
                    await updateDoc(bucketAuthorDocRef, {buckets: workingPostDataBuckets })
                    .then(() => {
                        const bucketDisplayContentComments = document.getElementById('bucket-display-content')
                        clearComments(bucketDisplayContentComments)
                        loadComments(bucketAuthor, bucketDisplayContentComments, bucketID)   
                    })
                } else {
                    console.log('Bucket ID not found in user data.');
                    console.log(workingPostDataBuckets)
                }
            } else {
                console.log('No such document for the bucket author.');
            }
        } else {
            console.log('No user found with the specified username.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateMooCount(bucketID, bucketAuthor) {
    try {
        const findPostAuthorQuery = query(usersCollection, where('userName', '==', bucketAuthor));
        const bucketAuthorQuerySnapshot = await getDocs(findPostAuthorQuery);

        if (!bucketAuthorQuerySnapshot.empty) {
            const bucketAuthorDocID = bucketAuthorQuerySnapshot.docs[0].id;

            const bucketAuthorDocRef = doc(firestore, 'users', bucketAuthorDocID);
            const bucketAuthorDocSnap = await getDoc(bucketAuthorDocRef);

            if (bucketAuthorDocSnap.exists()) {
                const workingPostData = bucketAuthorDocSnap.data();
                const workingPostDataBuckets = workingPostData.buckets;

                if (bucketID in workingPostDataBuckets) {
                    const workingPostDataActiveBucket = workingPostDataBuckets[bucketID];
                    var workingPostDataActiveBucketMooCount = workingPostDataActiveBucket['mooCount'];
                    workingPostDataActiveBucketMooCount++;
                
                    workingPostDataBuckets[bucketID].mooCount = workingPostDataActiveBucketMooCount;
                
                    await updateDoc(bucketAuthorDocRef, { buckets: workingPostDataBuckets });
                    displayMooCount(usersCollection, bucketAuthor, bucketID)
                } else {
                    console.log('Bucket ID not found in user data.');
                  }
            } else {
                console.log('No such document for the bucket author.');
            }
        } else {
            console.log('No user found with the specified username.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateGoatCount(bucketID, bucketAuthor) {
    try {
        const findPostAuthorQuery = query(usersCollection, where('userName', '==', bucketAuthor));
        const bucketAuthorQuerySnapshot = await getDocs(findPostAuthorQuery);

        if (!bucketAuthorQuerySnapshot.empty) {
            const bucketAuthorDocID = bucketAuthorQuerySnapshot.docs[0].id;

            const bucketAuthorDocRef = doc(firestore, 'users', bucketAuthorDocID);
            const bucketAuthorDocSnap = await getDoc(bucketAuthorDocRef);

            if (bucketAuthorDocSnap.exists()) {
                const workingPostData = bucketAuthorDocSnap.data();
                const workingPostDataBuckets = workingPostData.buckets;

                if (bucketID in workingPostDataBuckets) {
                    const workingPostDataActiveBucket = workingPostDataBuckets[bucketID];
                    let workingPostDataActiveBucketGoatCount = workingPostDataActiveBucket['goatCount'];
                    workingPostDataActiveBucketGoatCount++;
                
                    workingPostDataBuckets[bucketID].goatCount = workingPostDataActiveBucketGoatCount;
                
                    await updateDoc(bucketAuthorDocRef, { buckets: workingPostDataBuckets });
                    console.log('goatcount', workingPostDataActiveBucketGoatCount);
                    displayGoatCount(usersCollection, bucketAuthor, bucketID)
                  } else {
                    console.log('Bucket ID not found in user data.');
                  }
            } else {
                console.log('No such document for the bucket author.');
            }
        } else {
            console.log('No user found with the specified username.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadComments(bucketAuthor, bucketDisplayContentComments, bucketID) {
    try {
        const findPostAuthorQuery = query(usersCollection, where('userName', '==', bucketAuthor));
        const bucketAuthorQuerySnapshot = await getDocs(findPostAuthorQuery);

        if (!bucketAuthorQuerySnapshot.empty) {
            const bucketAuthorDocID = bucketAuthorQuerySnapshot.docs[0].id;

            const bucketAuthorDocRef = doc(firestore, 'users', bucketAuthorDocID);
            const bucketAuthorDocSnap = await getDoc(bucketAuthorDocRef);

            if (bucketAuthorDocSnap.exists()) {
                const workingPostData = bucketAuthorDocSnap.data();
                const workingPostDataBuckets = workingPostData.buckets;
                if (bucketID in workingPostDataBuckets) {
                    const workingPostDataActiveBucket = workingPostDataBuckets[bucketID];
                    const workingPostDataActiveBucketPostComments = workingPostDataActiveBucket['bucketComments']
                    const workingPostDataActiveBucketPostCommentsArray = Object.entries(workingPostDataActiveBucketPostComments);
                    workingPostDataActiveBucketPostCommentsArray.sort((a, b) => a[1].commentTime - b[1].commentTime);
                    const sortedWorkingPostDataActiveBucketPostComments = {};
                    workingPostDataActiveBucketPostCommentsArray.forEach(([key, value]) => {
                        sortedWorkingPostDataActiveBucketPostComments[key] = value;
                    })
                    for (const comment in sortedWorkingPostDataActiveBucketPostComments) {
                        if (sortedWorkingPostDataActiveBucketPostComments.hasOwnProperty(comment)) {
                            const bucketCommentID = sortedWorkingPostDataActiveBucketPostComments[comment];
                            const bucketCommentText = bucketCommentID['commentText'];
                            const bucketCommentAuthor = bucketCommentID['commentAuthor'];
                            const bucketCommentTime = new Date(bucketCommentID['commentTime']);
                            const bucketCommentTimeWeekday = daysOfWeek[bucketCommentTime.getDay()];
                            const bucketCommentTimeMonth = months[bucketCommentTime.getMonth()];
                            const bucketCommentTimeMonthDay = bucketCommentTime.getDate();
                            const bucketCommentTimeHours = bucketCommentTime.getHours()
                            const bucketCommentTimeMinutes = bucketCommentTime.getMinutes()
                            const bucketCommentTimeMinutesFormatted = bucketCommentTimeMinutes < 10 ? `0${bucketCommentTimeMinutes}` : bucketCommentTimeMinutes;
                            const bucketCommentTimeHoursMinutes = `${bucketCommentTimeHours}:${bucketCommentTimeMinutesFormatted}`
                            const completeBucketCommentTime = `at: ${bucketCommentTimeWeekday}, ${bucketCommentTimeMonth} ${bucketCommentTimeMonthDay} at  ${bucketCommentTimeHoursMinutes}`
                            const bucketGoatCount = bucketCommentID['goatCount'];
                            const bucketMooCount = bucketCommentID['mooCount'];
                            const showComment = document.createElement('div');
                            const showCommentAuthor = document.createElement('h5');
                            const showCommentTime = document.createElement('p');
                            const showCommentText = document.createElement('p');
                            const showCommentAnimalCountContainer = document.createElement('div')
                            // 🐮🐐
                            showComment.classList.add('show-comment-block');
                            showCommentAuthor.classList.add('comment-author');
                            showCommentTime.classList.add('comment-time');
                            showCommentText.classList.add('comment-text');
                            showCommentAuthor.classList.add('all-text');
                            showCommentTime.classList.add('all-text');
                            showCommentText.classList.add('all-text');
                            showCommentAnimalCountContainer.classList.add('animal-count-container');
                
                            showCommentAuthor.textContent = `@${bucketCommentAuthor} responded:`;
                            showCommentTime.textContent = `${completeBucketCommentTime}`
                            showCommentText.textContent = `${bucketCommentText}`;
                
                            bucketDisplayContentComments.appendChild(showComment);
                            showComment.appendChild(showCommentAuthor);
                            showComment.appendChild(showCommentTime);
                            showComment.appendChild(showCommentText);
                        }
                    }
                } else {
                    console.log('Bucket ID not found in user data.');
                    console.log(workingPostDataBuckets)
                }
            } else {
                console.log('No such document for the bucket author.');
            }
        } else {
            console.log('No user found with the specified username.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
    


function clearComments(bucketDisplayContentComments) {
    while (bucketDisplayContentComments.firstChild) {
        const firstChild = bucketDisplayContentComments.firstChild;
        bucketDisplayContentComments.removeChild(firstChild);
    }
}

async function displayMooCount(usersCollection, bucketAuthor, bucketID) {
    try {
        const findPostAuthorQuery = query(usersCollection, where('userName', '==', bucketAuthor));
        const bucketAuthorQuerySnapshot = await getDocs(findPostAuthorQuery);

        if (!bucketAuthorQuerySnapshot.empty) {
            const bucketAuthorDocID = bucketAuthorQuerySnapshot.docs[0].id;

            const bucketAuthorDocRef = doc(firestore, 'users', bucketAuthorDocID);
            const bucketAuthorDocSnap = await getDoc(bucketAuthorDocRef);

            if (bucketAuthorDocSnap.exists()) {
                const workingPostData = bucketAuthorDocSnap.data();
                const workingPostDataBuckets = workingPostData.buckets;
                if (bucketID in workingPostDataBuckets) {
                    const workingPostDataActiveBucket = workingPostDataBuckets[bucketID];
                    var workingPostDataActiveBucketMooCount = workingPostDataActiveBucket['mooCount'];
                    const bucketDisplayMooCount = document.getElementById('bucket-display-moo-count')

                    bucketDisplayMooCount.textContent = `🐮X${workingPostDataActiveBucketMooCount}`
                  } else {
                    console.log('Bucket ID not found in user data.');
                  }
            } else {
                console.log('No such document for the bucket author.');
            }
        } else {
            console.log('No user found with the specified username.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function displayGoatCount(usersCollection, bucketAuthor, bucketID) {
    try {
        const findPostAuthorQuery = query(usersCollection, where('userName', '==', bucketAuthor));
        const bucketAuthorQuerySnapshot = await getDocs(findPostAuthorQuery);

        if (!bucketAuthorQuerySnapshot.empty) {
            const bucketAuthorDocID = bucketAuthorQuerySnapshot.docs[0].id;

            const bucketAuthorDocRef = doc(firestore, 'users', bucketAuthorDocID);
            const bucketAuthorDocSnap = await getDoc(bucketAuthorDocRef);

            if (bucketAuthorDocSnap.exists()) {
                const workingPostData = bucketAuthorDocSnap.data();
                const workingPostDataBuckets = workingPostData.buckets;
                if (bucketID in workingPostDataBuckets) {
                    const workingPostDataActiveBucket = workingPostDataBuckets[bucketID];
                    var workingPostDataActiveBucketGoatCount = workingPostDataActiveBucket['goatCount'];
                    const bucketDisplayGoatCount = document.getElementById('bucket-display-goat-count')

                    bucketDisplayGoatCount.textContent = `🐐X${workingPostDataActiveBucketGoatCount}`
                  } else {
                    console.log('Bucket ID not found in user data.');
                  }
            } else {
                console.log('No such document for the bucket author.');
            }
        } else {
            console.log('No user found with the specified username.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// async function sortPostsAlgorithm() {
//     //Huge sorting algorithm goes here

// }

// const fullTimeline = {}

// for (const key in originalBuckets) {
//     const bucketKey = originalBuckets[key];
//     for (const secondaryKey in bucketKey) {
        
//         const subBucket = bucketKey[secondaryKey];
        
//         console.log(subBucket)
//         if ('mooCount' in subBucket) {
//             console.log(subBucket)
//         }
//         // for (const tertiaryKey in subBucket) {
//         //     if (tertiaryKey === 'mooCount') {
//         //         console.log(tertiaryKey)
//         //     }
//         // }
        
//     }
    
// }