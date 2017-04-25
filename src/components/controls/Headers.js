import React from 'react';
import {EditIcon} from './Icon.js';

const Header1 = ({children, ...props}) => (<h1 {...props}>{children}</h1>);
const Header2 = ({children, ...props}) => (<h2 {...props}>{children}</h2>);
const Header3 = ({children, ...props}) => (<h3 {...props}>{children}</h3>);
const Header4 = ({children, ...props}) => (<h4 {...props}>{children}</h4>);

function getHeader(size) {
  switch (size) {
  case 1:
    return Header1;
  case 2:
    return Header2;
  case 3:
    return Header3;
  case 4:
    return Header4;
  default:
    return Header1;
  }
}

export const HeaderWithEditIcon = ({label, onEditClick, children, editIconVisible = true, size = 1}) => {
  const Header = getHeader(size);
  return (
    <Header>
      {label}
      {editIconVisible ? (
        <small>
          {children ? (
            children
          ) : (
            <EditIcon
              onClick={onEditClick}
              title=""
              size={1}
              style={{display: 'inline', marginLeft: 10}}
              data-tst="open-header-icon"
            />
          )}
        </small>
      ) : null}
    </Header>
  );
};
