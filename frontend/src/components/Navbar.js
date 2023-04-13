import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useNavigate  } from 'react-router-dom';
import { toast } from 'react-toastify';
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out');

    navigate('/login');
  }

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">FileUploader</Link>
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        ) : (
          <Link to="/login" className="signin-btn">Sign In</Link>
        )}
      </div>
    </nav>
  );
  
};

export default Navbar;
