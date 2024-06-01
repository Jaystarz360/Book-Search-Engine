// Importing necessary modules from React and React Router
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing necessary modules from Apollo Client for GraphQL integration
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Importing page components and custom Navbar component
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

// Constructing the main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Constructing request middleware to attach JWT token to every request
const authLink = setContext((_, { headers }) => {
  // Get authentication token from local storage if exists
  const token = localStorage.getItem("id_token");
  // Return headers to context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Creating Apollo Client instance
const client = new ApolloClient({
  // Executing authLink middleware prior to making the request to GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Main App component
function App() {
  return (
    // Providing Apollo Client to the application
    <ApolloProvider client={client}>
      {/* Setting up React Router */}
      <Router>
        {/* Wrapping application components in a fragment */}
        <>
          {/* Rendering custom Navbar component */}
          <Navbar />
          {/* Defining routes for different pages */}
          <Routes>
            {/* Route for the main search page */}
            <Route path="/" element={<SearchBooks />} />
            {/* Route for the saved books page */}
            <Route path="/saved" element={<SavedBooks />} />
            {/* Route for handling unknown paths */}
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

// Exporting the main App component
export default App;
