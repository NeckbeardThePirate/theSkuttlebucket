
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

var tweetsTimelineColumn = document.getElementById('tweets-timeline-column')

function compareByTimestamp(a, b) {
    const date1 = new Date(a.timestamp);
    const date2 = new Date(b.timestamp);

    return date2 - date1;
}

console.log('this is a test')
let tweetObject = [];


for (const userId in users) {
    if (users.hasOwnProperty(userId)) {
        const tweets = users[userId].tweets;
        for (const tweet of tweets) {
            tweetObject.push(tweet)
        }
    }
}
tweetObject.sort(compareByTimestamp);

for (let tweet of tweetObject) {
    var showTweet = document.createElement('div');
    var tweetText = document.createElement('h3');
    var tweetDate = document.createElement('p');
    // var checkUserHandle = users[selectedUser].userName;
    showTweet.classList.add('tweet-block');
    tweetText.classList.add('all-text');
    tweetDate.classList.add('all-text');
    tweetText.textContent = `${tweet.text}`;
    tweetDate.textContent = `${tweet.timestamp}`;
    tweetsTimelineColumn.appendChild(showTweet);
    showTweet.appendChild(tweetText);
    showTweet.appendChild(tweetDate);
    console.log('this is a test')
}
