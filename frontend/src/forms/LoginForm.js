import { Input, Button, Form, FormGroup, Container } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Alert from "../components/Alert"; 
import "../styles/forms.css";

/**
 * LoginForm
 * 
 * Allows users to log in by submitting their credentials.
 * 
 * Props:
 * - setTokenAfterLogin: Function to handle login authentication and token setting.
 */
const LoginForm = ({ setTokenAfterLogin }) => {
  const navigate = useNavigate();
  const [response, setResponse] = useState(false); // Stores login error messages.
  const [loading, setLoading] = useState(false); // Prevents multiple submissions.

  // React Hook Form setup with default values.
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  /**
   * Handles form submission and authentication.
   * 
   * @param {object} data - Contains username and password from form inputs.
   */
  const onSubmit = async (data) => {
    setLoading(true); // Disable button while processing
    setResponse(false); // Reset error message

    const success = await setTokenAfterLogin(data, data.username);
    
    if (success) {
      navigate("/home"); // Redirect to home page if login is successful.
    } else {
      setResponse("Invalid username or password. Please try again."); // Display error message.
      reset(); // Clear form fields on failure.
    }

    setLoading(false); // Re-enable button after response.
  };

  return (
    <Container className="form-container"> {/* Uses shared styles from forms.css */}
      <h1 className="form-title">Login</h1> 
      <Form onSubmit={handleSubmit(onSubmit)} className="form">
        
        {/* Username Input */}
        <FormGroup className="form-group">
          <label>Username</label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => <Input placeholder="Enter your username" {...field} required />}
          />
        </FormGroup>

        {/* Password Input */}
        <FormGroup className="form-group">
          <label>Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input 
                type="password" 
                placeholder="Enter your password" 
                {...field} 
                required 
                autoComplete="current-password" 
              />
            )}
          />
        </FormGroup>

        {/* Error message if login fails */}
        {response && <Alert type="danger" message={response} />}

        {/* Submit button with loading state */}
        <Button className="form-button" type="submit" size="lg" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Redirect link for new users */}
        <p className="form-redirect">
          New to Trail Blazer? <Link to="/signup" className="link-primary">Sign up here</Link>
        </p>
      </Form>
    </Container>
  );
};

export default LoginForm;
