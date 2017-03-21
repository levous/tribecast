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
    this.props.actions.updateUserPassword(this.passwordInput.value, 'bed91480-0ab7-11e7-8a5a-391bcf20e197');
  }

  render() {
    return (
      <div>
        <input type='password' ref={input => this.passwordInput = input}/>
        <RaisedButton onTouchTap={this.handleUpdatePassword} label='Go'/>
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
