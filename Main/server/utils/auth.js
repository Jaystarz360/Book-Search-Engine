// Importing necessary module
const jwt = require("jsonwebtoken");

// Secret key and token expiration time
const secret = "mysecretsshhhhh";
const expiration = "2h";

// Exporting functions for JWT authentication
module.exports = {
  // Middleware function for JWT token verification
  authMiddleware: function ({ req }) {
    // Extract token from request body, query parameters, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If token is present in headers, remove "Bearer" prefix
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // If token is not present, return the request object
    if (!token) {
      return req;
    }

    try {
      // Verify the token and attach decoded user data to the request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (error) {
      // Handle the error in a more meaningful way
      console.error("Error verifying token:", error.message);
      // For example, you could throw an error to be caught by higher-level middleware or resolver
      throw new Error("Invalid token");
    }

    // Return the request object
    return req;
  },

  // Function to generate JWT token
  signToken: function ({ username, email, _id }) {
    // Create payload containing user data
    const payload = { username, email, _id };

    // Sign the payload to generate a JWT token
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
