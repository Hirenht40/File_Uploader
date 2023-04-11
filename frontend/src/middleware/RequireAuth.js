import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const requireAuth = (Component) => {
  const AuthenticatedComponent = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
      if (!token) {
        navigate('/login');
      }
    }, [token, navigate]);

    if (!token) {
      return null;
    }

    return <Component />;
  };

  return AuthenticatedComponent;
};

export default requireAuth;
