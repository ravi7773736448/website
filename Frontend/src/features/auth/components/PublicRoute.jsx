import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    // If user is already logged in, they shouldn't see login/register pages
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
