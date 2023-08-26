import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../lib/AuthContext';

const PrivateRoute = ({ element }) => {
  const { isSignedIn } = React.useContext(AuthContext);

  return isSignedIn ? element : <Navigate to="/signin_form" />;
};

export default PrivateRoute;
