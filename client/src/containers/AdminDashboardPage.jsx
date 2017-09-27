import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import communityDefaults from '../../../config/community-defaults';
import Auth from '../modules/Auth'

class AdminDashboardPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.auth = new Auth(context.store);
  }

  render() {
    console.log(this.auth.isUserAdmin());
    if(this.auth.isUserAdmin()) return this.props.router.push('/membership');

    return (
      <div className="jumbotron">
        <p><a href="/upload">Import CSV</a></p>
        <p><a href="/user-accounts">Manage User Accounts</a></p>

      </div>
    );
  }

}

export default AdminDashboardPage;
