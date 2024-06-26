import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";

// Component: SignupForm
const SignupForm = () => {
  // Initial form state
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Form validation state
  const [validated, setValidated] = useState(false);

  // Alert visibility state
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error }] = useMutation(ADD_USER);

  // useEffect to manage alert display based on mutation error
  useEffect(() => {
    if (error) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Form validation check
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const { data } = await addUser({ variables: { ...userFormData } });
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }

    // Reset form state
    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
    setValidated(false);
  };

  return (
    <>
      {/* Form Section */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert Section */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your signup!
        </Alert>

        {/* Username Field */}
        <Form.Group>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Email Field */}
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password Field */}
        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit Button */}
        <Button
          disabled={
            !(userFormData.username && userFormData.email && userFormData.password)
          }
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
