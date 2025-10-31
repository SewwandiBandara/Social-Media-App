<<<<<<< HEAD
import { useState } from 'react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  // Enhanced notifications data with more details
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        username: '@sarahj'
      },
      content: 'liked your post',
      postPreview: 'Amazing sunset at the beach! 🌅',
      postImage: true,
      timestamp: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Mike Chen',
        avatar: 'MC',
        username: '@mikechen'
      },
      content: 'commented on your post',
      comment: 'This is absolutely beautiful! Where was this taken? 📸',
      timestamp: '15m ago',
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: {
        name: 'Emma Wilson',
        avatar: 'EW',
        username: '@emmaw'
      },
      content: 'started following you',
      timestamp: '1h ago',
      read: false,
      isFollowing: false
    },
    {
      id: 4,
      type: 'mention',
      user: {
        name: 'David Lee',
        avatar: 'DL',
        username: '@davidlee'
      },
      content: 'mentioned you in a comment',
      comment: '@you This reminds me of our trip last summer! 🏖️',
      timestamp: '2h ago',
      read: true
    },
    {
      id: 5,
      type: 'like',
      user: {
        name: 'Lisa Anderson',
        avatar: 'LA',
        username: '@lisaa'
      },
      content: 'and 5 others liked your comment',
      comment: 'Great point! I completely agree with this perspective.',
      timestamp: '3h ago',
      read: true,
      likeCount: 6
    },
    {
      id: 6,
      type: 'share',
      user: {
        name: 'John Smith',
        avatar: 'JS',
        username: '@johnsmith'
      },
      content: 'shared your post',
      postPreview: 'Top 10 tips for productivity 💡',
      timestamp: '5h ago',
      read: true
    },
    {
      id: 7,
      type: 'reply',
      user: {
        name: 'Anna Taylor',
        avatar: 'AT',
        username: '@annataylor'
      },
      content: 'replied to your comment',
      comment: "I hadn't thought about it that way before. Thanks for sharing! 💭",
      timestamp: '1d ago',
      read: true
    },
    {
      id: 8,
      type: 'follow',
      user: {
        name: 'Robert Brown',
        avatar: 'RB',
        username: '@robertb'
      },
      content: 'started following you',
      timestamp: '2d ago',
      read: true,
      isFollowing: true
    },
    {
      id: 9,
      type: 'tag',
      user: {
        name: 'Jessica Park',
        avatar: 'JP',
        username: '@jessicap'
      },
      content: 'tagged you in a post',
      postPreview: 'Great team collaboration! 🎉',
      timestamp: '3d ago',
      read: true
    },
    {
      id: 10,
      type: 'birthday',
      user: {
        name: 'Tom Harris',
        avatar: 'TH',
        username: '@tomh'
      },
      content: 'has a birthday today',
      timestamp: 'Today',
      read: false
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const toggleFollow = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isFollowing: !notif.isFollowing } : notif
    ));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'comment':
      case 'reply':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'follow':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
        );
      case 'mention':
      case 'tag':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'share':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </div>
        );
      case 'birthday':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const filterNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === activeTab);
  };

  const filteredNotifications = filterNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Group notifications by date
  const groupByDate = (notifs) => {
    const today = [];
    const yesterday = [];
    const thisWeek = [];
    const older = [];

    notifs.forEach(notif => {
      const time = notif.timestamp.toLowerCase();
      if (time.includes('m ago') || time.includes('h ago') || time === 'today') {
        today.push(notif);
      } else if (time.includes('yesterday')) {
        yesterday.push(notif);
      } else if (time.includes('d ago') && !time.includes('10d ago')) {
        thisWeek.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { today, yesterday, thisWeek, older };
  };

  const groupedNotifications = groupByDate(filteredNotifications);

  const renderNotificationGroup = (title, notifications) => {
    if (notifications.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
          {title}
        </h3>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
                !notification.read ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  {getNotificationIcon(notification.type)}

                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {notification.user.avatar}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-bold">{notification.user.name}</span>{' '}
                          <span className="text-gray-600">{notification.content}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{notification.user.username}</p>
                      </div>
                      <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                        {notification.timestamp}
                      </span>
                    </div>

                    {/* Additional content based on type */}
                    {notification.postPreview && (
                      <div className="mt-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 font-medium">
                          {notification.postPreview}
                        </p>
                      </div>
                    )}
                    {notification.comment && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-700">{notification.comment}</p>
                      </div>
                    )}

                    {/* Action buttons for follow notifications */}
                    {notification.type === 'follow' && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleFollow(notification.id)}
                          className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                            notification.isFollowing
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md'
                          }`}
                        >
                          {notification.isFollowing ? 'Following' : 'Follow back'}
                        </button>
                        <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                          View profile
                        </button>
                      </div>
                    )}

                    {/* Action button for birthday notifications */}
                    {notification.type === 'birthday' && (
                      <div className="mt-3">
                        <button className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-md">
                          Say happy birthday 🎂
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center space-y-1 flex-shrink-0 ml-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors group"
                        title="Mark as read"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete notification"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                {unreadCount > 0 ? (
                  <>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full mr-2">
                      {unreadCount}
                    </span>
                    {`${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All caught up!
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'All', count: null },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'like', label: 'Likes', count: null },
              { id: 'comment', label: 'Comments', count: null },
              { id: 'follow', label: 'Follows', count: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 ${activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'} text-xs font-bold rounded-full`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
          </div>
        ) : (
          <>
            {renderNotificationGroup('Today', groupedNotifications.today)}
            {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
            {renderNotificationGroup('This Week', groupedNotifications.thisWeek)}
            {renderNotificationGroup('Older', groupedNotifications.older)}
          </>
        )}

        {/* Load More Button */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200">
              Load more notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
=======
import { useState } from 'react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  // Enhanced notifications data with more details
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        username: '@sarahj'
      },
      content: 'liked your post',
      postPreview: 'Amazing sunset at the beach! 🌅',
      postImage: true,
      timestamp: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Mike Chen',
        avatar: 'MC',
        username: '@mikechen'
      },
      content: 'commented on your post',
      comment: 'This is absolutely beautiful! Where was this taken? 📸',
      timestamp: '15m ago',
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: {
        name: 'Emma Wilson',
        avatar: 'EW',
        username: '@emmaw'
      },
      content: 'started following you',
      timestamp: '1h ago',
      read: false,
      isFollowing: false
    },
    {
      id: 4,
      type: 'mention',
      user: {
        name: 'David Lee',
        avatar: 'DL',
        username: '@davidlee'
      },
      content: 'mentioned you in a comment',
      comment: '@you This reminds me of our trip last summer! 🏖️',
      timestamp: '2h ago',
      read: true
    },
    {
      id: 5,
      type: 'like',
      user: {
        name: 'Lisa Anderson',
        avatar: 'LA',
        username: '@lisaa'
      },
      content: 'and 5 others liked your comment',
      comment: 'Great point! I completely agree with this perspective.',
      timestamp: '3h ago',
      read: true,
      likeCount: 6
    },
    {
      id: 6,
      type: 'share',
      user: {
        name: 'John Smith',
        avatar: 'JS',
        username: '@johnsmith'
      },
      content: 'shared your post',
      postPreview: 'Top 10 tips for productivity 💡',
      timestamp: '5h ago',
      read: true
    },
    {
      id: 7,
      type: 'reply',
      user: {
        name: 'Anna Taylor',
        avatar: 'AT',
        username: '@annataylor'
      },
      content: 'replied to your comment',
      comment: "I hadn't thought about it that way before. Thanks for sharing! 💭",
      timestamp: '1d ago',
      read: true
    },
    {
      id: 8,
      type: 'follow',
      user: {
        name: 'Robert Brown',
        avatar: 'RB',
        username: '@robertb'
      },
      content: 'started following you',
      timestamp: '2d ago',
      read: true,
      isFollowing: true
    },
    {
      id: 9,
      type: 'tag',
      user: {
        name: 'Jessica Park',
        avatar: 'JP',
        username: '@jessicap'
      },
      content: 'tagged you in a post',
      postPreview: 'Great team collaboration! 🎉',
      timestamp: '3d ago',
      read: true
    },
    {
      id: 10,
      type: 'birthday',
      user: {
        name: 'Tom Harris',
        avatar: 'TH',
        username: '@tomh'
      },
      content: 'has a birthday today',
      timestamp: 'Today',
      read: false
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const toggleFollow = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isFollowing: !notif.isFollowing } : notif
    ));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'comment':
      case 'reply':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'follow':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
        );
      case 'mention':
      case 'tag':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'share':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </div>
        );
      case 'birthday':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const filterNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === activeTab);
  };

  const filteredNotifications = filterNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Group notifications by date
  const groupByDate = (notifs) => {
    const today = [];
    const yesterday = [];
    const thisWeek = [];
    const older = [];

    notifs.forEach(notif => {
      const time = notif.timestamp.toLowerCase();
      if (time.includes('m ago') || time.includes('h ago') || time === 'today') {
        today.push(notif);
      } else if (time.includes('yesterday')) {
        yesterday.push(notif);
      } else if (time.includes('d ago') && !time.includes('10d ago')) {
        thisWeek.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { today, yesterday, thisWeek, older };
  };

  const groupedNotifications = groupByDate(filteredNotifications);

  const renderNotificationGroup = (title, notifications) => {
    if (notifications.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
          {title}
        </h3>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
                !notification.read ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  {getNotificationIcon(notification.type)}

                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {notification.user.avatar}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-bold">{notification.user.name}</span>{' '}
                          <span className="text-gray-600">{notification.content}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{notification.user.username}</p>
                      </div>
                      <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                        {notification.timestamp}
                      </span>
                    </div>

                    {/* Additional content based on type */}
                    {notification.postPreview && (
                      <div className="mt-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 font-medium">
                          {notification.postPreview}
                        </p>
                      </div>
                    )}
                    {notification.comment && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-700">{notification.comment}</p>
                      </div>
                    )}

                    {/* Action buttons for follow notifications */}
                    {notification.type === 'follow' && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleFollow(notification.id)}
                          className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                            notification.isFollowing
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md'
                          }`}
                        >
                          {notification.isFollowing ? 'Following' : 'Follow back'}
                        </button>
                        <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                          View profile
                        </button>
                      </div>
                    )}

                    {/* Action button for birthday notifications */}
                    {notification.type === 'birthday' && (
                      <div className="mt-3">
                        <button className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-md">
                          Say happy birthday 🎂
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center space-y-1 flex-shrink-0 ml-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors group"
                        title="Mark as read"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete notification"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                {unreadCount > 0 ? (
                  <>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full mr-2">
                      {unreadCount}
                    </span>
                    {`${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All caught up!
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'All', count: null },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'like', label: 'Likes', count: null },
              { id: 'comment', label: 'Comments', count: null },
              { id: 'follow', label: 'Follows', count: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 ${activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'} text-xs font-bold rounded-full`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
          </div>
        ) : (
          <>
            {renderNotificationGroup('Today', groupedNotifications.today)}
            {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
            {renderNotificationGroup('This Week', groupedNotifications.thisWeek)}
            {renderNotificationGroup('Older', groupedNotifications.older)}
          </>
        )}

        {/* Load More Button */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200">
              Load more notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
>>>>>>> origin/main
