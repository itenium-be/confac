import {Navbar, Nav} from 'react-bootstrap';
import {EnhanceWithClaim} from '../../enhancers/EnhanceWithClaim';

type StickyFooterProps = {
  children: any;
}

export const StickyFooter = EnhanceWithClaim(({children}: StickyFooterProps) => (
  <Navbar fixed="bottom" className="edit-footer">
    <Nav.Item className="navbar-center button-row">
      <div className="footer-container">
        {children}
      </div>
    </Nav.Item>
  </Navbar>
));
