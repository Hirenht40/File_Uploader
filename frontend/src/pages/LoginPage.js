import { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from 'react-google-login';
import "./LoginPage.css"




const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log("hi", process.env.REACT_APP_CLIENTID)


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again later.');
    }
  };


  



  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out');

    navigate('/login');
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
        navigate('/');
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
      <div className="login-container">
  <h2>Login</h2>
  <form className="login-form" onSubmit={handleSubmit}>
    <label>
      Email
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </label>
    <label>
      Password
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </label>
    <button type="submit" className="submit-btn">Submit</button>
  </form>
  <div className="signup-prompt">
    {isAuthenticated ? (
      <p>You are authenticated!</p>
    ) : (
      <p>Don't have an account? <a href="/signup">Sign up to create one.</a></p>
    )}
    <p className="or-divider">Or</p>
  </div>
  <div className="google-login">
    <GoogleLogin
      clientId={process.env.REACT_APP_CLIENTID}
      buttonText="Login with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      responseType="code,token"
    />
  </div>
</div>

    );
};

export default LoginPage;
