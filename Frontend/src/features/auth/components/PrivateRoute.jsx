import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // TEMPORARY: Skip auth check for development/testing
  // Remove this in production!
  // if (!user) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  // For testing: allow access if no user (remove in production)
  if (!user) {
    return children;
  }

  return children;
};

export default PrivateRoute;
