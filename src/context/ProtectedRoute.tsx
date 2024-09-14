import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  console.log(isAuthenticated); 

  if (!isAuthenticated) {
    console.log('não autenticado'); 
    console.log(isAuthenticated); 


    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;