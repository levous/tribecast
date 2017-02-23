import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import communityDefaults from '../../../config/community-defaults';


const HomePage = () => (

  <Card>
    <CardMedia
      overlay={<CardTitle title={communityDefaults.name} subtitle="Welcome!  Please log in." />}
    >
      <img src="/images/serenbe-farm.jpg" />
    </CardMedia>
    <CardActions>
      <FlatButton label="Action1" />
      <FlatButton label="Action2" />
    </CardActions>
  </Card>


);

export default HomePage;
