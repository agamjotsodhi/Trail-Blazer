import { Input, Button, Form, FormGroup, Container } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Alert from "../components/Alert";
import "../styles/forms.css";

const SignupForm = ({ setTokenAfterRegister }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Prevents double submissions

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
      first_name: "",
      email: "",
    },
  });

  /** Handles form submission */
  const onSubmit = async (data) => {
    setLoading(true); // Disable button on submit
    setError(null); // Reset error state

    try {
      const success = await setTokenAfterRegister(data);
      if (success) {
        navigate("/home"); // Redirect to home page after signup
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Username already exists. Please try another.");
      } else {
        setError(err?.response?.data?.error || "Signup failed. Please check your input.");
      }
    }

    setLoading(false); // Re-enable button after response
  };

  return (
    <Container className="form-container">
      <h1>Signup</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className="form-group">
          <label>Username</label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => <Input placeholder="Choose a username" {...field} required />}
          />
        </FormGroup>

        <FormGroup className="form-group">
          <label>First Name</label>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => <Input placeholder="Enter your first name" {...field} required />}
          />
        </FormGroup>

        <FormGroup className="form-group">
          <label>Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input type="email" placeholder="Enter your email" {...field} required />}
          />
        </FormGroup>

        <FormGroup className="form-group">
          <label>Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input type="password" placeholder="Create a password" {...field} required autoComplete="new-password" />
            )}
          />
        </FormGroup>

        {error && <Alert type="danger" message={error} />}

        <Button className="form-button" type="submit" size="lg" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </Form>

      {/* Redirect to Login */}
      <p className="form-redirect">
        Already have an account? <Link to="/login" className="link-primary">Log in here</Link>
      </p>
    </Container>
  );
};

export default SignupForm;
