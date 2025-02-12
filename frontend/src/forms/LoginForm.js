import { Input, Button, Form, FormGroup, Col, Container } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Alert from "../components/Alert"; 
import "../styles/forms.css";


const LoginForm = ({ setTokenAfterLogin }) => {
  const navigate = useNavigate();
  const [response, setResponse] = useState(false);

  // React Hook Form setup with default values
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handles form submission 
  const onSubmit = async (data) => {
    const success = await setTokenAfterLogin(data, data.username);
    if (success) {
      navigate("/home"); // Redirect to home page if login is successful
    } else {
      setResponse(success); // Show error message if login fails
      reset(); // Reset form fields on failure
    }
  };

  return (
    <Container className="form-container"> {/* Uses shared styles from forms.css */}
      <h1 className="form-title">Login</h1> 
      <Form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormGroup className="form-group">
          <label>Username</label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => <Input placeholder="Enter your username" {...field} required />}
          />
        </FormGroup>

        <FormGroup className="form-group">
          <label>Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Input type="password" placeholder="Enter your password" {...field} required />}
          />
        </FormGroup>

        {/* Error message if login fails */}
        {response && <Alert type="danger" message={response} />}

        {/* Styled button */}
        <Button className="form-button" type="submit">
          Login
        </Button>

        {/* Page redirect text */}
        <p className="form-redirect">
          New to Trail Blazer? <Link to="/signup" className="link-primary">Sign up here</Link>
        </p>
      </Form>
    </Container>
  );
};

export default LoginForm;