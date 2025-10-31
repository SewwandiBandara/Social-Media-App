// Authentication middleware to protect routes

/**
 * Middleware to check if user is authenticated
 * Blocks access if user is not logged in
 */
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      message: 'Authentication required. Please log in to perform this action.',
      authenticated: false
    });
  }
  next();
};

/**
 * Optional authentication middleware
 * Allows access but sets user info if authenticated
 */
const optionalAuth = (req, res, next) => {
  // Just pass through - the routes can check req.session.userId if needed
  next();
};

module.exports = {
  isAuthenticated,
  optionalAuth
};