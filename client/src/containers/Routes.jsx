import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {browserHistory, Router, Route, IndexRoute, pushState} from 'react-router';
import {Provider} from 'react-redux';
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
import UserAccountManagementPage from './UserAccountManagementPage';
import UploadPage from './UploadPage';
import HelpPage from './HelpPage';
import AdminDashboardPage from './AdminDashboardPage';
import NotFound from './NotFound';

class Routes extends Component {

  constructor(props, context) {
    super(props, context);
    this.store = configureStore();
    this.auth = new Auth(this.store);
  }

  requireAuth(nextState, replace) {
    if (!this.auth.isUserAuthenticated()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }

  logOut(nextState, replace){
    this.auth.deauthenticateUser();
    // change the current URL to /
    replace('/');
  }

  showMembersIfAuthorized(nextState, replace){
  
     if (this.auth.isUserAuthorizedToView()){
       replace('/membership');
     }
  }

  render() {

    return (
      <Provider store={this.store}>
        <Router history={browserHistory}>
          <Route path='/invite/:token' component={PasswordResetPage} />
          <Route path='/' component={Base}>
            <IndexRoute component={HomePage} onEnter={(nextState, replace) => this.showMembersIfAuthorized(nextState, replace)} />
            <Route path='/login' component={LoginPage} />
            <Route path='/signup' component={SignUpPage} />
            <Route path='/logout' onEnter={(nextState, replace) => this.logOut(nextState, replace)} />
            <Route path='/membership' component={MembershipPage} />
            <Route path='/admin' component={AdminDashboardPage} />
            <Route path='/user-accounts' component={UserAccountManagementPage} />
            <Route path='/invitations' component={InvitationsPage} />
            <Route path='/forgot-password/:token' component={PasswordResetPage} />
            <Route path='/profile' component={MemberProfilePage} onEnter={(nextState, replace) => this.requireAuth(nextState, replace)} />
            <Route path='/upload' component={UploadPage} onEnter={(nextState, replace) => this.requireAuth(nextState, replace)} />
            <Route path='/help' component={HelpPage} />
            <Route path='/*' component={NotFound} />
          </Route>
        </Router>
      </Provider>
  );
  }
}

export default Routes;
