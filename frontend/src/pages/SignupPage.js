import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from 'react-google-login';

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
        navigate('/homepage');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const onSuccess = async (googleUser) => {
    console.log('Login Success:', googleUser);
    setIsAuthenticated(true);
  
    // Get the user's Google ID and email
    const { sub: googleId, profileObj: { email } } = googleUser;
  
    try {
      // Send a request to the server to register the user
      const response = await fetch('/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, googleId })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/homepage');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again later.');
    }
  };
  
    const onFailure = (error) => {
      console.log('Login Error:', error);
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
      <p>
        Already have an account? <a href="/login">Log in</a>
      </p>
      <p>Or</p>
      <div>
      <GoogleLogin
  clientId= {process.env.REACT_APP_CLIENTID}
  buttonText="Signup with Google"
  onSuccess={onSuccess}
  onFailure={onFailure}
  cookiePolicy={'single_host_origin'}
  responseType="code,token"
  isSignedIn={false}
/>


      </div>

    </div>
  );
};

export default SignupPage;
