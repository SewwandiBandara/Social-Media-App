import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      username: '@sarahj',
      avatar: 'SJ',
      lastMessage: 'That sounds great! Let me know when you\'re free.',
      timestamp: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      username: '@mikechen',
      avatar: 'MC',
      lastMessage: 'Thanks for sharing that article!',
      timestamp: '1h ago',
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: 'Emma Wilson',
      username: '@emmaw',
      avatar: 'EW',
      lastMessage: 'See you tomorrow at the meeting',
      timestamp: '3h ago',
      unread: 0,
      online: false
    },
    {
      id: 4,
      name: 'Alex Smith',
      username: '@alexs',
      avatar: 'AS',
      lastMessage: 'Did you finish the project?',
      timestamp: '5h ago',
      unread: 1,
      online: false
    },
    {
      id: 5,
      name: 'Lisa Brown',
      username: '@lisab',
      avatar: 'LB',
      lastMessage: 'Happy birthday! 🎉',
      timestamp: '1d ago',
      unread: 0,
      online: true
    },
    {
      id: 6,
      name: 'Tom Davis',
      username: '@tomd',
      avatar: 'TD',
      lastMessage: 'Can you send me the files?',
      timestamp: '2d ago',
      unread: 0,
      online: false
    }
  ];

  const [chatMessages, setChatMessages] = useState({
    1: [
      {
        id: 1,
        senderId: 1,
        senderName: 'Sarah Johnson',
        content: 'Hey! How are you doing?',
        timestamp: '10:30 AM',
        isMine: false
      },
      {
        id: 2,
        senderId: 'me',
        senderName: 'You',
        content: 'Hi Sarah! I\'m doing great, thanks! How about you?',
        timestamp: '10:32 AM',
        isMine: true
      },
      {
        id: 3,
        senderId: 1,
        senderName: 'Sarah Johnson',
        content: 'I\'m good! I wanted to talk about the new project we discussed.',
        timestamp: '10:33 AM',
        isMine: false
      },
      {
        id: 4,
        senderId: 'me',
        senderName: 'You',
        content: 'Sure! I\'ve been working on some ideas. Would you like to meet up this week?',
        timestamp: '10:35 AM',
        isMine: true
      },
      {
        id: 5,
        senderId: 1,
        senderName: 'Sarah Johnson',
        content: 'That sounds great! Let me know when you\'re free.',
        timestamp: '10:36 AM',
        isMine: false
      }
    ],
    2: [
      {
        id: 1,
        senderId: 2,
        senderName: 'Mike Chen',
        content: 'Did you see that article I sent you?',
        timestamp: '9:15 AM',
        isMine: false
      },
      {
        id: 2,
        senderId: 'me',
        senderName: 'You',
        content: 'Yes! It was really insightful. Thanks for sharing!',
        timestamp: '9:20 AM',
        isMine: true
      },
      {
        id: 3,
        senderId: 2,
        senderName: 'Mike Chen',
        content: 'Thanks for sharing that article!',
        timestamp: '9:22 AM',
        isMine: false
      }
    ],
    3: [
      {
        id: 1,
        senderId: 3,
        senderName: 'Emma Wilson',
        content: 'Don\'t forget about tomorrow\'s meeting!',
        timestamp: '7:45 AM',
        isMine: false
      },
      {
        id: 2,
        senderId: 'me',
        senderName: 'You',
        content: 'Thanks for the reminder! What time again?',
        timestamp: '7:50 AM',
        isMine: true
      },
      {
        id: 3,
        senderId: 3,
        senderName: 'Emma Wilson',
        content: 'See you tomorrow at the meeting',
        timestamp: '7:52 AM',
        isMine: false
      }
    ]
  });

  const selectedConversation = conversations.find(c => c.id === selectedChat);
  const messages = chatMessages[selectedChat] || [];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        senderId: 'me',
        senderName: 'You',
        content: messageInput,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isMine: true
      };

      setChatMessages({
        ...chatMessages,
        [selectedChat]: [...(chatMessages[selectedChat] || []), newMessage]
      });
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active={"/messages"} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col">
              {/* Search Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Messages</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 text-sm text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`flex items-center p-4 cursor-pointer transition-colors ${
                      selectedChat === conversation.id
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{conversation.avatar}</span>
                      </div>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{selectedConversation.avatar}</span>
                        </div>
                        {selectedConversation.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{selectedConversation.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.online ? 'Active now' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.isMine ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {!message.isMine && (
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-semibold">{selectedConversation.avatar}</span>
                            </div>
                          )}
                          <div>
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                message.isMine
                                  ? 'bg-blue-500 text-white rounded-br-none'
                                  : 'bg-white text-gray-800 rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <p className={`text-xs text-gray-500 mt-1 ${message.isMine ? 'text-right' : 'text-left'}`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <div className="flex-1 relative">
                        <textarea
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          rows="1"
                          className="w-full px-4 py-2 pr-12 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 rounded-full transition-colors">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
