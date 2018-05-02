import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
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
import AddressListPage from './AddressListPage';
import UserAccountManagementPage from './UserAccountManagementPage';
import UploadPage from './UploadPage';
import HelpPage from './HelpPage';
import AdminDashboardPage from './AdminDashboardPage';
import NotFound from './NotFound';

class Routes extends React.Component {

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
        <Router>
          <div>
            <Route path='/membership' component={MembershipPage} />
          </div>
        </Router>
      </Provider>
      /*
      <Provider store={this.store}>
        <BrowserRouter>
          <div>
            <Route path='/invite/:token' component={PasswordResetPage} />
            <Route path='/' component={Base}>
              <IndexRoute component={HomePage} onEnter={(nextState, replace) => this.showMembersIfAuthorized(nextState, replace)} />
              <Route path='/login' component={LoginPage} onEnter={(nextState, replace) => {
                if (this.auth.isUserAuthenticated()) { replace('/membership') }
              }}/>
              <Route path='/signup' component={SignUpPage} />
              <Route path='/logout' onEnter={(nextState, replace) => this.logOut(nextState, replace)} />
              <Route path='/membership' component={MembershipPage} />
              <Route path='/address-view' component={AddressListPage} />
              <Route path='/admin' component={AdminDashboardPage} />
              <Route path='/user-accounts' component={UserAccountManagementPage} />
              <Route path='/invitations' component={InvitationsPage} />
              <Route path='/forgot-password/:token' component={PasswordResetPage} />
              <Route path='/profile' component={MemberProfilePage} onEnter={(nextState, replace) => this.requireAuth(nextState, replace)} />
              <Route path='/upload' component={UploadPage} onEnter={(nextState, replace) => this.requireAuth(nextState, replace)} />
              <Route path='/help' component={HelpPage} />
              <Route path='/*' component={NotFound} />
            </Route>
          </div>
        </BrowserRouter>
      </Provider>
      */
    );
  }
}

export default Routes;
