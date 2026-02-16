import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth'; // Optional helper: npm i react-firebase-hooks
import { auth } from '../firebase';

const ProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Checking authentication...</div>;
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;