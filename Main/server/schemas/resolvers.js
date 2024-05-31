// Importing necessary dependencies
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

// Resolvers definition
const resolvers = {
  // Query resolvers
  Query: {
    me: async (parent, args, context) => {
      // Retrieve the currently logged-in user's data
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      // Throw an AuthenticationError if the user is not logged in
      throw new AuthenticationError("Not logged in");
    },
  },

  // Mutation resolvers
  Mutation: {
    addUser: async (parent, args) => {
      // Create a new user with the provided arguments and sign a JWT token
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      // Find a user by email, check if the provided password is correct, and sign a JWT token
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      // Add a new book to the saved books array of the currently logged-in user
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      }
      // Throw an AuthenticationError if the user is not logged in
      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (parent, { bookId }, context) => {
      // Remove a book from the saved books array of the currently logged-in user
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      // Throw an AuthenticationError if the user is not logged in
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

// Exporting the resolvers
module.exports = resolvers;
