import React from 'react';
import {Button, Nav, Navbar} from 'react-bootstrap';
import {Link, Route} from 'react-router-dom';
import {t} from './util';
import {AddIcon} from './controls';

const OldSchoolMenuLink = ({ label, to, activeOnlyWhenExact = false }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link data-tst={'link-' + to.slice(1)} className={'nav-link header-link' + (match ? ' active' : '')} to={to}>
      {label}
    </Link>
  )}/>
)


const Header = () => (
  <Navbar bg="light" expand="lg" className="top-header">
    <Navbar.Brand>
      <a href="https://itenium.be" target="_blank" style={{ marginTop: -4 }} rel="noopener noreferrer">
        <img src="/img/itenium.png" role="presentation" alt="itenium logo" />
      </a>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <OldSchoolMenuLink to="/quotations" label={t('nav.quotations')} />
        <OldSchoolMenuLink to="/invoices" label={t('title')} />
        <OldSchoolMenuLink to="/clients" label={t('nav.clients')} />
        <OldSchoolMenuLink to="/config" label={t('nav.config')} />
      </Nav>
      <Link to="/invoices/create">
        <Button variant="success" style={{top: 8, position: 'absolute', right: 80}}>
          <AddIcon size={1} style={{marginRight: 15}} data-tst="invoice-create" />
          {t('invoice.createNew')}
        </Button>
      </Link>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
