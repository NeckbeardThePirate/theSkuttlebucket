import { userChats, getDoc, onSnapshot, docRef, query, usersCollection, where, userName, getDocs, doc, firestore, updateDoc } from './userProfile.js';

let userMessageChats = userChats

const openChatWindowButton = document.getElementById('chat-button')

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
    console.log(userMessageChats)
    const chatMainDisplayContentChats = document.getElementById('bucket-display-chats')
    for (const message in userMessageChats) {
        const chatButton = document.createElement('button');
        chatButton.classList.add('message-option');
        chatButton.classList.add('all-text');
        const conversationID = message
        chatButton.textContent = `Chat with @${conversationID}`
        chatMainDisplayContentChats.appendChild(chatButton);
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
                    let newMessageToAdd = {
                        messageText: newMessageText,
                        timestamp: Date.now(),
                        direction: 'sent',
                    }
                    const key = Date.now().toString();
                    workingConversationDataActiveChat[key] = newMessageToAdd;

                    workingConversationDataChats[conversationID] = workingConversationDataActiveChat

                    await updateDoc(messageAuthorDocRef, { messages: workingConversationDataChats })
                    .then(() => {
                        inputArea.value = '';
                        // const inputArea = document.getElementById('message-main-display-textarea');
                        inputArea.focus();
                    })
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
            userMessageChats = userFullData.messages;
            console.log('current convo', userMessageChats[conversationID])
            const currentConversation = userMessageChats[conversationID]
            clearMessages()
            loadConversation(conversationID, currentConversation);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

