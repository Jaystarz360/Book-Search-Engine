// Importing necessary modules
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { authMiddleware } = require("./utils/auth");

// Importing GraphQL schema and database connection
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

// Setting up port
const PORT = process.env.PORT || 3001;

// Creating Express app instance
const app = express();

// Creating Apollo Server instance with GraphQL schema and context for authentication middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Route for serving the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/"));
});

// Function to start Apollo Server and connect to the database
const startApolloServer = async (typeDefs, resolvers) => {
  // Start Apollo Server
  await server.start();
  // Apply Apollo middleware to Express app
  server.applyMiddleware({ app });

  // Once database connection is open, start Express server
  db.once("open", () => {
    app.listen(PORT, () => {
      // Server startup message
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);