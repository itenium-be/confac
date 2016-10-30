import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import t from '../trans.js';

const Header = () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">{t('title')}</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="#">{t('nav.create')}</NavItem>
    </Nav>
  </Navbar>
);

export default Header;
