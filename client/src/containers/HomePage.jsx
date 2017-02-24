import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import communityDefaults from '../../../config/community-defaults';


const HomePage = () => (

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

export default HomePage;
