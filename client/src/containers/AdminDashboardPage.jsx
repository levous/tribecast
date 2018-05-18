import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Card, CardActions, CardHeader, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import communityDefaults from '../../../config/community-defaults';
import Auth from '../modules/Auth'

class AdminDashboardPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.auth = new Auth(context.store);
    this.isAdmin = this.auth.isUserAdmin();
  }

  render() {
    if(!this.isAdmin) return <div className="jumbotron"><h2>Admins Only</h2><p>Sorry, you have to be an Administrator to view the Admin Dashboard</p></div>

    return (
      <div className="jumbotron">
        <p><a href="/upload">Import CSV</a></p>
        <p><a href="/user-accounts">Manage User Accounts</a></p>

      </div>
    );
  }

}

AdminDashboardPage.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};


function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(AdminDashboardPage);

