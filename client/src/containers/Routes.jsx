import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import Auth from '../modules/Auth';

import NavigableRoutes from './NavigableRoutes';
import PasswordResetPage from './PasswordResetPage';
import LogOut from '../components/auth/LogOut';


class Routes extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.store = configureStore();
    this.auth = new Auth(this.store);
  }

  render() {

    return (
      <Provider store={this.store}>
        <Router>
          <Switch>
            <Route path='/invite/:token' component={PasswordResetPage} />
            <Route path='/forgot-password/:token' component={PasswordResetPage} />
            <Route path='/logout' render={(props) => <LogOut auth={this.auth} />} />
            <Route path='/' component={NavigableRoutes} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default Routes;
