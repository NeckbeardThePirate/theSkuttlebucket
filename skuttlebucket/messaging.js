import { userChats, getDoc, onSnapshot, docRef, query, usersCollection, where, userName, getDocs, doc, firestore, updateDoc, userData } from './userProfile.js';
// import { chatLoadSearchResults, checkForMatchingUserNames, displayMatchingSearchResults, resultsContainer } from './search.js';
let userMessageChats = userChats

const openChatWindowButton = document.getElementById('chat-button')


const allUsersRef = await getDocs(usersCollection);

const allUserNames = [];

let filteredUsers = [];

allUsersRef.forEach((doc) => {
    if(doc.exists()) {
        const userData = doc.data();
        const userName = userData.userName;
        allUserNames.push(userName);
    }
})

openChatWindowButton.addEventListener('click', function() {
    openChatWindow();
})

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
        displayNewChatUserSearch();
    })
    window.addEventListener('click', (event) => {
        if (event.target === chatMainDisplayBackgroundWindow) {
            document.body.removeChild(chatMainDisplayBackgroundWindow);
            let messageAlert = false;
            for (const conversation in userChats) {
                const inspectConversation = userChats[conversation]
                for (const message in inspectConversation) {
                    const currentMessage = inspectConversation[message]
                    if (currentMessage.seen === false) {
                        console.log('There is an unseen message', message)
                        messageAlert = true;
                    }
                }
            } if (messageAlert === false) {
                const messagesButton = document.getElementById('chat-button');
                messagesButton.classList.remove('red-border')
            }
            
        }
    })

    loadChats();
}

function loadChats() {
    const chatMainDisplayContentChats = document.getElementById('bucket-display-chats')
    for (const message in userMessageChats) {
        const chatButton = document.createElement('button');
        chatButton.classList.add('message-option');
        chatButton.classList.add('all-text');
        const convo = userMessageChats[message];
        for (const chat in convo) {
            const chatObject = convo[chat];
            if (chatObject.seen === false) {
                chatButton.classList.add('red-border');
                chatButton.addEventListener('click', function() {
                    chatButton.classList.remove('red-border')
                })
            }
        }
        const conversationID = message
        chatButton.textContent = `Chat with @${conversationID}`
        chatMainDisplayContentChats.appendChild(chatButton);
        chatButton.addEventListener('click', function() {
            loadChatBlock(conversationID);
        })
    }
}

function loadChatBlock(conversationID) {
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

    messageMainDisplayTextArea.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            sendMessage(conversationID)
        }
    })

    

    pullChatData(conversationID)

    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const userDataChangeData = doc.data();
            pullChatData(conversationID)
        }
    })

    window.addEventListener('click', (event) => {
        if (event.target === messageMainDisplayBackgroundWindow) {
            document.body.removeChild(messageMainDisplayBackgroundWindow);
            unsubscribe()
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

        console.log('we hit load conversation')
    for (const message in sortedMessagesToLoad) {
        const messageObject = sortedMessagesToLoad[message];
        if (messageObject.seen === false) {
            messageObject.seen = true;
        }
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

    const messageMainDisplayContentMessages = document.getElementById('window-display-messages')

    messageMainDisplayContentMessages.scrollTop = messageMainDisplayContentMessages.scrollHeight;
}

async function sendMessage(conversationID, userMessageChats) {
    const newMessageText = document.getElementById('message-main-display-textarea').value
    const inputArea = document.getElementById('message-main-display-textarea');
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
                    const viewed = true;
                    let newMessageToAdd = {
                        messageText: newMessageText,
                        timestamp: Date.now(),
                        direction: 'sent',
                        seen: viewed,
                    }
                    const key = Date.now().toString();
                    workingConversationDataActiveChat[key] = newMessageToAdd;

                    workingConversationDataChats[conversationID] = workingConversationDataActiveChat

                    await updateDoc(messageAuthorDocRef, { messages: workingConversationDataChats })
                    .then(() => {
                        inputArea.value = '';
                        inputArea.focus();
                    })
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
                    const viewed = false;
                    
                    let newMessageToAdd = {
                        messageText: newMessageText,
                        timestamp: Date.now(),
                        direction: 'received',
                        seen: viewed,
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
    if (messageMainDisplayContentMessages.firstChild) {
        while (messageMainDisplayContentMessages.firstChild) {
            const firstChild = messageMainDisplayContentMessages.firstChild;
            messageMainDisplayContentMessages.removeChild(firstChild)
        }
    }
}

async function pullChatData(conversationID) {
    try {
        const refreshChatSnap = await getDoc(docRef);
        if (refreshChatSnap.exists()) {
            const userFullData = refreshChatSnap.data();
            userMessageChats = userFullData.messages;
            const currentConversation = userMessageChats[conversationID]
            clearMessages()
            loadConversation(conversationID, currentConversation);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function pullNewChatData(conversationID) {
    try {
        const refreshChatSnap = await getDoc(docRef);
        if (refreshChatSnap.exists()) {
            const userFullData = refreshChatSnap.data();
            userMessageChats = userFullData.messages;
            const currentConversation = userMessageChats[conversationID]
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function displayNewChatUserSearch() {
    const chatUserSearchModal = document.createElement('div')
    const chatUserSearchModalContent = document.createElement('div')
    const chatUserSearchModalHeaderContainer = document.createElement('div')
    const chatUserSearchModalHeaderContent = document.createElement('h2')
    const chatUserSearchModalInputBar = document.createElement('input')
    const chatUserSearchModalSearchButton = document.createElement('button')
    const chatUserSearchModalResultsContainer = document.createElement('div')

    chatUserSearchModal.classList.add('modal');
    chatUserSearchModalContent.classList.add('modal-content');
    chatUserSearchModalHeaderContainer.classList.add('modal-header-container');
    chatUserSearchModalHeaderContent.classList.add('all-text');
    chatUserSearchModalInputBar.classList.add('search-bar')
    chatUserSearchModalInputBar.placeholder = '@dev';
    chatUserSearchModalSearchButton.classList.add('action-button');

    chatUserSearchModalHeaderContent.textContent = 'Find a User';
    chatUserSearchModalSearchButton.textContent = 'Search'
    chatUserSearchModalResultsContainer.id = 'results-container'
    chatUserSearchModalInputBar.id = 'search-bar'

    chatUserSearchModalSearchButton.id = 'button-for-searching'

    chatUserSearchModal.style.display = 'block';

    document.body.appendChild(chatUserSearchModal)
    chatUserSearchModal.appendChild(chatUserSearchModalContent);
    chatUserSearchModalContent.appendChild(chatUserSearchModalHeaderContainer);
    chatUserSearchModalHeaderContainer.appendChild(chatUserSearchModalHeaderContent);
    chatUserSearchModalContent.appendChild(chatUserSearchModalInputBar);
    chatUserSearchModalContent.appendChild(chatUserSearchModalSearchButton);
    chatUserSearchModalContent.appendChild(chatUserSearchModalResultsContainer);


    window.addEventListener('click', function() {
        if (event.target === chatUserSearchModal) {
            document.body.removeChild(chatUserSearchModal)
            const chatMainDisplayContentChats = document.getElementById('bucket-display-chats')
            chatMainDisplayContentChats.style.display = 'none';
            loadChats();
        }
    })

    chatUserSearchModalSearchButton.addEventListener('click', function() {
        chatLoadSearchResults()
    })

}

// export { chatUserSearchModalResultsContainer }

function chatLoadSearchResults() {
    const chatUserSearchModalResultsContainer = document.getElementById('results-container')
    while (chatUserSearchModalResultsContainer.firstChild) {
        chatUserSearchModalResultsContainer.removeChild(chatUserSearchModalResultsContainer.firstChild)
    }
    filteredUsers = [];
    var searchTerm = document.getElementById('search-bar').value;
    chatCheckForMatchingUserNames(allUserNames, searchTerm);
    chatDisplayMatchingSearchResults(filteredUsers);
};

function chatCheckForMatchingUserNames(allUserNames, searchTerm) {
    filteredUsers = [];
    for (let i = 0; i < allUserNames.length; i++) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const lowerAllUserNames = allUserNames[i].toLowerCase();
        if(lowerAllUserNames.includes(lowerSearchTerm)) {
            filteredUsers.push(allUserNames[i]);
        }
    }
}
function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  function chatDisplayMatchingSearchResults(filteredUsers) {
    if (filteredUsers.length === 0){
        const showNoResults = document.createElement('div');
        const showNoResultsMessage = document.createElement('h3');
        showNoResultsMessage.textContent = 'No results found';
        showNoResults.classList.add('found-user');
        showNoResultsMessage.classList.add('found-username');
        showNoResultsMessage.classList.add('all-text');
        resultsContainer.appendChild(showNoResults);
        showNoResults.appendChild(showNoResultsMessage);
    } else {
        for (let i = 0; i < filteredUsers.length; i++) {
            var matchingUserAndFollowContainer = document.createElement('div');
            const showMatchingUser = document.createElement('div');
            const matchingUserName = document.createElement('h3');
            const messageUser = document.createElement('button');
            matchingUserAndFollowContainer.classList.add('matching-user-div')
            matchingUserName.classList.add('all-text');
            messageUser.textContent = `message`;
            messageUser.classList.add('follow-button')
            matchingUserName.textContent = `@${filteredUsers[i]}`
            showMatchingUser.classList.add('found-user')
            if (filteredUsers[i].length >= 16) {
                matchingUserName.classList.add('sixteen-charachter-plus-username')
            } if (filteredUsers[i].length >= 18) {
                matchingUserName.classList.remove('sixteen-charachter-plus-username')
                matchingUserName.classList.add('eighteen-charachter-plus-username')
            }

            const chatUserSearchModalResultsContainer = document.getElementById('results-container')

            matchingUserAndFollowContainer.style.display = 'flex';
            chatUserSearchModalResultsContainer.appendChild(matchingUserAndFollowContainer);
            matchingUserAndFollowContainer.appendChild(showMatchingUser);
            matchingUserAndFollowContainer.appendChild(messageUser);
            showMatchingUser.appendChild(matchingUserName);

            messageUser.addEventListener('click', function() {
            let goingToMessage = filteredUsers[i];
                console.log('Message clicked for user:', goingToMessage);
                startNewMessage(goingToMessage);
            });
            showMatchingUser.addEventListener('click', function() {
                if (userName === filteredUsers[i]) {
                    window.location.href = 'skuttlebukket_user.html'
                } else {
                    localStorage.setItem('userToLoad', JSON.stringify(filteredUsers[i]));
                    window.location.href = 'otherUserProfile.html';
                }
            });

        };
    }
};

async function startNewMessage(goingToMessage) {
    try {
        const currentChatsSnap = await getDoc(docRef);
        if (currentChatsSnap.exists()) {
            const userFullData = currentChatsSnap.data();
            const currentConversations = userFullData.messages;
            currentConversations[goingToMessage] = {}
            await updateDoc(docRef, { messages: currentConversations })
            .then(() => {
                console.log(currentConversations[goingToMessage])
            }) 
        } else {
            console.log('currentChatsSnapDoc not found')
        }
    } catch (error) {
        console.log('an error occured: ', error)
    }

    try {
        const newMessageUserNameQuery = query(usersCollection, where('userName', '==', goingToMessage))
        const newMessageUserNameQuerySnapshot = await getDocs(newMessageUserNameQuery);

        if (!newMessageUserNameQuerySnapshot.empty) {
            const newMessageUserNameDocID = newMessageUserNameQuerySnapshot.docs[0].id;

            const newMessageUserNameDocRef = doc(firestore, 'users', newMessageUserNameDocID);
            const newMessageUserNameDocSnap = await getDoc(newMessageUserNameDocRef);
            if (newMessageUserNameDocSnap.exists()) {
                const userToMessageFullData = newMessageUserNameDocSnap.data();
                const userToMessageCurrentConversations = userToMessageFullData.messages;
                userToMessageCurrentConversations[userName] = {}
                console.log(userToMessageCurrentConversations);
                console.log(userName)
                await updateDoc(newMessageUserNameDocRef, { messages: userToMessageCurrentConversations })
                .then(() => {
                    pullNewChatData(goingToMessage);
                    loadChatBlock(goingToMessage);
                })
            } else {
                console.log('an unknown error occured')
            }
        } else {
            console.log('currentChatsSnapDoc not found')
        }
    } catch (error) {
            console.log('an error occured: ', error)
    }
}