import React from 'react';
import {Button, Nav, Navbar, NavItem} from 'react-bootstrap';
import {Link} from 'react-router';
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap';
import {t} from '../util.js';
import {AddIcon} from '../controls.js';

const Header = () => (
  <Navbar>
  <Navbar.Header>
      <Navbar.Brand>
        <a href="https://itenium.be" target="_blank" style={{ marginTop: -4 }} rel="noopener noreferrer">
          <img src="/img/itenium.png" role="presentation" alt="itenium logo" />
        </a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
    <IndexLinkContainer to="/quotations" data-tst="link-quotations">
      <NavItem eventKey={4}>{t('nav.quotations')}</NavItem>
    </IndexLinkContainer>
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
      <Link onlyActiveOnIndex={false} to="/invoice/create">
        <Button bsStyle="success" style={{top: 8, position: 'absolute', right: 35}}>
          <AddIcon size={1} style={{marginRight: 15}} data-tst="invoice-create" />
          {t('invoice.createNew')}
        </Button>
      </Link>
  </Navbar>
);

export default Header;
