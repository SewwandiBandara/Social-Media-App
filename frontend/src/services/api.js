const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  logout: () => apiCall('/auth/logout', {
    method: 'POST',
  }),

  checkAuth: () => apiCall('/auth/check'),
};

// Profile API
export const profileAPI = {
  getProfile: () => apiCall('/profile'),

  getProfileByUsername: (username) => apiCall(`/profile/${username}`),

  updateProfile: (profileData) => apiCall('/profile/update', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  followUser: (userId) => apiCall(`/profile/follow/${userId}`, {
    method: 'POST',
  }),

  unfollowUser: (userId) => apiCall(`/profile/unfollow/${userId}`, {
    method: 'POST',
  }),

  getFollowers: (userId) => apiCall(`/profile/${userId}/followers`),

  getFollowing: (userId) => apiCall(`/profile/${userId}/following`),

  getStats: (userId) => apiCall(`/profile/${userId}/stats`),
};

// Posts API
export const postsAPI = {
  getAllPosts: (page = 1, limit = 10) => apiCall(`/posts?page=${page}&limit=${limit}`),

  getUserPosts: (userId, page = 1, limit = 10) =>
    apiCall(`/posts/user/${userId}?page=${page}&limit=${limit}`),

  getUserMedia: (userId) => apiCall(`/posts/user/${userId}/media`),

  getUserLikedPosts: (userId, page = 1, limit = 10) =>
    apiCall(`/posts/user/${userId}/likes?page=${page}&limit=${limit}`),

  createPost: (postData) => apiCall('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  }),

  updatePost: (postId, postData) => apiCall(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  }),

  deletePost: (postId) => apiCall(`/posts/${postId}`, {
    method: 'DELETE',
  }),

  likePost: (postId) => apiCall(`/posts/${postId}/like`, {
    method: 'POST',
  }),

  unlikePost: (postId) => apiCall(`/posts/${postId}/like`, {
    method: 'DELETE',
  }),

  addComment: (postId, content) => apiCall(`/posts/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),

  sharePost: (postId) => apiCall(`/posts/${postId}/share`, {
    method: 'POST',
  }),

  unsharePost: (postId) => apiCall(`/posts/${postId}/share`, {
    method: 'DELETE',
  }),
};

export default {
  auth: authAPI,
  profile: profileAPI,
  posts: postsAPI,
};
