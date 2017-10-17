import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../actions/user-actions';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {NotificationContainer} from 'react-notifications';
import TextField from '../components/forms/ThemedTextField.jsx';
import Auth from '../modules/Auth';
import communityDefaults from '../../../config/community-defaults';

class PasswordResetPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {errors:{}, fields:{}};

    this.auth = new Auth(context.store);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
    this.textFieldChanged = this.textFieldChanged.bind(this);
    //TODO: call out to api /invite/:passwordResetToken to check the token.  Display the username to the user to indicate that we know who they are
  }

  textFieldChanged(event) {
    const field = event.target.name;
    const {fields, errors} = this.state;
    fields[field] = event.target.value;

    // convenient cleanup of error messages (not checking password strength or nothin)
    if(fields.password) errors.password = null;
    if(fields.password == fields.passwordConfirmation) errors.passwordConfirmation = null;

    this.setState({
      fields,
      errors
    });
  }

  handleUpdatePassword(){
    const fields = this.state.fields;
    // clear last run
    this.setState({errors:{}});
    const errors = {};

    if(!fields.password) errors.password = 'Please provide a password';
    if(!fields.passwordConfirmation || fields.password !== fields.passwordConfirmation) errors.passwordConfirmation = 'Confirm Password must match Password';

    this.setState({
      errors
    });

    if (errors.password || errors.passwordConfirmation) return;

    this.props.actions.updateUserPassword(fields.password, this.props.params.token);
  }

  render() {
    const invitationMessageHtml = (
      <div>
        <NotificationContainer />
        <p style={{textAlign: "center"}}>Welcome!  You've been invited to<br /> {communityDefaults.name}</p>
        <h3>Please create your password here</h3>
      </div>
    );

    const {errors, fields} = this.state;

    if(this.props.passwordResetSucceeded) this.context.router.replace('/login');

    const userMessage = this.props.location.pathname.includes('forgot-password') ?
      'Welcome, back!  Please create a new password for your account.':
      invitationMessageHtml;

    return (

      <div className="jumbotron auth-panel">
        <Card className="text-center" style={{backgroundColor:'rgba(255,255,255,0.9)', padding:'20px'}}>
          <p>{userMessage}</p>
          <div>
            <TextField
              floatingLabelText="New Password"
              type="password"
              name="password"
              onChange={this.textFieldChanged}
              errorText={errors.password}
              value={fields.password}
            />
          </div>
          <div>
            <TextField
              floatingLabelText="Confirm Password"
              type="password"
              name="passwordConfirmation"
              onChange={this.textFieldChanged}
              errorText={errors.passwordConfirmation}
              value={fields.passwordConfirmation}
            />
          </div>
          <RaisedButton onTouchTap={this.handleUpdatePassword} label='Go!' />
        </Card>
      </div>

    );
  }

}

PasswordResetPage.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    passwordResetSucceeded: state.userApp.passwordResetSucceeded
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetPage);
