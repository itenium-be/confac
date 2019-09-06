import { Navbar, Nav } from "react-bootstrap";
import React from "react";

export const StickyFooter = ({children}) => {
  return (
    <Navbar fixed="bottom" className="edit-footer">
      <Nav.Item className="navbar-center button-row">
        {children}
      </Nav.Item>
    </Navbar>
  );
}
