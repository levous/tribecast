import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import Dialog from 'material-ui/Dialog';
import {connect} from 'react-redux';
import * as allActions from '../actions';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {NotificationContainer} from 'react-notifications';
import TextField from '../components/forms/ThemedTextField.jsx';
import Auth from '../modules/Auth';
import communityDefaults from '../../../config/community-defaults';
import Validator from '../../../shared-modules/Validator';
import Logger from '../modules/Logger';

/*
TODO:
link and instructions to present "reset password"
add email to fields and errors
close dialog when sent
add cancel button to dialog
send reinvite!
*/

class PasswordResetPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors:{},
      fields:{email:'', password: '', passwordConfirmation: ''},
      sendResetDialogOpen: false
    };

    this.auth = new Auth(context.store);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
    this.textFieldChanged = this.textFieldChanged.bind(this);
    //TODO: call out to api /invite/:passwordResetToken to check the token.  Display the username to the user to indicate that we know who they are
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.loggedInUser){
      this.props.actions.refreshMembersFromServer();
      this.context.router.replace('/membership');
    }
  }

  sendResetPasswordLink() {
    // valid8 email and only send when there is one there

    if (!Validator.isValidEmail(this.state.fields.email)) {
      this.setState({
        errors: { email: 'Email address is Not Valid', summary: 'That email address doesn\'t look right.  Please provide a valid email address for password reset.'}
      });
      return;
    }

    Logger.logWarn({description: `${this.state.fields.email} resetting password`});
    this.props.actions.resetPassword(this.state.fields.email);
    this.setState({sendResetDialogOpen: false});
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

  handleNewResetClick(){
    this.setState({sendResetDialogOpen: true});
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

    //if(this.props.passwordResetSucceeded) this.context.router.replace('/login');

    const userMessage = this.props.location.pathname.includes('forgot-password') ?
      'Welcome, back!  Please create a new password for your account.':
      invitationMessageHtml;

    return (

      <div className="jumbotron auth-panel">
        <Card className="text-center" style={{backgroundColor:'rgba(255,255,255,0.9)', padding:'20px'}}>
          <div>{userMessage}</div>
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
          <p style={{fontSize: '.7em', marginTop: '10px'}}>
            If you have trouble with an expired reset link, please <a onClick={ (e) => { e.preventDefault(); this.handleNewResetClick() } } >generate a new reset link </a>.
          </p>
        </Card>

        <Dialog
          title="Send Forgot Password Link"
          modal={true}
          open={this.state.sendResetDialogOpen}
          actions={[<RaisedButton label='Cancel' onClick={(button) => this.setState({sendResetDialogOpen: false})} />,<RaisedButton style={{marginLeft: '10px'}} primary={true} label='Send Reset Link' onClick={(button) => this.sendResetPasswordLink()} />]}
          >

          <p>Please enter your email address and I'll send you a new reset link</p>
          {this.state.errors.summary && <p className="error-message">{this.state.errors.summary}</p>}
          <TextField
            floatingLabelText="Email Address"
            type="text"
            name="email"
            onChange={this.textFieldChanged}
            errorText={errors.email}
            value={fields.email}
          />

        </Dialog>
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
    passwordResetSucceeded: state.userApp.passwordResetSucceeded,
    loggedInUser: state.userApp.userData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(allActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetPage);
