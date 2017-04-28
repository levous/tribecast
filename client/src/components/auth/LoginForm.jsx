import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


const LoginForm = ({
  onSubmit,
  onChange,
  onResetPassword,
  errors,
  successMessage,
  user
}) => {
  let emailField, emailValid8;

  const resetPassword = e => {
    e.preventDefault();
    emailValid8.innerHTML = '';
    const email = emailField.input.value;
    if(!email) {
      emailValid8.innerHTML = 'Please provide your email address for password reset';
      return;
    }
    onResetPassword(email);
  }

  return (
  <Card className="container text-center">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Login</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <div ref={ el => emailValid8 = el } className='error-message'></div>
        <TextField
          ref={ el => emailField = el }
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
        />
      </div>

      <div className="field-line">

        <TextField
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>

      <div className="button-line">
        <RaisedButton type="submit" label="Log in" primary />
      </div>

      <CardText>
        Don't have an account? <Link to={'/signup'}>Create one</Link><br />
        Can't remember your password? <a onClick={resetPassword}>Reset password</a>
      </CardText>
    </form>
  </Card>
)};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;
