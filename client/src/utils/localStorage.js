// Function to get saved book IDs from local storage
export const getSavedBookIds = () => {
  // Retrieve the saved book IDs from local storage, or return an empty array if none are found
  const savedBookIds = localStorage.getItem("saved_books")
    ? JSON.parse(localStorage.getItem("saved_books"))
    : [];

  return savedBookIds;
};

// Function to save book IDs to local storage
export const saveBookIds = (bookIdArr) => {
  // If there are book IDs in the array, save them to local storage
  if (bookIdArr.length) {
    localStorage.setItem("saved_books", JSON.stringify(bookIdArr));
  } else {
    // If the array is empty, remove the saved_books item from local storage
    localStorage.removeItem("saved_books");
  }
};

// Function to remove a book ID from local storage
export const removeBookId = (bookId) => {
  // Retrieve the saved book IDs from local storage, or return null if none are found
  const savedBookIds = localStorage.getItem("saved_books")
    ? JSON.parse(localStorage.getItem("saved_books"))
    : null;

  // If there are no saved book IDs, return false
  if (!savedBookIds) {
    return false;
  }

  // Filter out the book ID to be removed
  const updatedSavedBookIds = savedBookIds?.filter(
    (savedBookId) => savedBookId !== bookId
  );
  // Update local storage with the remaining book IDs
  localStorage.setItem("saved_books", JSON.stringify(updatedSavedBookIds));

  return true;
};