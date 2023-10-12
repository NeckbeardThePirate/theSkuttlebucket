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

        showBucket.addEventListener('click', function() {
            const bucketAuthor = subBucket[`bucketAuthor`];
            const bucketID = subBucket[`bucketID`];
            const bucketText = subBucket[`bucketText`];
            const bucketComments = subBucket[`bucketComments`];
            const mooCount = subBucket[`mooCount`];
            const goatCount = subBucket[`goatCount`];
            loadBucket(bucketAuthor, bucketID, bucketText, bucketComments, mooCount, goatCount)
        })
    }
}

let followingUser = true;

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

function loadBucket(bucketAuthor, bucketID, bucketText, bucketComments, mooCount, goatCount) {
    console.log('author: ', bucketAuthor);
    console.log('comments', bucketComments);
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
    const bucketDisplayMessageButton = document.createElement('div');
    const bucketDisplayMessageButtonTextContent = document.createElement('p');
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
    bucketDisplayFollowButton.classList.add('action-button');
    bucketDisplayCommentButton.classList.add('action-button');
    bucketDisplayMessageButton.classList.add('action-button');
    bucketDisplayFollowButtonTextContent.classList.add('all-text');
    bucketDisplayCommentButtonTextContent.classList.add('all-text');
    bucketDisplayMessageButtonTextContent.classList.add('all-text');
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
    if (followingUser) {
        console.log(followingList.length, followingList)
        console.log('currently following');
        bucketDisplayFollowButtonTextContent.textContent = `UnFollow @${bucketAuthor}`;
    } else {
        console.log(followingList.length, followingList)
        console.log('currently not following');
        bucketDisplayFollowButtonTextContent.textContent = `Follow @${bucketAuthor}`;
    }
    bucketDisplayCommentButtonTextContent.textContent = `Comment`;
    bucketDisplayMessageButtonTextContent.textContent = `Message @${bucketAuthor}`;


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
    bucketDisplayActionButtonsContainer.appendChild(bucketDisplayMessageButton);
    bucketDisplayMessageButton.appendChild(bucketDisplayMessageButtonTextContent);
    bucketDisplayContent.appendChild(bucketDisplayTextContentContainer);
    bucketDisplayTextContentContainer.appendChild(bucketDisplayTextContent);
    bucketDisplayContent.appendChild(bucketDisplayCountersContainer);
    bucketDisplayCountersContainer.appendChild(bucketDisplayMooCount);
    bucketDisplayCountersContainer.appendChild(bucketDisplayGoatCount);
    bucketDisplayContent.appendChild(bucketDisplayContentComments);


    loadComments(bucketComments, bucketDisplayContentComments)


    bucketDisplayCloseButton.addEventListener('click', function() {
        closeBucketDisplay()
    });
    window.addEventListener('click', (event) => {
        if (event.target === bucketDisplayBackgroundWindow) {
            document.body.removeChild(bucketDisplayBackgroundWindow);
            
        }
    });

    bucketDisplayFollowButton.addEventListener('click', function() {
        if (followingUser) {
            followingUser = false;
            removeUserFromFollowing()
            unFollowUserFunction()
            document.body.removeChild(bucketDisplayBackgroundWindow);
            loadBucket(bucketAuthor, bucketID, bucketText, bucketComments, mooCount, goatCount);
        } else {
            followingUser = true;
            addUserToFollowing();
            followUserFunction();
            document.body.removeChild(bucketDisplayBackgroundWindow);
            loadBucket(bucketAuthor, bucketID, bucketText, bucketComments, mooCount, goatCount)
        }
    });

    bucketDisplayMessageButton.addEventListener('click', function() {
        alert('This functionality is still in development thanks for your patience');
    })

    bucketDisplayCommentButton.addEventListener('click', function() {
        writeComment(userName, bucketDisplayContentComments, bucketID, bucketAuthor, bucketText, bucketComments)
    })

    bucketDisplayMooCount.addEventListener('click', function() {
        alert('This functionality is still in development thanks for your patience');
    })

    bucketDisplayGoatCount.addEventListener('click', function() {
        alert('This functionality is still in development thanks for your patience');
    })
}

async function writeComment(currentUserName, bucketDisplayContentComments, bucketID, bucketAuthor, bucketText, bucketComments) {
    const displayCreateCommentHeaderContainer = document.createElement('div');
    const displayCreateCommentHeader = document.createElement('h3');
    const displayCreateCommentInput = document.createElement('textarea');
    const displayCreateCommentPostButton = document.createElement('div');

    displayCreateCommentHeader.textContent = `@${currentUserName}:`;
    displayCreateCommentPostButton.classList.add('action-button');
    displayCreateCommentPostButton.classList.add('all-text');
    displayCreateCommentHeaderContainer.classList.add('display-create-comment-header');
    displayCreateCommentPostButton.textContent = 'Post';
    displayCreateCommentInput.classList.add('add-comment-text-content-container');
    displayCreateCommentHeader.classList.add('all-text');

    displayCreateCommentPostButton.addEventListener('click', function() {
        const commentToPost = displayCreateCommentInput.value;
        postComment(commentToPost, currentUserName, bucketID, bucketAuthor, bucketText, bucketComments);
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
                    // alert('your comment was posted... still working out the kinks, just reload the page and open the bucket again to see it, thanks! @Dev')
                    .then(() => {
                        // document.body.removeChild(bucketDisplayBackgroundWindow)
                        const bucketDisplayContentComments = document.getElementById('bucket-display-content')
                        clearComments(bucketDisplayContentComments)
                        console.log(workingPostDataActiveBucketPostComments)
                        loadComments(workingPostDataActiveBucketPostComments, bucketDisplayContentComments)   
                        console.log('idk if it worked or not')
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

function clearComments(bucketDisplayContentComments) {
    while (bucketDisplayContentComments.firstChild) {
        const firstChild = bucketDisplayContentComments.firstChild;
        bucketDisplayContentComments.removeChild(firstChild);
    }
}

function loadComments(bucketComments, bucketDisplayContentComments) {
    for (const comment in bucketComments) {
        if (bucketComments.hasOwnProperty(comment)) {
            const bucketCommentID = bucketComments[comment];
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
}
