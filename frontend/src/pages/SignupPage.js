import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";
import './SignupPage.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success("'Sign up successful!");
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const onSuccess = async (googleUser) => {
    console.log("Login Success:", googleUser.data.sub);
    setIsAuthenticated(true);

    // Get the user's Google ID and email
    const {
      sub: googleId,
      email: email,
    } = googleUser.data;
    console.log("Login Success:", email, googleId);

    try {
      // Send a request to the server to register the user
      const response = await fetch("/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, googleId }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
        required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign up</button>
        
      </form>
      
      <p>Already have an account? <Link to="/login">Log in</Link></p>
      <p>Or</p>
      <div>
      <LoginSocialGoogle
          scope="openid profile email"
          discoveryDocs="claims_supported"
          access_type="offline"
          client_id={process.env.REACT_APP_CLIENTID || ""}
          onResolve={onSuccess}
          onReject={(err) => {
            console.log(err);
          }}
        >
          <GoogleLoginButton />
        </LoginSocialGoogle>


      </div>

    </div>
  );
};

export default SignupPage;
