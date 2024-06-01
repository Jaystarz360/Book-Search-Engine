// Importing necessary module
const { Schema } = require("mongoose");

// Definition of subdocument schema for saved books
const bookSchema = new Schema({
  // Authors of the book
  authors: [
    {
      type: String,
    },
  ],
  // Description of the book
  description: {
    type: String,
    required: true,
  },
  // Unique book ID from Google Books API
  bookId: {
    type: String,
    required: true,
  },
  // URL of the book's image
  image: {
    type: String,
  },
  // URL of the book's details page
  link: {
    type: String,
  },
  // Title of the book
  title: {
    type: String,
    required: true,
  },
});

// Exporting the subdocument schema for use in other files
module.exports = bookSchema;
