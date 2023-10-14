import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, query, where, addDoc, updateDoc, getDocs, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
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

const bucketsWall = document.getElementById('buckets-wall');

const originalUserBuckets = userData.buckets

const userDescription = document.createElement('button');

const userJoinDate = new Date(userData.joinDate);

const followerList = userData.followerList;

const followingList = userData.followingList

let activeComment = false;

const openChatWindowButton = document.getElementById('chat-button')

const joinMonth = userJoinDate.toLocaleString('default', { month: 'long' });

const joinYear = userJoinDate.getFullYear();

const formattedJoinDate = `${joinMonth} ${joinYear}`; 

const bucketTimestampArray = Object.values(originalUserBuckets);

let userChats = userData[`messages`];

const userName = userData.userName;

console.log(userName);

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
window.addEventListener("load", displayBuckets());


function displayBuckets() {
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

            showBucket.addEventListener('click', function() {
                const bucketID = subBucket['bucketID'];
                const bucketAuthor = `${subBucket['bucketAuthor']}`;
                const bucketText = subBucket['bucketText'];
                const bucketComments = subBucket['bucketComments']
                const mooCount = subBucket['mooCount'];
                const goatCount = subBucket['goatCount'];
                console.log('this is right before we load the bucket', mooCount, goatCount)
                loadBucket(bucketAuthor, bucketID, bucketText, bucketComments, mooCount, goatCount)
            })

            bucketDate.textContent = `${fullPostTime}`;
            showBucket.classList.add('bucket-block');
            bucketText.classList.add('all-text'); 
            bucketAuthor.classList.add('all-text'); 
            bucketText.textContent = `${bucketContent}`;
            bucketAuthor.textContent = `@${subBucket['bucketAuthor']}`;
            bucketDate.style.fontSize = '10px';
            bucketsWall.appendChild(showBucket);
            showBucket.appendChild(bucketAuthor);
            showBucket.appendChild(bucketDate);
            showBucket.appendChild(bucketText);
        }
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
        bucketID: newBucketAuthor+Date.now(),
        bucketComments: {},
        mooCount: 0,
        goatCount: 0,
    };
    userData.buckets[`${newBucketAuthor}${Date.now()}`] = newBucket;

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
            }, 400);
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

function loadBucket(bucketAuthor, bucketID, bucketText, bucketComments, mooCount, goatCount) {
    const bucketDisplayBackgroundWindow = document.createElement('div');
    const bucketDisplayContent = document.createElement('div');
    const bucketDisplayContentComments = document.createElement('div');
    const bucketDisplayCloseButton = document.createElement('span');
    const bucketDisplayHeaderContainer = document.createElement('div');
    const bucketDisplayHeader = document.createElement('h3');
    const bucketDisplayTextContentContainer = document.createElement('div');
    const bucketDisplayTextContent = document.createElement('p');
    const bucketDisplayActionButtonsContainer = document.createElement('div');
    const bucketDisplayDeletePostButton = document.createElement('div');
    const bucketDisplayDeletePostButtonTextContent = document.createElement('p');
    const bucketDisplayCommentButton = document.createElement('div');
    const bucketDisplayCommentButtonTextContent = document.createElement('p');
    const bucketDisplayEditPostButton = document.createElement('div');
    const bucketDisplayEditPostButtonTextContent = document.createElement('p');
    const bucketDisplayCountersContainer = document.createElement('div');
    const bucketDisplayMooCount = document.createElement('div');
    const bucketDisplayGoatCount = document.createElement('div');

    bucketDisplayContentComments.id = 'bucket-display-content'

    bucketDisplayBackgroundWindow.id = 'bucket-display-background-window'
    bucketDisplayBackgroundWindow.classList.add('bucket-display-modal');
    bucketDisplayContentComments.classList.add('comments-column');
    bucketDisplayContent.classList.add('bucket-display-modal-content');
    bucketDisplayCloseButton.classList.add('close');
    bucketDisplayBackgroundWindow.style.display = 'block';
    bucketDisplayHeaderContainer.classList.add('bucket-display-header-container');
    bucketDisplayHeader.classList.add('all-text');
    bucketDisplayTextContentContainer.classList.add('bucket-display-text-content-container');
    bucketDisplayTextContent.classList.add('all-text');
    bucketDisplayActionButtonsContainer.classList.add('bucket-display-action-buttons-container');
    bucketDisplayDeletePostButton.classList.add('action-button');
    bucketDisplayCommentButton.classList.add('action-button');
    bucketDisplayEditPostButton.classList.add('action-button');
    bucketDisplayDeletePostButtonTextContent.classList.add('all-text');
    bucketDisplayCommentButtonTextContent.classList.add('all-text');
    bucketDisplayEditPostButtonTextContent.classList.add('all-text');
    bucketDisplayCountersContainer.classList.add('counters-container')
    bucketDisplayMooCount.classList.add('moo-count');
    bucketDisplayMooCount.classList.add('all-text');
    bucketDisplayGoatCount.classList.add('goat-count');
    bucketDisplayGoatCount.classList.add('all-text');
    var currentGoatCount = goatCount;
    var currentMooCount = mooCount;
    bucketDisplayHeader.textContent = `@${bucketAuthor} says:`;
    bucketDisplayTextContent.textContent = `"${bucketText}"`;
    bucketDisplayMooCount.textContent = `🐮X${currentMooCount}`
    bucketDisplayGoatCount.textContent = `🐐X${currentGoatCount}`
    bucketDisplayDeletePostButtonTextContent.textContent = 'Delete Post';
    bucketDisplayCommentButtonTextContent.textContent = `Comment`;
    bucketDisplayEditPostButtonTextContent.textContent = `Edit Post`;

    bucketDisplayDeletePostButton.setAttribute('tabindex', '0');
    bucketDisplayCommentButton.setAttribute('tabindex', '0.1');
    bucketDisplayEditPostButton.setAttribute('tabindex', '0.2');
    bucketDisplayMooCount.setAttribute('tabindex', '0.3');
    bucketDisplayGoatCount.setAttribute('tabindex', '0.4');

    bucketDisplayDeletePostButton.focus();


    document.body.appendChild(bucketDisplayBackgroundWindow);
    bucketDisplayBackgroundWindow.appendChild(bucketDisplayContent);
    bucketDisplayContent.appendChild(bucketDisplayCloseButton);
    bucketDisplayContent.appendChild(bucketDisplayHeaderContainer);
    bucketDisplayHeaderContainer.appendChild(bucketDisplayHeader);
    bucketDisplayContent.appendChild(bucketDisplayActionButtonsContainer);
    bucketDisplayActionButtonsContainer.appendChild(bucketDisplayDeletePostButton);
    bucketDisplayDeletePostButton.appendChild(bucketDisplayDeletePostButtonTextContent);
    bucketDisplayActionButtonsContainer.appendChild(bucketDisplayCommentButton);
    bucketDisplayCommentButton.appendChild(bucketDisplayCommentButtonTextContent);
    bucketDisplayActionButtonsContainer.appendChild(bucketDisplayEditPostButton);
    bucketDisplayEditPostButton.appendChild(bucketDisplayEditPostButtonTextContent);
    bucketDisplayContent.appendChild(bucketDisplayTextContentContainer);
    bucketDisplayTextContentContainer.appendChild(bucketDisplayTextContent);
    bucketDisplayContent.appendChild(bucketDisplayCountersContainer);
    bucketDisplayCountersContainer.appendChild(bucketDisplayMooCount);
    bucketDisplayCountersContainer.appendChild(bucketDisplayGoatCount);
    bucketDisplayContent.appendChild(bucketDisplayContentComments);

    loadComments(bucketComments, bucketDisplayContentComments, bucketAuthor, bucketID)


    bucketDisplayCloseButton.addEventListener('click', function() {
        closeBucketDisplay()
    });
    window.addEventListener('click', (event) => {
        if (event.target === bucketDisplayBackgroundWindow) {
            activeComment = false;
            document.body.removeChild(bucketDisplayBackgroundWindow);
            
        }
    });
    const currentUserName = bucketAuthor;
    bucketDisplayCommentButton.addEventListener('click', function() {
        if (activeComment === false) {
            writeComment(currentUserName, bucketDisplayContentComments, bucketID, bucketAuthor, bucketText, bucketComments)
            activeComment = true;
        } else {
            const displayCreateCommentPostButton = document.getElementById('display-create-comment-post-button');
            displayCreateCommentPostButton.scrollIntoView({ behavior: 'smooth' });
            const displayCreateCommentInput = document.getElementById('display-create-comment-input')
            setTimeout(() => {
                displayCreateCommentInput.focus();
            },550);
        }
    });

    bucketDisplayDeletePostButton.addEventListener('click', function() {
        confirmDelete(bucketID)
    })

    bucketDisplayEditPostButton.addEventListener('click', function() {
        openEditBucketWindow(bucketText, currentUserName, bucketID, bucketAuthor, bucketComments, mooCount, goatCount)
    })

    bucketDisplayDeletePostButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            confirmDelete(bucketID)
        }
    })
    bucketDisplayCommentButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            if (activeComment === false) {
                writeComment(currentUserName, bucketDisplayContentComments, bucketID, bucketAuthor, bucketText, bucketComments)
                activeComment = true;
            } else {
                const displayCreateCommentPostButton = document.getElementById('display-create-comment-post-button');
                displayCreateCommentPostButton.scrollIntoView({ behavior: 'smooth' });
                const displayCreateCommentInput = document.getElementById('display-create-comment-input')
                setTimeout(() => {
                    displayCreateCommentInput.focus();
                },550);
            }
        }
    })
    bucketDisplayEditPostButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            openEditBucketWindow(bucketText, currentUserName, bucketID, bucketAuthor, bucketComments, mooCount, goatCount)
        }
    })

}

async function deletePost(bucketID) {
    const bucketCheckList = userData.buckets;
    for (const bucket in bucketCheckList) {
        console.log('we are checking')
        const bucketToCheck = bucketCheckList[bucket];
        if (bucketToCheck.bucketID === bucketID) {
            console.log('found it')
            delete bucketCheckList[bucket];
            await updateDoc(docRef, { buckets: bucketCheckList})
            .then(() => {
                console.log('successfully deleted post');
                window.location.reload(true);

            })
            .catch((error) => {
                console.log('error deleting post: ', error);
            })
        }
    }
}

async function writeComment(currentUserName, bucketDisplayContentComments, bucketID, bucketAuthor, bucketText, bucketComments) {
    const displayCreateCommentHeaderContainer = document.createElement('div');
    const displayCreateCommentHeader = document.createElement('h3');
    const displayCreateCommentInput = document.createElement('textarea');
    const displayCreateCommentPostButton = document.createElement('div');

    displayCreateCommentPostButton.setAttribute('tabindex', '0.5')

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

    displayCreateCommentPostButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            const commentToPost = displayCreateCommentInput.value;
            if (commentToPost.length < 100) {
                postComment(commentToPost, currentUserName, bucketID, bucketAuthor, bucketText, bucketComments);            
            } else {
                alert('The current comment length max at this time is 100 charachters')
            }
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

async function postComment(commentToPost, currentUserName, bucketID, bucketAuthor, bucketText, bucketComments) {
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
                        loadComments(workingPostDataActiveBucketPostComments, bucketDisplayContentComments, bucketAuthor, bucketID)   
                    })
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

openChatWindowButton.addEventListener('click', function() {
    openChatWindow();
})

function confirmDelete(bucketID) {
    const confirmDeleteModal = document.createElement('div');
    const confirmDeleteModalContentContainer = document.createElement('div');
    const confirmDeleteModalHeader = document.createElement('div');
    const confirmDeleteModalButtonContainer = document.createElement('div');
    const confirmDeleteModalYesButton = document.createElement('div');
    const confirmDeleteModalNoButton = document.createElement('div');

    confirmDeleteModal.classList.add('modal');
    confirmDeleteModal.style.display = 'block';
    confirmDeleteModalContentContainer.classList.add('modal-content');
    confirmDeleteModalHeader.classList.add('modal-header-container');
    confirmDeleteModalHeader.classList.add('all-text');
    confirmDeleteModalHeader.classList.add('header-text');
    confirmDeleteModalHeader.textContent = 'Are You Sure You Want To Delete This?';
    confirmDeleteModalYesButton.classList.add('action-button');
    confirmDeleteModalNoButton.classList.add('action-button');
    confirmDeleteModalYesButton.textContent = 'Confirm';
    confirmDeleteModalNoButton.textContent = 'Cancel';
    confirmDeleteModalButtonContainer.classList.add('delete-confirmation-buttons-container')
    confirmDeleteModalYesButton.setAttribute('tabindex', '0');
    confirmDeleteModalNoButton.setAttribute('tabindex', '0.5');

    document.body.appendChild(confirmDeleteModal);
    confirmDeleteModal.appendChild(confirmDeleteModalContentContainer);
    confirmDeleteModalContentContainer.appendChild(confirmDeleteModalHeader);
    confirmDeleteModalContentContainer.appendChild(confirmDeleteModalButtonContainer);
    confirmDeleteModalButtonContainer.appendChild(confirmDeleteModalYesButton);
    confirmDeleteModalButtonContainer.appendChild(confirmDeleteModalNoButton);

    confirmDeleteModalYesButton.focus();

    confirmDeleteModalYesButton.addEventListener('click', function(){
        console.log('trying to delete...')
        deletePost(bucketID);
    })

    confirmDeleteModalYesButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            console.log('trying to delete...')
            deletePost(bucketID);
        }
    })

    confirmDeleteModalNoButton.addEventListener('click', function(){
        document.body.removeChild(confirmDeleteModal);
    })

    confirmDeleteModalNoButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            document.body.removeChild(confirmDeleteModal);
        }
    })
}

function openEditBucketWindow(bucketText, currentUserName, bucketID, bucketAuthor, bucketComments, mooCount, goatCount) {
    const editBucketWindowModal = document.createElement('div');
    const editBucketWindowModalContent = document.createElement('div');
    const editBucketWindowModalHeader = document.createElement('div');
    const editBucketWindowModalText = document.createElement('textarea');
    const editBucketWindowModalDumpBucketButton = document.createElement('div');

    editBucketWindowModal.id = 'edit-bucket-window-modal'
    editBucketWindowModalText.id = 'edit-bucket-updated-textarea'
    editBucketWindowModal.classList.add('modal');
    editBucketWindowModal.style.display = 'block';
    editBucketWindowModalContent.classList.add('bucket-display-modal-content');
    editBucketWindowModalHeader.classList.add('modal-header-container');
    editBucketWindowModalHeader.classList.add('all-text');
    editBucketWindowModalText.classList.add('all-text');
    editBucketWindowModalText.classList.add('textarea')
    editBucketWindowModalDumpBucketButton.classList.add('action-button')
    editBucketWindowModalDumpBucketButton.classList.add('all-text')

    editBucketWindowModalHeader.textContent = 'Edit Bucket Text';
    editBucketWindowModalText.textContent = bucketText;
    editBucketWindowModalDumpBucketButton.textContent = 'Dump Bucket';

    document.body.appendChild(editBucketWindowModal);
    editBucketWindowModal.appendChild(editBucketWindowModalContent);
    editBucketWindowModalContent.appendChild(editBucketWindowModalHeader);
    editBucketWindowModalContent.appendChild(editBucketWindowModalText);
    editBucketWindowModalContent.appendChild(editBucketWindowModalDumpBucketButton);

    editBucketWindowModalText.focus();
    

    window.addEventListener('click', function() {
        if (event.target === editBucketWindowModal) {
            closeEditBucketWindow()
        }
    })
    editBucketWindowModalDumpBucketButton.addEventListener('click', function() {
        updateBucket(currentUserName, bucketID, bucketAuthor, bucketText, bucketComments, mooCount, goatCount)
    })
    editBucketWindowModalDumpBucketButton.addEventListener('keyup', function(event) {
        if (event.keycode === 13) {
            updateBucket()
        }
    })
}

function closeEditBucketWindow() {
    const editBucketWindowModal = document.getElementById('edit-bucket-window-modal')
    editBucketWindowModal.style.display = 'none';
}

async function updateBucket(currentUserName, bucketID, bucketAuthor, bucketText, bucketComments, mooCount, goatCount) {
    const newBucketText = document.getElementById('edit-bucket-updated-textarea').value;
    console.log(newBucketText)
    try {
        console.log(bucketAuthor)
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
                    workingPostDataActiveBucket[`bucketText`] = newBucketText;
                    await updateDoc(bucketAuthorDocRef, {buckets: workingPostDataBuckets })
                    .then(() => {
                        closeEditBucketWindow();
                        closeBucketDisplay();
                        clearBucketsTimeline()
                        for (let bucket in userBuckets) {
                            if (userBuckets.hasOwnProperty(bucket)) {
                              const checkBucketID = userBuckets[bucket];
                              if (checkBucketID['bucketID'] === bucketID) {
                                console.log('found it ', checkBucketID['bucketText']);
                                checkBucketID['bucketText'] = newBucketText;
                                console.log('updated: ', checkBucketID['bucketText']);
                                userBuckets[bucket] = checkBucketID; // Update the original object
                              }
                            }
                          }
                        displayBuckets();
                        loadBucket(bucketAuthor, bucketID, newBucketText, bucketComments, mooCount, goatCount);
                    })
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

function closeBucketDisplay() {
    const bucketDisplayBackgroundWindow = document.getElementById('bucket-display-background-window')
    document.body.removeChild(bucketDisplayBackgroundWindow);
}

function clearBucketsTimeline() {
    while (bucketsWall.firstChild) {
        const firstChild = bucketsWall.firstChild;
        bucketsWall.removeChild(firstChild);
    }
}

async function loadComments(bucketComments, bucketDisplayContentComments, bucketAuthor, bucketID) {
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

function openChatWindow() {
    const chatMainDisplayBackgroundWindow = document.createElement('div');
    const chatMainDisplayContent = document.createElement('div');
    const chatMainDisplayContentChats = document.createElement('div');
    const chatMainDisplayCloseButton = document.createElement('span');
    const chatMainDisplayHeaderContainer = document.createElement('div');
    const chatMainDisplayHeader = document.createElement('h3');
    const chatMainDisplayUpperDiv = document.createElement('div');
    const chatMainDisplayLowerDiv = document.createElement('div');
    const chatMainDisplayNewChatButton = document.createElement('div');
    const chatMainDisplayNewChatButtonTextContent = document.createElement('p');

    chatMainDisplayContentChats.id = 'bucket-display-chats'
    chatMainDisplayBackgroundWindow.id = 'chat-display-background-window'
    chatMainDisplayBackgroundWindow.classList.add('chat-display-modal');
    chatMainDisplayContentChats.classList.add('chats-column');
    chatMainDisplayContent.classList.add('chat-display-modal-content');
    chatMainDisplayCloseButton.classList.add('close');
    chatMainDisplayBackgroundWindow.style.display = 'block';
    chatMainDisplayHeaderContainer.classList.add('chat-display-header-container');
    chatMainDisplayHeader.classList.add('all-text');
    chatMainDisplayNewChatButton.classList.add('action-button');
    chatMainDisplayNewChatButtonTextContent.classList.add('all-text');
    chatMainDisplayHeader.textContent = `Your Messages`;
    chatMainDisplayNewChatButtonTextContent.textContent = 'Message Someone New';
    chatMainDisplayUpperDiv.classList.add('chat-divider')
    chatMainDisplayLowerDiv.classList.add('chat-divider')

    chatMainDisplayNewChatButton.focus();

    document.body.appendChild(chatMainDisplayBackgroundWindow);
    chatMainDisplayBackgroundWindow.appendChild(chatMainDisplayContent);
    chatMainDisplayContent.appendChild(chatMainDisplayCloseButton);
    chatMainDisplayContent.appendChild(chatMainDisplayHeaderContainer);
    chatMainDisplayHeaderContainer.appendChild(chatMainDisplayHeader);
    chatMainDisplayContent.appendChild(chatMainDisplayNewChatButton);
    chatMainDisplayNewChatButton.appendChild(chatMainDisplayNewChatButtonTextContent);
    chatMainDisplayContent.appendChild(chatMainDisplayUpperDiv);
    chatMainDisplayContent.appendChild(chatMainDisplayContentChats);
    chatMainDisplayContent.appendChild(chatMainDisplayLowerDiv);

    chatMainDisplayNewChatButton.addEventListener('click', function() {
        alert(`we're still working on this. Thanks for your patience. @Dev`)
    })
    window.addEventListener('click', (event) => {
        if (event.target === chatMainDisplayBackgroundWindow) {
            document.body.removeChild(chatMainDisplayBackgroundWindow);
        }
    })

    loadChats();
}

function loadChats() {
    console.log(userChats)
    const chatMainDisplayContentChats = document.getElementById('bucket-display-chats')
    for (const message in userChats) {
        const chatButton = document.createElement('button');
        chatButton.classList.add('message-option');
        chatButton.classList.add('all-text');
        const conversationID = message
        chatButton.textContent = `Chat with @${conversationID}`
        chatMainDisplayContentChats.appendChild(chatButton);
        console.log(conversationID);
        console.log(message)
        chatButton.addEventListener('click', function() {
            loadChatBlock(conversationID);
        })
    }
}

function loadChatBlock (conversationID) {
    const messageMainDisplayBackgroundWindow = document.createElement('div');
    const messageMainDisplayContent = document.createElement('div');
    const messageMainDisplayContentMessages = document.createElement('div');
    const messageMainDisplayCloseButton = document.createElement('span');
    const messageMainDisplayHeaderContainer = document.createElement('div');
    const messageMainDisplayHeader = document.createElement('h3');
    const messageMainDisplaySendMessageBlock = document.createElement('div');
    const messageMainDisplayTextArea = document.createElement('textarea');
    const messageMainDisplaySendNewMessageButton = document.createElement('button');

    messageMainDisplayContentMessages.id = 'window-display-messages'
    messageMainDisplayTextArea.id = `message-main-display-textarea`
    messageMainDisplayBackgroundWindow.id = 'message-display-background-window'
    messageMainDisplayBackgroundWindow.classList.add('message-display-modal');
    messageMainDisplayContentMessages.classList.add('messages-column');
    messageMainDisplayContent.classList.add('message-display-modal-content');
    messageMainDisplayCloseButton.classList.add('close');
    messageMainDisplayBackgroundWindow.style.display = 'block';
    messageMainDisplayHeaderContainer.classList.add('message-display-header-container');
    messageMainDisplayHeader.classList.add('all-text');
    messageMainDisplaySendNewMessageButton.classList.add('action-button');
    messageMainDisplaySendNewMessageButton.classList.add('all-text');
    messageMainDisplayHeader.textContent = `Messages With @${conversationID}`;
    messageMainDisplaySendNewMessageButton.textContent = 'Send';
    messageMainDisplaySendMessageBlock.classList.add('send-message-block')
    messageMainDisplayTextArea.classList.add('message-input')
    messageMainDisplayTextArea.classList.add('all-text');
    messageMainDisplaySendNewMessageButton.classList.add('action-button')
    messageMainDisplaySendNewMessageButton.classList.add('send-message-button')

    messageMainDisplayTextArea.focus();

    document.body.appendChild(messageMainDisplayBackgroundWindow);
    messageMainDisplayBackgroundWindow.appendChild(messageMainDisplayContent);
    messageMainDisplayContent.appendChild(messageMainDisplayCloseButton);
    messageMainDisplayContent.appendChild(messageMainDisplayHeaderContainer);
    messageMainDisplayHeaderContainer.appendChild(messageMainDisplayHeader);
    messageMainDisplayContent.appendChild(messageMainDisplayContentMessages);
    messageMainDisplayContent.appendChild(messageMainDisplaySendMessageBlock);
    messageMainDisplaySendMessageBlock.appendChild(messageMainDisplayTextArea);
    messageMainDisplaySendMessageBlock.appendChild(messageMainDisplaySendNewMessageButton);

    

    messageMainDisplaySendNewMessageButton.addEventListener('click', function() {
        sendMessage(conversationID)
    })

    messageMainDisplaySendNewMessageButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            sendMessage(conversationID)
        }
    })

    

    pullChatData(conversationID)

    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const userDataChangeData = doc.data();
            pullChatData(conversationID)
            console.log('a change was made')
        }
    })

    window.addEventListener('click', (event) => {
        if (event.target === messageMainDisplayBackgroundWindow) {
            document.body.removeChild(messageMainDisplayBackgroundWindow);
            unsubscribe()
            console.log('unsubscribed i think?')
        }
    })
}

function loadConversation(conversationID, currentConversation) {
        const messagesToLoad = currentConversation
        const messagesToLoadArray = Object.entries(messagesToLoad);
        messagesToLoadArray.sort((a,b) => b[0] - a[0]);
        var sortedMessagesToLoad = {};
        messagesToLoadArray.forEach(entry => {
            const [timestamp, value] = entry;
            sortedMessagesToLoad[timestamp] = value
        });


    for (const message in sortedMessagesToLoad) {
        const messageObject = sortedMessagesToLoad[message];
        const individualMessageBlock = document.createElement('div');
        const individualMessageTime = document.createElement('div');
        const individualMessageText = document.createElement('div');
        const messageMainDisplayContentMessages = document.getElementById('window-display-messages')
        individualMessageText.textContent = messageObject['messageText'];
        individualMessageTime.textContent = `${conversationID} at: ${messageObject[`timestamp`]}`

        if (messageObject[`direction`] === 'sent') {
            individualMessageBlock.classList.add('sent-message-block')
        } else {
            individualMessageBlock.classList.add('received-message-block')
        }

        messageMainDisplayContentMessages.appendChild(individualMessageBlock);
        individualMessageBlock.appendChild(individualMessageTime);
        individualMessageBlock.appendChild(individualMessageText);
    }

    messageMainDisplayContentMessages.scrollTop = messageMainDisplayContentMessages.scrollHeight;
}

async function sendMessage(conversationID, userChats) {
    const newMessageText = document.getElementById('message-main-display-textarea').value
    const inputArea = document.getElementById('message-main-display-textarea');
    inputArea.value = '';
    try {
        const findMessageAuthorQuery = query(usersCollection, where('userName', '==', userName));
        const messageAuthorQuerySnapshot = await getDocs(findMessageAuthorQuery);

        if (!messageAuthorQuerySnapshot.empty) {
            const messageAuthorDocID = messageAuthorQuerySnapshot.docs[0].id;

            const messageAuthorDocRef = doc(firestore, 'users', messageAuthorDocID);
            const messageAuthorDocSnap = await getDoc(messageAuthorDocRef);

            if (messageAuthorDocSnap.exists()) {
                const workingConversationData = messageAuthorDocSnap.data();
                const workingConversationDataChats = workingConversationData.messages;

                if (conversationID in workingConversationDataChats) {
                    const workingConversationDataActiveChat = workingConversationDataChats[conversationID];
                    let newMessageToAdd = {
                        messageText: newMessageText,
                        timestamp: Date.now(),
                        direction: 'sent',
                    }
                    const key = Date.now().toString();
                    workingConversationDataActiveChat[key] = newMessageToAdd;

                    workingConversationDataChats[conversationID] = workingConversationDataActiveChat

                    await updateDoc(messageAuthorDocRef, { messages: workingConversationDataChats })

                    console.log('newMessage object', workingConversationDataChats);
                  } else {
                    console.log('conversationID not found in user data.');
                  }
            } else {
                console.log('No such document for the message author.');
            }
        } else {
            console.log('No user found with the specified username.');
        }
    } catch (error) {
        console.error('Error:', error);
    }


    try {
        const findMessageRecipientQuery = query(usersCollection, where('userName', '==', conversationID));
        const messageRecipientQuerySnapshot = await getDocs(findMessageRecipientQuery);
        if (!messageRecipientQuerySnapshot.empty) {
            const messageRecipientDocID = messageRecipientQuerySnapshot.docs[0].id;

            const messageRecipientDocRef = doc(firestore, 'users', messageRecipientDocID);
            const messageRecipientDocSnap = await getDoc(messageRecipientDocRef);

            if (messageRecipientDocSnap.exists()) {
                const workingConversationData = messageRecipientDocSnap.data();
                const workingConversationDataChats = workingConversationData.messages;
                if (workingConversationDataChats.hasOwnProperty(userName)) {
                }
                if (userName in workingConversationDataChats) {
                    const workingConversationDataActiveChat = workingConversationDataChats[userName];

                    
                    let newMessageToAdd = {
                        messageText: newMessageText,
                        timestamp: Date.now(),
                        direction: 'received',
                    }
                    const key = Date.now().toString();
                    workingConversationDataActiveChat[key] = newMessageToAdd;

                    workingConversationDataChats[userName] = workingConversationDataActiveChat

                    await updateDoc(messageRecipientDocRef, { messages: workingConversationDataChats })
                    .then(() => {
                        pullChatData(conversationID)
                    })
                  } else {
                    console.log('userName not found in user data.');
                  }
            } else {
                console.log('No such document for the message author.');
            }
        } else {
            console.log('No user found with the specified username.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function clearMessages() {
    const messageMainDisplayContentMessages = document.getElementById('window-display-messages')
    while (messageMainDisplayContentMessages.firstChild) {
        const firstChild = messageMainDisplayContentMessages.firstChild;
        messageMainDisplayContentMessages.removeChild(firstChild)
    }
}

async function pullChatData(conversationID) {
    try {
        const refreshChatSnap = await getDoc(docRef);
        if (refreshChatSnap.exists()) {
            const userFullData = refreshChatSnap.data();
            userChats = userFullData.messages;
            console.log('current convo', userChats[conversationID])
            const currentConversation = userChats[conversationID]
            clearMessages()
            loadConversation(conversationID, currentConversation);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

