import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import {NotificationContainer} from 'react-notifications';
import Auth from '../modules/Auth';
import communityDefaults from '../../../config/community-defaults';

const Base = ({ children }, {store}) => {
  const auth = new Auth(store);
  const userIsAuthenticated = auth.isUserAuthenticated();
  const userName = auth.loggedInUserName() || 'what?';
  return (
  <div>

    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <IndexLink className="navbar-brand page-scroll" to="/">{communityDefaults.name}</IndexLink>
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
          {userIsAuthenticated && (
            <LinkContainer to="/admin">
              <NavItem eventKey={3}>Admin Dashboard</NavItem>
            </LinkContainer>
          )}
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

      {children}

    </div>
    <NotificationContainer />
  </div>
  );
};

Base.propTypes = {
  children: PropTypes.object.isRequired
};

Base.contextTypes = { store: PropTypes.object };

export default Base;
