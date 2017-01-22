import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import Auth from '../modules/Auth';

const Base = ({ children }) => (

  <div>

    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <IndexLink className="navbar-brand page-scroll" to="/">Dashboard</IndexLink>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          {Auth.isUserAuthenticated() && (
            <LinkContainer to="/membership">
              <NavItem eventKey={1}>Members</NavItem>
            </LinkContainer>
          )}
          {Auth.isUserAuthenticated() && (
            <LinkContainer to="/upload">
              <NavItem eventKey={1}>Upload CSV</NavItem>
            </LinkContainer>
          )}
        </Nav>
        <Nav pullRight>
          {Auth.isUserAuthenticated() && (
            <LinkContainer to="/logout">
              <NavItem eventKey={1}>Log Out</NavItem>
            </LinkContainer>
          )}
          {!Auth.isUserAuthenticated() && (
            <LinkContainer to="/signup">
              <NavItem eventKey={1}>Sign Up</NavItem>
            </LinkContainer>
          )}
          {!Auth.isUserAuthenticated() && (
            <LinkContainer to="/login">
              <NavItem eventKey={2}>Log In</NavItem>
            </LinkContainer>
          )}

        </Nav>
      </Navbar.Collapse>
    </Navbar>

    <div className="container">
      <div className="jumbotron">
        {children}
      </div>
    </div>

  </div>
);

Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;
