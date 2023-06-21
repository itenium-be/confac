import React from 'react';
import {Nav, Navbar, Dropdown, ButtonGroup} from 'react-bootstrap';
import {Link as ReactLink, NavLink} from 'react-router-dom';
import {t} from './utils';
import {AddIcon, Icon} from './controls/Icon';
import {Claim} from './users/models/UserModel';
import {EnhanceWithClaim, EnhanceWithClaimProps} from './enhancers/EnhanceWithClaim';
import {DataLoaded} from './admin/DataLoaded';


type OldSchoolMenuLinkProps = EnhanceWithClaimProps & {
  label: string;
  to: string;
}

const OldSchoolMenuLinkInner = ({label, to}: OldSchoolMenuLinkProps) => (
  <NavLink className={({isActive}) => `nav-link header-link${isActive ? ' active' : ''}`} to={to}>
    {label}
  </NavLink>
);

const OldSchoolMenuLink = EnhanceWithClaim(OldSchoolMenuLinkInner);



type WrappedLinkProps = EnhanceWithClaimProps & {
  to: string;
  className: string;
}


const WrappedLinkInner = ({children, ...props}: WrappedLinkProps) => (
  <ReactLink {...props}>
    {children}
  </ReactLink>
);


const Link = EnhanceWithClaim(WrappedLinkInner);



const Header = () => (
  <Navbar bg="light" expand="lg" className="top-header">
    <Navbar.Brand>
      <a href="https://itenium.be" target="_blank" style={{marginTop: -4, marginLeft: 12}} rel="noopener noreferrer">
        <img src="/img/itenium.png" role="presentation" alt="itenium logo" />
      </a>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <OldSchoolMenuLink claim={Claim.ViewHome} to="/home" label={t('nav.home')} />
        <OldSchoolMenuLink claim={Claim.ViewProjectMonth} to="/monthly-invoicing" label={t('nav.monthlyInvoicing')} />
        <OldSchoolMenuLink claim={Claim.ViewProjects} to="/projects" label={t('nav.projects')} />
        <OldSchoolMenuLink claim={Claim.ViewClients} to="/clients" label={t('nav.clients')} />
        <OldSchoolMenuLink claim={Claim.ViewInvoices} to="/invoices" label={t('nav.invoices')} />
        <OldSchoolMenuLink
          claim={claims => claims.includes(Claim.ViewInvoices) && !claims.includes(Claim.ViewInvoices)}
          to="/quotations"
          label={t('nav.quotations')}
        />
        <OldSchoolMenuLink claim={Claim.ViewConfig} to="/config" label={t('nav.config')} />
      </Nav>

      <Dropdown as={ButtonGroup} style={{top: 8, position: 'absolute', right: 80}}>
        <DataLoaded claim={Claim.LoadHistoricalData} />

        <Link claim={Claim.ManageInvoices} to="/invoices/create" className="btn btn-success">
          <AddIcon size={1} style={{marginRight: 15}} />
          <>{t('invoice.createNew')}</>
        </Link>
        <Link
          claim={claims => claims.includes(Claim.ManageProjects) && !claims.includes(Claim.ManageInvoices)}
          to="/projects/create"
          className="btn btn-success"
        >
          <AddIcon size={1} style={{marginRight: 15}} />
          <>{t('project.createNew')}</>
        </Link>

        <Dropdown.Toggle split variant="success" id="header-create-split" />
        <Dropdown.Menu>
          <Link claim={Claim.ManageProjects} to="/projects/create" className="dropdown-item">
            {t('project.createNew')}
          </Link>
          <Link claim={Claim.ManageClients} to="/clients/create" className="dropdown-item">
            {t('client.createNew')}
          </Link>
          <Link claim={Claim.ManageConsultants} to="/consultants/create" className="dropdown-item">
            {t('consultant.createNew')}
          </Link>
          <Link claim={Claim.ManageQuotations} to="/quotations/create" className="dropdown-item">
            {t('quotation.createNew')}
          </Link>
        </Dropdown.Menu>
        <Icon
          fa="fa fa-user-circle"
          color="#668014"
          onClick="/user"
          style={{marginLeft: 22, paddingTop: 3}}
        />
      </Dropdown>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
