import React from 'react';
import PropTypes from 'prop-types';
import  { Redirect } from 'react-router-dom'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Auth from '../modules/Auth';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import LoginForm from '../components/auth/LoginForm.jsx';
import * as allActions from '../actions';
import communityDefaults from '../../../config/community-defaults';
import Validator from '../../../shared-modules/Validator';
import Logger from '../modules/Logger';

class LoginPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        email: '',
        password: ''
      },
      passwordResetDialogOpen: props.passwordResetSucceeded || false,
      loggedIn: false,
      attemptedMagicLinkToken: ''
    };

    this.auth = new Auth(context.store);

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.sendMagicLink = this.sendMagicLink.bind(this);
    this.dialogClosed = this.dialogClosed.bind(this);

  }

  componentWillReceiveProps(nextProps){
    if(nextProps.loggedInUser){
      this.props.actions.refreshMembersFromServer();
      this.setState({loggedIn: true})
    }

    if(nextProps.loginFailureMessage){
      this.setState({errors: {summary: nextProps.loginFailureMessage}});
    }
  }

  validateLoginForm(userData) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!userData || typeof userData.email !== 'string' || userData.email.trim().length === 0) {
      isFormValid = false;
      errors.email = 'Please provide your email address.';
    }

    if (!userData || typeof userData.password !== 'string' || userData.password.trim().length === 0) {
      isFormValid = false;
      errors.password = 'Please provide your password.';
    }

    if (!isFormValid) {
      message = 'Unable to login.  Please review problems.';
    }

    return {
      success: isFormValid,
      message,
      errors
    };
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    const validationResult = this.validateLoginForm(this.state.user);
    if(!validationResult.success){

      this.setState({
        errors: validationResult.errors
      });
      return;
    }

    this.props.actions.logInUser(this.state.user);
  }



  sendMagicLink() {
    // valid8 email and only send when there is one there

    if (!Validator.isValidEmail(this.state.user.email)) {
      this.setState({
        errors: { email: 'Email address is Not Valid', summary: 'That email address doesn\'t look right.  Please provide a valid email address to send your magic link.'}
      });
      return;
    }

    Logger.logWarn({description: `${this.state.user.email} sending magic link`});
    this.props.actions.sendMagicLink(this.state.user.email);
  }

  /**
   * Login using magic link
   *
   * @param String magicLinkToken - a token passed in the url that can log a user in
   */
  loginMagicLink(magicLinkToken) {
    this.setState({attemptedMagicLinkToken: magicLinkToken});
    return this.props.actions.logInMagicLink(magicLinkToken);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  resetPassword() {
    // valid8 email and only send when there is one there

    if (!Validator.isValidEmail(this.state.user.email)) {
      this.setState({
        errors: { email: 'Email address is Not Valid', summary: 'That email address doesn\'t look right.  Please provide a valid email address for password reset.'}
      });
      return;
    }

    Logger.logWarn({description: `${this.state.user.email} resetting password`});
    this.props.actions.resetPassword(this.state.user.email);
  }

  dialogClosed(){
    this.setState({passwordResetDialogOpen: false});
  }

  /**
   * Render the component.
   */
  render() {


    if(this.props.match.params.magicLinkToken && !this.state.loggedIn && this.state.attemptedMagicLinkToken != this.props.match.params.magicLinkToken) {
      this.loginMagicLink(this.props.match.params.magicLinkToken);
    }

    if (this.state.loggedIn) {
      return <Redirect to="/membership" />
    }

    return (
      <div className="jumbotron auth-panel">

        <Dialog
            title="Password Was Reset"
            actions={<FlatButton label="OK" primary={true} onClick={this.dialogClosed} />}
            modal={false}
            open={this.state.passwordResetDialogOpen}
            onRequestClose={this.dialogClosed}
          >
          Password Reset was Successful!
          <h3>Please log in</h3>
        </Dialog>

        <LoginForm
          onSubmit={this.processForm}
          onChange={this.changeUser}
          onResetPassword={this.resetPassword}
          onSendMagicLink={this.sendMagicLink}
          errors={this.state.errors}
          successMessage={this.state.successMessage}
          user={this.state.user}
        />

      </div>


    );
  }

}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {
    passwordResetSucceeded: state.userApp.passwordResetSucceeded,
    loggedInUser: state.userApp.userData,
    loginFailureMessage: state.userApp.loginFailureMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(allActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
