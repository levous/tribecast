import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Root from './containers/Root.jsx'
//TODO: configure webpack to inject sass  //import '../stylesheets/main.scss';
//TODO: configure webpack to support import of component.jsx without the extension `import Root from './containers/Root'`

import '../stylesheets/main.scss'



// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin();

const Index = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Root/>
  </MuiThemeProvider>
)

ReactDom.render(
  <Index/>,
  document.getElementById('react-app')
);
