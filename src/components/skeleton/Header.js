import React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {browserHistory} from 'react-router';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {t} from '../util.js';
import {AddIcon} from '../controls.js';

const Header = () => (
  <Navbar>
    <Nav>
      <IndexLinkContainer to="/" data-tst="link-invoices">
        <NavItem eventKey={1}>{t('title')}</NavItem>
      </IndexLinkContainer>
      <LinkContainer to={{pathname: '/clients'}} data-tst="link-clients">
        <NavItem eventKey={3} href="#">{t('nav.clients')}</NavItem>
      </LinkContainer>
      <LinkContainer to={{pathname: '/config'}} data-tst="link-config">
        <NavItem eventKey={2} href="#">{t('nav.config')}</NavItem>
      </LinkContainer>
    </Nav>
    <button
      className="btn btn-success"
      style={{top: 8, position: 'absolute', right: 35}}
      onClick={() => browserHistory.push('/invoice/create')}>
      <AddIcon size={1} style={{marginRight: 15}} data-tst="invoice-create" />
      {t('invoice.createNew')}
    </button>
  </Navbar>
);

export default Header;
