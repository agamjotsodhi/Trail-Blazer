import { Input, Button, Form, FormGroup, Col, Container } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "../components/Alert";
import "../styles/forms.css";


const SignupForm = ({ setTokenAfterRegister }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // React Hook Form setup with default values
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
    try {
      console.log("[SignupForm] Submitting:", data);
      
      const success = await setTokenAfterRegister(data);
      if (success) {
        console.log("[SignupForm] Signup successful! Redirecting...");
        navigate("/home"); // Redirect to home page after signup
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("[SignupForm] Signup error:", err);
      setError(err?.response?.data?.error || "Signup failed. Please check your input.");
    }
  };

  return (
    <Container className="signup-form-container"> {/* Wrapper for styling */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup row>
          <Col md={{ offset: 3, size: 6 }} sm="12">
            <div className="FormContainer"> {/* Shared form styling with other forms*/}
              <h1>Sign Up</h1>

              {/* Username Input */}
              <div className="FormInput">
                <label>Username</label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => <Input placeholder="Choose a username" {...field} required />}
                />
              </div>

              {/* First Name Input */}
              <div className="FormInput">
                <label>First Name</label>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => <Input placeholder="Enter your first name" {...field} required />}
                />
              </div>

              {/* Email Input */}
              <div className="FormInput">
                <label>Email</label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input type="email" placeholder="Enter your email" {...field} required />}
                />
              </div>

              {/* Password Input */}
              <div className="FormInput">
                <label>Password</label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => <Input type="password" placeholder="Create a password" {...field} required />}
                />
              </div>

              {/* Display error messages if signup fails */}
              {error && <Alert type="danger" message={error} />}

              {/* Submit Button (shared styling with LoginForm) */}
              <Button className="FormButton" type="submit" size="lg">
                Submit
              </Button>
            </div>
          </Col>
        </FormGroup>
      </Form>
    </Container>
  );
};

export default SignupForm;
