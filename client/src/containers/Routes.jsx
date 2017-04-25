import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {browserHistory, Router, Route, IndexRoute, pushState} from 'react-router';
import {Provider} from 'react-redux';
import {member_action_types} from '../actions/member-actions';
import configureStore from '../store/configureStore';
import Auth from '../modules/Auth';

import Base from './Base';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import PasswordResetPage from './PasswordResetPage';
import InvitationsPage from './InvitationsPage';
import MemberProfilePage from './MemberProfilePage';
import MembershipPage from './MembershipPage';
import UploadPage from './UploadPage';
import AdminDashboardPage from './AdminDashboardPage';
import NotFound from './NotFound';

const store = configureStore();
const auth = new Auth(store);

export default class Routes extends Component {

  requireAuth(nextState, replace) {
    if (!auth.isUserAuthenticated()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }

  logOut(nextState, replace){
    auth.deauthenticateUser();
    // change the current URL to /
    replace('/');
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path='/' component={Base}>
            <IndexRoute component={HomePage} onEnter={(nextState, replace) => {if (auth.isUserAuthorizedToView()){replace('/membership')}}}/>
            <Route path='/login' component={LoginPage} />
            <Route path='/signup' component={SignUpPage} />
            <Route path='/logout' onEnter={this.logOut} />
            <Route path='/membership' component={MembershipPage} />
            <Route path='/admin' component={AdminDashboardPage} />
            <Route path='/invitations' component={InvitationsPage} />
            <Route path='/invite/:token' component={PasswordResetPage} />
            <Route path='/profile' component={MemberProfilePage} onEnter={this.requireAuth} />
            <Route path='/upload' component={UploadPage} onEnter={this.requireAuth} />
            <Route path='/*' component={NotFound} />
          </Route>
        </Router>
      </Provider>
  );
  }
}
