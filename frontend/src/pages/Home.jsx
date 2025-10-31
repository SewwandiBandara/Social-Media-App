import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Johnson',
      username: '@sarahj',
      avatar: 'SJ',
      time: '2h ago',
      content: 'Just launched my new project! Check it out and let me know what you think. Excited to share this with everyone! 🚀',
      image: null,
      likes: 234,
      comments: 45,
      shares: 12,
      liked: false
    },
    {
      id: 2,
      author: 'Mike Chen',
      username: '@mikechen',
      avatar: 'MC',
      time: '4h ago',
      content: 'Beautiful sunset today! Nature never ceases to amaze me. 🌅',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      likes: 567,
      comments: 89,
      shares: 23,
      liked: true
    },
    {
      id: 3,
      author: 'Emma Wilson',
      username: '@emmaw',
      avatar: 'EW',
      time: '6h ago',
      content: 'Finally finished reading this amazing book! Highly recommend it to anyone interested in technology and innovation. 📚',
      image: null,
      likes: 123,
      comments: 34,
      shares: 8,
      liked: false
    }
  ]);

  const [postContent, setPostContent] = useState('');

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (postContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        author: 'You',
        username: '@you',
        avatar: 'Y',
        time: 'Just now',
        content: postContent,
        image: null,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      };
      setPosts([newPost, ...posts]);
      setPostContent('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active={"/"} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Summary */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">U</span>
                </div>
                <h3 className="mt-4 font-semibold text-gray-800">Your Profile</h3>
                <p className="text-sm text-gray-500">@username</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-semibold text-gray-800">1,234</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Following</span>
                  <span className="font-semibold text-gray-800">567</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-semibold text-gray-800">89</span>
                </div>
                {/* settings */}
                {/* <div className="flex justify-between text-md mt-2">
                  <span className="text-gray-900"><a href="/settings">Settings</a></span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Create Post Card */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">U</span>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!postContent.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{post.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.author}</h3>
                      <p className="text-sm text-gray-500">{post.username} · {post.time}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-800 leading-relaxed">{post.content}</p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="w-full">
                    <img src={post.image} alt="Post content" className="w-full h-auto object-cover" />
                  </div>
                )}

                {/* Post Stats */}
                <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-b border-gray-100">
                  <span>{post.likes} likes</span>
                  <div className="flex space-x-4">
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-4 py-2 flex items-center justify-around">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      post.liked ? 'text-red-500' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-6 h-6" fill={post.liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium">Like</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="font-medium">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="space-y-6 sticky top-24">
              {/* Trending Topics */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Trending Topics</h3>
                <div className="space-y-3">
                  {['#Technology', '#WebDevelopment', '#AI', '#Design', '#Startup'].map((topic, index) => (
                    <div key={index} className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      <p className="font-medium text-blue-600">{topic}</p>
                      <p className="text-xs text-gray-500">{Math.floor(Math.random() * 50) + 10}k posts</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Friends */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Suggested for You</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Alex Smith', username: '@alexs', avatar: 'AS' },
                    { name: 'Lisa Brown', username: '@lisab', avatar: 'LB' },
                    { name: 'Tom Davis', username: '@tomd', avatar: 'TD' }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{user.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.username}</p>
                        </div>
                      </div>
                      <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
