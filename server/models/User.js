// Importing necessary modules
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// Importing bookSchema from Book.js
const bookSchema = require("./Book");

// Defining user schema
const userSchema = new Schema(
  {
    // Username field
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // Email field
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    // Password field
    password: {
      type: String,
      required: true,
    },
    // Array of saved books adhering to bookSchema
    savedBooks: [bookSchema],
  },
  // Options for toJSON method
  {
    toJSON: {
      virtuals: true, // Include virtual fields when JSON.stringify() is called
    },
  }
);

// Middleware to hash user password before saving
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Virtual field to get the count of saved books
userSchema.virtual("bookCount").get(function () {
  return this.savedBooks.length;
});

// Creating User model
const User = model("User", userSchema);

// Exporting User model
module.exports = User;
