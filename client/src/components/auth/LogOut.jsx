import  { Redirect } from 'react-router-dom'

const LogOut = ({auth}) => {
  auth.deauthenticateUser();
  return <Redirect to="/login" />
};

export { LogOut };
