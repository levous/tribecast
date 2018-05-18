import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  NavLink
} from 'react-router-dom';

import { Navbar, Nav, NavItem } from 'react-bootstrap'
import IconHelp from 'material-ui/svg-icons/action/help-outline';
import { white, lightBlue500 } from 'material-ui/styles/colors';
import { LinkContainer } from 'react-router-bootstrap';
import Auth from '../modules/Auth';
import communityDefaults from '../../../config/community-defaults';

import RequireAuth from '../components/auth/RequireAuth';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import InvitationsPage from './InvitationsPage';
import MemberProfilePage from './MemberProfilePage';
import MembershipPage from './MembershipPage';
import AddressListPage from './AddressListPage';
import UserAccountManagementPage from './UserAccountManagementPage';
import UploadPage from './UploadPage';
import HelpPage from './HelpPage';
import AdminDashboardPage from './AdminDashboardPage';
import NotFound from './NotFound';


const NavigableRoutes = (props, {store}) => {
  const auth = new Auth(store);
  const userIsAuthenticated = auth.isUserAuthenticated();
  const userIsAdmin = auth.isUserAdmin();
  const userName = auth.loggedInUserName() || 'what?';
  return (
  <div>

    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <NavLink
            exact
            className="navbar-brand page-scroll"
            activeClassName="active" activeStyle={{fontWeight: 'bold'}}
            to="/" >
            {communityDefaults.name}
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          {userIsAuthenticated && (
            <LinkContainer to="/membership">
              <NavItem eventKey={1}>Members</NavItem>
            </LinkContainer>
          )}
          {userIsAuthenticated && (
            <LinkContainer to="/profile">
              <NavItem eventKey={2}>My Profile</NavItem>
            </LinkContainer>
          )}
          {userIsAdmin && (
            <LinkContainer to="/admin">
              <NavItem eventKey={3}>Admin Dashboard</NavItem>
            </LinkContainer>
          )}
          <LinkContainer to="/help">
            <NavItem eventKey={5}><IconHelp color={lightBlue500} /></NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
          {userIsAuthenticated && (
            <LinkContainer to="/logout">
              <NavItem eventKey={4}>Log Out, {userName}</NavItem>
            </LinkContainer>
          )}
          {!userIsAuthenticated && (
            <LinkContainer to="/signup">
              <NavItem eventKey={5}>Sign Up</NavItem>
            </LinkContainer>
          )}
          {!userIsAuthenticated && (
            <LinkContainer to="/login">
              <NavItem eventKey={6}>Log In</NavItem>
            </LinkContainer>
          )}


        </Nav>
      </Navbar.Collapse>
    </Navbar>

    <div className="container">
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/login' component={LoginPage} onEnter={(nextState, replace) => {
          if (this.auth.isUserAuthenticated()) { replace('/membership') }
        }} />
        <Route path='/signup' component={SignUpPage} />
        <Route path='/membership' component={MembershipPage} />
        <Route path='/address-view' component={AddressListPage} />
        <Route path='/admin' component={AdminDashboardPage} />
        <Route path='/user-accounts' component={UserAccountManagementPage} />
        <Route path='/invitations' component={InvitationsPage} />
        <RequireAuth path='/profile' component={MemberProfilePage}
          isAuthenticated={userIsAuthenticated} isLoading={false} />
        <RequireAuth path='/upload' component={UploadPage}
          isAuthenticated={userIsAuthenticated} isLoading={false} />
        <Route path='/help' component={HelpPage} />
        <Route path='/*' component={NotFound} />
      </Switch>
    </div>
  </div>
  );
};

NavigableRoutes.propTypes = {};

NavigableRoutes.contextTypes = { store: PropTypes.object };

export default NavigableRoutes;
