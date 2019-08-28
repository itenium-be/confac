import React from 'react';
import {Button, Nav, Navbar} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {t} from '../util';
import {AddIcon} from '../controls';

const Header = () => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand>
      <a href="https://itenium.be" target="_blank" style={{ marginTop: -4 }} rel="noopener noreferrer">
        <img src="/img/itenium.png" role="presentation" alt="itenium logo" />
      </a>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/quotations" data-tst="link-quotations">
          {t('nav.quotations')}
        </Nav.Link>
        <Nav.Link href="/" data-tst="link-invoices">
          {t('title')}
        </Nav.Link>
        <Nav.Link href="/clients" data-tst="link-clients">
          {t('nav.clients')}
        </Nav.Link>
        <Nav.Link href="/config" data-tst="link-config">
          {t('nav.config')}
        </Nav.Link>
      </Nav>
      <Link to="/invoice/create">
        <Button variant="success" style={{top: 8, position: 'absolute', right: 80}}>
          <AddIcon size={1} style={{marginRight: 15}} data-tst="invoice-create" />
          {t('invoice.createNew')}
        </Button>
      </Link>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
