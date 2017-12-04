import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import communityDefaults from '../../../config/community-defaults';
import Auth from '../modules/Auth'

class HomePage extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.auth = new Auth(context.store);
  }

  render() {
    const authorized = this.auth.isUserAuthorizedToView();
    if(authorized) return this.props.router.push('/membership');

    // The auth componet initialized in ctor keeps a reference after authentication has changed.
    // IOW, when the user data values change due to a log in or log out event, this page doesn't know about it


    return (
      <Card>
        <CardMedia
          overlay={<CardTitle title={communityDefaults.name} subtitle="Welcome!  Please log in above" />}
        >
          <img src="/images/serenbe-farm.jpg" />
        </CardMedia>
        <CardText>
          Access to the {communityDefaults.name} is private and can be granted by an administrator.
        </CardText>
      </Card>
    );
  }

}

export default HomePage;
