var users = {
    user1: {
        userName: '@elsiehasattitude',
        displayName: 'Elsie Da Milk Cow',
        joinedDate: 'June 2022',
        followingCount: 17,
        followerCount: 54,
        profileDescription: 'Hey Im Elsie! I love making the humans chase me all over the place and being a pain in the neck',
        avatarURL: 'assets/pexels-pixabay-36347.jpg',
        coverPhotoURL: 'assets/pexels-helena-lopes-4731090.jpg',
        tweets: [
            {
                text: 'finna make these stupid humans chase me all over the farm again',
                timestamp: '9/10/2023 00:01:20'
            },
            {
                text: 'took a romantic nap with buford today',
                timestamp: '8/09/2023 18:37:12'
            },
            {
                text: 'These flies are out of control!!!',
                timestamp: '7/14/2023 12:11:51'
            },
            {
                text: 'its gon be a cooker',
                timestamp: '2/10/2023 00:01:20'
            },
            {
                text: 'SOMEONE GET THESE STEERS AWAY FROM ME',
                timestamp: '2/09/2023 18:37:12'
            },
            {
                text: 'partay at the back of the South Pasture 2nite! bring your own hay or grass, refreshment will not be provided but we will bump the tunes and be turnin up the fade',
                timestamp: '2/09/2023 12:11:51'
            }
        ]
    },

    user2: {
        userName: '@mrbean',
        displayName: 'Mr. Bean',
        joinedDate: 'June 2009',
        followingCount: 274,
        followerCount: 4,
        profileDescription: 'I wanna know what\'s in that barn bruh',
        avatarURL: 'assets/billgates.jpg',
        coverPhotoURL: 'assets/billgates-cover.jpeg',
        tweets: [
            {
                text: 'Hey anyone want to hangout?',
                timestamp: '2/10/2023 00:01:20'
            },
            {
                text: 'Bruh im dying to know what is in that barn',
                timestamp: '2/09/2023 18:37:12'
            },
            {
                text: 'Someone tell @lillygotkids to stop headbutting me',
                timestamp: '2/09/2023 12:11:51'
            }
        ]
    },
    user3: {
        userName: '@reelscreamo',
        displayName: 'Screamo',
        joinedDate: 'June 2009',
        followingCount: 0,
        followerCount: 0,
        profileDescription: 'Screamo was a loud goat and we loved him for it - @nitwitdagowt',
        avatarURL: 'assets/billgates.jpg',
        coverPhotoURL: 'assets/billgates-cover.jpeg',
        tweets: [
            {
                text: 'Hey everyone this is @nitwitdagowt on my brothers account I regret to inform you that @reelscreamo is dead',
                timestamp: '2/10/2023 00:01:20'
            },
            {
                text: 'Hey why is zach walking towards me with that big knife?',
                timestamp: '2/09/2023 18:37:12'
            },
            {
                text: 'Someone tell @lillygotkids to stop headbutting me',
                timestamp: '2/09/2023 12:11:51'
            },
            {
                text: 'hey @boss_wesley_ladies_man you kinda stink bro',
                timestamp: '2/10/2023 00:01:20'
            },
            {
                text: 'i screamed for nine hours today and my brother @nitwitdagowt talked to a post for three and then peed on his own head',
                timestamp: '2/09/2023 18:37:12'
            },
            {
                text: 'BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!!!!',
                timestamp: '2/09/2023 12:11:51'
            }
        ]
    }
};
const storage = firebase.storage();


const queryString = window.location.search;
console.log('query', queryString);

if (queryString !== '') {
    const params = new URLSearchParams(queryString);
    console.log('params', params);
    var selectedUser = params.get('user');
    console.log('selected User', selectedUser);
} else {
    selectedUser = 'user1';
}
var userDisplayName = document.createElement('h2');

var profileHeader = document.getElementById('profile-header');

var userDisplayNameContainer = document.createElement('div');

var userHandle = document.createElement('p');

var subProfileInfo = document.createElement('div');

var followingCount = document.createElement('p');

var followerCount = document.createElement('p');

var joinDate = document.createElement('p');

var tweetsColumn = document.getElementById('tweets-column');

var tweets = users[selectedUser].tweets;

var userDescription = document.createElement('h4');




subProfileInfo.id = 'subprofile-info';
followingCount.textContent = `Following: ${users[selectedUser].followingCount}`;
followerCount.textContent = `Followers: ${users[selectedUser].followerCount}`;
joinDate.textContent = `Member since: ${users[selectedUser].joinedDate}`;
followingCount.id = 'following-count'
followerCount.id = 'follower-count'
joinDate.id = 'join-date'
followingCount.classList.add('identifying-numbers')
followerCount.classList.add('identifying-numbers')
joinDate.classList.add('identifying-numbers')

userDisplayNameContainer.id = 'user-identifiers'
userDisplayNameContainer.style.backgroundColor = '#D1D1D1';

userDisplayName.textContent = `${users[selectedUser].displayName}`
userDisplayName.classList.add('all-text');
userDisplayName.id = 'user-display-name'

userHandle.id = 'handle'
userHandle.textContent = `${users[selectedUser].userName}`

userDescription.textContent = `${users[selectedUser].profileDescription}`
userDescription.classList.add('identifying-numbers', 'all-text')

profileHeader.appendChild(userDisplayNameContainer);
userDisplayNameContainer.appendChild(userDisplayName);
userDisplayNameContainer.appendChild(userHandle);
profileHeader.appendChild(subProfileInfo);
subProfileInfo.appendChild(followingCount);
subProfileInfo.appendChild(followerCount);
subProfileInfo.appendChild(joinDate);
profileHeader.appendChild(userDescription);



for (let tweet of tweets) {
  var showTweet = document.createElement('div');
  var tweetText = document.createElement('h3');
  var tweetDate = document.createElement('p');
  var checkUserHandle = users[selectedUser].userName;
  showTweet.classList.add('tweet-block');
  tweetText.classList.add('all-text');
  tweetDate.classList.add('all-text');
  tweetText.textContent = `${tweet.text}`;
  tweetDate.textContent = `${tweet.timestamp}`;
  tweetsColumn.appendChild(showTweet);
  showTweet.appendChild(tweetText);
  showTweet.appendChild(tweetDate);
}

