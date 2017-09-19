import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Auth from '../modules/Auth';
import { Card, CardActions, CardHeader, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import LoginForm from '../components/auth/LoginForm.jsx';
import * as userActions from '../actions/user-actions';
import communityDefaults from '../../../config/community-defaults';

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
      }
    };

    this.auth = new Auth(context.store);
    
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.resetPassword = this.resetPassword.bind(this);

  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;

    //TODO: refactor into login service
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // save the token
        this.auth.authenticateUser(xhr.response.token);
        // send login action
        this.props.actions.userLoggedIn(xhr.response.user);

        // change the current URL to /
        this.context.router.replace('/membership');
      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
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

  resetPassword(email) {
    this.props.actions.resetPassword(email);
  }

  /**
   * Render the component.
   */
  render() {
    const message = this.props.passwordResetSucceeded ? 'Password Reset was Successful!  Please log in.' : undefined;
    return (
      <Card>
        <CardMedia
          overlay={<CardTitle title={communityDefaults.name} subtitle='Welcome!' />}
        >
          <img src="/images/serenbe-farm.jpg" />
        </CardMedia>
        {message && (<div style={{color: '#aa0000', fontWeight: 'bold', textAlign: 'center'}}>{message}</div>)}
        <CardActions>
          <LoginForm
            onSubmit={this.processForm}
            onChange={this.changeUser}
            onResetPassword={this.resetPassword}
            errors={this.state.errors}
            successMessage={this.state.successMessage}
            user={this.state.user}
          />
        </CardActions>
      </Card>


    );
  }

}

LoginPage.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
