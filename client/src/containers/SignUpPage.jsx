import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../actions/user-actions';
import SignUpForm from '../components/auth/SignUpForm';
import Auth from '../modules/Auth';
import Validator from '../../../shared-modules/Validator';
class SignUpPage extends React.Component {

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

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    const errors = {};

    if(!this.state.user.name) errors.name = 'Please provide your Name';
    if(!this.state.user.password) errors.password = 'Please provide a Password';
    if(!this.state.user.email) errors.email = 'Please provide your Email Address';

    if (this.state.user.email && !Validator.isValidEmail(this.state.user.email)) {
      errors.email = 'Email address is Not Valid';
      errors.summary = 'That email address doesn\'t look right.  Please provide a valid email address.';
    }

    if(errors.name || errors.email || errors.password || errors.summary) {
      this.setState({
        errors
      });
      return;
    }

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `name=${name}&email=${email}&password=${password}&source=signup`;

    //TODO: All remote calls should be moved out of the page into the auth service.
    //     This component should then watch logged in state and redirect when state changes.
    //     This is utter crap

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
        // send login action
        this.props.actions.userLoggedIn(xhr.response.user);

        // change the current URL to /
        this.context.router.replace('/membership');

      } else {
        // failure

        const errors = xhr.response.errors || {};
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

  /**
   * Render the component.
   */
  render() {
    return (
      <div className="jumbotron auth-panel">
        <SignUpForm
          onSubmit={this.processForm}
          onChange={this.changeUser}
          errors={this.state.errors}
          user={this.state.user}
        />
      </div>
    );
  }

}

SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(SignUpPage);
