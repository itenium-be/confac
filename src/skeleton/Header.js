import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import t from '../trans.js';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">{t('title')}</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <LinkContainer to={{pathname: '/invoice/create'}}>
        <NavItem eventKey={1} href="#">{t('nav.create')}</NavItem>
      </LinkContainer>
      <LinkContainer to={{pathname: '/config'}}>
        <NavItem eventKey={2} href="#">{t('nav.config')}</NavItem>
      </LinkContainer>
    </Nav>
  </Navbar>
);

export default Header;
