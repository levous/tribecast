import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import communityDefaults from '../../../config/community-defaults';
import * as userActions from '../actions/user-actions';

class HelpPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
    };
  }

  render() {

    return (
        <div className="jumbotron">
          <h1>Uh oh!  You need help?</h1>
          <p>The best way to get help is to:<br /> <a href={`mailto:${communityDefaults.supportEmail.address}`}>send an email to {communityDefaults.supportEmail.address}</a></p>
          <p>You'll receive an auto-reply from our ticketing system and support personnel will handle it from there.</p>
          <p><img src='/images/help-image.jpg' width='100%'/></p>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dispatch: PropTypes.func.isRequired
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpPage);
