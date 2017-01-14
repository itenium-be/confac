import React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {t} from '../util.js';

const Header = () => (
  <Navbar>
    <Nav>
      <IndexLinkContainer to="/">
        <NavItem eventKey={1}>{t('title')}</NavItem>
      </IndexLinkContainer>
      <LinkContainer to={{pathname: '/clients'}}>
        <NavItem eventKey={3} href="#">{t('nav.clients')}</NavItem>
      </LinkContainer>
      <LinkContainer to={{pathname: '/config'}}>
        <NavItem eventKey={2} href="#">{t('nav.config')}</NavItem>
      </LinkContainer>
    </Nav>
  </Navbar>
);

export default Header;
