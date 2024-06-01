// Importing necessary modules
import React from "react";
import ReactDOM from "react-dom";

// Importing Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Importing custom CSS
import "./index.css";

// Importing the root component of the application
import App from "./App";

// Rendering the root component
ReactDOM.render(
  // Wrapping the root component with React.StrictMode for additional checks in development mode
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  // Mounting the root component to the DOM element with id "root"
  document.getElementById("root")
);