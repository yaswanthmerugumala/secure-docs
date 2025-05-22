const jwt = require('jsonwebtoken');

// Middleware to authenticate user and verify JWT
const authenticateUser = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request object

    // Optionally: Check for roles or permissions (if needed)
    // Example: if (req.user.role !== 'admin') { return res.status(403).json({ message: 'Access forbidden.' }); }

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateUser };
