import React from 'react';
import PropTypes from 'prop-types';
import  { Redirect } from 'react-router-dom'

const LogOut = ({auth}) => {
  auth.deauthenticateUser();
  return <Redirect to="/login" />
};

export default LogOut;
