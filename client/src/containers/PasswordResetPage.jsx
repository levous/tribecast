import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../actions/user-actions';
import PasswordResetForm from '../components/auth/PaswordResetForm';
import Auth from '../modules/Auth';

class PasswordResetPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        name: '',
        password: ''
      }
    };

    this.auth = new Auth(context.store);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
  }

  handleUpdatePassword(password, passwordConfirmation){
    this.props.actions.updateUserPassword(password);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    const password = this.state.user.password;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // set a message
        localStorage.setItem('successMessage', xhr.response.message);

        //TODO: dup code fomr LoginPage.jsx   fix all that
        // save the token
        this.auth.authenticateUser(xhr.response.token);
        // save user data
        this.props.actions.cacheUserData(xhr.response.user);

        // change the current URL to /
        this.context.router.replace('/membership');

      } else {
        // failure

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
   * Render the component.
   */
  render() {
    return (
      <ChangePasswordForm
        onSubmit={this.handleUpdatePassword}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

PasswordResetPage.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(PasswordResetPage);
