import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../actions/user-actions';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Auth from '../modules/Auth';

class PasswordResetPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      fields: {
        password: '',
        passwordConfirmation: ''
      },
      errors:{}
    };

    this.auth = new Auth(context.store);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const fieldName = event.target.name;
    const fields = this.state.fields;
    fields[fieldName] = event.target.value;

    this.setState({
      fields
    });
  }

  handleUpdatePassword(password, passwordConfirmation){
    this.setState({errors: {}});
    const fields = this.state.fields;

    if(!fields.password) return this.setState({errors: {password: 'Please provide a password'}});
    if(!fields.passwordConfirmation || fields.password !== fields.passwordConfirmation)  return this.setState({errors: {passwordConfirmation: 'Confirm Password must match Password'}});

    this.props.actions.updateUserPassword(fields.password, this.props.params.token);
  }

  render() {

    const noticeStyle = {
      color: '#aa0000'
    }

    const {passwordNotice, passwordConfirmNotice} = this.state;

    if(this.props.passwordResetSucceeded) this.context.router.replace('/login');

    const userMessage = this.props.location.pathname.includes('forgot-password') ?
      'Welcome, back!  Please create a new password for your account.':
      'Welcome!  Please create a password to activate your membership account.';

    const {errors, fields} = this.state;

    return (

      <div className='jumbotron'>
        <Card className="container text-center">
          <p>{userMessage}</p>
          <div>

            <div style={noticeStyle}>{passwordNotice}</div>
              <TextField
                floatingLabelText='New Password'
                type='password'
                name='password'
                errorText={errors.password}
                onChange={this.onChange}
                value={fields.password}
              />

          </div>
          <div>

            <div style={noticeStyle}>{passwordConfirmNotice}</div>

              <TextField
                floatingLabelText='Confirm Your Password'
                type='password'
                name='passwordConfirmation'
                errorText={errors.passwordConfirmation}
                onChange={this.onChange}
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
