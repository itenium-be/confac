import React from 'react';
import {Nav, Navbar, Dropdown, ButtonGroup} from 'react-bootstrap';
import {Link, Route} from 'react-router-dom';
import {t} from './utils';
import {AddIcon} from './controls/Icon';

type OldSchoolMenuLinkProps = {
  label: string;
  to: string;
  activeOnlyWhenExact?: boolean;
}

const OldSchoolMenuLink = ({label, to, activeOnlyWhenExact = false}: OldSchoolMenuLinkProps) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({match}) => (
      <Link data-tst={`link-${to.slice(1)}`} className={`nav-link header-link${match ? ' active' : ''}`} to={to}>
        {label}
      </Link>
    )}
  />
);


const Header = () => (
  <Navbar bg="light" expand="lg" className="top-header">
    <Navbar.Brand>
      <a href="https://itenium.be" target="_blank" style={{marginTop: -4}} rel="noopener noreferrer">
        <img src="/img/itenium.png" role="presentation" alt="itenium logo" />
      </a>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <OldSchoolMenuLink to="/projects" label={t('nav.projects')} />
        <OldSchoolMenuLink to="/invoices" label={t('title')} />
        <OldSchoolMenuLink to="/clients" label={t('nav.clients')} />
        <OldSchoolMenuLink to="/config" label={t('nav.config')} />
      </Nav>

      <Dropdown as={ButtonGroup} style={{top: 8, position: 'absolute', right: 80}}>
        <Link to="/invoices/create" className="btn btn-success">
          <AddIcon size={1} style={{marginRight: 15}} data-tst="invoice-create" />
          {t('invoice.createNew')}
        </Link>

        <Dropdown.Toggle split variant="success" id="header-create-split" />
        <Dropdown.Menu>
          <Link to="/projects/create" className="dropdown-item">
            {t('project.createNew')}
          </Link>
          <Link to="/clients/create" className="dropdown-item">
            {t('client.createNew')}
          </Link>
          <Link to="/consultants/create" className="dropdown-item">
            {t('consultant.createNew')}
          </Link>
          <Link to="/quotations/create" className="dropdown-item">
            {t('quotation.createNew')}
          </Link>
        </Dropdown.Menu>
      </Dropdown>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
