import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from '../forms/ThemedTextField.jsx';


const LoginForm = ({
  onSubmit,
  onChange,
  onResetPassword,
  onSendMagicLink,
  errors,
  successMessage,
  user
}) => {

  return (
  <Card className="container text-center" style={{backgroundColor:'rgba(255,255,255,0.9)', padding:'20px'}}>
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Login</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">

        <TextField
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
        Can't remember your password? <a onClick={onResetPassword}>Reset password</a><br/>
        Hate typing passwords? <a onClick={onSendMagicLink}>Send Magic link</a>
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
