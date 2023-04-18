import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./LoginPage.css";
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";
import { Link } from "react-router-dom";



const LoginPage = () => {
 

 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
      toast.error(error.message);
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
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
      <div className="signup-prompt">
        {isAuthenticated ? (
          <p>You are authenticated!</p>
        ) : (
          <p>
            Don't have an account?{" "}
            <Link to="/signup">Sign up to create one.</Link>
          </p>
        )}
        <p className="or-divider">Or</p>
      </div>
      <div className="google-login">
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

export default LoginPage;
