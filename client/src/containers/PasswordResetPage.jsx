import React, { PropTypes } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as userActions from '../actions/user-actions';
import RaisedButton from 'material-ui/RaisedButton';
import Auth from '../modules/Auth';

class PasswordResetPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
    };

    this.auth = new Auth(context.store);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
  }

  handleUpdatePassword(password, passwordConfirmation){
    // clear last run
    this.setState({passwordNotice: null, passwordConfirmNotice: null});

    if(!this.passwordInput.value) return this.setState({passwordNotice: 'Please provide a password'});
    if(!this.passwordConfirmInput.value || this.passwordInput.value !== this.passwordConfirmInput.value)  return this.setState({passwordConfirmNotice: 'Confirm Password must match Password'});

    this.props.actions.updateUserPassword(this.passwordInput.value, this.props.params.token);
  }

  render() {

    const noticeStyle = {
      color: '#aa0000'
    }

    const {passwordNotice, passwordConfirmNotice} = this.state;
    return (

      <div className='jumbotron'>
        <p>Welcome!  Please create a password to activate your membership account.</p>
        <div>
          <label htmlFor='password'>Please Enter your Password</label>
          <div style={noticeStyle}>{passwordNotice}</div>
          <input type='password' ref={input => this.passwordInput = input} id='password'/>
        </div>
        <div>
          <label htmlFor='password-confirm'>Confirm your Password</label>
          <div style={noticeStyle}>{passwordConfirmNotice}</div>
          <input type='password' ref={input => this.passwordConfirmInput = input} id='password-confirm'/>
        </div>
        <RaisedButton onTouchTap={this.handleUpdatePassword} label='Go!' />
      </div>
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
