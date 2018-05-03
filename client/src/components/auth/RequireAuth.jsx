import React from 'react';
import PropTypes from 'prop-types';
import  { Redirect } from 'react-router-dom'

const RequireAuth = ({component: Component, isAuthenticated, isLoading, ...rest }) => {
  if(isLoading) {
    return <div>Loading...</div>
  }

  if(!isAuthenticated) {
    return <Redirect to="/login" />
  }

  return <Component {...rest} />

}

export default RequireAuth;
