import { Input, Button, Form, FormGroup, Col, Container } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
    <Container className="login-form-container"> 
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup row>
          <Col md={{ offset: 3, size: 6 }} sm="12">
            <div className="FormContainer"> 
              <h1>Login</h1>

              {/* Username Input */}
              <div className="FormInput">
                <label>Username</label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => <Input placeholder="Enter your username" {...field} required />}
                />
              </div>

              {/* Password Input */}
              <div className="FormInput">
                <label>Password</label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => <Input type="password" placeholder="Enter your password" {...field} required />}
                />
              </div>

              {/* Display error messages if login fails */}
              {response && <Alert type="danger" message={response} />}

              {/* Submit Button (shared styling with SignupForm) */}
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

export default LoginForm;
