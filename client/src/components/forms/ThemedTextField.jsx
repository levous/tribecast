import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import muiThemeable from 'material-ui/styles/muiThemeable';

const ThemedTextField = (props) => {
  const {muiTheme, ...rest} = props;
  return (
    <TextField {...rest} floatingLabelStyle={{color: props.muiTheme.palette.primary1Color}} />
  );
};

export default muiThemeable()(ThemedTextField);
