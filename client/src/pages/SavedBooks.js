// Importing necessary dependencies from React and other libraries
import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';

import Auth from '../utils/auth';

// Defining the SavedBooks component
const SavedBooks = () => {
  // Fetch user's saved books data
  const { loading, data } = useQuery(QUERY_ME);
  // Define mutation for removing a book
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  // Function to handle book deletion
  const handleDeleteBook = async (bookId) => {
    // Retrieve user authentication token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Execute mutation to remove book from the database
      const { data } = await removeBook({
        variables: { bookId },
      });

      // Remove the book's ID from local storage upon successful deletion
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Render loading state while data is being fetched
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // Rendering the SavedBooks component
  return (
    <>
      {/* Header Section */}
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing {userData.username}'s saved books!</h1>
        </Container>
      </div>

      {/* Saved Books Section */}
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'
            }:`
            : 'You have no saved books!'}
        </h2>
        <div>
          {/* Display Saved Books */}
          <Row>
            {userData.savedBooks?.map((book) => {
              return (
                <Col md="4" key={book.bookId}>
                  <Card border="dark">
                    {book.image && (
                      <Card.Img
                        src={book.image}
                        alt={`The cover for ${book.title}`}
                        variant="top"
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{book.title}</Card.Title>
                      <p className="small">Authors: {book.authors}</p>
                      <Card.Text>{book.description}</Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteBook(book.bookId)}
                      >
                        Delete this Book!
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </>
  );
};

// Exporting the SavedBooks component
export default SavedBooks;
