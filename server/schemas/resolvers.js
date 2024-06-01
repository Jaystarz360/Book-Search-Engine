// Importing necessary modules and functions
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

// GraphQL resolvers definition
const resolvers = {
  // Query resolvers
  Query: {
    // Resolver for fetching user data (me)
    me: async (parent, args, context) => {
      // Check if user is authenticated
      if (context.user) {
        // Fetch user data excluding sensitive information
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      // If user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError("Not logged in");
    },
  },

  // Mutation resolvers
  Mutation: {
    // Resolver for adding a new user
    addUser: async (parent, args) => {
      // Create a new user
      const user = await User.create(args);
      // Generate JWT token for the user
      const token = signToken(user);
      // Return token and user data
      return { token, user };
    },
    // Resolver for user login
    login: async (parent, { email, password }) => {
      // Find user by email
      const user = await User.findOne({ email });
      // If user not found, throw AuthenticationError
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      // Check if provided password is correct
      const correctPw = await user.isCorrectPassword(password);
      // If password is incorrect, throw AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      // Generate JWT token for the user
      const token = signToken(user);
      // Return token and user data
      return { token, user };
    },
    // Resolver for saving a book to user's savedBooks list
    saveBook: async (parent, { bookData }, context) => {
      // Check if user is authenticated
      if (context.user) {
        // Update user's savedBooks list with the new book
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      }
      // If user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError("You need to be logged in!");
    },
    // Resolver for removing a book from user's savedBooks list
    removeBook: async (parent, { bookId }, context) => {
      // Check if user is authenticated
      if (context.user) {
        // Remove book from user's savedBooks list
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      // If user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

// Exporting the resolvers
module.exports = resolvers;
