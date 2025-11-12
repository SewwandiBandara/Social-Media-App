import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postsAPI.getAllPosts(1, 20);
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p._id === postId);
      if (!post) return;

      if (post.isLikedByUser) {
        await postsAPI.unlikePost(postId);
      } else {
        await postsAPI.likePost(postId);
      }

      // Update local state
      setPosts(posts.map(p =>
        p._id === postId
          ? {
              ...p,
              isLikedByUser: !p.isLikedByUser,
              likesCount: p.isLikedByUser ? p.likesCount - 1 : p.likesCount + 1
            }
          : p
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Failed to update like status');
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    try {
      setSubmitting(true);
      const newPostData = { content: postContent };
      const response = await postsAPI.createPost(newPostData);

      // Add the new post to the top of the feed
      setPosts([response.post, ...posts]);
      setPostContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar active={"/"} /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Summary */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-gray-800">
                  {user ? user.name : 'Your Profile'}
                </h3>
                <p className="text-sm text-gray-500">
                  {user ? `@${user.username}` : '@username'}
                </p>
              </div>
              {user && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-semibold text-gray-800">
                      {user.followersCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Following</span>
                    <span className="font-semibold text-gray-800">
                      {user.followingCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Posts</span>
                    <span className="font-semibold text-gray-800">
                      {user.postsCount || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Create Post Card */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">
                    {user ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                    disabled={submitting}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={submitting}>
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={submitting}>
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={submitting}>
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!postContent.trim() || submitting}
                    >
                      {submitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">Loading posts...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 rounded-lg shadow-sm p-4 border border-red-200">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchPosts}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Posts Feed */}
            {!loading && posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {post.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {post.author?.name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          @{post.author?.username || 'unknown'} · {post.getTimeAgo?.() || 'recently'}
                        </p>
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
                  {post.images && post.images.length > 0 && (
                    <div className="w-full">
                      <img src={post.images[0].url} alt={post.images[0].alt || 'Post content'} className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-b border-gray-100">
                    <span>{post.likesCount || 0} likes</span>
                    <div className="flex space-x-4">
                      <span>{post.commentsCount || 0} comments</span>
                      <span>{post.sharesCount || 0} shares</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 py-2 flex items-center justify-around">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        post.isLikedByUser ? 'text-red-500' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-6 h-6" fill={post.isLikedByUser ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
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
              ))
            )}
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
