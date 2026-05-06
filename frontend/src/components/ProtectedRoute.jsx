import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="page-shell"><div className="card"><p>Loading...</p></div></div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
